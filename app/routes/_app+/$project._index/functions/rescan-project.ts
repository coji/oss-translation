import { okAsync } from 'neverthrow'
import { listRepositoryFiles } from '~/services/repository/list-repository-files'
import { getProjectPath } from '~/services/repository/utils'
import { getProject, listProjectFiles } from './queries.server'

export const rescanFiles = async (projectId: string) => {
  const project = await getProject(projectId)
  const projectFiles = await listProjectFiles(projectId)
  const directory = getProjectPath(project)
  const repositoryFiles = await listRepositoryFiles(directory, {
    pattern: project.pattern,
    excludes: project.excludes,
  })
  if (repositoryFiles.isErr()) {
    return repositoryFiles
  }

  const updatedFiles: {
    filePath: string
    content: string
    contentMD5: string
    status: 'updated' | 'added' | 'removed'
  }[] = []

  // check for updated and added files
  for (const repositoryFile of repositoryFiles.value) {
    const matchFile = projectFiles.find((projectFile) => {
      return projectFile.path === repositoryFile.filename
    })

    if (matchFile && matchFile.contentMD5 !== repositoryFile.md5) {
      updatedFiles.push({
        filePath: repositoryFile.filename,
        content: repositoryFile.content,
        contentMD5: repositoryFile.md5,
        status: 'updated',
      })
    }
    if (!matchFile) {
      updatedFiles.push({
        filePath: repositoryFile.filename,
        content: repositoryFile.content,
        contentMD5: repositoryFile.md5,
        status: 'added',
      })
    }
  }

  // check for removed files
  for (const projectFile of projectFiles) {
    const matchFile = repositoryFiles.value.find((repositoryFile) => {
      return projectFile.path === repositoryFile.filename
    })

    if (!matchFile) {
      updatedFiles.push({
        filePath: projectFile.path,
        content: projectFile.content,
        contentMD5: projectFile.contentMD5,
        status: 'removed',
      })
    }
  }

  return okAsync(updatedFiles)
}
