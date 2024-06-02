import fs from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '~/services/db.server'

export const exportFiles = async (projectId: string) => {
  const files = await prisma.file.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
  })

  // 既存のファイルを削除
  await fs.rm(path.join(process.cwd(), 'exports'), {
    recursive: true,
    force: true,
  })

  // 出力先ディレクトリを作成して、ファイルを書き出す
  for (const file of files) {
    if (!file.output) {
      continue
    }

    const outputPath = path.join(process.cwd(), 'exports', file.path)
    const outputDir = path.dirname(outputPath)
    await fs.mkdir(outputDir, { recursive: true })
    await fs.writeFile(outputPath, file.output, {
      encoding: 'utf-8',
    })
  }

  return files
}
