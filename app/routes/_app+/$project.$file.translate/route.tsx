import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import type { File, Project } from '@prisma/client'
import type { ActionFunctionArgs } from '@remix-run/node'
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from '@remix-run/react'
import { LoaderCircleIcon } from 'lucide-react'
import { z } from 'zod'
import { zx } from 'zodix'
import { Button, Label, Stack, Textarea } from '~/components/ui'
import { translateByGemini } from '~/services/translate-gemini'
import { updateFileOutput } from './mutations.server'
import { getFile } from './queries.server'

const schema = z.object({
  prompt: z.string(),
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

  const file = await getFile(projectId, fileId)

  const ret = await translateByGemini({
    systemPrompt: submission.value.prompt,
    source: file.content,
  })

  if (ret.type === 'error') {
    return {
      lastResult: submission.reply({
        resetForm: true,
        formErrors: [ret.error],
      }),
    }
  }

  await updateFileOutput(projectId, fileId, ret.destinationText)

  return {
    lastResult: submission.reply({ resetForm: true }),
  }
}

export default function ProjectFileDetails() {
  const { project, file } = useOutletContext<{ project: Project; file: File }>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [form, { prompt }] = useForm({
    lastResult: navigation.state === 'idle' ? actionData?.lastResult : null,
    defaultValue: {
      prompt: project.prompt,
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
          <Textarea id="original" readOnly rows={15} value={file.content} />
        </Stack>
        <Stack>
          <Label htmlFor="output">Output</Label>
          <Textarea
            id="output"
            readOnly
            value={file.output ?? undefined}
            rows={15}
          />
        </Stack>

        <Stack className="col-span-2">
          <div>
            <Label>Prompt</Label>
            <Textarea {...getTextareaProps(prompt)} />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={navigation.state === 'submitting'}
          >
            {navigation.state === 'submitting' && (
              <LoaderCircleIcon size="16" className="mr-2 animate-spin" />
            )}
            Translate
          </Button>
        </Stack>
      </Form>
    </div>
  )
}
