import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({ type: String, description: 'name of the category' })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  parent?: number
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
