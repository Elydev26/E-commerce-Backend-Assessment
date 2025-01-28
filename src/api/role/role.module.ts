import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { UserService } from '../user/services/user.service';
import { Role } from 'src/entity/role.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User]), UserModule],
  controllers: [RoleController],
  providers: [RoleService, UserService],
  exports: [RoleService],
})
export class RoleModule {}
