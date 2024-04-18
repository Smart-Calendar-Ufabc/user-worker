import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UpdateOnboardingUseCase } from '../update-onboarding'

export function makeUpdateOnboardingUseCase({
	databaseConnectionString,
}: {
	databaseConnectionString: string
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaUsersRepository = new PrismaUsersRepository(options)

	const updateOnboardingUseCase = new UpdateOnboardingUseCase(
		prismaUsersRepository,
	)

	return updateOnboardingUseCase
}
