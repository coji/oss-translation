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
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '~/components/ui'
import { listProjects } from './queries.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const projects = await listProjects()
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Path</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.path}</TableCell>
                  <TableCell>{project.createdAt.toISOString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
