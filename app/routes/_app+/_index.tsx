import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui'
import { db } from '~/services/db.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const projects = await db.project.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return { projects }
}
export default function Index() {
  const { projects } = useLoaderData<typeof loader>()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>
          Projects are the top-level container for your workspaces. Create a
          project to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {projects.map((project) => (
          <div key={project.id}>
            <Link to={`/projects/${project.id}`}>{project.name}</Link>
          </div>
        ))}

        {projects.length === 0 && <div>No projects yet.</div>}
      </CardContent>
      <CardFooter>
        <Button type="button" variant="default" asChild>
          <Link to="/new">New</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
