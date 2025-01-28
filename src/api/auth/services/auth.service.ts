// import {
//   ConflictException,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { RoleIds } from 'src/api/role/enum/role.enum';
// import { RoleService } from 'src/api/role/services/role.service';
// import { CreateUserDto } from 'src/api/user/dto/user.dto';
// import { UserService } from 'src/api/user/services/user.service';
// import { errorMessages } from 'src/errors/custom';
// import { PayloadDto } from '../dto/auth.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly userService: UserService,
//     private readonly roleService: RoleService,
//     private jwtService: JwtService,
//     private configService: ConfigService,
//   ) {}

//   async login(user: CreateUserDto) {
//     const { email, password } = user;
//     const alreadyExistingUser = await this.userService.findByEmail(email);
//     if (!alreadyExistingUser)
//       throw new UnauthorizedException(errorMessages.auth.wronCredentials);

//     const isValidPassword = await this.userService.comparePassword(
//       password,
//       alreadyExistingUser.password,
//     );
//     if (!isValidPassword)
//       throw new UnauthorizedException(errorMessages.auth.wronCredentials);
//     return this.generateToken({
//       id: alreadyExistingUser.id,
//       email,
//     });
//   }

//   async register(user: CreateUserDto) {
//     const alreadyExistingUser = await this.userService.findByEmail(user.email);
//     if (alreadyExistingUser)
//       throw new ConflictException(errorMessages.auth.userAlreadyExist);

//     const customerRole = await this.roleService.findById(RoleIds.Customer);

//     await this.userService.createUser(user, customerRole);

//     return {
//       message: 'success',
//     };
//   }

//   async generateToken(payload: PayloadDto) {
//     const accessToken = await this.jwtService.signAsync(payload, {
//       secret: this.configService.get('jwt.secret'),
//     });

//     return { accessToken };
//   }
// }
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

  /**
   * Log in a user by validating their credentials and generating a token.
   * @param credentials - The user's email and password.
   * @returns An object containing the JWT access token.
   */
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

  /**
   * Register a new user and assign a default role.
   * @param credentials - The user's registration details.
   * @returns A success message.
   */
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

  /**
   * Generate a JWT access token for a user.
   * @param payload - The token payload (email and ID).
   * @returns An object containing the JWT access token.
   */
  async generateToken(payload: PayloadDto): Promise<{ accessToken: string }> {
    const secret = this.configService.get<string>('jwt.secret');
    const accessToken = await this.jwtService.signAsync(payload, { secret });
    return { accessToken };
  }
}
