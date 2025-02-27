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
    // Check if a user with the provided email already exists in the database
    const userExists = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    // If a user with the given email exists, throw a ConflictException
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    // Hash the user's password using bcrypt with a salt rounds value of 10
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // Create a new user entity with the provided username, email, and hashed password
    const userData = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      role_id: createUserDto.role_id,
    });
    // Save the new user entity to the database and return the result
    return await this.userRepository.save(userData);
  }


  async login(logindto: Logindto) {
    // Attempt to find the user in the database by their email address
    const user = await this.userRepository.findOne({ where: { email: logindto.email } });
    // If the user is not found, throw a NotFoundException
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(logindto.password, user.password);
    // If the passwords do not match, throw an UnauthorizedException
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Create a payload for the JWT containing user-specific information
    const payload = {
      email: user.email,   // User's email address
      user_id: user.id,        // User's unique identifier (subject)
      username: user.username,
      role_id:user.role_id// User's username
    };
    // Generate a JWT token using the payload
    const token = this.jwtService.sign(payload);
    // Return a response object containing a success message, status code, user details, and the generated token
    return {
      message: 'Logged in successfully',
      statusCode: HttpStatus.OK,
      user: user,
      token: token
    };
  }



  // Fetch multiple users with pagination
  findAll(skip: number, take: number) {
    // Fetch users from the repository with pagination parameters
    return this.userRepository.find({
      skip, // Number of records to skip
      take  // Number of records to take
    });
  }

  // Fetch a single user by ID
  async findOne(id: number) {
    // Check if the user exists in the database
    const userExists = await this.userRepository.findOne({ where: { id } });
    // If the user is not found, throw a ConflictException
    if (!userExists) {
      throw new ConflictException('User not found');
    }
    // Return the found user
    return userExists;
  }

  // Update user information
  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if the user exists
    const userExists = await this.findOne(id);
    // If the user does not exist, throw an error
    if (!userExists) {
      throw new ConflictException('User not found');
    }
    // Perform the update operation
    await this.userRepository.update(id, updateUserDto);
    // Return the updated user
    return await this.findOne(id);
  }

  // Delete a user by ID
  async remove(id: number) {
    // Check if the user exists
    const userExists = await this.findOne(id);

    // If the user does not exist, throw an error
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    // Perform the delete operation
    const deletes = await this.userRepository.delete(id);
    // If deletion was successful, return a success response
    if (deletes.affected) {
      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully'
      };
    }
    // If something goes wrong, return an error message
    throw new Error("Something went wrong while deleting the user");
  }

}
