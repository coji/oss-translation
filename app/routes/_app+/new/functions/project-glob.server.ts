import type { Project } from '@prisma/client'
import fg from 'fast-glob'
import path from 'node:path'

export const globProject = async (project: Project) => {
  const cwd = path.join('projects', project.id, project.path)
  const files = await fg(project.pattern, {
    cwd,
    onlyFiles: true,
  })

  return files
}
