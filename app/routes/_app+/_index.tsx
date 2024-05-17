import { Form } from '@remix-run/react'
import { jsonWithSuccess } from 'remix-toast'
import { Button } from '~/components/ui'

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
