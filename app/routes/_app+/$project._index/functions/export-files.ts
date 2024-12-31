import fs from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '~/services/db.server'

export const exportFiles = async (projectId: string) => {
  const exportedFiles: string[] = []

  const files = await prisma.file.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
  })

  // 既存のファイルを削除
  await fs.rm(path.join(process.cwd(), 'exports', 'projects', projectId), {
    recursive: true,
    force: true,
  })

  // 出力先ディレクトリを作成して、ファイルを書き出す
  for (const file of files) {
    console.log(`Exporting ${file.path}: ${file.output?.length} bytes`)
    if (!file.output) {
      continue
    }
    console.time(`Exporting ${file.path}`)

    const outputPath = path.join(process.cwd(), 'exports', file.path)
    const outputDir = path.dirname(outputPath)
    await fs.mkdir(outputDir, { recursive: true })
    await fs.writeFile(outputPath, file.output, {
      encoding: 'utf-8',
      flush: true,
    })

    exportedFiles.push(file.path)
    console.timeEnd(`Exporting ${file.path}`)
  }

  return exportedFiles
}
