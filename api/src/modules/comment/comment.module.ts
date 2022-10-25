import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';
import { TicketModule } from '../ticket/ticket.module';
import { SocketModule } from '../socket/socket.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TicketModule, SocketModule, NotificationModule],
  exports: [CommentService],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
