import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData, useNavigate } from '@remix-run/react'
import { ArrowLeftIcon } from 'lucide-react'
import { $path } from 'remix-routes'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import { Stack } from '~/components/ui/stack'
import dayjs from '~/libs/dayjs'
import { startTranslationJob } from '~/services/translation.server'
import { getProjectDetails } from './queries.server'

const schema = z.object({
  intent: z.literal('start-translation-job'),
})

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { project: projectId } = zx.parseParams(params, { project: z.string() })
  const project = await getProjectDetails(projectId)
  return { project }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { project: projectId } = zx.parseParams(params, { project: z.string() })
  const submission = parseWithZod(await request.formData(), {
    schema,
  })

  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  if (submission.value.intent === 'start-translation-job') {
    await startTranslationJob(projectId)
  }

  return { lastResult: submission.reply({ resetForm: true }) }
}

export default function ProjectDetail() {
  const { project } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

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

          {project.id}
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>

        <Stack>
          <Form method="POST">
            <Button name="intent" value="start-translation-job">
              Start Translation
            </Button>
          </Form>
        </Stack>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Path</TableHead>
              <TableHead>UpdatedAt</TableHead>
              <TableHead>TranslatedAt</TableHead>
              <TableHead>isUpdated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.files.map((file) => (
              <TableRow
                key={file.path}
                className="hover:cursor-pointer"
                onClick={() => {
                  navigate(
                    $path('/:project/:file', {
                      project: project.id,
                      file: file.id,
                    }),
                  )
                }}
              >
                <TableCell>{file.path}</TableCell>
                <TableCell>
                  {dayjs(file.updatedAt)
                    .utc()
                    .tz()
                    .format('YYYY-MM-DD HH:mm:ss')}
                </TableCell>
                <TableCell>{file.isUpdated && 'yes'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
