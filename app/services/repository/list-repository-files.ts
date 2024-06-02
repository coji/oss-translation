import fg from 'fast-glob'
import { getRepositoryFileContent } from './get-repository-file-content'
import type { RepositoryFile } from './types'

export const listRepositoryFiles = async (directory: string) => {
  const filenames = await fg('**/*', {
    cwd: directory,
    onlyFiles: true,
  })

  const files: RepositoryFile[] = []

  for (const filename of filenames) {
    const result = await getRepositoryFileContent(directory, filename)
    if (result.isOk()) {
      files.push(result.value)
    }
  }

  return files
}
