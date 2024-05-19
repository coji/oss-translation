import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
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

const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  path: z.string(),
})

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const dir = await fs.readdir('./projects')
  return { dir }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  const stat = await fs
    .stat(path.join('./projects', submission.value.path))
    .catch(() => null)
  if (!stat) {
    return {
      lastResult: submission.reply({
        fieldErrors: { path: ['Path does not exist'] },
      }),
    }
  }
  if (!stat.isDirectory()) {
    return {
      lastResult: submission.reply({
        fieldErrors: { path: ['Path must be a directory'] },
      }),
    }
  }

  return { lastResult: submission.reply() }
}

export default function NewProjectPage() {
  const { dir } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [form, { name, description, path }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <Form method="post" {...getFormProps(form)}>
      <Card>
        <CardHeader>
          <CardTitle>New Project</CardTitle>
          <CardDescription>Create a new translation project</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack>
            <div>
              <Label htmlFor={name.id}>Name</Label>
              <Input {...getInputProps(name, { type: 'text' })} />
              <div id={name.errorId} className="text-sm text-destructive">
                {name.errors}
              </div>
            </div>

            <div>
              <Label htmlFor={description.id}>Description</Label>
              <Textarea {...getTextareaProps(description)} />
              <div
                id={description.errorId}
                className="text-sm text-destructive"
              >
                {description.errors}
              </div>
            </div>

            <div>
              <Label>Path</Label>
              <Input {...getInputProps(path, { type: 'text' })} />
              <div id={path.errorId} className="text-sm text-destructive">
                {path.errors}
              </div>
            </div>
          </Stack>
        </CardContent>
        <CardFooter>
          <Button type="button" variant="ghost" asChild>
            <Link to="/">Cancel</Link>
          </Button>

          <Button type="submit">Create Project</Button>
        </CardFooter>
      </Card>
    </Form>
  )
}
