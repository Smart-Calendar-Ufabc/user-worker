import { Context, Next } from 'hono'
import { PrismaSessionsRepository } from '../../repositories/prisma/prisma-sessions-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'

export async function ensureAuthenticate(c: Context, next: Next) {
	const sessionToken = c.req.header('Authorization')

	if (!sessionToken) {
		return c.json(
			{
				message: 'Not authenticated',
			},
			401,
		)
	}

	const sessionsRepository = new PrismaSessionsRepository({
		connectionString: c.env.DATABASE_URL,
	})

	const session = await sessionsRepository.findUniqueByToken(sessionToken)

	if (!session) {
		return c.json(
			{
				message: 'Not authenticated',
			},
			401,
		)
	}

	const usersRepository = new PrismaUsersRepository({
		connectionString: c.env.DATABASE_URL,
	})

	const user = await usersRepository.findUniqueById(session.user_id)

	if (!user) {
		return c.json(
			{
				message: 'Not authenticated',
			},
			401,
		)
	}

	// Store the user in the context so it can be accessed in subsequent middleware and routes.
	c.env.user = user
	c.env.profile = user.profile
	c.env.token = sessionToken

	// Proceed to the next middleware or route handler.
	await next()
}
