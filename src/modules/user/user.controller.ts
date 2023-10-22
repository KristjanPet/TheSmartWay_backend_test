import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger/dist/index'
import { User } from 'src/entities/user.entity';
import { Request } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { join } from 'path';

import { CreateUserDto } from './Dto/create-user.dto';
import { UpdateUserDto } from './Dto/update-user.dto';
import { UserService } from './user.service';

// @ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // GET

  // @ApiCreatedResponse({ description: 'List all users.' })
  // @ApiBadRequestResponse({ description: 'Error for list of users' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // @ApiCreatedResponse({ description: 'Get one user.' })
  // @ApiBadRequestResponse({ description: 'Error getting one user' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id, []);
  }

  //POST

  // @ApiCreatedResponse({ description: 'Create a user.' })
  // @ApiBadRequestResponse({ description: 'Error for creating a user' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // PATCH

  // @ApiCreatedResponse({ description: 'Update users info.' })
  // @ApiBadRequestResponse({ description: 'Error updating users info' })
  @Patch('/update-user')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ): Promise<User> {
    const cookie = req.cookies['access_token'];
    const user = (await this.authService.user(cookie)) as User;
    return this.userService.update(user, updateUserDto);
  }

  // DELTE
  // @ApiCreatedResponse({ description: 'Delete user.' })
  // @ApiBadRequestResponse({ description: 'Error deleting user' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
