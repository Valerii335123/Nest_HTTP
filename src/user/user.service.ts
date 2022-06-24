import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import UserNotFoundException from './exceptions/UserNotFound.exception';

// This should be a real class/interface representing a user entity

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        email: email,
        deleted_at: IsNull(),
      },
    });
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        deleted_at: IsNull(),
      },
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async create({ name, email }, password): Promise<User> {
    const user = await this.userRepository.create({
      name,
      email,
      password_hash: password,
    });

    await this.userRepository.save(user);
    return user;
  }
}
