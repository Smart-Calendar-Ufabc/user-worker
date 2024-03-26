import { Profile } from "@prisma/client/edge";
import { ProfilesRepository } from "../repositories/profiles-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface UpdateProfileRequest {
  id: string;
  name: string;
  avatar: string;
}

interface UpdateProfileResponse {
  profile: Profile
}

export class UpdateProfileUseCase {
  constructor(private profilesRepository: ProfilesRepository) {
    this.profilesRepository = profilesRepository;
  }

  async execute({ id, name, avatar }: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const profile = await this.profilesRepository.findUniqueById(id);

    if (!profile) {
      throw new ResourceNotFoundError()
    }

    // TODO: send image to cloudinary to get the image url
    // TODO: delete old image from cloudinary

    profile.name = name;
    profile.avatar_image_url = avatar;

    await this.profilesRepository.save(profile)

    return {
      profile
    }
  }
}