import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  password: string;
}

export class RefreshAuthDto {
  @ApiProperty({ type: String })
  refreshToken: string;
}
