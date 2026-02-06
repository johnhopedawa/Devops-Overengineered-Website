#!/usr/bin/env bash
set -euo pipefail

#set directory
SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

cd "$SCRIPT_DIR"

# -- CONFIG --
KUBE_CONTEXT=prod

chmod +x apply.sh
chmod +x apply-secrets.sh
chmod +x delete.sh
