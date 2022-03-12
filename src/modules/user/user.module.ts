import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [UserService, TokenService, AuthService],
  controllers: [UserController, AuthController],
  exports: [UserService],
})
export class UserModule {}
