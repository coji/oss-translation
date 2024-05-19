import type { Prisma } from '@prisma/client'
import { db } from '~/services/db.server'

export const createProject = async (data: Prisma.ProjectCreateInput) => {
  return await db.project.create({ data })
}
