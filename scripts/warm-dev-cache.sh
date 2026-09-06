#!/usr/bin/env bash
# Best-effort warm-up of Vite's SSR dependency cache (node_modules/.vite).
#
# On a cold cache the Astro + @astrojs/cloudflare dev server crashes on its
# first boot: Vite's dep optimizer discovers an extra SSR dependency after its
# initial scan, triggers a program reload, and the workerd runner dies before
# the cache is persisted. Running the dev server until it stabilizes populates
# node_modules/.vite so later `astro dev` starts (including from a prebuilt
# environment snapshot) come up cleanly on the first try.
#
# This script is idempotent and always exits 0 so it never fails `install`.
# The dev-server terminal command self-heals as a safety net if warming did
# not fully populate the cache.
set -u

cd "$(dirname "$0")/.." || exit 0

PORT="${1:-4891}"

if curl -sf -o /dev/null "http://localhost:${PORT}/en" 2>/dev/null; then
  echo "warm-dev-cache: something already serving on :${PORT}, skipping"
  exit 0
fi

# Run the resilient dev-server loop in its own process group so we can tear
# down astro and its workerd children together when the cache is warm.
#
# NOTE: the flags here must match the dev-server terminal command in
# .cursor/environment.json exactly (including --host). Vite derives its
# optimized-deps cache key from the resolved config, and --host changes that
# key, so warming without --host would leave the cache invalid for a boot that
# uses --host and trigger a re-optimization crash on first start.
setsid bash -c "until npx astro dev --port ${PORT} --host >/tmp/warm-dev-cache.log 2>&1; do sleep 1; done" &
loop_pid=$!

stable=0
for _ in $(seq 1 120); do
  sleep 1
  if curl -sf -o /dev/null "http://localhost:${PORT}/en" 2>/dev/null; then
    stable=$((stable + 1))
    if [ "${stable}" -ge 5 ]; then
      break
    fi
  else
    stable=0
  fi
done

# Tear down the loop and every process in its group.
kill -TERM -"${loop_pid}" 2>/dev/null
sleep 1
kill -KILL -"${loop_pid}" 2>/dev/null

if [ "${stable}" -ge 5 ]; then
  echo "warm-dev-cache: cache warmed (node_modules/.vite populated)"
else
  echo "warm-dev-cache: could not confirm a stable dev server; the terminal loop will self-heal at boot"
fi

exit 0
