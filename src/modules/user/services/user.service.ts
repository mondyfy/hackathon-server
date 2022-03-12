import { Injectable } from '@nestjs/common';
import { Address } from 'src/database/models/address.entity';
import { User } from 'src/database/models/user.entity';
import { Repository, Connection } from 'typeorm';
import { AddressInput } from '../dto/address.input';
import { UpdateUserInput, UserInput } from '../dto/user.input';

@Injectable()
export class UserService {
  private _userRepository: Repository<User>;
  private _addressRepository: Repository<Address>;

  constructor(private _connection: Connection) {
    this._userRepository = this._connection.getRepository(User);
    this._addressRepository = this._connection.getRepository(Address);
  }

  async create(userInput: UserInput) {
    const user = await this._userRepository.save(userInput);
    return user;
  }

  async createAddress(addressInput: AddressInput) {
    const address = await this._addressRepository.save(addressInput);
    return address;
  }

  findAll() {
    return this._userRepository.find({
      relations: ['address'],
    });
  }

  findOne(id: number) {
    return this._userRepository.findOne({
      where: {
        id,
      },
      relations: ['address']
    });
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
    const user = await this._userRepository.findOneOrFail(id, { select: ['password'] });
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
