import { Context } from 'hono'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { parseZodErrors } from '../../factories/parseZodErrors'
import { makeCreateProfileUseCase } from '../../use-cases/factories/make-create-profile'
import { UserAlreadyExistsError } from '../../use-cases/errors/UserAlreadyExistsError'

export async function createProfile(c: Context) {
	const signUpBodySchema = z.object({
		name: z.string().optional(),
		avatar: z.string().optional(),
		sleepHours: z.object({
			start: z.object({
				hour: z.number().int().min(0).max(23),
				minutes: z.number().int().min(0).max(59),
			}),
			end: z.object({
				hour: z.number().int().min(0).max(23),
				minutes: z.number().int().min(0).max(59),
			}),
		}),
	})

	try {
		const { name, avatar, sleepHours } = signUpBodySchema.parse(
			await c.req.json(),
		)

		const createProfileUseCase = makeCreateProfileUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
			cloudinaryApiKey: c.env.CLOUDINARY_API_KEY,
			cloudinaryCloudName: c.env.CLOUDINARY_CLOUD_NAME,
			cloundinaryApiSecret: c.env.CLOUDINARY_API_SECRET,
		})

		const { profile } = await createProfileUseCase.execute({
			user_id: c.env.user.id,
			name,
			avatar,
			sleepHours,
		})

		return c.json(
			{
				profile,
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
		}

		return c.json(
			{
				message: 'Internal server error',
			},
			500,
		)
	}
}
