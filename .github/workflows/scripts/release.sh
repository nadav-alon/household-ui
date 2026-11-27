#!/usr/bin/env bash
set -euo pipefail

# Publishes a GitHub release for package.json's version, which tags SHA.
# Reads REPO, SHA and GH_TOKEN from the environment, package.json from the
# working directory.

version="$(node -p "require('./package.json').version")"
tag="v$version"

# A version that already has a tag is released; nothing to do. Only a 404 means
# "no tag yet": any other failure fails the run rather than guessing.
if lookup="$(gh api "repos/$REPO/git/ref/tags/$tag" 2>&1)"; then
  echo "$tag already exists; nothing to release."
  exit 0
elif ! grep -q '404' <<<"$lookup"; then
  echo "$lookup" >&2
  exit 1
fi

# The release notes are the version's CHANGELOG.md entry when there is one,
# else GitHub's generated notes.
notes="$(mktemp)"
if [[ -f CHANGELOG.md ]]; then
  awk -v heading="## $version" '
    $0 == heading { inside = 1; next }
    inside && /^## / { exit }
    inside { print }
  ' CHANGELOG.md | sed -e :a -e '/^\n*$/{$d;N;ba' -e '}' | sed '/./,$!d' >"$notes"
fi

if [[ -s "$notes" ]]; then
  notes_args=(--notes-file "$notes")
else
  notes_args=(--generate-notes)
fi

gh release create "$tag" --repo "$REPO" --target "$SHA" --title "$tag" "${notes_args[@]}"
