import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthzMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const [header, payload, signature] = (token || '').split('.');
      const payloadInfo = JSON.parse(
        Buffer.from(payload, 'base64').toString('utf-8'),
      );

      const userInfo = payloadInfo.data;
      const body = req.body;
      body['userInfo'] = userInfo;
    } catch {
      throw new UnauthorizedException();
    }
    next();
  }
  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
