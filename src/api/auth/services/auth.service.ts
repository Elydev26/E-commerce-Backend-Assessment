import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RoleIds } from 'src/api/role/enum/role.enum';
import { RoleService } from 'src/api/role/services/role.service';
import { UserService } from 'src/api/user/services/user.service';
import { AuthCredentialsDto, PayloadDto } from '../dto/auth.dto';
import { errorMessages } from 'src/errors/custom';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

   async login(
    credentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = credentials;

    // Validate user existence
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(errorMessages.auth.wronCredentials);
    }

    // Validate password
    const isPasswordValid = await this.userService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(errorMessages.auth.wronCredentials);
    }

    // Generate and return JWT
    return this.generateToken({ id: user.id, email });
  }

  async register(
    credentials: AuthCredentialsDto,
  ): Promise<{ message: string }> {
    const { email } = credentials;

    // Check for existing user
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(errorMessages.auth.userAlreadyExist);
    }

    // Assign default customer role
    const customerRole = await this.roleService.findById(RoleIds.Customer);
    await this.userService.createUser(credentials, customerRole);

    return { message: 'User successfully registered' };
  }
  async generateToken(payload: PayloadDto): Promise<{ accessToken: string }> {
    const secret = this.configService.get<string>('jwt.secret');
    const accessToken = await this.jwtService.signAsync(payload, { secret });
    return { accessToken };
  }
}
