import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { USER_REPOSITORY } from 'src/constants';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

import type { IEmailService } from 'src/email/email.interface';
import { EMAIL_SERVICE } from 'src/email/email.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepo: Repository<User>,

    private readonly configService: ConfigService,
    @Inject(EMAIL_SERVICE)
    private mailService: IEmailService,
  ) {}

  async create(newUser: CreateUserDto): Promise<User> {
    const isUserExist = await this.userRepo.findOneBy({
      email: newUser.email,
    });

    if (isUserExist) {
      throw new ConflictException('Email is already taken');
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newUser.password, salt);

    const user = this.userRepo.create({
      password: passwordHash,
      email: newUser.email,
      username: newUser.username,
    });
    return await this.userRepo.save(user);
  }

  async findOne(loginUser: LoginUserDto): Promise<User> {
    const user = await this.userRepo.findOneBy({ email: loginUser.email });
    if (user === null) {
      throw new NotFoundException('Wrong credentials');
    }

    const passwordMatches = await bcrypt.compare(
      loginUser.password,
      user.password,
    );

    if (passwordMatches) {
      return user;
    }
    throw new NotFoundException('Wrong credentials');
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour
    await this.userRepo.save(user);

    await this.mailService.sendPasswordReset(user.email, token);

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepo.findOne({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await this.userRepo.save(user);

    return { message: 'Password successfully reset' };
  }

  createToken = (userId: number) => {
    return jwt.sign(
      { userId },
      this.configService.get<string>('TOKEN_SECRET_KEY')!,
      {
        expiresIn: '7d',
      },
    );
  };
}
