import { Context } from 'hono'
import { setCookie } from 'hono/cookie'
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

		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

		const { token, profile, onboardingCompleted } =
			await authenticateUseCase.execute({
				email,
				password,
			})

		const isLocal = Boolean(c.env?.IS_LOCALHOST)

		setCookie(c, 'session', token, {
			path: '/',
			secure: !isLocal,
			httpOnly: true,
			expires: expiresAt,
			sameSite: isLocal ? 'Lax' : 'None',
		})

		return c.json(
			{
				token,
				profile,
				onboardingCompleted,
			},
			200,
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
