import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoleIds } from '../../role/enum/role.enum';
import {
  CreateProductDto,
  ProductDetailsDto,
  ProductSearchDto,
} from '../dto/product.dto';
import { ProductService } from '../services/product.service';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { CurrentUser } from 'src/api/auth/guards/user.decorator';
import { User } from 'src/entity/user.entity';
import { FindOneParams } from 'src/helper/findOneParams.dto';
import { Product } from 'src/entity/product.entity';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Products')
@Controller('product')
@UseGuards(ThrottlerGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search')
  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @ApiOperation({ summary: 'Search and filter products' })
  @ApiResponse({
    status: 200,
    description: 'List of products matching search criteria',
    type: Product,
    isArray: true,
  })
  async searchProducts(
    @Query() searchDto: ProductSearchDto,
    @CurrentUser() user: User,
  ) {
    return this.productService.searchProducts(searchDto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product details',
    type: Product,
  })
  async getProduct(@Param() product: FindOneParams) {
    return this.productService.getProduct(product.id);
  }

  @Post('create')
  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  async createProduct(
    @Body() body: CreateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productService.createProduct(body, user.id);
  }

  @Post(':id/details')
  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product details' })
  @ApiResponse({
    status: 201,
    description: 'Product details added successfully',
    type: Product,
  })
  async addProductDetails(
    @Param() product: FindOneParams,
    @Body() body: ProductDetailsDto,
    @CurrentUser() user: User,
  ) {
    return this.productService.addProductDetails(product.id, body, user.id);
  }
  @Throttle({
    default: {
      ttl: 60000,
      limit: 10,
    },
  })
  @Post(':id/activate')
  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a product' })
  @ApiResponse({
    status: 200,
    description: 'Product activated successfully',
  })
  async activateProduct(
    @Param() product: FindOneParams,
    @CurrentUser() user: User,
  ) {
    return this.productService.activateProduct(product.id, user.id);
  }

  @Delete(':id')
  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  async deleteProduct(
    @Param() product: FindOneParams,
    @CurrentUser() user: User,
  ) {
    return this.productService.deleteProduct(product.id, user.id);
  }
}
