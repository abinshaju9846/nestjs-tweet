// profile.service.ts
import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UsersService } from 'src/users/users.service';
import { imageCompression } from 'src/config/multer.config';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { GetUserId } from 'src/decorators/user.decorator';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly userservice: UsersService,
  ) {}

  async create(
    user_id,
    createProfileDto: CreateProfileDto,
    avatar?: Express.Multer.File,
  ) {
    await this.userservice.findOne(user_id);

    const profileExist = await this.profileRepository.findOne({
      where: { user_id: user_id },
    });
    if (profileExist) {
      throw new ConflictException('Profile already exists for this user');
    }

    let avatarPath: string | null = null;
    if (avatar) {
      avatarPath = `uploads/avatars/${avatar.filename}`;
      const fullAvatarPath = join(process.cwd(), avatarPath);
      try {
        await imageCompression(fullAvatarPath);
        // Remove the original uncompressed file
        if (existsSync(fullAvatarPath)) {
          unlinkSync(fullAvatarPath);
        }
        // Update avatarPath to point to the compressed image
        avatarPath = avatarPath.replace(
          /(\.[\w\d_-]+)$/i,
          '_compressed$1',
        );
      } catch (error) {
        throw new InternalServerErrorException(
          'Error processing avatar image',
        );
      }
    }

    const createProfile = this.profileRepository.create({
      user_id: user_id,
      bio: createProfileDto.bio,
      avatar: avatarPath,
    });
    const save = await this.profileRepository.save(createProfile);
    return { ...save, message: 'Profile created' };
  }

  findAll() {
    return this.profileRepository.find();
  }

  async findOne(id) {
    const profileExists = await this.profileRepository.findOne({
      where: { user_id: id },
    });
    if (!profileExists) {
      throw new ConflictException('Profile not found');
    }
    return profileExists;
  }

  public async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
    avatar?: Express.Multer.File,
  ) {
    const profile = await this.profileRepository.findOne({ where: {user_id: id } });
    if (!profile) {
      throw new ConflictException(`Profile with id ${id} not found`);
    }

    let avatarPath = profile.avatar;
    if (avatar) {
      avatarPath = `uploads/avatars/${avatar.filename}`;
      const fullAvatarPath = join(process.cwd(), avatarPath);
      try {
        await imageCompression(fullAvatarPath);
        // Remove the original uncompressed file
        if (existsSync(fullAvatarPath)) {
          unlinkSync(fullAvatarPath);
        }
        // Update avatarPath to point to the compressed image
        avatarPath = avatarPath.replace(
          /(\.[\w\d_-]+)$/i,
          '_compressed$1',
        );
      } catch (error) {
        throw new InternalServerErrorException(
          'Error processing avatar image',
        );
      }
    }

    const updatedData = {
      ...updateProfileDto,
      avatar: avatarPath,
    };
    console.log(updatedData,id);
    

   const update = await this.profileRepository.update({user_id:id}, updatedData);

   console.log(update);
   
    return await this.profileRepository.findOne({ where: {user_id: id } });
  }

  async remove(id: number) {
    await this.findOne(id);
    const remove = await this.profileRepository.delete({user_id:id});
    if (!remove) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error in profile deletion',
      };
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile deleted',
    };
  }
}
