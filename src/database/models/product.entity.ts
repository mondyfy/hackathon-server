import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @Column('varchar', { nullable: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { nullable: true, default: 'unverified' })
  status?: string;

  @Column('varchar', { nullable: true })
  type?: string;

  @Column('json', { nullable: true })
  specification?: string;

  @Column({ name: 'manufracture_date', type: 'date', nullable: true })
  manufractureDate?: string;

  @Column({ name: 'expiration_date', type: 'date', nullable: true })
  expirationDate?: string;

  @Column('simple-array', { nullable: true })
  keywords?: string[];

  @Column('varchar', { nullable: true })
  note?: string;

  @Column('json', { nullable: true })
  attributes: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onUpdate: 'CASCADE',
  })
  category?: Category;

  @ManyToOne(() => User, (user) => user.products, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;
}
