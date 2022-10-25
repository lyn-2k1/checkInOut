import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [UserModule, NotificationModule],
  exports: [TicketService],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
