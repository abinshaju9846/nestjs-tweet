import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { GetUserId } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { Roles } from 'src/decorators/roles.decrator';
import { RolesGuard } from 'src/auth/guards/role,gaurd';


@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Post()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async create(
    @GetUserId() id,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() avatar?: Express.Multer.File,

  ) {

    return this.profileService.create(id, {

      bio: createProfileDto.bio,
      avatar: avatar ? avatar.path : null,
    });
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get()
  findAll() {
    return this.profileService.findAll();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('ById')
  findOne(@GetUserId() id) {
    return this.profileService.findOne(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Patch()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  update(@GetUserId() id, @Body() updateProfileDto: UpdateProfileDto, @UploadedFile() avatar: Express.Multer.File) {
    return this.profileService.update(+id, updateProfileDto, avatar);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Delete()
  remove(@GetUserId() id: number) {
    return this.profileService.remove(+id);
  }
}
