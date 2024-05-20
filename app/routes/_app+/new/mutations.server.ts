import type { Prisma, Project } from '@prisma/client'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { db } from '~/services/db.server'

export const createProject = async (data: Prisma.ProjectCreateInput) => {
  return await db.project.create({ data })
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
    const hash = crypto.createHash('md5')
    const md5sum = hash.update(content).digest('hex')
    await db.file.create({
      data: {
        path: filePath,
        content,
        contentMD5: md5sum,
        Project: { connect: { id: project.id } },
      },
    })
  }
}
