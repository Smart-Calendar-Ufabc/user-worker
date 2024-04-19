import { Context } from 'hono'
import { z } from 'zod'
import { parseZodErrors } from '../../factories/parseZodErrors'
import { makePasswordRecoveryConfirmCodeUseCase } from '../../use-cases/factories/make-password-recovery-confirm-code'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { InvalidCodeError } from '../../use-cases/errors/InvalidCodeError'

export async function passwordRecoveryConfirmCode(c: Context) {
	const signUpBodySchema = z.object({
		email: z.string().email(),
		code: z.string().length(6),
	})

	try {
		const { code, email } = signUpBodySchema.parse(await c.req.json())

		const passwordRecoverySendCode = makePasswordRecoveryConfirmCodeUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		const { token } = await passwordRecoverySendCode.execute({
			email,
			code,
		})

		return c.json({ token }, 200)
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
		} else if (error instanceof InvalidCodeError) {
			return c.json(
				{
					message: 'Invalid code',
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
