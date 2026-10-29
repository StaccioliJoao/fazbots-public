import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../utils/typeorm/entities/User';
import { UpdateUserDetails, UserDetails } from '../../utils/types';
import { IUserService } from '../interfaces/user';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  createUser(details: UserDetails) {
    const newUser = this.userRepository.create(details);
    return this.userRepository.save(newUser);
  }
  findUser(discordId: string) {
    return this.userRepository.findOne({ discordId });
  }

  updateUser(user: User, details: UpdateUserDetails) {
    return this.userRepository.save({
      ...user,
      ...details,
    });
  }
}
