#!/usr/bin/env bash
set -euo pipefail

#Set directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

# -- CONFIG --
KUBE_CONTEXT=prod

# apply all 

echo "Applying all changes..."

./apply-secrets.sh

kubectl apply -f ingress/
kubectl apply -f deployment/
kubectl apply -f configmap/
kubectl apply -f services/
kubectl apply -f pvc/

echo "Deployment complete"
