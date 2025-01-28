import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, EntityManager, Like, Between, SelectQueryBuilder } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto, ProductDetailsDto, ProductSearchDto, SortField, SortOrder } from '../dto/product.dto';
import { errorMessages } from 'src/errors/custom';
import { validate } from 'class-validator';
import { Category } from '../../../entity/category.entity';
import { Product } from '../../../entity/product.entity';
import { successObject } from '../../../helper/sucess-response.interceptor';
import { PaginatedResponse } from 'src/util/functions/pagination.function';

@Injectable()
export class ProductService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getProduct(productId: number) {
    const product = await this.entityManager.findOne(Product, {
      where: { id: productId },
    });

    if (!product) throw new NotFoundException(errorMessages.product.notFound);

    return product;
  }

  async createProduct(data: CreateProductDto, merchantId: number) {
    const category = await this.entityManager.findOne(Category, {
      where: { id: data.categoryId },
    });

    if (!category) throw new NotFoundException(errorMessages.category.notFound);

    const product = this.entityManager.create(Product, {
      category,
      merchantId,
      ...data,
    });

    return this.entityManager.save(product);
  }

  async addProductDetails(
    productId: number,
    body: ProductDetailsDto,
    merchantId: number,
  ) {
    const result = await this.entityManager
      .createQueryBuilder()
      .update<Product>(Product)
      .set({
        ...body,
        variationType: () => `'${body.variationType}'`,
        details: () => `'${JSON.stringify(body.details)}'`,
      })
      .where('id = :id', { id: productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .returning(['id'])
      .execute();

    if (result.affected < 1)
      throw new NotFoundException(errorMessages.product.notFound);

    return result.raw[0];
  }
  async searchProducts(
    searchDto: ProductSearchDto,
    merchantId?: number,
  ): Promise<PaginatedResponse<Product>> {
    if (!merchantId) {
      throw new Error('Merchant ID is required for search.');
    }

    const queryBuilder = this.createSearchQueryBuilder(searchDto, merchantId);
    const [items, total] = await this.executeSearchQuery(
      queryBuilder,
      searchDto,
    );

    return {
      items,
      total,
      page: searchDto.page,
      limit: searchDto.limit,
      totalPages: Math.ceil(total / searchDto.limit),
    };
  }

  // private createSearchQueryBuilder(
  //   searchDto: ProductSearchDto,
  //   merchantId: number,
  // ): SelectQueryBuilder<Product> {
  //   const queryBuilder = this.entityManager
  //     .createQueryBuilder(Product, 'product')
  //     .leftJoinAndSelect('product.category', 'category')
  //     .where('product.merchantId = :merchantId', { merchantId });
  //   if (searchDto.search) {
  //     queryBuilder.andWhere('LOWER(product.title) LIKE LOWER(:search)', {
  //       search: `%${searchDto.search}%`,
  //     });
  //   }
  //   if (searchDto.category) {
  //     queryBuilder.andWhere('LOWER(category.name) = LOWER(:category)', {
  //       category: searchDto.category,
  //     });
  //   }
  //   if (searchDto.categoryId) {
  //     queryBuilder.andWhere('category.id = :categoryId', {
  //       categoryId: searchDto.categoryId,
  //     });
  //   }
  //   if (searchDto.minPrice !== undefined) {
  //     queryBuilder.andWhere('product.price >= :minPrice', {
  //       minPrice: searchDto.minPrice,
  //     });
  //   }
  //   if (searchDto.maxPrice !== undefined) {
  //     queryBuilder.andWhere('product.price <= :maxPrice', {
  //       maxPrice: searchDto.maxPrice,
  //     });
  //   }
  //   this.applySorting(queryBuilder, searchDto);

  //   return queryBuilder;
  // }
  private createSearchQueryBuilder(
    searchDto: ProductSearchDto,
    merchantId: number,
  ) {
    const queryBuilder = this.entityManager
      .createQueryBuilder(Product, 'product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.merchantId = :merchantId', { merchantId });

    const conditions = [
      {
        key: 'search',
        condition: !!searchDto.search,
        query:
          '(product.title ILIKE :search OR product.description ILIKE :search)',
        params: { search: `%${searchDto.search}%` },
      },
      {
        key: 'category',
        condition: !!searchDto.category,
        query: 'category.name ILIKE :category',
        params: { category: `%${searchDto.category}%` },
      },
      {
        key: 'minPrice',
        condition: !!searchDto.minPrice,
        query: 'product.price >= :minPrice',
        params: { minPrice: searchDto.minPrice },
      },
      {
        key: 'maxPrice',
        condition: !!searchDto.maxPrice,
        query: 'product.price <= :maxPrice',
        params: { maxPrice: searchDto.maxPrice },
      },
      { key: 'sortBy', condition: !!searchDto.sortBy, query: '', params: {} },
    ];

    for (const condition of conditions) {
      switch (condition.key) {
        case 'search':
          if (condition.condition) {
            queryBuilder.andWhere(condition.query, condition.params);
          }
          break;
        case 'category':
          if (condition.condition) {
            queryBuilder.andWhere(condition.query, condition.params);
          }
          break;
        case 'minPrice':
          if (condition.condition) {
            queryBuilder.andWhere(condition.query, condition.params);
          }
          break;
        case 'maxPrice':
          if (condition.condition) {
            queryBuilder.andWhere(condition.query, condition.params);
          }
          break;
        case 'sortBy':
          if (condition.condition && searchDto.order) {
            queryBuilder.orderBy(
              `product.${searchDto.sortBy}`,
              searchDto.order as unknown as SortOrder,  
            );
          }
          break;
        default:
          break;
      }
    }

    return queryBuilder;

  }  
  private applySorting(
    queryBuilder: SelectQueryBuilder<Product>,
    searchDto: ProductSearchDto,
  ): void {
    const sortField = this.getSortField(searchDto.sortBy);
    const sortOrder = searchDto.sortOrder || SortOrder.DESC;

    queryBuilder.orderBy(sortField, sortOrder);

    // Add secondary sort by id to ensure consistent ordering
    queryBuilder.addOrderBy('product.id', SortOrder.DESC);
  }

  private getSortField(sortBy: SortField): string {
    const sortFieldMap: Record<SortField, string> = {
      [SortField.PRICE]: 'product.price',
      [SortField.NAME]: 'product.title',
      [SortField.STOCK]: 'product.stockQuantity',
      [SortField.CREATED_AT]: 'product.createdAt',
      // Add more sort fields as needed
    };

    return sortFieldMap[sortBy] || 'product.createdAt';
  }

  private async executeSearchQuery(
    queryBuilder: SelectQueryBuilder<Product>,
    searchDto: ProductSearchDto,
  ): Promise<[Product[], number]> {
    const skip = (searchDto.page - 1) * searchDto.limit;

    return queryBuilder.skip(skip).take(searchDto.limit).getManyAndCount();
  }
  async activateProduct(productId: number, merchantId: number) {
    if (!(await this.validate(productId)))
      throw new ConflictException(errorMessages.product.notFulfilled);

    const result = await this.entityManager
      .createQueryBuilder()
      .update<Product>(Product)
      .set({ isActive: true })
      .where('id = :id', { id: productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .returning(['id', 'isActive'])
      .execute();

    return result.raw[0];
  }

  async validate(productId: number) {
    const product = await this.entityManager.findOne(Product, {
      where: { id: productId },
    });

    if (!product) throw new NotFoundException(errorMessages.product.notFound);

    const errors = await validate(product);
    return errors.length === 0;
  }

  async deleteProduct(productId: number, merchantId: number) {
    const result = await this.entityManager
      .createQueryBuilder()
      .delete()
      .from(Product)
      .where('id = :productId', { productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .execute();

    if (result.affected < 1)
      throw new NotFoundException(errorMessages.product.notFound);

    return successObject;
  }
}