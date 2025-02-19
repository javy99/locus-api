import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    console.log('Authorization Header:', request.headers.authorization);
    const token = request.headers.authorization?.split(' ')[1];
    console.log(token);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        this.logger.error(
          'JWT_SECRET is not defined in environment variables.',
        );
        return false;
      }
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: secret,
      });
      request.user = payload;
      const user = request.user as JwtPayload;
      return roles.includes(user.role);
    } catch (error: any) {
      if (error instanceof Error) {
        this.logger.error(
          `JWT Verification Failed: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(`JWT Verification Failed: ${String(error)}`);
      }
      return false;
    }
  }
}
