import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { loginDto, registerDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private JwtService: JwtService,
  ) {}

  async register(registerDto: registerDto) {
    try {
      const { email, password, username } = registerDto;
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        throw new HttpException(
          { message: 'User ALready exist' },
          HttpStatus.CONFLICT,
        );
      }
      const hashedPassword = await hash(password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      const data = {
        newUser,
        message: 'user created Succesfully',
      };
      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async login(loginDto: loginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      const isPassword = await compare(password, user.password);
      if (!isPassword) {
        throw new HttpException(
          { message: 'Invalid email and password' },
          HttpStatus.NOT_FOUND,
        );
      }
      const payload = {
        userId: user.id,
        email: user.email,
      };
      const token = await this.JwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });
      const { password: _, ...userWithoutPassword } = user;
      const data = {
        user: userWithoutPassword,
        token,
      };
      return data;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getusers() {
    return await this.prisma.user.findMany();
  }
}
