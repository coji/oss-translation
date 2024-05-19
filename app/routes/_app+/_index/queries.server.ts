import { db } from '~/services/db.server'

export const listProjects = async () => {
  return await db.project.findMany({
    orderBy: { createdAt: 'desc' },
  })
}
