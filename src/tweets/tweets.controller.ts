import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { GetUserId } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { Roles } from 'src/decorators/roles.decrator';
import { RolesGuard } from 'src/auth/guards/role,gaurd';

@UseGuards(JwtAuthGuard)
@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  create(@GetUserId() id:number,@Body() createTweetDto: CreateTweetDto) {
    console.log("hiiii");
    return this.tweetsService.create(createTweetDto,id);
  }

  @Get()
  findAll() {
    return this.tweetsService.findAll();
  }

  @Get('getById')
  findOne(@GetUserId() id: number) {
    return this.tweetsService.findOne(id);
  }

  @Patch()
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetsService.update(+id, updateTweetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tweetsService.remove(+id);
  }
}
