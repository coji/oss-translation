import fs from 'node:fs/promises'
import path from 'node:path'
import { md5sum } from '~/libs/md5sum'

export const getRepositoryFileContent = async (
  directory: string,
  filename: string,
) => {
  const content = await fs.readFile(path.join(directory, filename), 'utf-8')
  const md5 = md5sum(content)

  return { filename, content, md5 }
}
