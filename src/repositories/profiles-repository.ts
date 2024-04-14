import { Prisma, Profile } from '@prisma/client/edge'

export interface ProfilesRepository {
	findUniqueById(id: string): Promise<Profile | null>
	findUniqueByUserId(user_id: string): Promise<Profile | null>
	create(params: Prisma.ProfileUncheckedCreateInput): Promise<Profile>
	save(id: string, data: Prisma.ProfileUncheckedUpdateInput): Promise<Profile>
}
