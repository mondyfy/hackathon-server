import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ type: String, description: 'name of the product' })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  type?: string;

  @ApiProperty({ type: String })
  specification?: string;

  @ApiProperty({ type: String })
  keywords?: string[];

  @ApiProperty({ type: String })
  categoryId?: number;

  @ApiProperty({ type: String })
  manufractureDate?: string;

  @ApiProperty({ type: String })
  expirationDate?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  productImage?: any;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
