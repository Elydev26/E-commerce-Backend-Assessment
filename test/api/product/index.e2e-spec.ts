import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from 'src/app/app.module';
import { Product } from 'src/entity/product.entity';
import { User } from 'src/entity/user.entity';

// Mock user and product data
const mockUser = { email: 'merchant@test.com', password: '12345678' };
const mockProduct = {
  name: 'Test Product',
  price: 100,
  description: 'Test description',
};
const mockProductDetails = { stock: 50, category: 'Test Category' };

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let productRepository: Repository<Product>;
  let userRepository: Repository<User>;
  let accessToken: string;
  let createdProductId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    productRepository = moduleFixture.get('ProductRepository');
    userRepository = moduleFixture.get('UserRepository');

    await productRepository.delete({});
    await userRepository.delete({});

    await app.init();

    // Register and log in the mock user to get an access token
    await request(app.getHttpServer()).post('/auth/register').send(mockUser);
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockUser);
    accessToken = loginResponse.body.data.accessToken;
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/product/create (POST)', () => {
    it('should create a product', async () => {
      const response = await request(app.getHttpServer())
        .post('/product/create')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockProduct);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(mockProduct.name);
      createdProductId = response.body.id;
    });
  });

  describe('/product/:id/details (POST)', () => {
    it('should add product details', async () => {
      const response = await request(app.getHttpServer())
        .post(`/product/${createdProductId}/details`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(mockProductDetails);

      expect(response.status).toBe(201);
      expect(response.body.details.stock).toBe(mockProductDetails.stock);
    });
  });

  describe('/product/:id/activate (POST)', () => {
    it('should activate a product', async () => {
      const response = await request(app.getHttpServer())
        .post(`/product/${createdProductId}/activate`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.isActive).toBe(true);
    });
  });

  describe('/product/search (GET)', () => {
    it('should search for products', async () => {
      const response = await request(app.getHttpServer())
        .get('/product/search?name=Test')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('/product/:id (GET)', () => {
    it('should get a product by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/product/${createdProductId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdProductId);
    });
  });

  describe('/product/:id (DELETE)', () => {
    it('should delete a product', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/product/${createdProductId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully');
    });
  });
});
