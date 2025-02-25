import { ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Logindto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,

  ) { }
  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({ where: { email: createUserDto.email } })
    if (!userExists) {
      const hashedPassword=await bcrypt.hash(createUserDto.password,10)
      const userData = this.userRepository.create({
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword
      })
      return await this.userRepository.save(userData);

    }
    throw new ConflictException('User already exists')

  }

  async login(logindto:Logindto) {

    const user =await this.userRepository.findOne({where: {email: logindto.email}})
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const isMatch=await bcrypt.compare(logindto.password,user.password)
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials')
    }
      // Create JWT payload
      const payload = { 
        email: user.email, 
        sub: user.id,
        username: user.username 
      };
      
      // Generate JWT token
      const token = this.jwtService.sign(payload)
    return {
      message: 'Logged in successfully',
      statusCode: HttpStatus.OK,
      user: user,
      token:token
    }

  }

  findAll(skip:number,take:number) {
    return this.userRepository.find({
      skip,
      take
    });
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
