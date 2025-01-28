import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductDetails, ProductDetailsTypeFn } from './productDetails';
import { variationTypesKeys } from '../enums/product.enum';

export class CreateProductDto {
  @ApiProperty({
    description: 'Category ID for the product',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}

export class ProductDetailsDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Wireless Headphones',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Unique product code',
    example: 'WH-1000XM4',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Product variation type',
    enum: variationTypesKeys,
    example: 'color',
  })
  @IsDefined()
  @IsString()
  @IsIn(variationTypesKeys)
  variationType: string;

  @ApiProperty({
    description: 'Detailed product specifications',
  })
  @IsDefined()
  @Type(ProductDetailsTypeFn)
  @ValidateNested()
  details: ProductDetails;

  @ApiProperty({
    description: 'Product highlights',
    type: [String],
    example: ['Noise cancellation', 'Long battery life'],
  })
  @ArrayMinSize(1)
  @IsString({ each: true })
  about: string[];

  @ApiProperty({
    description: 'Comprehensive product description',
    example: 'Premium wireless headphones with advanced noise cancellation',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum SortField {
  NAME = 'name',
  PRICE = 'price',
  STOCK = 'stockQuantity',
  CREATED_AT = 'createdAt',
}

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 10;
}

export class ProductSearchDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search term for product name',
    example: 'Wireless Headphones',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Product category name',
    example: 'Electronics',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Marchant ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    minimum: 0,
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Field to sort results by',
    enum: SortField,
    default: SortField.CREATED_AT,
    example: SortField.PRICE,
  })
  @IsOptional()
  @IsEnum(SortField)
  sortBy: SortField = SortField.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Sort order direction',
    enum: SortOrder,
    default: SortOrder.DESC,
    example: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;
  order: boolean;
}