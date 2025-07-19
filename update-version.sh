#!/bin/bash

set -e

echo "Latest tag: $(git describe --abbrev=0 --tags)"
echo "Current version: $(jq -r ".version" package.json)"
echo "New version ?"
read VERSION
npm version -f --no-git-tag-version --allow-same-version ${VERSION}
cd projects/lib
npm version -f --no-git-tag-version --allow-same-version ${VERSION}
