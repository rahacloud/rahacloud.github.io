type PostalAddress = {
  district?: string;
  city: string;
  country: string;
};

type Identifiers = {
  registrationNumber?: string;
  nationalId?: string;
};

type OrganizationData = {
  name: string;
  description: string;
  url: string;
  logo: string;
  email: string;
  telephone: string;
  addresses: PostalAddress[];
  identifiers?: Identifiers;
  sameAs: string[];
};

type ServiceData = {
  name: string;
  description: string;
};

type Props = {
  organization: OrganizationData;
  services: ServiceData[];
};

export default function StructuredData({ organization, services }: Props) {
  const postalAddresses = organization.addresses.map((addr) => ({
    '@type': 'PostalAddress',
    ...(addr.district ? { streetAddress: addr.district } : {}),
    addressLocality: addr.city,
    addressCountry: addr.country,
  }));

  const identifierList = [
    organization.identifiers?.registrationNumber && {
      '@type': 'PropertyValue',
      propertyID: 'Iran Company Registration Number',
      value: organization.identifiers.registrationNumber,
    },
    organization.identifiers?.nationalId && {
      '@type': 'PropertyValue',
      propertyID: 'Iran National ID',
      value: organization.identifiers.nationalId,
    },
  ].filter(Boolean);

  const identifierFields =
    identifierList.length > 0
      ? {
          identifier: identifierList,
          ...(organization.identifiers?.nationalId
            ? { taxID: organization.identifiers.nationalId }
            : {}),
        }
      : {};

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    description: organization.description,
    url: organization.url,
    logo: organization.logo,
    email: organization.email,
    telephone: organization.telephone,
    address: postalAddresses,
    ...identifierFields,
    sameAs: organization.sameAs,
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: organization.name,
    description: organization.description,
    url: organization.url,
    logo: organization.logo,
    email: organization.email,
    telephone: organization.telephone,
    address: postalAddresses,
    ...identifierFields,
    priceRange: '$$',
    openingHours: 'Mo-Fr 09:00-18:00',
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires innerHTML for structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires innerHTML for structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {services.map((service) => (
        <script
          key={service.name}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires innerHTML
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              provider: { '@type': 'Organization', name: organization.name },
              name: service.name,
              description: service.description,
            }),
          }}
        />
      ))}
    </>
  );
}
