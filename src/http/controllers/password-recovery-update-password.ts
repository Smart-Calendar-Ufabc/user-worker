import { Context } from 'hono'
import { z } from 'zod'
import { parseZodErrors } from '../../factories/parseZodErrors'
import { makePasswordRecoveryUpdatePasswordUseCase } from '../../use-cases/factories/make-password-recovery-update-password'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { PasswordDoesNotMatchError } from '../../use-cases/errors/PasswordDoesNotMatchError'

export async function passwordRecoveryUpdatePassword(c: Context) {
	const signUpBodySchema = z.object({
		newPassword: z.string(),
		confirmPassword: z.string(),
		token: z.string(),
	})

	try {
		const { newPassword, confirmPassword, token } = signUpBodySchema.parse(
			await c.req.json(),
		)

		const passwordRecoverySendCode = makePasswordRecoveryUpdatePasswordUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		await passwordRecoverySendCode.execute({
			newPassword,
			confirmPassword,
			token,
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
		} else if (error instanceof PasswordDoesNotMatchError) {
			return c.json(
				{
					message: 'Password does not match',
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
