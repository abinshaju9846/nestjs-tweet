import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { AuthGuard } from 'src/users/user.guard';
import { GetUserId } from 'src/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async create(
    @GetUserId()id,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() avatar?: Express.Multer.File,
    
  ) {
    
    return this.profileService.create(id,{
      
      bio: createProfileDto.bio,
      avatar: avatar? avatar.path : null,
    });
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get('ById')
  findOne(@GetUserId()id) {
    return this.profileService.findOne(id);
  }

    @Patch()
    @UseInterceptors(FileInterceptor('avatar', multerConfig))
    update(@GetUserId()id, @Body() updateProfileDto: UpdateProfileDto,@UploadedFile() avatar:Express.Multer.File) {
      return this.profileService.update(+id, updateProfileDto,avatar);
    }

    @Delete()
    remove(@GetUserId() id: number) {
      return this.profileService.remove(+id);
    }
}
