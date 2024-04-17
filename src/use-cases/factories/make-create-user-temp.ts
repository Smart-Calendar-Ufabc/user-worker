import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { PrismaUsersTempRepository } from '../../repositories/prisma/prisma-users-temp-repository'
import { CreateUserTempUseCase } from '../create-user-temp'

export function makeCreateUserTempUseCase({
	databaseConnectionString,
	isLocalhost,
}: {
	databaseConnectionString: string
	isLocalhost?: boolean
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaUsersRepository = new PrismaUsersRepository(options)
	const prismaUsersTempRepository = new PrismaUsersTempRepository(options)
	const createUserTempUseCase = new CreateUserTempUseCase(
		prismaUsersTempRepository,
		prismaUsersRepository,
		isLocalhost,
	)

	return createUserTempUseCase
}
