import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { errorMessages } from 'src/errors/custom';
import { EntityManager } from 'typeorm';
import { ProductDetailsDto, ProductSearchDto } from '../dto/product.dto';
import { ComputerDetails } from '../dto/productDetails/computer.details';
import { ProductService } from './product.service';
import { CategoryIds, Categories, Category } from 'src/entity/category.entity';
import { Product } from 'src/entity/product.entity';
import { successObject } from 'src/helper/sucess-response.interceptor';
import { VariationTypes } from '../enums/product.enum';

describe('ProductService', () => {
  let service: ProductService;
  let fakeEntityManager: Partial<EntityManager>;
  const computersCategory = {
    id: CategoryIds.Computers,
    name: Categories.Computers,
  } as Category;

  const testProduct = {
    id: 1,
    title: 'test title',
    category: computersCategory,
    merchantId: 1,
  } as Product;

  const fulfilledProduct = {
    id: 3,
    title: 'test title',
    description: 'description 1',
    about: ['about 1'],
    details: {
      brand: 'Dell',
      series: 'XPS',
      capacity: 2,
      category: 'Computers',
      capacityType: 'HD',
      capacityUnit: 'TB',
    },
    isActive: true,
    merchantId: 1,
    categoryId: 1,
  };

  const computerDetails: ComputerDetails = {
    category: Categories.Computers,
    capacity: 2,
    capacityUnit: 'TB',
    capacityType: 'HD',
    brand: 'Dell',
    series: 'XPS',
  };

  const productDetails: ProductDetailsDto = {
    details: computerDetails,
    about: ['about 1'],
    description: 'test description',
    code: 'test UPC code',
    title: 'test title',
    variationType: VariationTypes.NONE,
  };

  const createMockQueryBuilder = (results = [], count = 0) => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([results, count]),
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    fakeEntityManager = {
      findOne: jest.fn().mockResolvedValue(computersCategory),
      find: jest.fn(),
      save: jest.fn().mockImplementation((data) => data),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn().mockResolvedValue(testProduct),
      createQueryBuilder: jest.fn().mockReturnValue({
        update: jest.fn(),
        delete: jest.fn(),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getEntityManagerToken(),
          useValue: fakeEntityManager,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProduct: get product by id', () => {
    it('should throw not found product', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(null);
      const result = service.getProduct(1);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
    });

    it('should success', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(testProduct);
      const result = await service.getProduct(1);
      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result.id).toBe(testProduct.id);
    });
  });

  describe('createProduct: create initial inActive product', () => {
    it('should throw not found category', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(null);
      const result = service.createProduct(
        {
          categoryId: 1,
        },
        1,
      );

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.category.notFound.message,
      );
    });

    it('should success', async () => {
      const result = await service.createProduct(
        {
          categoryId: 1,
        },
        1,
      );

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(fakeEntityManager.create).toBeCalled();
      expect(result.id).toBe(testProduct.id);
    });
  });

  describe('addProductDetails: add product details by updating exising product', () => {
    it('should throw not found product', async () => {
      fakeEntityManager.createQueryBuilder().update = jest
        .fn()
        .mockReturnValueOnce({
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          returning: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({ affected: 0, raw: [] }),
        });
      const result = service.addProductDetails(1, productDetails, 1);

      expect(fakeEntityManager.createQueryBuilder().update).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
    });

    it('should success', async () => {
      fakeEntityManager.createQueryBuilder().update = jest
        .fn()
        .mockReturnValueOnce({
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          returning: jest.fn().mockReturnThis(),
          execute: jest
            .fn()
            .mockResolvedValueOnce({ affected: 1, raw: [testProduct] }),
        });
      const result = await service.addProductDetails(1, productDetails, 1);

      expect(fakeEntityManager.createQueryBuilder().update).toBeCalled();
      expect(result.id).toBe(testProduct.id);
    });
  });
  describe('activateProduct: activate Product if its info is fulfilled', () => {
    it('should throw not found product', async () => {
      fakeEntityManager.findOne = jest.fn().mockReturnValueOnce(null);
      const result = service.activateProduct(1, 1);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
    });

    it('should throw error if product not fulfilled', async () => {
      fakeEntityManager.findOne = jest.fn().mockReturnValueOnce(new Product());
      const result = service.activateProduct(1, 1);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.product.notFulfilled.message,
      );
    });

    it('should success', async () => {
      const returnedActiveProduct = {
        id: 1,
        isActive: true,
      };
      fakeEntityManager.findOne = jest
        .fn()
        .mockReturnValueOnce(fulfilledProduct);

      fakeEntityManager.createQueryBuilder().update = jest
        .fn()
        .mockReturnValueOnce({
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          returning: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({
            affected: 1,
            raw: [returnedActiveProduct],
          }),
        });
      const result = await service.activateProduct(1, 1);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(fakeEntityManager.createQueryBuilder().update).toBeCalled();
      expect(result.id).toBe(returnedActiveProduct.id);
      expect(result.isActive).toBe(true);
    });
  });

  describe('deleteProduct: delete product by id', () => {
    it('should throw not found product', async () => {
      fakeEntityManager.createQueryBuilder().delete = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({ affected: 0, raw: [] }),
        });
      const result = service.deleteProduct(1, 1);

      expect(fakeEntityManager.createQueryBuilder().delete).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
    });

    it('should success', async () => {
      fakeEntityManager.createQueryBuilder().delete = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({ affected: 1, raw: [] }),
        });
      const result = await service.deleteProduct(1, 1);

      expect(fakeEntityManager.createQueryBuilder().delete).toBeCalled();
      expect(result.message).toBe(successObject.message);
    });
    describe('searchProducts: search products by title and category', () => {
      let service: ProductService;
      let mockEntityManager: Partial<EntityManager>;

      beforeEach(async () => {
        mockEntityManager = {
          createQueryBuilder: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
          providers: [
            ProductService,
            {
              provide: EntityManager,
              useValue: mockEntityManager,
            },
          ],
        }).compile();

        service = module.get<ProductService>(ProductService);
      });

      describe('searchProducts', () => {
        let searchDto: ProductSearchDto;

        beforeEach(() => {
          searchDto = new ProductSearchDto();
          searchDto.page = 1;
          searchDto.limit = 10;
        });

        it('should throw an error if no merchantId is provided', async () => {
          await expect(
            service.searchProducts(searchDto, null),
          ).rejects.toThrowError('Merchant ID is required for search.');
        });

        it('should return empty results if no products match', async () => {
          const mockQueryBuilder = createMockQueryBuilder([], 0);
          (mockEntityManager.createQueryBuilder as jest.Mock).mockReturnValue(
            mockQueryBuilder,
          );

          const result = await service.searchProducts(searchDto, 1);
          expect(result.items).toEqual([]);
          expect(result.total).toBe(0);
        });

        it('should return matching products by title', async () => {
          searchDto.search = 'test title';

          const matchingProduct = { id: 1, title: 'test title' };
          const mockQueryBuilder = createMockQueryBuilder([matchingProduct], 1);
          (mockEntityManager.createQueryBuilder as jest.Mock).mockReturnValue(
            mockQueryBuilder,
          );

          const result = await service.searchProducts(searchDto, 1);
          expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
            '(product.title ILIKE :search OR product.description ILIKE :search)',
            { search: '%test title%' },
          );
          expect(result.items).toEqual([matchingProduct]);
          expect(result.total).toBe(1);
        });

        it('should return matching products by category', async () => {
          searchDto.category = 'electronics';

          const matchingProduct = {
            id: 2,
            title: 'Laptop',
            category: 'electronics',
          };
          const mockQueryBuilder = createMockQueryBuilder([matchingProduct], 1);
          (mockEntityManager.createQueryBuilder as jest.Mock).mockReturnValue(
            mockQueryBuilder,
          );

          const result = await service.searchProducts(searchDto, 1);
          expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
            'category.name ILIKE :category',
            { category: '%electronics%' },
          );
          expect(result.items).toEqual([matchingProduct]);
          expect(result.total).toBe(1);
        });

        it('should apply price filters when provided', async () => {
          searchDto.minPrice = 100;
          searchDto.maxPrice = 500;

          const filteredProduct = { id: 3, title: 'Smartphone', price: 300 };
          const mockQueryBuilder = createMockQueryBuilder([filteredProduct], 1);
          (mockEntityManager.createQueryBuilder as jest.Mock).mockReturnValue(
            mockQueryBuilder,
          );

          const result = await service.searchProducts(searchDto, 1);
          expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
            'product.price >= :minPrice',
            { minPrice: 100 },
          );
          expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
            'product.price <= :maxPrice',
            { maxPrice: 500 },
          );
          expect(result.items).toEqual([filteredProduct]);
          expect(result.total).toBe(1);
        });

        it('should apply pagination correctly', async () => {
          searchDto.page = 2;
          searchDto.limit = 5;

          const paginatedProducts = [
            { id: 6, title: 'Product 6' },
            { id: 7, title: 'Product 7' },
          ];
          const mockQueryBuilder = createMockQueryBuilder(
            paginatedProducts,
            10,
          );
          (mockEntityManager.createQueryBuilder as jest.Mock).mockReturnValue(
            mockQueryBuilder,
          );

          const result = await service.searchProducts(searchDto, 1);
          expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
          expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
          expect(result.items).toEqual(paginatedProducts);
          expect(result.total).toBe(10);
        });
      });
    });
  });
});

