import type { File, Project } from '@prisma/client'
import { useOutletContext } from '@remix-run/react'
import { splitMarkdownByHeaders } from '~/libs/split-markdown'

export default function TestPage() {
  const { file } = useOutletContext<{ file: File; project: Project }>()
  const chunks = splitMarkdownByHeaders(file.content)

  return (
    <div className="grid grid-cols-2 grid-rows-1 gap-4">
      <textarea className="rounded border p-2" defaultValue={file.content} />
      <div className="grid grid-cols-1 gap-4">
        {chunks.map((chunk, index) => (
          <div className="grid grid-cols-1" key={`${index}_${chunk}`}>
            <div className="flex">
              <span>{index + 1}. </span>
              <span className="flex-1" />
              <span className="text-sm text-muted-foreground">
                {chunk.length.toLocaleString()} characters
              </span>
            </div>
            <div className="whitespace-pre-wrap break-words rounded border bg-slate-50 p-2">
              {chunk}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
