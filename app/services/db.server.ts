import { PrismaClient } from '@prisma/client'
import createDebug from 'debug'

const debug = createDebug('app:db')

export const db = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
})

db.$on('query', (e) => {
  debug(`${e.query}, ${e.params}, ${e.duration}ms`)
})
