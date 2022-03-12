import { PartialType } from "@nestjs/swagger";
import { Category } from "src/database/models/category.entity";

export class CategoryInput {
  name: string;
  description: string;
  parent?: Category;
}

export class UpdateCategoryInput extends PartialType(CategoryInput) {}
