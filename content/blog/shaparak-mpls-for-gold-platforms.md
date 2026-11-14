---
title: "Connecting a gold platform to Shaparak over MPLS, from Kubernetes"
date: "2026-11-14"
description: "Shaparak now requires gold trading platforms to reach ZarPayesh over an MPLS line with IPsec, GRE and OSPF. Here is how we brought one up inside a managed Kubernetes cluster, the traps that cost us days, and how to tell whose side an outage is on."
---

Iranian gold trading platforms have a new piece of infrastructure to run. Shaparak requires them to reach its gold services, ZarPayesh among them, over a private MPLS line instead of the internet. On top of that line sits a GRE tunnel protected by IPsec, with OSPF running across it. The platforms were given a deadline, a generic guide in a `.docx`, and a short sheet of parameters.

We recently did this for a gold platform whose production runs on a managed Kubernetes cluster. It is live and carrying their calls to ZarPayesh. This post is what we learned: how the pieces fit, what broke, and how to debug it when it stops answering at eleven at night.

## Four parties, one tunnel

The first surprise is how many organisations own a piece of the path:

| Part | Owner |
| --- | --- |
| The MPLS line from the data centre to Shaparak | the telecom and the data centre |
| Putting your machine on that line | your cloud provider |
| IPsec, GRE, OSPF and NAT on your end | **you** |
| Letting your NAT address through to their services, and activating your account | Shaparak |

Each party will tell you, correctly, that their part works. The tunnel only comes up when all four do, and the platform is the one that has to prove which link is missing. Most of the calendar time goes on that coordination. The configuration itself is a few hours of work once you know what it should look like.

## What runs on your end

The sheet Shaparak sends describes a Cisco-shaped design. On your side you need:

1. **IPsec**: IKEv1 Main Mode with a pre-shared key, protecting only the GRE packets between your underlay address and Shaparak's. That is what Cisco's `tunnel protection` builds, so the traffic selectors are protocol 47 between two /32s.
2. **GRE**: a point-to-point tunnel with a /30 on it, inside that IPsec.
3. **OSPF** across the GRE: your router announces your NAT pool (a /29 Shaparak assigns) and learns Shaparak's service network.
4. **NAT**: everything you send to Shaparak's services leaves from an address in your /29, because that is the only range their side knows and allows.

On a VM this is a routine afternoon with strongSwan, iproute2, FRR and iptables. On managed Kubernetes it is not.

## Doing it inside a pod

Our client had no VM to spare and wanted the tunnel in git with the rest of their production, so we ran it as a second container in the pod of the small nginx gateway that their backend calls. The provider routes a pod's traffic onto the MPLS line when the pod carries a specific label, so the gateway's own calls go through the tunnel without touching the rest of the cluster.

![The path from the backend through the gateway pod, the provider's MPLS line and Shaparak's edge router to ZarPayesh](/blog/shaparak-mpls-path.svg)

Three things had to change from the VM version:

- **ESP in userspace.** IKE negotiated fine, then installing the SA failed with `Protocol not supported`: the nodes have no `esp4` module, and a pod cannot load one. strongSwan's `kernel-libipsec` plugin does ESP in userspace over a TUN device. Ubuntu's `libcharon-extra-plugins` ships it; Alpine's strongSwan does not.
- **IKEv1 means strongSwan 5.** strongSwan 6 builds dropped IKEv1, and Shaparak's side speaks only IKEv1. Pin 5.9.
- **Force NAT-T and keep IKE out of its own tunnel.** Between the pod and the line the source address is rewritten, so the tunnel has to be told to encapsulate in UDP. And because the tunnel's selector is the peer itself, charon's own IKE packets must be marked and routed outside it, or the tunnel swallows its own control traffic.

The container needs `NET_ADMIN`, `NET_RAW`, `SYS_ADMIN` (FRR will not start without it) and `MKNOD` for the TUN device. It runs a single replica, because Shaparak accepts one tunnel from one address. It also retries setup forever instead of crashing: a crash loop would mark the pod unready and take the gateway out of service along with the tunnel.

