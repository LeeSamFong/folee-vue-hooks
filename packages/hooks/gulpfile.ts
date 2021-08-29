import gulp from 'gulp'
import ts from 'gulp-typescript'
import path from 'path'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { buildOutput } from '../../build/paths'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rewriter from '../../build/gulp-rewriter'

export const esm = './es'
export const cjs = './lib'
const tsProject = ts.createProject('tsconfig.json')

const inputs = [
  './**/*.ts',
  '!./node_modules',
  '!./gulpfile.ts',
  '!./__tests__/*.ts',
]

function compileEsm() {
  return gulp
    .src(inputs)
    .pipe(tsProject())
    .pipe(rewriter())
    .pipe(gulp.dest(esm))
}

function compileCjs() {
  return gulp
    .src(inputs)
    .pipe(
      ts.createProject('tsconfig.json', {
        module: 'commonjs',
      })(),
    )
    .pipe(rewriter())
    .pipe(gulp.dest(cjs))
}

const distBundle = path.resolve(buildOutput, './folee-vue-hooks')

/**
 * copy from packages/hooks/lib to dist/hooks
 */
function copyEsm() {
  return gulp
    .src(esm + '/**')
    .pipe(gulp.dest(path.resolve(distBundle, 'es/hooks')))
}

function copyCjs() {
  return gulp
    .src(cjs + '/**')
    .pipe(gulp.dest(path.resolve(distBundle, 'lib/hooks')))
}

export const build = gulp.series(compileEsm, compileCjs, copyEsm, copyCjs)

export default build
