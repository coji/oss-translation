import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs } from '@remix-run/node'
import { Form, Link, redirect, useActionData } from '@remix-run/react'
import fs from 'node:fs/promises'
import path from 'node:path'
import { $path } from 'remix-routes'
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
import { scanProject } from '~/services/repository/scan-project'
import { createFiles, createProject } from './functions/mutations.server'

const schema = z.object({
  id: z.string(),
  path: z.string(),
  pattern: z.string(),
  description: z.string().optional(),
  prompt: z.string(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  const stat = await fs
    .stat(path.join('./projects', submission.value.id))
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

  const project = await createProject(submission.value)
  const files = await scanProject(project)

  await createFiles(project, files)

  return redirect($path('/'))
}

export default function NewProjectPage() {
  const actionData = useActionData<typeof action>()
  const [form, { id, path, pattern, description, prompt }] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: {
      prompt:
        'Translate the following text to Japanese. Markdowns should be left intact:',
    },
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
              <Label htmlFor={id.id}>Name</Label>
              <Input {...getInputProps(id, { type: 'text' })} />
              <div id={id.errorId} className="text-sm text-destructive">
                {id.errors}
              </div>
            </div>
            <div>
              <Label>Document Path</Label>
              <Input {...getInputProps(path, { type: 'text' })} />
              <div id={path.errorId} className="text-sm text-destructive">
                {path.errors}
              </div>
            </div>
            <div>
              <Label>Glob Pattern</Label>
              <Input {...getInputProps(pattern, { type: 'text' })} />
              <div id={pattern.errorId} className="text-sm text-destructive">
                {pattern.errors}
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
              <Label htmlFor={prompt.id}>Prompt</Label>
              <Textarea {...getTextareaProps(prompt)} />
              <div id={prompt.errorId} className="text-sm text-destructive">
                {prompt.errors}
              </div>
            </div>
          </Stack>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row">
          <Button type="button" variant="ghost" asChild>
            <Link to={$path('/')}>Cancel</Link>
          </Button>

          <Button type="submit">Create Project</Button>
        </CardFooter>
      </Card>
    </Form>
  )
}
