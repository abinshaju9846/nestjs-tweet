import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Logindto } from './dto/login-user.dto';
import { skip } from 'node:test';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decrator';
import { RolesGuard } from 'src/auth/guards/role,gaurd';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('')
  @Get()
  findAll(@Query("skip", ParseIntPipe) skip: number, @Query("take", ParseIntPipe) take: number,) {
    return this.usersService.findAll(skip, take);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
