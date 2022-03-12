import { Injectable } from '@nestjs/common';
import { User } from 'src/database/models/user.entity';
import { Repository, Connection } from 'typeorm';
import { UpdateUserInput, UserInput } from '../dto/user.input';

@Injectable()
export class UserService {
  private _userRepository: Repository<User>;

  constructor(private _connection: Connection) {
    this._userRepository = this._connection.getRepository(User);
  }

  async create(userInput: UserInput) {
    const user = await this._userRepository.save(userInput);
    return user;
  }

  findAll() {
    return this._userRepository.find();
  }

  findOne(id: number) {
    return this._userRepository.findOne(id);
  }

  findByEmail(email: string) {
    return this._userRepository.findOneOrFail({
      where: {
        email
      },
      select: ['id', 'password']
    });
  }
  
  async update(id: number, updateUserDto: UpdateUserInput) {
    const user = await this._userRepository.findOneOrFail(id, { select: ['password']});
    user.firstName = updateUserDto.firstName || user.firstName;
    user.lastName = updateUserDto.lastName || user.lastName;
    user.password = updateUserDto.password || user.password;
    await this._userRepository.save(user);
    return user;
  }

  remove(id: string) {
    return this._userRepository.delete(id);
  }
}

