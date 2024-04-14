import { PrismaProfilesRepository } from '../../repositories/prisma/prisma-profiles-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { CreateProfileUseCase } from '../create-profile'

export function makeCreateProfileUseCase({
	databaseConnectionString,
}: {
	databaseConnectionString: string
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaUsersRepository = new PrismaUsersRepository(options)
	const prismaProfileRepository = new PrismaProfilesRepository(options)

	const createUserTempUseCase = new CreateProfileUseCase(
		prismaProfileRepository,
		prismaUsersRepository,
	)

	return createUserTempUseCase
}
