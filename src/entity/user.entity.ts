import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Role } from './role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsArray } from 'class-validator';

@Entity()
export class User {
  @ApiProperty({ description: 'Unique user identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'User email address' })
  @Column({ type: 'varchar', length: 120, unique: true, nullable: false })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password' })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  password: string;

  @ApiProperty({ description: 'User roles' })
  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({ name: 'user_roles' })
  @IsArray()
  roles: Role[];

  @ApiProperty({ description: 'Products created by the user' })
  @OneToMany(() => Product, (product) => product.merchant, { lazy: true })
  products: Product[];

  @ApiProperty({ description: 'User creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'User last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
