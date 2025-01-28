import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from '../role/role.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/services/user.service';
import { User } from 'src/entity/user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3h' },
    }),
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, ConfigService],
  exports: [],
})
export class AuthModule {}


