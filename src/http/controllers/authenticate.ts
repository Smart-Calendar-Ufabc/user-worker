import { Context } from 'hono'
import { z } from 'zod'
import { makeAuthenticateUseCase } from '../../use-cases/factories/make-authenticate'
import { InvalidCredentialsError } from '../../use-cases/errors/InvalidCredentialsError'

export async function authenticate(c: Context) {
	const authenticateBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	try {
		const { email, password } = authenticateBodySchema.parse(await c.req.json())

		const authenticateUseCase = makeAuthenticateUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		const { user } = await authenticateUseCase.execute({ email, password })

		return c.json({
			user,
		})
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return c.json(
				{
					message: 'Invalid credentials',
				},
				400,
			)
		}

		return c.json(
			{
				message: 'Internal server error',
			},
			500,
		)
	}
}
