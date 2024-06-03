import { prisma } from '~/services/db.server'

export const getProjectDetails = async (projectId: string) => {
  return await prisma.project.findFirstOrThrow({
    include: {
      files: {
        select: {
          id: true,
          path: true,
          content: true,
          contentMD5: true,
          output: true,
          isUpdated: true,
          translatedAt: true,
          updatedAt: true,
          createdAt: true,
        },
        orderBy: { path: 'asc' },
      },
    },
    where: { id: projectId },
  })
}

export const listProjectFiles = async (projectId: string) => {
  return await prisma.file.findMany({
    where: { projectId },
    orderBy: { path: 'asc' },
  })
}
