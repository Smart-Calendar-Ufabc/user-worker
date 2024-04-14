import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { PrismaUsersTempRepository } from '../../repositories/prisma/prisma-users-temp-repository'
import { CreateUserUseCase } from '../create-user'

export function makeCreateUserUseCase({
	databaseConnectionString,
}: {
	databaseConnectionString: string
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaUsersRepository = new PrismaUsersRepository(options)
	const prismaUsersTempRepository = new PrismaUsersTempRepository(options)

	const createUserTempUseCase = new CreateUserUseCase(
		prismaUsersRepository,
		prismaUsersTempRepository,
	)

	return createUserTempUseCase
}
