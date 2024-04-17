import { Profile, User } from '@prisma/client'

declare global {
	type Bindings = {
		CLOUDINARY_API_KEY: string
		CLOUDINARY_API_SECRET: string
		CLOUDINARY_CLOUD_NAME: string
		DATABASE_URL: string
		IS_LOCALHOST?: boolean
		user: User
		profile: Profile
	}
}

export {}
