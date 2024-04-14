import { Profile, User } from '@prisma/client'

declare global {
	type Bindings = {
		DATABASE_URL: string
		user: User
		profile: Profile
	}
}

export {}
