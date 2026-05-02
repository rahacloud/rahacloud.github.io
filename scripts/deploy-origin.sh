#!/usr/bin/env bash
# Build and deploy the static site to the Raha origin server.
#
# Prereqs:
#   - pnpm installed
#   - SSH access to ${ORIGIN_USER}@${ORIGIN_HOST} via your default key
#     (the 1995parham GitHub keys are trusted by raha-io-deploy)
#
# Usage:
#   scripts/deploy-origin.sh             # build + deploy
#   SKIP_BUILD=1 scripts/deploy-origin.sh   # deploy existing out/

set -euo pipefail

ORIGIN_HOST="${ORIGIN_HOST:-2.144.15.81}"
ORIGIN_USER="${ORIGIN_USER:-raha-io-deploy}"
ORIGIN_INCOMING="${ORIGIN_INCOMING:-/srv/raha-io/incoming/}"
PROMOTE_CMD="${PROMOTE_CMD:-/usr/local/bin/raha-io-promote}"

cd "$(dirname "$0")/.."

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  echo "==> Building"
  pnpm install --frozen-lockfile
  pnpm build
fi

if [ ! -d out ]; then
  echo "out/ not found — run without SKIP_BUILD=1" >&2
  exit 1
fi

echo "==> Rsync to ${ORIGIN_USER}@${ORIGIN_HOST}:${ORIGIN_INCOMING}"
rsync -az --delete --omit-dir-times \
  -e "ssh -o BatchMode=yes" \
  out/ "${ORIGIN_USER}@${ORIGIN_HOST}:${ORIGIN_INCOMING}"

echo "==> Promote"
ssh -o BatchMode=yes "${ORIGIN_USER}@${ORIGIN_HOST}" "${PROMOTE_CMD}"
