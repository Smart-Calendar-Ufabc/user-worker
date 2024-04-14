import { Context } from 'hono'
import { z } from 'zod'
import { makeCreateUserTempUseCase } from '../../use-cases/factories/make-create-user-temp'
import { UserAlreadyExistsError } from '../../use-cases/errors/UserAlreadyExistsError'
import { parseZodErrors } from '../../factories/parseZodErrors'

export async function singUp(c: Context) {
	const signUpBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	try {
		const { email, password } = signUpBodySchema.parse(await c.req.json())

		const createUserTempUseCase = makeCreateUserTempUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		const { code } = await createUserTempUseCase.execute({
			email,
			password,
		})

		return c.json(
			{
				message: 'Code sent to email',
				code,
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
		} else if (error instanceof UserAlreadyExistsError) {
			return c.json(
				{
					message: 'User already exists with this email',
				},
				409, // Conflict
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
