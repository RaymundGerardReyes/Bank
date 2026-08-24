#!/bin/bash
set -e

# ============================================================
# Supervised, config-driven isolated semantic-commit + tag tool
# Safe by default: dry-run preview, per-module confirmation,
# automatic backup branch, and a full run log.
#
# Usage:
#   ./isolated_release.sh                 # interactive, asks before each module
#   ./isolated_release.sh --dry-run        # shows everything, commits/tags nothing
#   ./isolated_release.sh --yes            # auto-confirm every module (no prompts)
#   ./isolated_release.sh --config path.conf
#
# Config file format (one module per non-empty, non-comment line):
#   scope|tag_prefix|commit_type|commit_description|path1,path2,...
#
# Example line:
#   inference-engine|inference-engine|feat|add CNN-LSTM fall-detection pipeline|src/ml/inference,src/ml/models
#
# commit_type accepted: feat, feat!, fix, patch, refactor, perf,
#                        chore, docs, test, major, breaking
# ============================================================

CONFIG_FILE="modules.conf"
DRY_RUN=false
AUTO_YES=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --yes) AUTO_YES=true ;;
    --config)
      shift_config_next=true ;;
    *)
      if [ "${shift_config_next:-false}" = "true" ]; then
        CONFIG_FILE="$arg"
        shift_config_next=false
      fi
      ;;
  esac
done

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="release_log_${TIMESTAMP}.txt"
BACKUP_BRANCH="backup-before-release-${TIMESTAMP}"

log() {
  echo "$1" | tee -a "$LOG_FILE"
}

if [ ! -f "$CONFIG_FILE" ]; then
  echo "ERROR: Config file '$CONFIG_FILE' not found."
  echo "Create it with lines like:"
  echo "  scope|tag_prefix|commit_type|commit_description|path1,path2"
  exit 1
fi

log "=============================================================="
log "Run started: $(date)"
log "Mode: $([ "$DRY_RUN" = true ] && echo DRY-RUN || echo LIVE) | Auto-confirm: $AUTO_YES"
log "Config: $CONFIG_FILE"
log "=============================================================="

if [ "$DRY_RUN" = false ]; then
  if git show-ref --verify --quiet "refs/heads/$BACKUP_BRANCH"; then
    log "Backup branch $BACKUP_BRANCH already exists, skipping creation."
  else
    git branch "$BACKUP_BRANCH"
    log "Safety backup branch created: $BACKUP_BRANCH (rollback with: git reset --hard $BACKUP_BRANCH)"
  fi
fi

log "Unstaging everything to start from a clean slate..."
git reset >> "$LOG_FILE" 2>&1 || true

log "Fetching remote tags to avoid collisions..."
if [ "$DRY_RUN" = false ]; then
  git fetch --tags origin >> "$LOG_FILE" 2>&1 || true
else
  log "  (skipped actual fetch in dry-run; assuming local tags are current)"
fi

