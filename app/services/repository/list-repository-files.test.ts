import path from 'node:path'
import { expect, test } from 'vitest'
import { listRepositoryFiles } from './list-repository-files'

test('listRepositoryFiles', async () => {
  const directory = path.join(
    import.meta.dirname,
    'test/fixtures/projects/projectA/docs',
  )
  const files = await listRepositoryFiles(directory)
  expect(files).toMatchSnapshot()
})
