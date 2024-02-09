import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { Address } from './address.entity';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { Token } from './token.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 30, nullable: false })
  firstName: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 30, nullable: true })
  middleName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 30, nullable: false })
  lastName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 30,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({ name: 'phone_number', type: 'bigint', nullable: true })
  phoneNumber: number;

  @Column({
    name: 'profile_picture',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  profilePicture: string;

  @Column({
    name: 'cover_picture',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  coverPicture: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ name: 'gender', type: 'varchar', length: 10, nullable: true })
  gender: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 300,
    nullable: false,
    select: false,
  })
  password: string;

  @Column({ name: 'role', type: 'varchar', length: 30, default: 'USER' })
  role: string;

  @OneToMany(() => Token, (token) => token.user)
  tokens?: Token[];

  @OneToMany(() => Address, (address) => address.user)
  @JoinColumn({ name: 'address_id' })
  address?: Address[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
