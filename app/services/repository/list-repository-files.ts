import fg from 'fast-glob'

export const listRepositoryFiles = async (directory: string) => {
  const files = await fg('**/*', {
    cwd: directory,
    onlyFiles: true,
  })

  return files
}
