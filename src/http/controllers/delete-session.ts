import { Context } from 'hono'
import { deleteCookie } from 'hono/cookie'
import { makeDeleteSessionUseCase } from '../../use-cases/factories/make-delete-session'

export async function deleteSession(c: Context) {
	try {
		const deleteSessionUseCase = makeDeleteSessionUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		await deleteSessionUseCase.execute({
			userId: c.env.user.id,
			token: c.env.token,
		})

		const isLocal = Boolean(c.env?.IS_LOCALHOST)

		deleteCookie(c, 'session', {
			path: '/',
			secure: !isLocal,
			httpOnly: true,
			sameSite: isLocal ? 'Lax' : 'None',
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
