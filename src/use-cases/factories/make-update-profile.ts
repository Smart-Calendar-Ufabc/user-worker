import { PrismaProfilesRepository } from '../../repositories/prisma/prisma-profiles-repository'
import { UpdateProfileUseCase } from '../update-profile'

export function makeUpdateProfileUseCase({
	databaseConnectionString,
}: {
	databaseConnectionString: string
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaProfileRepository = new PrismaProfilesRepository(options)

	const createUserTempUseCase = new UpdateProfileUseCase(
		prismaProfileRepository,
	)

	return createUserTempUseCase
}
