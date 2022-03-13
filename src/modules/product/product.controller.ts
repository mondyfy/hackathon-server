import { FormDataRequest } from 'nestjs-form-data';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/services/user.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductInput } from './dto/product.input';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
@ApiBearerAuth('authorization')
@FormDataRequest()
export class ProductController {
    constructor(
        private readonly userService: UserService,
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService,
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    async create(@Req() req, @Body() createProductDto: CreateProductDto) {
        const { user } = req?.auth;
        const { name, description, categoryId, keywords, manufractureDate, expirationDate } = createProductDto;
        try {

            const userInfo = await this.userService.findOne(user.id);
            const productInput: ProductInput = {
                name,
                description,
                keywords,
                user: userInfo,
                manufractureDate,
                expirationDate,
            };
            if (categoryId) {
                productInput.category = await this.categoryService.findOne(categoryId);
            }
            return this.productService.create(productInput);
        } catch (err) {
            throw new Error(err);
        }
    }

    @Get()
    findAll() {
        return this.productService.findAll();
    }


    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productService.update(+id, updateProductDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(+id);
    }


    @Get('search')
    async searchProducts(@Query() query) {
        const { keywords } = query;
        let { limit, page } = query;
        limit = limit ? Number(limit) : 20;
        page = page ? Number(page) : 1;
        const status = 'verified';
        const data = await this.productService.searchProducts(
            keywords,
            status,
            limit,
            page,
        );
        return {
            products: data[0],
            count: data[1],
            currentPage: page,
            totalPage: Math.ceil(data[1] / limit),
        };
    }
}
