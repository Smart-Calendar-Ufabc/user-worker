import { Context } from 'hono'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { InvalidCodeError } from '../../use-cases/errors/InvalidCodeError'
import { parseZodErrors } from '../../factories/parseZodErrors'
import { makeCreateProfileUseCase } from '../../use-cases/factories/make-create-profile'
import { UserAlreadyExistsError } from '../../use-cases/errors/UserAlreadyExistsError'

export async function createProfile(c: Context) {
	const intervalSchema = z.object({
		start: z.object({
			hour: z.number().int().min(0).max(23),
			minutes: z.number().int().min(0).max(59),
		}),
		end: z.object({
			hour: z.number().int().min(0).max(23),
			minutes: z.number().int().min(0).max(59),
		}),
	})

	const blockedTimeTypeSchema = z.object({
		dates: z.array(z.date()),
		weekDays: z.array(z.number().int().min(0).max(6)),
		intervals: z.array(intervalSchema),
	})

	const signUpBodySchema = z.object({
		name: z.string(),
		avatar: z.string().optional(),
		blockedTimes: z.array(blockedTimeTypeSchema).optional(),
	})

	try {
		const { name, avatar, blockedTimes } = signUpBodySchema.parse(
			await c.req.json(),
		)

		const createProfileUseCase = makeCreateProfileUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		const { profile } = await createProfileUseCase.execute({
			user_id: c.env.user.id,
			name,
			avatar,
			blockedTimes,
		})

		return c.json(
			{
				data: { profile },
			},
			201,
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
					message: 'User not found',
				},
				404,
			)
		} else if (error instanceof UserAlreadyExistsError) {
			return c.json(
				{
					message: 'Profile already exists',
				},
				403,
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
