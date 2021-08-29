import { buildOutput, epRoot } from './paths'
import rollup from 'rollup'
import path from 'path'
import esbuild from 'rollup-plugin-esbuild'
import replace from 'rollup-plugin-replace'
import { EP_PREFIX, excludes } from './constants'
import chalk from 'chalk'
import genDts from './gen-entry-dts'
import fs from 'fs'

const buildEntry = async () => {
  const entryFiles = await fs.promises.readdir(epRoot, { withFileTypes: true })

  const entryPoints = entryFiles
    .filter(f => f.isFile())
    .filter(f => {
      return f.name !== 'package.json' && f.name !== 'README.md'
    })
    .map(f => path.resolve(epRoot, f.name))

  const entryBundle = await rollup.rollup({
    input: entryPoints,
    plugins: [
      esbuild({
        minify: false,
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
    external: () => true,
  })

  const rewriter = id => {
    if (id.startsWith(`${EP_PREFIX}/hooks`))
      return id.replace(`${EP_PREFIX}/hooks`, './hooks')
    if (id.startsWith(EP_PREFIX) && excludes.every(e => !id.endsWith(e)))
      return id.replace(EP_PREFIX, '.')
  }

  console.log(chalk.yellow('Generating cjs entry'))

  await entryBundle.write({
    format: 'cjs',
    dir: path.resolve(buildOutput, 'folee-vue-hooks/lib'),
    exports: 'named',
    paths: rewriter,
  })

  console.log(chalk.green('cjs entry generated'))

  console.log(chalk.yellow('Generating esm entry'))

  await entryBundle.write({
    format: 'esm',
    dir: path.resolve(buildOutput, 'folee-vue-hooks/es'),
    paths: rewriter,
  })

  console.log(chalk.green('esm entry generated'))

  console.log(chalk.bold(chalk.green('Full bundle generated')))

  console.log(chalk.yellow('Generate entry file definitions'))

  await genDts()

  console.log(chalk.green('Entry file definitions generated'))
}

buildEntry()
