import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RespondAfterCreateUserDto } from './dto/response-after-create.dto';
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RespondAfterCreateUserDto> {
    const user = await this.usersService.create(createUserDto);
    const token = this.usersService.createToken(user.id);
    return {
      userToken: token,
      userInfo: { username: user.username, email: user.email },
    };
  }

  @Post('login')
  async getUser(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<RespondAfterCreateUserDto> {
    const user = await this.usersService.findOne(loginUserDto);
    const token = this.usersService.createToken(user.id);
    return {
      userToken: token,
      userInfo: { username: user.username, email: user.email },
    };
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.usersService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ) {
    return this.usersService.resetPassword(token, password);
  }
}
