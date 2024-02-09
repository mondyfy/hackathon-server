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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryInput } from './dto/category.input';

@ApiTags('category')
@Controller('category')
@ApiBearerAuth('authorization')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const { name, description, parent } = createCategoryDto;
    const categoryInput: CategoryInput = {
      name,
      description,
    };
    if (parent) {
      categoryInput.parent = await this.categoryService.findOne(
        createCategoryDto.parent,
      );
    }
    return this.categoryService.create(categoryInput);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('/tree')
  findCategoryTree() {
    return this.categoryService.findTree();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
