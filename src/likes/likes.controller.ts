import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { GetUserId } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decrator';
import { RolesGuard } from 'src/auth/guards/role,gaurd';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@GetUserId() id: number, @Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(id, createLikeDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.likesService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likesService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
  //   return this.likesService.update(+id, updateLikeDto);
  // }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likesService.remove(+id);
  }
}
