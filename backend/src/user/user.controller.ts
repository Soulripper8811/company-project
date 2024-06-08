import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { loginDto, registerDto } from './dto/user.dto';
import { JWTGuard } from './guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/register')
  async register(@Body() registerDto: registerDto) {
    return this.userService.register(registerDto);
  }
  @Post('/login')
  async login(@Body() loginDto: loginDto) {
    return this.userService.login(loginDto);
  }
  @UseGuards(JWTGuard)
  @Get()
  async getAllUser() {
    return this.userService.getusers();
  }
}
