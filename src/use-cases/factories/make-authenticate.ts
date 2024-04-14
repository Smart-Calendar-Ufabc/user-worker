import { PrismaSessionsRepository } from '../../repositories/prisma/prisma-sessions-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase({
	databaseConnectionString,
}: {
	databaseConnectionString: string
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaUsersRepository = new PrismaUsersRepository(options)
	const sessionsRepository = new PrismaSessionsRepository(options)
	const authenticateUseCase = new AuthenticateUseCase(
		prismaUsersRepository,
		sessionsRepository,
	)

	return authenticateUseCase
}
