import { PrismaSessionsRepository } from '../../repositories/prisma/prisma-sessions-repository'
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
	const prismaSessionsRepository = new PrismaSessionsRepository(options)

	const createUserTempUseCase = new CreateUserUseCase(
		prismaUsersRepository,
		prismaUsersTempRepository,
		prismaSessionsRepository,
	)

	return createUserTempUseCase
}
