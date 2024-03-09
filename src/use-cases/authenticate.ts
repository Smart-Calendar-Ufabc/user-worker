import { User } from "@prisma/client/edge";
import { UsersRepository } from "../repositories/users-repository";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";
import { compare } from "bcryptjs";

interface AuthenticateRequest {
  email: string;
  password: string;
}

interface AuthenticateResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({email, password}:AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }
    
    const doesMatchPassword = await compare(password, user.password_hash);

    if (!doesMatchPassword) {
      throw new InvalidCredentialsError();
    }

    return {
      user
    }
  }
}