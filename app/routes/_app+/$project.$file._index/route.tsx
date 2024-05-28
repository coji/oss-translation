import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react'
import { ArrowLeftIcon } from 'lucide-react'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Label,
  Stack,
  Textarea,
} from '~/components/ui'
import { updateFileOutput } from './mutations.server'
import { getFile } from './queries.server'

const schema = z.object({
  output: z.string(),
})

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { project: projectId, file: fileId } = zx.parseParams(params, {
    project: z.string(),
    file: zx.NumAsString,
  })
  const file = await getFile(projectId, fileId)
  return { file }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { project: projectId, file: fileId } = zx.parseParams(params, {
    project: z.string(),
    file: zx.NumAsString,
  })

  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  await updateFileOutput(projectId, fileId, submission.value.output)

  return {
    lastResult: submission.reply({ resetForm: true }),
  }
}

export default function ProjectFileDetails() {
  const { file } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [form, { output }] = useForm({
    lastResult: navigation.state === 'idle' ? actionData?.lastResult : null,
    defaultValue: {
      output: file.output,
    },
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <Form method="POST" {...getFormProps(form)}>
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
          <CardDescription>{file.contentMD5}</CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-2">
          <Stack>
            <Label>Original</Label>
            <Textarea readOnly rows={20} defaultValue={file.content} />
          </Stack>

          <Stack>
            <Label htmlFor={output.id}>Output</Label>
            <Textarea {...getTextareaProps(output)} rows={20} />
            <div id={output.errorId} className="text-sm text-destructive">
              {output.errors}
            </div>

            <HStack>
              <Button
                variant="secondary"
                {...form.reset.getButtonProps()}
                disabled={!form.dirty}
                className="w-full"
              >
                Reset
              </Button>

              <Button type="submit" disabled={!form.dirty} className="w-full">
                Save
              </Button>
            </HStack>
          </Stack>
        </CardContent>
      </Card>
    </Form>
  )
}
