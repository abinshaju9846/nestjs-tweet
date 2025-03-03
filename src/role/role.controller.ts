import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { Roles } from 'src/decorators/roles.decrator';
import { RolesGuard } from 'src/auth/guards/role,gaurd';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService,

  ) { }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roleService.findOne(+id);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
