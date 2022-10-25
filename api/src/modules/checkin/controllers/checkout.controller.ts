import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CheckinoutPayload } from '../payloads/checkinout.payload';
import { CheckinService } from '../services/checkinout.service';

@Controller('checkout')
@ApiTags('check out')
@ApiBearerAuth()
@UsePipes(ValidationPipe)
@UseGuards(RolesGuard)
@Roles(Role.User)
export class CheckoutController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  @ApiOperation({
    summary: '(USER only)',
    description: 'check out action',
  })
  async checkout(@ReqUser() user, @Body() data: CheckinoutPayload) {
    data.userId = user.id;
    return {
      statusCode: HttpStatus.OK,
      message: 'Checked out successfully',
      data: await this.checkinService.update(data),
    };
  }
}
