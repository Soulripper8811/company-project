import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class JWTGuard implements CanActivate {
  constructor(
    private JwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      throw new HttpException(
        { message: 'No token present' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const payload = await this.JwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (!user) {
        throw new HttpException(
          { message: 'No user found' },
          HttpStatus.NOT_FOUND,
        );
      }
      request['user'] = user;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return true;
  }
  private extractToken(request: Request) {
    console.log(request);
    try {
      const [type, token] = request.headers.authorization.split(' ');
      return type === 'Bearer' ? token : undefined;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        {
          message: 'Token is not valid',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
