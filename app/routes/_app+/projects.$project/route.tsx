import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { zx } from 'zodix'
import {
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
import dayjs from '~/libs/dayjs'
import { getProjectDetails } from './queries.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { project: projectId } = zx.parseParams(params, { project: z.string() })
  const project = await getProjectDetails(projectId)
  return { project }
}

export default function ProjectDetail() {
  const { project } = useLoaderData<typeof loader>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.id}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
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
              <TableRow key={file.path}>
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
