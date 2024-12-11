import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { File, Project } from '@prisma/client'
import type { ActionFunctionArgs } from 'react-router';
import { Form, useActionData, useNavigation, useOutletContext } from 'react-router';
import { z } from 'zod'
import { zx } from 'zodix'
import { Button, HStack, Label, Stack, Textarea } from '~/components/ui'
import { updateFileOutput } from './mutations.server'

const schema = z.object({
  output: z.string(),
})

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
  const { file } = useOutletContext<{ project: Project; file: File }>()
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
    <div>
      <Form
        method="POST"
        {...getFormProps(form)}
        className="grid grid-cols-2 gap-2"
      >
        <Stack>
          <Label htmlFor="original">Original</Label>
          <Textarea id="original" readOnly rows={20} value={file.content} />
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
      </Form>
    </div>
  )
}
