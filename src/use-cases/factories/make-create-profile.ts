import { PrismaProfilesRepository } from '../../repositories/prisma/prisma-profiles-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { CloudinaryFileStorage } from '../../services/file-storage/cloudinary/cloudinary-file-storage'
import { CreateProfileUseCase } from '../create-profile'

export function makeCreateProfileUseCase({
	databaseConnectionString,
	cloudinaryApiKey,
	cloundinaryApiSecret,
	cloudinaryCloudName,
}: {
	databaseConnectionString: string
	cloudinaryCloudName: string
	cloudinaryApiKey: string
	cloundinaryApiSecret: string
}) {
	const options = {
		connectionString: databaseConnectionString,
	}

	const prismaUsersRepository = new PrismaUsersRepository(options)
	const prismaProfileRepository = new PrismaProfilesRepository(options)
	const cloudinaryFileStorage = new CloudinaryFileStorage(
		cloudinaryApiKey,
		cloundinaryApiSecret,
		cloudinaryCloudName,
	)

	const createUserTempUseCase = new CreateProfileUseCase(
		prismaProfileRepository,
		prismaUsersRepository,
		cloudinaryFileStorage,
	)

	return createUserTempUseCase
}
