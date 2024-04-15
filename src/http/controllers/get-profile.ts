import { Context } from 'hono'
import { makeGetProfileUseCase } from '../../use-cases/factories/make-get-profile'

export async function getProfile(c: Context) {
	try {
		const createProfileUseCase = makeGetProfileUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		const { profile } = await createProfileUseCase.execute({
			userId: c.env.user.id,
		})

		return c.json(
			{
				profile,
			},
			200,
		)
	} catch (error) {
		return c.json(
			{
				message: 'Internal server error',
			},
			500,
		)
	}
}
