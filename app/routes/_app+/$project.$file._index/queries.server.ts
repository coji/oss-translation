import { prisma } from '~/services/db.server'

export const getFile = async (projectId: string, fileId: number) => {
  return await prisma.file.findUniqueOrThrow({
    where: {
      id: fileId,
      projectId,
    },
  })
}
