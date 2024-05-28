import { prisma } from '~/services/db.server'

export const getProjectDetails = async (projectId: string) => {
  return await prisma.project.findFirstOrThrow({
    include: {
      files: {
        select: {
          id: true,
          path: true,
          isUpdated: true,
          translatedAt: true,
          updatedAt: true,
          createdAt: true,
        },
        orderBy: { path: 'asc' },
      },
    },
    where: { id: projectId },
    orderBy: {},
  })
}
