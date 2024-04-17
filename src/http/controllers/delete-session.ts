import { Context } from 'hono'
import { makeDeleteSessionUseCase } from '../../use-cases/factories/make-delete-session'

export async function deleteSession(c: Context) {
	try {
		const deleteSessionUseCase = makeDeleteSessionUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		console.log('c.env.user.id', c.env.user.id)

		await deleteSessionUseCase.execute({
			userId: c.env.user.id,
		})

		return c.json(null, 200)
	} catch (error) {
		console.log('error', error)
		return c.json(
			{
				message: 'Internal server error',
			},
			500,
		)
	}
}
