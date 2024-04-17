import { PrismaSessionsRepository } from '../../repositories/prisma/prisma-sessions-repository'
import { DeleteSessionUseCase } from '../delete-session'

export function makeDeleteSessionUseCase({
	databaseConnectionString,
}: {
	databaseConnectionString: string
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaSessionsRepository = new PrismaSessionsRepository(options)
	const deleteSessionUseCase = new DeleteSessionUseCase(
		prismaSessionsRepository,
	)

	return deleteSessionUseCase
}
