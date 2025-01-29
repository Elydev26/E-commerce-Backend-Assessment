import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { Serialize } from 'src/helper/serialize.interceptor';
import { CurrentUser } from 'src/api/auth/guards/user.decorator';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { User } from 'src/entity/user.entity';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get profile of the current user' })
  @ApiResponse({ status: 200, description: 'User profile', type: UserDto })
  @Auth()
  @Serialize(UserDto)
  @Get('profile')
  profile(@CurrentUser() user: User) {
    return this.userService.findById(user.id);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const newUser = await this.userService.createUser(createUserDto);
    return newUser;
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserDto],
  })
  @Auth()
  @Serialize(UserDto)
  @Get()
  async findAllUsers(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserDto,
  })
  @Auth()
  @Serialize(UserDto)
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
