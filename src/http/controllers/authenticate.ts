import { Context } from 'hono'
import { z } from 'zod'
import { makeAuthenticateUseCase } from '../../use-cases/factories/make-authenticate'
import { InvalidCredentialsError } from '../../use-cases/errors/InvalidCredentialsError'
import { parseZodErrors } from '../../factories/parseZodErrors'

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

		const { token, profile } = await authenticateUseCase.execute({
			email,
			password,
		})

		return c.json(
			{
				token,
				profile,
			},
			200,
			{
				'Set-Cookie': `authToken=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600; Secure`,
			},
		)
	} catch (error) {
		if (error instanceof z.ZodError) {
			return c.json(
				{
					message: 'Invalid request body',
					errors: parseZodErrors(error),
				},
				400,
			)
		} else if (error instanceof InvalidCredentialsError) {
			console.error(error)
			return c.json(
				{
					message: 'Invalid credentials',
				},
				401,
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
