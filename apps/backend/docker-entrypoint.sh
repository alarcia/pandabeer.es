#!/bin/sh
# Entrypoint for the Medusa runtime container.
#
# Runs inside .medusa/server (WORKDIR /app), which is the built standalone app.
# By default it applies pending DB migrations + link sync, then starts the server.
# Set RUN_MIGRATIONS=false for additional worker-only containers so migrations
# run exactly once (only the server/shared container should migrate).
set -e

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Running database migrations (predeploy)..."
  npm run predeploy
fi

echo "[entrypoint] Starting Medusa..."
exec npm run start
