import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { Link, useLoaderData, useNavigate } from 'react-router';
import { $path } from 'remix-routes'
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

export const meta: MetaFunction = () => [{ title: 'Projects' }]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const projects = await listProjects()
  return { projects }
}

export default function Index() {
  const { projects } = useLoaderData<typeof loader>()
  const navigate = useNavigate()

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
                <TableCell>Path</TableCell>
                <TableCell>Pattern</TableCell>
                <TableCell>Excludes</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="hover:cursor-pointer"
                  onClick={() => {
                    navigate($path('/:project', { project: project.id }))
                  }}
                >
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.path}</TableCell>
                  <TableCell>{project.pattern}</TableCell>
                  <TableCell>{project.excludes}</TableCell>
                  <TableCell>{project.createdAt.toString()}</TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No projects yet.
                </TableCell>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="button" variant="default" asChild>
          <Link to={$path('/new')}>New</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
