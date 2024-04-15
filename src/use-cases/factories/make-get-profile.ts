import { PrismaProfilesRepository } from '../../repositories/prisma/prisma-profiles-repository'
import { GetProfileUseCase } from '../get-profile'

export function makeGetProfileUseCase({
	databaseConnectionString,
}: {
	databaseConnectionString: string
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaProfileRepository = new PrismaProfilesRepository(options)

	const createUserTempUseCase = new GetProfileUseCase(prismaProfileRepository)

	return createUserTempUseCase
}
