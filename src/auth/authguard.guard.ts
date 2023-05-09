import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthguardGuard implements CanActivate {
  // constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const [header, payload, signature] = (token || '').split('.');
      const payloadInfo = JSON.parse(
        Buffer.from(payload, 'base64').toString('utf-8'),
      );

      const userInfo = payloadInfo.data;
      request['userInfo'] = userInfo;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
