import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const authToken: string = client.handshake.headers.authorization;

    if (!authToken) {
      throw new WsException('Unauthorized');
      return false;
    }

    const accessToken = authToken.split(' ')[1];

    const user = await this.authService.validateAccessToken(accessToken);
    context.switchToHttp().getRequest().user = user;
    return Boolean(user);
  }

  getRequest(context: ExecutionContext) {
    const ctx = context.switchToWs().getClient();
    return {
      headers: {
        authorization: ctx.handshake.headers.authorization,
      },
    };
  }
}
