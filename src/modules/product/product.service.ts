import { Injectable, Logger } from '@nestjs/common';
import { Product } from 'src/database/models/product.entity';
import { ILike, In, Repository } from 'typeorm';
import { UpdateProductDto } from './dto/product.dto';
import { ProductInput } from './dto/product.input';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private _productRepository: Repository<Product>,
    private readonly emailService: MailService,
  ) {}

  async create(input: ProductInput) {
    return await this._productRepository.save(input);
  }

  async findAll(limit?: number, offset?: number) {
    return await this._productRepository.find({
      take: limit || 10,
      skip: offset || 0,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    return await this._productRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this._productRepository.findOneOrFail({
      where: { id },
    });
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

  async getUserProductsAndCount(userId: number, page: number, limit: number) {
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
        userId,
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
        status: 'unverified',
      },
    });
  }

  async totalVerifiedProducts() {
    return await this._productRepository.count({
      where: {
        status: 'verified',
      },
    });
  }

  async getExpiringProducts() {
    const products = await this._productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .where(`product.expirationDate < NOW() + INTERVAL '48 HOURS'`)
      .getMany();
    return products;
  }

  /* Runs every day */
  @Cron(process.env['CRON.EXPIRY_REMINDER_POLLING_EXPRESSION'])
  public async sendExpiryReminderEmail() {
    // get products that are expiring within next 48 hours
    const expiringProducts = await this.getExpiringProducts();
    if (expiringProducts && expiringProducts.length > 0) {
      for (const product of expiringProducts) {
        const text = `Hi ${product.user.firstName} ${product.user.lastName},
        your product are being expired within next 48 hours, please take a look and give it a priority on sales.
          
        Product details: 
        name: ${product.name}
        listedDate: ${product.createdAt.toISOString().substring(0, 10)}
        expirationDate: ${product.expirationDate}

        Thank you.
          `;
        Logger.log(
          `Sending expiration notification to: ${product.user.firstName}`,
        );
        // send emails to the owner of product
        await this.emailService.sendMail({
          to: product.user.email,
          subject: `${product.name} - Expiry notification.`,
          text,
        });
        Logger.log(
          `Sending expiration notification to: ${product.user.firstName} completed.`,
        );
      }
    }
  }
}
