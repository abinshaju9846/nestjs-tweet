import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  @UseInterceptors(FileInterceptor('avatar',multerConfig))
  create(@Body() createProfileDto: CreateProfileDto,@UploadedFile() avatar:Express.Multer.File) {
    return this.profileService.create(createProfileDto,avatar);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.profileService.findOne(id);
  }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('avatar', multerConfig))
    update(@Param('id') id: number, @Body() updateProfileDto: UpdateProfileDto,@UploadedFile() avatar:Express.Multer.File) {
      return this.profileService.update(+id, updateProfileDto,avatar);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
      return this.profileService.remove(+id);
    }
}
