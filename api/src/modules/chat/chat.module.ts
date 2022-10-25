import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [AuthModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
