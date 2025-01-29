import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { AdminSeeder } from './seeders/admin.seeder';
import { CategorySeeder } from './seeders/category.seeder';
import { ColorSeeder } from './seeders/color.seeder';
import { CountrySeeder } from './seeders/country.seeder';
import { CurrencySeeder } from './seeders/currency.seeder';
import { RolesSeeder } from './seeders/role.seeder';
import { SizeSeeder } from './seeders/size.seeder';
import { Category } from '../../../entity/category.entity';
import { Color } from '../../../entity/color.entity';
import { Country } from '../../../entity/country.entity';
import { Currency } from '../../../entity/currency.entity';
import { Role } from '../../../entity/role.entity';
import { Size } from '../../../entity/size.entity';
import { User } from '../../../entity/user.entity';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { configuration } from '../../../config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forFeature([
      Role,
      User,
      Category,
      Size,
      Color,
      Country,
      Currency,
    ]),
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
  ],
  controllers: [],
  providers: [
    SeedService,
    RolesSeeder,
    AdminSeeder,
    CategorySeeder,
    SizeSeeder,
    ColorSeeder,
    CountrySeeder,
    CurrencySeeder,
  ],
})
export class SeedModule {}
