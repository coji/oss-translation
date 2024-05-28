import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react'
import { ArrowLeftIcon, LoaderCircleIcon } from 'lucide-react'
import { $path } from 'remix-routes'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'

import dayjs from '~/libs/dayjs'
import {
  exportFiles,
  getProjectDetails,
  startTranslationJob,
} from './functions.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { project: projectId } = zx.parseParams(params, { project: z.string() })
  const project = await getProjectDetails(projectId)
  return { project }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { project: projectId } = zx.parseParams(params, { project: z.string() })
  const formData = await request.formData()

  const intent = formData.get('intent') as string

  if (intent === 'start-translation-job') {
    await startTranslationJob(projectId)
  }

  if (intent === 'export-files') {
    await exportFiles(projectId)
  }

  return {}
}

export default function ProjectDetail() {
  const { project } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const navigate = useNavigate()

  const isSubmitting = navigation.state === 'submitting'
  const isTranslationInProgress =
    navigation.state === 'submitting' &&
    navigation.formData?.get('intent') === 'start-translation-job'
  const isExportInProgress =
    navigation.state === 'submitting' &&
    navigation.formData?.get('intent') === 'export-files'

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

        <Form method="POST">
          <HStack>
            <Button
              name="intent"
              value="start-translation-job"
              disabled={isSubmitting}
            >
              {isTranslationInProgress && (
                <LoaderCircleIcon size="16" className="mr-2 animate-spin" />
              )}
              Start Translation
            </Button>
            <Button name="intent" value="export-files" disabled={isSubmitting}>
              {isExportInProgress && (
                <LoaderCircleIcon size="16" className="mr-2 animate-spin" />
              )}
              Export files
            </Button>
          </HStack>
        </Form>
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
                <TableCell>
                  {file.isUpdated && <Badge>Updated</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
