import { Profile } from "@prisma/client/edge";
import { ProfilesRepository } from "../repositories/profiles-repository";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface CreateProfileRequest {
  user_id: string;
  name: string;
  avatar: string;
}

interface CreateProfileResponse {
  profile: Profile
}

export class CreateProfileUseCase {
  constructor(
    private profilesRepository: ProfilesRepository, 
    private usersRepository: UsersRepository
  ) {
    this.profilesRepository = profilesRepository;
  }

  async execute({ user_id, name, avatar }: CreateProfileRequest): Promise<CreateProfileResponse> {
    const user = await this.usersRepository.findUniqueById(user_id);

    if (!user) {
      throw new ResourceNotFoundError()
    }

    // TODO: send image to cloudinary to get the image url
    const profile = await this.profilesRepository.create({
      name,
      avatar_image_url: avatar,
      user_id
    })

    return {
      profile
    }
  }
}