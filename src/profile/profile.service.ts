import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly userservice: UsersService,
  ) { }
  async create(createProfileDto: CreateProfileDto) {
    // console.log(createProfileDto.user_id);
    await this.userservice.findOne(createProfileDto.user_id)

    const profileExist = await this.profileRepository.findOne({ where: { user_id: createProfileDto.user_id } })
    if (profileExist) {
      throw new ConflictException('Profile already exist for this user')
    }
    const createProfile = await this.profileRepository.create({
      user_id: createProfileDto.user_id,
      bio: createProfileDto.bio,
      avatar: createProfileDto.avatar
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

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    await this.findOne(id)
    await this.profileRepository.update(id, {
      bio: updateProfileDto.bio,
      avatar: updateProfileDto.avatar
    });
    return this.findOne(id)

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
