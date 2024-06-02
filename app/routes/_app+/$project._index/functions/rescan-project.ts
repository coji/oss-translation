import fg from 'fast-glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { md5sum } from '~/libs/md5sum'
import { getProjectDetails } from './queries.server'

export const rescanFiles = async (projectId: string) => {
  const project = await getProjectDetails(projectId)
  const cwd = path.join('projects', project.id, project.path)
  const repositoryFiles = await fg(project.pattern, {
    cwd,
    onlyFiles: true,
  })

  const updatedFiles: {
    filePath: string
    content: string
    contentMD5: string
    status: 'updated' | 'added' | 'removed'
  }[] = []
  for (const repositoryFilePath of repositoryFiles) {
    const content = await fs.readFile(
      path.join(cwd, repositoryFilePath),
      'utf-8',
    )
    const contentMD5 = md5sum(content)
    const file = project.files.find((file) => {
      return (
        file.path ===
        path.join('projects', project.id, project.path, repositoryFilePath)
      )
    })
    if (file && file.contentMD5 !== contentMD5) {
      updatedFiles.push({
        filePath: repositoryFilePath,
        content,
        contentMD5,
        status: 'updated',
      })
    }
    if (!file) {
      updatedFiles.push({
        filePath: repositoryFilePath,
        content,
        contentMD5,
        status: 'added',
      })
    }
  }

  return updatedFiles
}
