/**
 * fork = require( https://github.com/element-plus/element-plus/blob/dev/build/gen-version.ts
 */

import pkg from '../packages/folee-vue-hooks/package.json'
import fs from 'fs'
import path from 'path'

const tagVer = process.env.TAG_VERSION

let version: string

if (tagVer) {
  version = tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
} else {
  version = pkg.version
}

fs.writeFileSync(
  path.resolve(__dirname, '../packages/folee-vue-hooks/version.ts'),
  `export const version = '${version}'
`,
)
