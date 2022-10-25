import { Module } from '@nestjs/common';
import { CheckinController } from './controllers/checkin.controller';
import { CheckoutController } from './controllers/checkout.controller';
import { CheckinService } from './services/checkinout.service';
import { CheckOutHistoryService } from './services/checkout-history.service';

@Module({
  imports: [],
  exports: [CheckinService, CheckOutHistoryService],
  controllers: [CheckinController, CheckoutController],
  providers: [CheckinService, CheckOutHistoryService],
})
export class CheckinModule {}
