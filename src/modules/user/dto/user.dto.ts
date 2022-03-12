import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: String })
  firstName: string;

  @ApiProperty({ type: String })
  middleName?: string;

  @ApiProperty({ type: String })
  lastName: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: Number })
  phoneNumber?: number;

  @ApiProperty({ type: String })
  gender: string;

  @ApiProperty({ type: String })
  role?: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: String })
  dateOfBirth?: string;
}

export class CreateQuestionOptionDto {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Boolean })
  isCorrect: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateQuestionOptionDto extends PartialType(CreateQuestionOptionDto) {}
