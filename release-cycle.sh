#/usr/bin/env bash

# The full sequence of commands to make a release.

git checkout develop
git pull

git checkout master
git pull
git merge develop

npm run release
git push --follow-tags

git checkout develop
git merge master
git push
