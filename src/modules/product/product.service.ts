import { Injectable } from '@nestjs/common';
import { Product } from 'src/database/models/product.entity';
import { Connection, ILike, In, Repository } from 'typeorm';
import { UpdateProductDto } from './dto/product.dto';
import { ProductInput } from './dto/product.input';

@Injectable()
export class ProductService {
    private _productRepository: Repository<Product>;

    constructor(private _connection: Connection) {
        this._productRepository = this._connection.getRepository(Product);
    }

    async create(input: ProductInput) {
        return await this._productRepository.save(input);
    }

    async findAll(limit?: number,
        offset?: number) {
        return await this._productRepository.find({
            take: limit || 10,
            skip: offset || 0,
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number) {
        return await this._productRepository.findOne(id, {
            relations: ['category', 'user'],
        });
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const product = await this._productRepository.findOneOrFail(id);
        product.name = updateProductDto.name || product.name;

        product.description = updateProductDto.description || product.description;
        await this._productRepository.save(product);
        return product;
    }


    remove(id: number) {
        return this._productRepository.delete(id);
    }

    // pass empty object to count all the records equivalent to count()
    async count(countCondition: any) {
        return await this._productRepository.count({ where: countCondition });
    }

    async search(
        keywords: string,
        page: number,
        limit: number,
        order: any,
        status: string,
    ) {
        if (status) {
            return await this._productRepository.manager
                .getRepository(Product)
                .createQueryBuilder('product')
                .where('product.keywords LIKE :keywords', { keywords: `%${keywords}%` })
                .andWhere('product.status = :status', { status })
                .orderBy('product.createdAt', order ? order : null)
                .take(limit)
                .skip(limit * (page - 1))
                .getMany();
        } else {
            return await this._productRepository.manager
                .getRepository(Product)
                .createQueryBuilder('product')
                .where('product.keywords LIKE :keywords', { keywords: `%${keywords}%` })
                .orderBy('product.createdAt', order ? order : null)
                .take(limit)
                .skip(limit * (page - 1))
                .getMany();
        }
    }

    async searchProducts(
        keywords: string,
        status: string,
        limit: number,
        page: number,
    ) {
        return await this._productRepository.findAndCount({
            where: [
                {
                    keywords: ILike(`%${keywords}%`),
                    status,
                },
                {
                    name: ILike(`%${keywords}%`),
                    status,
                },
            ],
            take: limit,
            skip: limit * (page - 1),
            order: { createdAt: 'DESC' },
            relations: ['productMetas'],
        });
    }

    async paginate(filter: any, limit: number, order: any, page: number) {
        return await this._productRepository.find({
            where: filter,
            take: limit,
            skip: limit * (page - 1),
            order: {
                createdAt: order,
            },
            relations: ['productMetas', 'category'],
        });
    }

    async delete(id: number) {
        return this._productRepository.delete(id);
    }

    async getProductsByCategoryAndCount(data) {
        const { status, catIds, limit, order, page } = data;
        return await this._productRepository.findAndCount({
            where: { status, category: In(catIds) },
            take: limit,
            skip: limit * (page - 1),
            order: { createdAt: order },
        });
    }

    async getUserProductsAndCount(
        userId: string,
        page: number,
        limit: number,
    ) {
        return this._productRepository.findAndCount({
            where: { userId, status: 'verified' },
            take: limit,
            skip: limit * (page - 1),
            order: { createdAt: 'DESC' },
        });
    }

    async searchUserProducts(
        keywords: string,
        page: number,
        limit: number,
        userId: number,
    ) {
        return await this._productRepository.findAndCount({
            where: {
                user: userId,
                keywords: ILike(`%${keywords}%`),
                status: 'verified',
            },
            take: limit,
            skip: limit * (page - 1),
            order: { createdAt: 'DESC' },
        });
    }


    async totalUnverifiedProducts() {
        return await this._productRepository.count({
            where: {
                status: 'unverified'
            },
        })
    }

    async totalVerifiedProducts() {
        return await this._productRepository.count({
            where: {
                status: 'verified'
            },
        })
    }
}
