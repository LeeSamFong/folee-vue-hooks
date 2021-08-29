import path from 'path'
import glob from 'fast-glob'
import { buildOutput, epRoot } from './paths'
import { Project } from 'ts-morph'
import chalk from 'chalk'
import fs from 'fs'

const TSCONFIG_PATH = path.resolve(__dirname, '../tsconfig.dts.json')

const gen = async () => {
  const files = await glob(epRoot + '/*.ts')
  const project = new Project({
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,
      noEmitOnError: false,
      outDir: path.resolve(buildOutput, 'entry/types'),
      skipLibCheck: true,
      esModuleInterop: true,
      target: 99, // ESNext
      downlevelIteration: true,
      // types: ["./typings", "esnext", "dom"],
    },
    skipFileDependencyResolution: true,
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  })
  const sourceFiles = files.map(f => project.addSourceFileAtPath(f))

  for (const sourceFile of sourceFiles) {
    console.log(
      chalk.yellow(`Emitting file: ${chalk.bold(sourceFile.getFilePath())}`),
    )
    await sourceFile.emit()
    const emitOutput = sourceFile.getEmitOutput()
    for (const outputFile of emitOutput.getOutputFiles()) {
      const filepath = outputFile.getFilePath()

      await fs.promises.mkdir(path.dirname(filepath), {
        recursive: true,
      })
      await fs.promises.writeFile(
        filepath,
        outputFile.getText().replace(new RegExp('@folee-vue-hooks', 'g'), '.'),
        'utf8',
      )

      console.log(
        chalk.green(
          'Definition for file: ' +
            chalk.bold(sourceFile.getBaseName()) +
            ' generated',
        ),
      )
    }
  }
}

export default gen
