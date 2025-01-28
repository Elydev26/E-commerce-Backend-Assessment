import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserRelation } from '../dto/user.types';
import { errorMessages } from 'src/errors/custom';
import { Role } from 'src/entity/role.entity';
import { User } from 'src/entity/user.entity';
import { ApiTags } from '@nestjs/swagger';

@Injectable()
@ApiTags('Users')
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  public async createUser(
    body: CreateUserDto,
    ...roles: Role[]
  ): Promise<User> {
    body.password = await hash(body.password, 10);
    const user: User = this.repository.create({
      ...body,
      roles,
    });

    return this.repository.save(user);
  }

  public async findByEmail(
    email: string,
    relations?: UserRelation,
  ): Promise<User> {
    const user: User = await this.repository.findOne({
      where: {
        email,
      },
      relations,
    });
    return user;
  }
  /**
   * Retrieve all users from the database.
   * @returns An array of user entities.
   */
  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  public async comparePassword(password, userPassword): Promise<boolean> {
    return compare(password, userPassword);
  }

  public async findById(id: number, relations?: UserRelation): Promise<User> {
    const user: User = await this.repository.findOne({
      where: {
        id,
      },
      relations,
    });
    if (!user) {
      throw new NotFoundException(errorMessages.user.notFound);
    }
    return user;
  }

  /**
   * Update an existing user's details.
   * @param id - User ID.
   * @param updateUserDto - Data Transfer Object for updating user details.
   * @returns The updated user entity.
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.repository.save(user);
  }

  /**
   * Delete a user by their ID.
   * @param id - User ID.
   * @returns A boolean indicating success.
   */
  async deleteUser(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  public async save(user: User) {
    return this.repository.save(user);
  }
}
