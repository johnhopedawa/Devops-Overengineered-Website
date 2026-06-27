#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Copying TLS secret to argocd namespace..."
kubectl get secret cloudflare-origin-cert -n overengineered -o yaml \
  | sed 's/namespace: overengineered/namespace: argocd/' \
  | kubectl apply -f -

echo "Applying ArgoCD config..."
kubectl apply -f "$SCRIPT_DIR/argocd-cm.yaml"
kubectl apply -f "$SCRIPT_DIR/argocd-cmd-params-cm.yaml"
kubectl apply -f "$SCRIPT_DIR/argocd-rbac-cm.yaml"
kubectl apply -f "$SCRIPT_DIR/ingress.yaml"

echo "Restarting argocd-server to pick up insecure mode..."
kubectl rollout restart deployment argocd-server -n argocd
kubectl rollout status deployment argocd-server -n argocd

echo "Done. ArgoCD should be live at https://argocd.johnhopedawa.com"
