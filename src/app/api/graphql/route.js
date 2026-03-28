import { createYoga, createSchema } from 'graphql-yoga'
import jwt from 'jsonwebtoken'
import { typeDefs } from '../../../graphql/schema'
import { resolvers } from '../../../graphql/resolvers'

const schema = createSchema({ typeDefs, resolvers })

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  context: ({ request }) => {
    const auth = request.headers.get('authorization') ?? ''
    if (auth.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(auth.slice(7), process.env.JWT_SECRET)
        return { userId: decoded.id, userEmail: decoded.email }
      } catch {}
    }
    return {}
  },
})

export async function GET(request)     { return yoga.fetch(request) }
export async function POST(request)    { return yoga.fetch(request) }
export async function OPTIONS(request) { return yoga.fetch(request) }
