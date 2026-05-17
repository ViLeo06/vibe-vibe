#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_NAME="${CLOUDFLARE_PAGES_PROJECT:-vibevibe-mvp}"
OUTPUT_DIR="${CLOUDFLARE_PAGES_OUTPUT_DIR:-docs/.vitepress/dist}"
BUILD_COMMAND="${BUILD_COMMAND:-pnpm build}"
BRANCH_NAME="${CLOUDFLARE_PAGES_BRANCH:-main}"
DRY_RUN=0
INSTALL_DEPS=1

usage() {
  cat <<'USAGE'
Usage: bash scripts/deploy-cloudflare-pages.sh [options]

Build and deploy this VitePress site to Cloudflare Pages.

Options:
  --dry-run        Install dependencies if needed and build, but skip deploy.
  --no-install     Skip dependency installation check.
  --project NAME   Cloudflare Pages project name. Default: vibevibe-mvp.
  --output DIR     Build output directory. Default: docs/.vitepress/dist.
  --branch NAME    Deployment branch name. Default: main.
  -h, --help       Show this help.

Required for deploy:
  Wrangler auth via local login, or environment variables:
  CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.
USAGE
}

log() {
  printf '[deploy:pages] %s\n' "$*"
}

fail_next_steps() {
  local exit_code="$1"
  cat >&2 <<EOF
[deploy:pages] Failed with exit code ${exit_code}.
[deploy:pages] Next checks:
[deploy:pages] 1. Verify Cloudflare auth: npx --yes wrangler@4 whoami
[deploy:pages] 2. Verify project exists/free plan: npx --yes wrangler@4 pages project list
[deploy:pages] 3. Verify build locally: pnpm build
[deploy:pages] 4. Do not paste full tokens into chat; use CLOUDFLARE_API_TOKEN as an environment variable or GitHub Secret.
EOF
}

on_error() {
  local exit_code="$1"
  fail_next_steps "$exit_code"
  exit "$exit_code"
}

trap 'on_error $?' ERR

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --no-install)
      INSTALL_DEPS=0
      shift
      ;;
    --project)
      PROJECT_NAME="${2:?Missing value for --project}"
      shift 2
      ;;
    --output)
      OUTPUT_DIR="${2:?Missing value for --output}"
      shift 2
      ;;
    --branch)
      BRANCH_NAME="${2:?Missing value for --branch}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      ;;
    *)
      printf '[deploy:pages] Unknown option: %s\n\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
cd "$PROJECT_ROOT"

if ! command -v pnpm >/dev/null 2>&1; then
  log "pnpm not found; enabling Corepack."
  corepack enable
fi

if [[ "$INSTALL_DEPS" -eq 1 ]]; then
  log "Installing dependencies with frozen lockfile."
  env -u CLOUDFLARE_API_TOKEN -u CLOUDFLARE_ACCOUNT_ID -u CF_API_TOKEN -u CF_ACCOUNT_ID -u WRANGLER_API_TOKEN pnpm install --frozen-lockfile
fi

log "Building with: ${BUILD_COMMAND}"
env -u CLOUDFLARE_API_TOKEN -u CLOUDFLARE_ACCOUNT_ID -u CF_API_TOKEN -u CF_ACCOUNT_ID -u WRANGLER_API_TOKEN bash -lc "$BUILD_COMMAND"

if [[ ! -d "$OUTPUT_DIR" ]]; then
  printf '[deploy:pages] Build output directory not found: %s\n' "$OUTPUT_DIR" >&2
  printf '[deploy:pages] Check wrangler.toml pages_build_output_dir and package.json build script.\n' >&2
  exit 1
fi

log "Build output ready: ${OUTPUT_DIR}"

if [[ "$DRY_RUN" -eq 1 ]]; then
  log "Dry run complete; deploy skipped."
  log "Would deploy to Cloudflare Pages project '${PROJECT_NAME}' on branch '${BRANCH_NAME}'."
  exit 0
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  log "CLOUDFLARE_API_TOKEN is not set; trying local Wrangler auth."
fi

LOG_FILE="${TMPDIR:-/tmp}/vibevibe-pages-deploy-$(date +%Y%m%d%H%M%S)-$$.log"

log "Deploying to Cloudflare Pages project '${PROJECT_NAME}' on branch '${BRANCH_NAME}'."
npx --yes wrangler@4 pages deploy "$OUTPUT_DIR" \
  --project-name "$PROJECT_NAME" \
  --branch "$BRANCH_NAME" \
  --commit-dirty=true | tee "$LOG_FILE"

DEPLOY_URL="$(grep -Eo 'https://[A-Za-z0-9._-]+\.pages\.dev[^[:space:]]*' "$LOG_FILE" | tail -n 1 || true)"
if [[ -n "$DEPLOY_URL" ]]; then
  log "Deployment URL: ${DEPLOY_URL}"
else
  log "Deployment completed, but no pages.dev URL was found in Wrangler output."
  log "Wrangler output log: ${LOG_FILE}"
fi
