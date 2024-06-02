import fg from 'fast-glob'
import { okAsync } from 'neverthrow'
import { getRepositoryFileContent } from './get-repository-file-content'
import type { RepositoryFile } from './types'

export const listRepositoryFiles = async (
  directory: string,
  opt: { pattern: string; excludes: string[] } = {
    pattern: '**/*',
    excludes: [],
  },
) => {
  const filenames = await fg(
    [opt.pattern, ...opt.excludes.map((e) => `!${e}`)],
    {
      cwd: directory,
      onlyFiles: true,
    },
  )

  const files: RepositoryFile[] = []
  for (const filename of filenames) {
    const result = await getRepositoryFileContent(directory, filename)
    if (result.isOk()) {
      files.push(result.value)
    }
  }

  return okAsync(files)
}
