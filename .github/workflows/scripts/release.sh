#!/usr/bin/env bash
set -euo pipefail

# Publishes a GitHub release for package.json's version, which tags SHA.
# Reads REPO, SHA and GH_TOKEN from the environment, package.json from the
# working directory.

version="$(node -p "require('./package.json').version")"
tag="v$version"

gh release create "$tag" --repo "$REPO" --target "$SHA" --title "$tag" --generate-notes
