import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Logindto } from './dto/login-user.dto';
import { skip } from 'node:test';
import { AuthGuard } from './user.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query("skip", ParseIntPipe) skip: number, @Query("take", ParseIntPipe) take: number,) {
    return this.usersService.findAll(skip, take);
  }


  @Post('login')
  login(@Body() logindto: Logindto) {
    return this.usersService.login(logindto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
