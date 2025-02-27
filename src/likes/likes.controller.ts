import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { GetUserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/users/user.guard';
@UseGuards(AuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  @Post()
  create(@GetUserId()id:number,@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(id,createLikeDto);
  }

  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likesService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
  //   return this.likesService.update(+id, updateLikeDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likesService.remove(+id);
  }
}
