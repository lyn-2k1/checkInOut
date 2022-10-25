import { PrismaService } from 'nestjs-prisma';
import { WsAuthGuard } from './../../common/guards/ws/ws-jwt.guard';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
  BaseWsExceptionFilter,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User } from '@prisma/client';
import { ReqUser } from '../../common/decorators/user.decorator';
import { AuthService } from '../auth/services/auth.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  handleDisconnect(client: Socket) {
    client.emit('close', new WsException('Close conection'));
  }

  async handleConnection(client: Socket) {
    const authToken: string = client.handshake.headers.authorization;
    console.log(
      '🚀 ~ file: ws-jwt.guard.ts ~ line 13 ~ WsAuthGuard ~ canActivate ~ authToken',
      authToken,
    );
    if (!authToken) {
      client.emit('close', new WsException('Unauthorized'));
      client.disconnect(true);
      return;
    }
    const accessToken = authToken.split(' ')[1];
    const user = await this.authService.validateAccessToken(accessToken);
    client.join('user-' + user.id);
  }

  @UseGuards(WsAuthGuard)
  // @UsePipes(new ValidationPipe())
  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createChatDto: any,
    @ConnectedSocket() client: Socket,
    @ReqUser() user: User,
  ) {
    const { to, message } = createChatDto;
    const from = user.id;
    console.log(to, message);
    const mess = await this.prisma.chat.create({
      data: {
        fromId: from,
        toId: to,
        message: message,
      },
    });
    console.log('messageccc', mess);
    // client.emit('chat:reciver', mess);
    client.to('user-' + to).emit('message', message);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('chat:connect')
  async getChat(
    @MessageBody() createChatDto: any,
    @ConnectedSocket() client: Socket,
    @ReqUser() user: User,
  ) {
    const { to } = createChatDto;
    const from = user.id;
    const message = await this.prisma.chat.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                fromId: from,
              },
              {
                toId: to,
              },
            ],
          },
          {
            AND: [
              {
                fromId: to,
              },
              {
                toId: from,
              },
            ],
          },
        ],
      },
    });
    client.emit('chat:reciver', message);
  }
}
