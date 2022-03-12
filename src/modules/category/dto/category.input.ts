import { PartialType } from "@nestjs/swagger";
import { Category } from "src/database/models/category.entity";

export class CategoryInput {
  name: string;
  description: string;
  parent?: Category;
  createdBy?: string;
  updatedBy?: string;
}

export class UpdateCategoryInput extends PartialType(CategoryInput) {}
