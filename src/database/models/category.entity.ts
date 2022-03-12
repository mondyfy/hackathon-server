import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, Tree, TreeParent, TreeChildren } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'category' })
@Tree('materialized-path')
export class Category extends BaseEntity {
    @ApiProperty()
    @Column({ type: 'varchar', length: 50, nullable: true })
    name: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 300, nullable: true })
    description: string;

    @ApiProperty()
    @TreeChildren()
    children: Category[];
  
    @ApiProperty()
    @TreeParent()
    parent: Category;
}
