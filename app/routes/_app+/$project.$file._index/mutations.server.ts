import { prisma } from '~/services/db.server'

export const updateFileOutput = async (
  projectId: string,
  fileId: number,
  output: string,
) => {
  return await prisma.file.update({
    data: {
      output,
    },
    where: {
      id: fileId,
      projectId,
    },
  })
}
