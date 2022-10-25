import { Logger, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from 'nestjs-prisma';
import { join } from 'path';
import { AwsModule } from './common/aws/aws.module';
import { ConfigModule } from './common/config/config.module';
import { ConfigService } from './common/config/config.service';
// import { DatabaseModule } from './common/database/database.module';
import { loggingMiddleware } from './common/middlewares/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { CheckinModule } from './modules/checkin/checkinout.module';
import { CommentModule } from './modules/comment/comment.module';
import { MailModule } from './modules/mail/mail.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SocketModule } from './modules/socket/socket.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { dateTimeMiddleware } from './utils/datetimeprisa';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware(new Logger('PrismaMiddleware')),
          dateTimeMiddleware(),
        ], // configure your prisma middleware
      },
    }),
    ConfigModule,
    AuthModule,
    MailModule,
    CheckinModule,
    // DatabaseModule,
    CommentModule,
    TicketModule,
    SocketModule,
    NotificationModule,
    AwsModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
    }),
    ChatModule,
  ],
})
export class AppModule {
  static port: string | number;
  static isDev: boolean;

  constructor(private readonly config: ConfigService) {
    AppModule.port = config.get('PORT') ?? 3000;
    AppModule.isDev = config.isDev;
  }
}
