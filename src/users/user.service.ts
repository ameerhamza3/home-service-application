import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/createUser.dto';
import { v4 as uuid } from 'uuid';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

let failedLoginAttempts = 0;
let isLockedOut = false;
let lockoutTimer: NodeJS.Timeout | null = null;
function handleFailedLogin() {
  failedLoginAttempts++;

  if (failedLoginAttempts >= 2) {
    isLockedOut = true;
    lockoutTimer = setTimeout(() => {
      isLockedOut = false;
      failedLoginAttempts = 0;
      lockoutTimer = null;
    }, 60000);
  }
}
@Injectable()
export class UserService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const verificationToken = uuid();
      createUserDto.verificationToken = verificationToken;
      createUserDto.isLoggedIn = false;

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;

      const newUser = await this.userRepository.save(createUserDto);

      await this.transporter.sendMail({
        from: 'your_email@example.com',
        to: createUserDto.email,
        subject: 'Verify Your Email',
        html: `<p>Please click the link below to verify your email:</p>
            <p><a href="http://your_app_url/users/verify-email/${verificationToken}">Verify Email</a></p>`,
      });

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async verifyEmail(verificationToken: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { verificationToken },
      });

      if (!user) {
        throw new NotFoundException('Invalid verification token');
      }

      user.verificationToken = null;
      user.isLoggedIn = true;
      await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to verify email');
    }
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    try {
      if (isLockedOut) {
        throw new UnauthorizedException(
          'Too many failed login attempts. Please try again later.',
        );
      }

      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        handleFailedLogin();
        throw new UnauthorizedException('Invalid Credentials');
      }

      if (!user.isLoggedIn) {
        throw new UnauthorizedException(
          'Please verify your email before logging in.',
        );
      }

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        handleFailedLogin();
        throw new UnauthorizedException('Invalid Credentials');
      }

      failedLoginAttempts = 0;
      clearTimeout(lockoutTimer);
      lockoutTimer = null;

      const payload = { userId: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch (error) {
      throw new InternalServerErrorException('Failed to login user');
    }
  }

  async initiatePasswordReset(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException(
          'Invalid email address. Please provide a valid email associated with your account.',
        );
      }

      const resetToken = uuid();
      user.resetToken = resetToken;
      await this.userRepository.save(user);

      await this.transporter.sendMail({
        from: 'your_email@example.com',
        to: email,
        subject: 'Reset Your Password',
        html: `<p>Please click the link below to reset your password:</p>
          <p><a href="http://localhost:3000/users/reset-password/${resetToken}">Reset Password</a></p>`,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to initiate password reset',
      );
    }
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { resetToken } });

      if (!user) {
        throw new NotFoundException(
          'Invalid reset token. Please initiate the password reset process again.',
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
