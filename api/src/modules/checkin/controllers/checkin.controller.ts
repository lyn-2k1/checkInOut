import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UsePipes,
  UseGuards,
  ValidationPipe,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { CheckinService } from '../services/checkinout.service';
import { CheckinoutPayload } from '../payloads/checkinout.payload';
import { SearchQueryDto } from '../dto/search.dto';
import { Role } from '@prisma/client';
import * as moment from 'moment';
import { TicketService } from 'src/modules/ticket/services/ticket.service';

@Controller('checkin')
@ApiTags('check in')
@ApiBearerAuth()
@UsePipes(ValidationPipe)
@UseGuards(RolesGuard)
@Roles(Role.User)
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Get()
  @ApiOperation({
    summary: '(USER only)',
    description: 'get all checkin',
  })
  async getCheckin(@ReqUser() user, @Query() data: SearchQueryDto) {
    return await this.checkinService.search(user.id, data);
  }
  @Get('today')
  @ApiOperation({
    summary: '(USER only)',
    description: 'get all checkin',
  })
  async getCheckinToday(@ReqUser() user) {
    const data: SearchQueryDto = {
      fromDate: moment().format('YYYY-MM-DD'),
      toDate: moment().add(1, 'd').format('YYYY-MM-DD'),
    };
    console.log(
      '🚀 ~ file: checkin.controller.ts ~ line 50 ~ CheckinController ~ getCheckinToday ~ data',
      data,
    );

    return await this.checkinService.search(user.id, data);
  }

  @Post()
  @ApiOperation({
    summary: '(USER only)',
    description: 'check in action',
  })
  async checkin(@ReqUser() user, @Body() data: CheckinoutPayload) {
    data.userId = user.id;
    return {
      statusCode: HttpStatus.OK,
      message: 'Checked in successfully',
      data: await this.checkinService.create(data),
    };
  }
}
