import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/common/typeorm/typeorm-ex.module';
import { PasswordService } from '../auth/services/password.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, PasswordService],
})
export class UserModule {}
