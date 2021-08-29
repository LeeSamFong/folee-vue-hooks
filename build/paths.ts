import path from 'path'

const projRoot = path.resolve(__dirname, '../')
const pkgRoot = path.resolve(projRoot, './packages')
const epRoot = path.resolve(pkgRoot, './folee-vue-hooks')
const buildOutput = path.resolve(projRoot, './dist')

export { projRoot, pkgRoot, epRoot, buildOutput }
