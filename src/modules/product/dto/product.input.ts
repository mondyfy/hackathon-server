import { PartialType } from "@nestjs/swagger";
import { Category } from "src/database/models/category.entity";
import { User } from "src/database/models/user.entity";

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
}

export class UpdateProductInput extends PartialType(ProductInput) { }
