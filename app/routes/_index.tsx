import type { MetaFunction } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { jsonWithSuccess } from 'remix-toast'
import { Button } from '~/components/ui'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export const action = () => {
  return jsonWithSuccess(
    {},
    {
      message: 'hello!',
    },
  )
}

export default function Index() {
  return (
    <Form method="POST">
      <Button type="submit">Submit</Button>
    </Form>
  )
}
