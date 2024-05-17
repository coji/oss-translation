import { PrismaClient } from '@prisma/client'
import createDebug from 'debug'

const debug = createDebug('app:db')

export const db = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
})

db.$on('query', (e) => {
  debug(`Query: ${e.query}`)
  debug(`Params: ${e.params}`)
  debug(`Duration: ${e.duration}ms`)
})
