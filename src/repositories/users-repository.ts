import { Prisma, Profile, User } from '@prisma/client/edge'

export interface UsersRepository {
	findUniqueById(
		id: string,
	): Promise<(User & { profile: Profile | null }) | null>
	findUniqueByEmail(
		email: string,
	): Promise<(User & { profile: Profile | null }) | null>
	create(user: Prisma.UserCreateInput): Promise<User>
	update(id: string, data: Prisma.UserUpdateInput): Promise<User>
}
