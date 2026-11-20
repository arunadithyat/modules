#!/usr/bin/env bash
# Creates a local Frappe bench with ERPNext + HRMS and links the AutomateGenie core app.
# Prereqs: Python 3.11+, Node 18+, yarn, pip install frappe-bench, docker (for MariaDB/Redis).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$REPO_ROOT/.env" ] && set -a && . "$REPO_ROOT/.env" && set +a
SITE_NAME="${SITE_NAME:-automategenie.localhost}"
BENCH_DIR="${BENCH_DIR:-$REPO_ROOT/frappe-bench}"
FRAPPE_BRANCH="${FRAPPE_BRANCH:-version-15}"

docker compose -f "$REPO_ROOT/docker/docker-compose.dev.yml" --env-file "$REPO_ROOT/.env" up -d

if [ ! -d "$BENCH_DIR" ]; then
  bench init --frappe-branch "$FRAPPE_BRANCH" --skip-redis-config-generation "$BENCH_DIR"
fi
cd "$BENCH_DIR"

bench set-config -g db_host 127.0.0.1
bench set-config -g redis_cache redis://127.0.0.1:13000
bench set-config -g redis_queue redis://127.0.0.1:11000
bench set-config -g redis_socketio redis://127.0.0.1:11000

[ -d apps/erpnext ] || bench get-app --branch "$FRAPPE_BRANCH" erpnext
[ -d apps/hrms ]    || bench get-app --branch "$FRAPPE_BRANCH" hrms
# Link (not clone) our app so edits in the repo are live in the bench
if [ ! -e apps/automategenie_core ]; then
  ln -s "$REPO_ROOT/backend/apps/automategenie_core" apps/automategenie_core
  ./env/bin/pip install -e apps/automategenie_core
  grep -qx automategenie_core sites/apps.txt || echo automategenie_core >> sites/apps.txt
fi

if [ ! -d "sites/$SITE_NAME" ]; then
  bench new-site "$SITE_NAME" \
    --db-root-password "${MARIADB_ROOT_PASSWORD:-change-me-root}" \
    --admin-password "${ADMIN_PASSWORD:-change-me-admin}"
fi

bench --site "$SITE_NAME" install-app erpnext hrms automategenie_core
bench --site "$SITE_NAME" set-config developer_mode 1
bench use "$SITE_NAME"

echo "Done. Run: cd $BENCH_DIR && bench start   (API on http://localhost:8000)"
