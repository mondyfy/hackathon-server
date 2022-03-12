import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'address' })
export class Address extends BaseEntity {
    @ApiProperty()
    @Column({ name: 'title', type: 'varchar', length: 30, nullable: true })
    title?: string;

    @ApiProperty()
    @Column({ name: 'description', type: 'varchar', length: 300, nullable: true })
    description?: string;

    @ApiProperty()
    @Column({ name: 'city_name', type: 'varchar', length: 50, nullable: true })
    cityName?: string;

    @ApiProperty()
    @Column({ name: 'country_name', type: 'varchar', length: 50, nullable: true })
    countryName?: string;

    @ApiProperty()
    @Column({ name: 'street_name', type: 'varchar', length: 50, nullable: true })
    streetName?: string;

    @ApiProperty()
    @Column({ name: 'longitude', type: 'decimal', nullable: true })
    longitude?: string;

    @ApiProperty()
    @Column({ name: 'latitude', type: 'decimal', nullable: true })
    latitude?: string;

    @ManyToOne(() => User, user => user.address )
    @JoinColumn({ name: 'user_id' })
    user: User;
}