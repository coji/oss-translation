import { Link } from '@remix-run/react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from '~/components/ui'
import { Stack } from '~/components/ui/stack'

export default function NewProjectPage() {
  return (
    <form>
      <Card>
        <CardHeader>
          <CardTitle>New Project</CardTitle>
          <CardDescription>Create a new translation project</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack>
            <Label>
              Name
              <Input type="text" />
            </Label>

            <Label>
              <span>Project Description</span>
              <Textarea />
            </Label>
          </Stack>
        </CardContent>
        <CardFooter>
          <Button type="button" variant="ghost" asChild>
            <Link to="/">Cancel</Link>
          </Button>

          <Button type="submit">Create Project</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
