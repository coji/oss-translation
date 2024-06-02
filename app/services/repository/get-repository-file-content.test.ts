import path from 'node:path'
import { expect, test } from 'vitest'
import { getRepositoryFileContent } from './get-repository-file-content'

test('getRepositoryFileContent', async () => {
  const directory = path.join(
    import.meta.dirname,
    'fixtures/projects/projectA/docs',
  )
  const result = await getRepositoryFileContent(directory, 'index.md')

  expect(result).toMatchObject({
    filename: 'index.md',
    content: expect.stringContaining(
      'title: Getting Started with Task Management Application',
    ),
    md5: 'b6ea662901a38626e3c5f45e532082ad',
  })
})
