#! /usr/bin/bash

set -e

echo 'Publishing...'

cd dist/folee-vue-hooks
npm publish --access public
cd -

echo "Publish completed"
