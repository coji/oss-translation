import { href, Link, useNavigate } from 'react-router'
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
import type { Route } from './+types/route'
import { listProjects } from './queries.server'

export const meta: Route.MetaFunction = () => [{ title: 'Projects' }]

export const loader = async ({ request }: Route.LoaderArgs) => {
  const projects = await listProjects()
  return { projects }
}

export default function Index({
  loaderData: { projects },
}: Route.ComponentProps) {
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
                    navigate(href('/:project', { project: project.id }))
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
          <Link to={href('/new')}>New</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
