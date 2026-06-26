#!/usr/bin/env bash
set -euo pipefail

# Set directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

SECRETS_DIR="$SCRIPT_DIR/secrets"
NAMESPACE="${KUBE_NAMESPACE:-overengineered}"
SECRET_NAME="${CLOUDFLARE_SECRET_NAME:-cloudflare-origin-cert}"
TLS_CERT="$SECRETS_DIR/cloudflare-origin.crt"
TLS_KEY="$SECRETS_DIR/cloudflare-origin.key"

if [[ ! -d "$SECRETS_DIR" ]]; then
  echo "No secrets directory found. Skipping secrets apply."
  exit 0
fi

if [[ -f "$TLS_CERT" && -f "$TLS_KEY" ]]; then
  echo "Applying TLS secret $SECRET_NAME in namespace $NAMESPACE..."
  kubectl create secret tls "$SECRET_NAME" \
    -n "$NAMESPACE" \
    --cert="$TLS_CERT" \
    --key="$TLS_KEY" \
    --dry-run=client -o yaml | kubectl apply -f -
else
  echo "TLS files not found at $TLS_CERT and $TLS_KEY. Skipping TLS secret."
fi

if ls -1 "$SECRETS_DIR"/*.y*ml >/dev/null 2>&1; then
  echo "Applying secrets manifests..."
  kubectl apply -f "$SECRETS_DIR"
fi
