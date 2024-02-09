import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserInput } from './dto/user.input';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('authorization')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      email,
      role,
      password,
      phoneNumber,
      dateOfBirth,
      cityName,
      countryName,
      streetName,
    } = createUserDto;

    const user: UserInput = {
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber: Number(phoneNumber),
      gender,
      role,
      password: await bcrypt.hash(password, 8),
      dateOfBirth,
    };
    const userRes = await this.userService.create(user);
    const addressInput = {
      cityName,
      countryName,
      streetName,
      user: userRes,
    };
    await this.userService.createAddress(addressInput);
    return userRes;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('detail')
  findUserDetail(@Req() req) {
    const { user } = req?.auth;
    return this.userService.findOne(user.id);
  }

  @Get(':id([0-9]+)')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 8);
    }
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
