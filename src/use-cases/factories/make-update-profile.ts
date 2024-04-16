import { PrismaProfilesRepository } from '../../repositories/prisma/prisma-profiles-repository'
import { CloudinaryFileStorage } from '../../services/file-storage/cloudinary/cloudinary-file-storage'
import { UpdateProfileUseCase } from '../update-profile'

export function makeUpdateProfileUseCase({
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

	const prismaProfileRepository = new PrismaProfilesRepository(options)
	const cloudinaryFileStorage = new CloudinaryFileStorage(
		cloudinaryApiKey,
		cloundinaryApiSecret,
		cloudinaryCloudName,
	)

	const createUserTempUseCase = new UpdateProfileUseCase(
		prismaProfileRepository,
		cloudinaryFileStorage,
	)

	return createUserTempUseCase
}
