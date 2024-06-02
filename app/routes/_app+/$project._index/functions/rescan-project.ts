import fg from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { md5sum } from '~/libs/md5sum'
import { getProjectDetails } from './queries.server'

export const rescanFiles = async (projectId: string) => {
  const project = await getProjectDetails(projectId)
  const cwd = path.join('projects', project.id, project.path)
  const filePaths = await fg(project.pattern, {
    cwd,
    onlyFiles: true,
  })

  const files: { filePath: string; content: string; contentMD5: string }[] = []
  for (const filePath of filePaths) {
    const content = await fs.readFile(path.join(cwd, filePath), 'utf-8')
    const contentMD5 = md5sum(content)
    const some = project.files.some((file) => {
      console.log({
        a: file.path,
        b: path.join('projects', project.id, project.path, filePath),
      })
      return (
        file.path ===
          path.join('projects', project.id, project.path, filePath) &&
        file.contentMD5 === contentMD5
      )
    })
    if (some) {
      continue
    }
    console.log({ filePath })
    files.push({ filePath, content, contentMD5 })
  }

  return files
}
