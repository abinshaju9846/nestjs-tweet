import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UsersService } from 'src/users/users.service';
import { join } from 'path';
import { unlink } from 'fs';

@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly userservice: UsersService,
  ) { }
  async create(createProfileDto: CreateProfileDto,avatar?:Express.Multer.File) {
    // console.log(createProfileDto.user_id);
    await this.userservice.findOne(createProfileDto.user_id)

    const profileExist = await this.profileRepository.findOne({ where: { user_id: createProfileDto.user_id } })
    if (profileExist) {
      throw new ConflictException('Profile already exist for this user')
    }

    const avatarPath=avatar?`uploads/avatars/${avatar.filename}`:null
    const createProfile = await this.profileRepository.create({
      user_id: createProfileDto.user_id,
      bio: createProfileDto.bio,
      avatar:avatarPath,
    })
    const save = await this.profileRepository.save(createProfile);
    return { ...save, messaage: "profile creted" }

  }

  findAll() {
    return this.profileRepository.find();
  }

  async findOne(id: number) {
    const profileExists = await this.profileRepository.findOne({ where: { id: id } })
    if (!profileExists) {
      throw new ConflictException('Profile not found')
    }
    return profileExists;
  }

  public async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
    avatar?: Express.Multer.File, 
  ) {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new ConflictException(`Profile with id ${id} not found`);
    }


    const updatedData = {
      ...updateProfileDto,
      avatar: avatar ? `/uploads/avatars/${avatar.filename}` : profile.avatar, 
    };


    await this.profileRepository.update(id, updatedData);
    return await this.profileRepository.findOne({ where: { id } });
  }


  async remove(id: number) {
    await this.findOne(id)
    const remove = await this.profileRepository.delete(id)
    if (!remove) {
      return {
        statuscode: HttpStatus.BAD_REQUEST,
        message: 'error in profiledeletion'
      }
    }
    return {
      statuscode: HttpStatus.OK,
      message: 'Profile deleted'
    }

  }
}
