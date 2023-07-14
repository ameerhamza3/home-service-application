import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  @Post('login')
  async loginUser(@Body() user: User): Promise<{ accessToken: string }> {
    return this.userService.loginUser(user.email, user.password);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller') // Requires 'admin' role
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  // Other routes (e.g., login, confirm email) can be added here
}
