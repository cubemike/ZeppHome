#!/bin/bash
set -e
version=$(jq -r '.app.version.name' app.json)
version="$(semver -i patch $version)"
jq ".app.version.name = \"$version\"" app.json | sponge app.json
zeus preview
