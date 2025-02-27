import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Logindto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,

  ) { }

  async login(logindto: Logindto) {
    const { email, password } = logindto
    const user = await this.validateUser(email, password)
    // Create a payload for the JWT containing user-specific information
    const payload = {
      email: user.email,   // User's email address
      user_id: user.id,        // User's unique identifier (subject)
      username: user.username,
      role: user.role.role// User's username
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
  async validateUser(email, password) {
    const user = await this.userRepository.findOne({ where: { email } });
    // If the user is not found, throw a NotFoundException
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // console.log("user role:", user.role.role);
    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user

  }
}