## Traps worth knowing about

**Filter what OSPF teaches you.** Shaparak's OSPF database carried about fifty external routes, `10.0.0.0/8` among them. Only one was installed on our side, and only by accident of the area topology. Had that changed, `10.0.0.0/8` would have pulled the cluster's own pod and service traffic into the tunnel. We filter at zebra (`ip protocol ospf route-map …`) so that only Shaparak's service network can ever reach the routing table. FRR 8.4's ospfd has no inbound `distribute-list`, and a config that uses one fails quietly.

**MTU will bite you, later.** The tunnel came up and worked for ten days at a GRE MTU of 1400. After a routine restart, OSPF stuck in `Loading` with hundreds of requests outstanding while hellos passed both ways. Shaparak's database had grown, our link-state requests now went out near 1400 bytes, and GRE plus ESP plus UDP around that no longer fit the pod network's 1450. We dropped the GRE MTU to 1300, clamped TCP MSS to 1260, and set `ip ospf mtu-ignore` because the Cisco side still announces 1400. It went Full in forty seconds.

![With a GRE MTU of 1400 a full packet is 1504 bytes on the wire, past the pod network's 1450; with 1300 it is 1392 and fits](/blog/shaparak-mpls-mtu.svg)

**ZarPayesh needs SNI and Shaparak's own CA.** Its hostname exists only inside Shaparak's network, so you connect to the address Shaparak gives you. Connected by bare IP, the TLS handshake just hangs. With the right SNI it completes at once, and the certificate is issued by a private CA of Shaparak's. Trust that CA for this one upstream rather than turning verification off.

**Ask for the address; don't look for it.** Shaparak filters everything that is not explicitly allowed. A sweep of their service network shows nothing, and from their side it looks like a port scan from your NAT pool. The address, port and scheme come from Shaparak, together with the rule opening them to your /29.

**"Activated" has two meanings.** Network access and the platform's account at ZarPayesh are switched on separately. A JSON error from ZarPayesh, such as status 1010 («کاربر فعلا اجازه فعالیت ندارد»), means the path works and the account does not yet. A timeout means the path itself is down.

## Whose side is it on?

One evening the platform's calls started timing out. Nothing on our side had changed since the morning, when the same path had answered. Before anyone spends an hour on the phone, it pays to be able to say exactly where packets stop. From inside the tunnel container:

- `swanctl --list-sas`: both SAs up, with packets counting in both directions.
- `vtysh -c "show ip ospf neighbor"`: Full, and the service network still learned.
- `tcpdump` on the GRE interface, while opening a connection: SYNs leaving from the right NAT address, with no SYN-ACK.
- The SNAT rule's packet counter going up by one per connection, which proves the source address.
- A TTL trace (`ping -t 1`, `-t 2`, …): Shaparak's tunnel endpoint answering `Time to live exceeded` at hop one, and nothing beyond it.

That is a precise statement: packets reach Shaparak's router and its replies get back to us, so the drop is between their router and the service. Passed on in those words, it got the right team at Shaparak working on it. The path came back two hours later with nothing changed on our side. A note on the error pages, because they confuse everyone: if a CDN such as ArvanCloud sits in front of your gateway, a slow upstream shows up as the CDN's 502 or as nginx's 504. Neither means the gateway is broken.

## If you run a gold platform

Every gold platform in Iran has to build this path, and most are discovering the same traps one at a time, under a deadline. We have already been through them in production, on managed Kubernetes. A plain VM is the easier case.

What we take on:

- coordinating the telecom, the data centre or cloud provider, and Shaparak until the line answers;
- building the IPsec, GRE, OSPF and NAT on your side, on a VM or inside your cluster, with the configuration kept in your own repository;
- the gateway your application calls, with Shaparak's CA, SNI and access control set up;
- monitoring and on-call, so that when ZarPayesh stops answering you know within minutes whose side it is on.

[Get in touch](/en/#contact) and tell us where your production runs. We will tell you what your path to Shaparak looks like and how long it will take.
