import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { User } from './user.entity';
import { Category } from './category.entity';
import { VariationTypes } from '../api/product/enums/product.enum';

@Entity()
export class Product {
  @ApiProperty({ description: 'Unique product identifier' })
  @PrimaryGeneratedColumn()
  @IsDefined()
  @IsNumber()
   id!: number;

  @ApiProperty({ description: 'Unique product code' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  @IsDefined()
  @IsString()
  @Index()
   code: string;

  @ApiProperty({ description: 'Product title' })
  @Column({ type: 'varchar', nullable: false })
  @IsDefined()
  @IsString()
   title: string;

  @ApiProperty({
    description: 'Product variation type',
    enum: VariationTypes,
    default: VariationTypes.NONE,
  })
  @Column({ type: 'enum', enum: VariationTypes, default: VariationTypes.NONE })
  @IsDefined()
  @IsString()
   variationType: VariationTypes;

  @ApiPropertyOptional({ description: 'Product description' })
  @Column({ type: 'text', nullable: true })
  @IsString()
   description?: string | null;

  @ApiProperty({
    description: 'Product highlights',
    type: [String],
  })
  @Column({ type: 'text', array: true, default: [] })
  @ArrayMinSize(1)
  @IsString({ each: true })
   about?: string[];

  @ApiPropertyOptional({ description: 'Detailed product specifications' })
  @Column({ type: 'jsonb', nullable: true })
  @Type(() => Object)
  @ValidateNested()
   details: Record<string, any> | null;

  @ApiProperty({
    description: 'Product active status',
    default: false,
  })
  @Column({ type: 'boolean', default: false })
   isActive: boolean;

  @ApiProperty({ description: 'Merchant details' })
  @ManyToOne(() => User, (user) => user.products, {
    lazy: true,
    nullable: false,
  })
  @JoinColumn({ name: 'merchantId' })
   merchant: Promise<User>;

  @ApiProperty({ description: 'Merchant ID' })
  @Column({ type: 'int', nullable: false })
  @IsDefined()
  @IsNumber()
   merchantId: number;

  @ApiProperty({ description: 'Category details' })
  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
   category: Category;

  @ApiProperty({ description: 'Category ID' })
  @Column({ type: 'int', nullable: true })
  @IsNumber()
   categoryId: number;

  @ApiProperty({ description: 'Product creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
   createdAt!: Date;

  @ApiProperty({ description: 'Product last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
   updatedAt!: Date;
}

