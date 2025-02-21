import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

  ) { }
  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({ where: { email: createUserDto.email } })
    if (!userExists) {
      const userData = this.userRepository.create({
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password
      })
      return await this.userRepository.save(userData);

    }
    throw new ConflictException('User already exists')

  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number,) {
    const userExists = await this.userRepository.findOne({where:{id}});
    if (!userExists) {
      throw new ConflictException('User not found')
    }
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userExists = await this.findOne(id);
    if (!userExists) {
      throw new ConflictException('User not found')
    }
    const updatedUser = await this.userRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const userExists = await this.findOne(id);
    if (!userExists) {
      throw new NotFoundException('User not found')
    }
    const deletes = await this.userRepository.delete(id);
    if (deletes) {
      return {
        statuscode: HttpStatus.OK,
        message: 'User deleted'
      }

    }
    return "something wrong happened"
  }
}
