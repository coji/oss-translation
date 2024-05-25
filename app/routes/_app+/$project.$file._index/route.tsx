import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { ArrowLeftIcon } from 'lucide-react'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
} from '~/components/ui'
import { getFile } from './queries.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { project: projectId, file: fileId } = zx.parseParams(params, {
    project: z.string(),
    file: zx.NumAsString,
  })
  const file = await getFile(projectId, fileId)
  return { file }
}

export default function ProjectFileDetails() {
  const { file } = useLoaderData<typeof loader>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mr-2 rounded-full"
            asChild
          >
            <Link to=".." relative="path">
              <ArrowLeftIcon size="16" />
            </Link>
          </Button>
          {file.path}
        </CardTitle>
        <CardDescription>{file.contentMD5}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Textarea readOnly rows={20} value={file.content} />
        <Textarea readOnly rows={20} value={file.output ?? undefined} />
      </CardContent>
    </Card>
  )
}
