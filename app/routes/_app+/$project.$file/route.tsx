import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { ArrowLeftIcon } from 'lucide-react'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  NavTab,
  NavTabs,
} from '~/components/ui'
import { getFile, getProject } from './queries.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { project: projectId, file: fileId } = zx.parseParams(params, {
    project: z.string(),
    file: zx.NumAsString,
  })
  const project = await getProject(projectId)
  const file = await getFile(projectId, fileId)
  return { project, file }
}

export default function ProjectFileDetails() {
  const { project, file } = useLoaderData<typeof loader>()
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

        <NavTabs>
          <NavTab to="." end>
            Edit
          </NavTab>
          <NavTab to="./translate" end>
            Translate
          </NavTab>
        </NavTabs>
      </CardHeader>

      <CardContent>
        <Outlet context={{ project, file }} />
      </CardContent>
    </Card>
  )
}
