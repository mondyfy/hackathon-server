import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ type: String })
  cityName?: string;

  @ApiProperty({ type: String })
  countryName?: string;

  @ApiProperty({ type: String })
  streetName?: string;

  @ApiProperty({ type: String })
  title?: string;

  @ApiProperty({ type: String })
  description?: string;

  @ApiProperty({ type: String })
  longitude?: string;

  @ApiProperty({ type: String })
  latitude?: string;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
