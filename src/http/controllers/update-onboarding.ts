import { Context } from 'hono'
import { makeUpdateOnboardingUseCase } from '../../use-cases/factories/make-update-onboarding'

export async function updateOnboarding(c: Context) {
	try {
		const updateOnboardingUseCase = makeUpdateOnboardingUseCase({
			databaseConnectionString: c.env.DATABASE_URL,
		})

		await updateOnboardingUseCase.execute({
			userId: c.env.user.id,
		})

		return c.json(
			{
				message: 'Onboarding completed',
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
