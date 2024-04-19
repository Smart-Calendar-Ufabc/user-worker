import { Context } from 'hono'
import { z } from 'zod'
import { parseZodErrors } from '../../factories/parseZodErrors'
import { makePasswordRecoverySendCodeUseCase } from '../../use-cases/factories/make-password-recovery-send-code'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'

export async function passwordRecoverySendCode(c: Context) {
	const signUpBodySchema = z.object({
		email: z.string().email(),
	})

	try {
		const { email } = signUpBodySchema.parse(await c.req.json())

		const passwordRecoverySendCode = makePasswordRecoverySendCodeUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
			isLocalhost: c.env?.IS_LOCALHOST,
		})

		await passwordRecoverySendCode.execute({
			email,
		})

		return c.json({}, 200)
	} catch (error) {
		if (error instanceof z.ZodError) {
			return c.json(
				{
					message: 'Invalid request body',
					errors: parseZodErrors(error),
				},
				400,
			)
		} else if (error instanceof ResourceNotFoundError) {
			return c.json(
				{
					message: 'Resource not found',
				},
				404,
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
