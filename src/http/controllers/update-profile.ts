import { Context } from 'hono'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { InvalidCodeError } from '../../use-cases/errors/InvalidCodeError'
import { parseZodErrors } from '../../factories/parseZodErrors'
import { UserAlreadyExistsError } from '../../use-cases/errors/UserAlreadyExistsError'
import { makeUpdateProfileUseCase } from '../../use-cases/factories/make-update-profile'

export async function updateProfile(c: Context) {
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

		const updateProfile = makeUpdateProfileUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		const { profile } = await updateProfile.execute({
			id: c.env.profile.id,
			name,
			avatar,
			blockedTimes,
		})

		return c.json({ profile }, 200)
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
