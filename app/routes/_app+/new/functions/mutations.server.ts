import type { Prisma, Project } from '@prisma/client'
import fs from 'node:fs/promises'
import path from 'node:path'
import { md5sum } from '~/libs/md5sum'
import { prisma } from '~/services/db.server'

export const createProject = async (data: Prisma.ProjectCreateInput) => {
  return await prisma.project.create({ data })
}

export const createFiles = async (project: Project, files: string[]) => {
  for (const file of files) {
    const filePath = path.join('projects', project.id, project.path, file)
    const stat = await fs.stat(filePath).catch(() => null)
    if (!stat) continue
    if (!stat.isFile()) {
      continue
    }
    const content = await fs.readFile(filePath, 'utf-8')
    const contentMD5 = md5sum(content)

    await prisma.file.create({
      data: {
        path: filePath,
        content,
        contentMD5,
        Project: { connect: { id: project.id } },
      },
    })
  }
}
