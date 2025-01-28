// import { Body, Controller, Post } from '@nestjs/common';
// import { CreateUserDto } from 'src/api/user/dto/user.dto';
// import { AuthService } from '../services/auth.service';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   login(@Body() user: CreateUserDto) {
//     return this.authService.login(user);
//   }

//   @Post('register')
//   register(@Body() user: CreateUserDto) {
//     return this.authService.register(user);
//   }
// }
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthCredentialsDto, AuthResponseDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth') // Swagger grouping
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Log in to the application' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() credentials: AuthCredentialsDto,
  ): Promise<AuthResponseDto> {
    return this.authService.login(credentials);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() credentials: AuthCredentialsDto,
  ): Promise<{ message: string }> {
    return this.authService.register(credentials);
  }
}
