import { PartialType } from '@nestjs/swagger';
import { Category } from 'src/database/models/category.entity';
import { User } from 'src/database/models/user.entity';

class Attribute {
  id?: string;
  url: string;
  dimesion?: string;
}
export class ProductInput {
  name: string;
  description: string;
  type?: string;
  status?: string;
  specification?: string;
  manufractureDate?: string;
  expirationDate?: string;
  keywords?: string[];
  category?: Category;
  user: User;
  attributes?: Attribute[];
}

export class UpdateProductInput extends PartialType(ProductInput) {}
