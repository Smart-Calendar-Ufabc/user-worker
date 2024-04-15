import { Context } from 'hono'
import { z } from 'zod'
import { makeCreateUserUseCase } from '../../use-cases/factories/make-create-user'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { InvalidCodeError } from '../../use-cases/errors/InvalidCodeError'
import { parseZodErrors } from '../../factories/parseZodErrors'

export async function singUpCodeValidate(c: Context) {
	const signUpBodySchema = z.object({
		email: z.string().email(),
		code: z.string().length(6),
	})

	try {
		const { email, code } = signUpBodySchema.parse(await c.req.json())

		const createUserUseCase = makeCreateUserUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		const { token } = await createUserUseCase.execute({
			email,
			code,
		})

		return c.json(
			{
				token,
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
		} else if (error instanceof ResourceNotFoundError) {
			return c.json(
				{
					message: 'User not found with this email',
				},
				404,
			)
		} else if (error instanceof InvalidCodeError) {
			return c.json(
				{
					message: 'Invalid code',
					errors: {
						code: ['Invalid code'],
					},
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