bump_patch() {
  local version=${1#v}
  if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    echo "${BASH_REMATCH[1]}.${BASH_REMATCH[2]}.$((BASH_REMATCH[3] + 1))"
  else
    echo "0.0.1"
  fi
}

bump_minor() {
  local version=${1#v}
  if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    echo "${BASH_REMATCH[1]}.$((BASH_REMATCH[2] + 1)).0"
  else
    echo "0.1.0"
  fi
}

bump_major() {
  local version=${1#v}
  if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    echo "$((BASH_REMATCH[1] + 1)).0.0"
  else
    echo "1.0.0"
  fi
}

confirm() {
  local prompt="$1"
  if [ "$AUTO_YES" = true ] || [ "$DRY_RUN" = true ]; then
    return 0
  fi
  read -r -p "$prompt [y/N]: " reply
  [[ "$reply" =~ ^[Yy]$ ]]
}

process_module() {
  local scope_name="$1"
  local tag_prefix="$2"
  local commit_type="$3"
  local commit_desc="$4"
  local paths_csv="$5"
  IFS=',' read -r -a paths <<< "$paths_csv"

  local changes=""
  for i in "${!paths[@]}"; do
    # Trim leading/trailing whitespace and update the array element
    paths[i]="$(echo "${paths[$i]}" | xargs)"
    if [ -n "$(git ls-files -m -o -d --exclude-standard "${paths[$i]}" 2>/dev/null)" ]; then
      changes="yes"
      break
    fi
  done

  if [ -z "$changes" ]; then
    log "No changes detected for '$scope_name', skipping."
    return
  fi

  log "----------------------------------------------------"
  log "Module: $scope_name"
  log "Paths: ${paths[*]}"
  local actual_type="${commit_type%\!}"
  local breaking=""
  if [[ "$commit_type" == *"!"* ]]; then
    breaking="!"
  fi
  local full_commit_msg="${actual_type}(${scope_name})${breaking}: ${commit_desc}"

  log "Proposed commit: ${full_commit_msg}"
  log ""
  log "-- git status for these paths --"
  git status --short "${paths[@]}" 2>/dev/null | tee -a "$LOG_FILE"
  log "-- diff stat for these paths --"
  git diff --stat -- "${paths[@]}" 2>/dev/null | tee -a "$LOG_FILE"
  git diff --stat --cached -- "${paths[@]}" 2>/dev/null | tee -a "$LOG_FILE"
  echo ""

  if [ "$DRY_RUN" = true ]; then
    log "[DRY-RUN] Would run: git add ${paths[*]}"
    log "[DRY-RUN] Would run: git commit -m \"${full_commit_msg}\""
  fi

  if ! confirm "Commit '$scope_name' as shown above?"; then
    log "Skipped '$scope_name' by user choice."
    return
  fi

  if [ "$DRY_RUN" = false ]; then
    git add "${paths[@]}"
    git commit -m "$full_commit_msg" | tee -a "$LOG_FILE"
  fi

  if [[ "$commit_type" != "chore" && "$commit_type" != "docs" && "$commit_type" != "test" ]]; then
    local current_tag version_num tag_pattern
    if [ -z "$tag_prefix" ]; then
      tag_pattern="v*"
    else
      tag_pattern="${tag_prefix}-v*"
    fi
    
    current_tag=$(git tag -l "$tag_pattern" | sort -V | tail -n 1)
    
    if [ -z "$current_tag" ]; then
      version_num="0.0.0"
      current_tag="None"
    else
      if [ -z "$tag_prefix" ]; then
        version_num=${current_tag#v}
      else
        version_num=${current_tag#${tag_prefix}-v}
      fi
    fi

    local next_version bump_reason
    if [[ "$commit_type" == *"!"* || "$commit_type" == "major" || "$commit_type" == "breaking" ]]; then
      next_version=$(bump_major "$version_num")
      bump_reason="MAJOR (breaking change)"
    elif [[ "$commit_type" == "fix" || "$commit_type" == "patch" || "$commit_type" == "refactor" || "$commit_type" == "perf" ]]; then
      next_version=$(bump_patch "$version_num")
      bump_reason="PATCH (backward-compatible fix)"
    else
      next_version=$(bump_minor "$version_num")
      bump_reason="MINOR (new backward-compatible feature)"
    fi

    local next_tag
    if [ -z "$tag_prefix" ]; then
      next_tag="v${next_version}"
    else
      next_tag="${tag_prefix}-v${next_version}"
    fi
    log "Tag plan for $scope_name: $current_tag -> $next_tag ($bump_reason)"

    if [ "$DRY_RUN" = true ]; then
      log "[DRY-RUN] Would create tag: $next_tag"
    else
      if confirm "Create tag $next_tag for this commit?"; then
        git tag -a "$next_tag" -m "${tag_prefix} Release ${next_version}

Included commit:
- ${full_commit_msg}

Bump reason: ${bump_reason}"
        log "Tag created: $next_tag"
      else
        log "Tag skipped by user for $scope_name."
      fi
    fi
  else
    log "No tag needed for commit type '$commit_type'."
  fi
}

while IFS= read -r line || [ -n "$line" ]; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  IFS='|' read -r scope tag_prefix commit_type commit_desc paths_csv <<< "$line"
  process_module "$scope" "$tag_prefix" "$commit_type" "$commit_desc" "$paths_csv"
done < "$CONFIG_FILE"

log "=============================================================="
log "Run finished: $(date)"
if [ "$DRY_RUN" = true ]; then
  log "This was a DRY RUN. Nothing was committed or tagged."
else
  log "Review with: git log -n 24 --oneline"
  log "If something is wrong, undo with: git reset --hard $BACKUP_BRANCH"
  log "When satisfied, push with: git push origin main && git push --tags"
fi
log "Full log saved to: $LOG_FILE"
