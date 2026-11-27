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

gh release create "$tag" --repo "$REPO" --target "$SHA" --title "$tag" --generate-notes
