#! /usr/bin/bash

set -e

yarn bootstrap
yarn clean:lib
yarn update:version
yarn gen:version
yarn build:hooks
yarn build:entry

echo 'copying entry types'
rsync -a dist/entry/types/ dist/folee-vue-hooks/es/
rsync -a dist/entry/types/ dist/folee-vue-hooks/lib/

echo 'copying source code'
cp -R packages dist/folee-vue-hooks
cp packages/folee-vue-hooks/package.json dist/folee-vue-hooks/package.json
