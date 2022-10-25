import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, TicketStatus } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { SearchQueryDto } from '../dto/search.dto';
import { CreateTicketPayload } from '../payloads/create-ticket.payload';
import { UpdateTicketPayload } from '../payloads/update-ticket.payload';
import { TicketService } from '../services/ticket.service';

@Controller('ticket')
@ApiTags('ticket')
@ApiBearerAuth()
@UsePipes(ValidationPipe)
@UseGuards(RolesGuard)
@Roles(Role.User)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  @ApiOperation({
    summary: '(ADMIN only)',
    description: 'get all tickets',
  })
  @Roles(Role.Admin)
  async getAll(@ReqUser() user: User, @Query() params: SearchQueryDto) {
    return await this.ticketService.getByRecipientId(user.id, params);
  }

  @Get('/me')
  @Roles(Role.User)
  @ApiOperation({
    summary: '(USER only)',
    description: 'get all tickets of current user',
  })
  async getAllByUserId(
    @ReqUser() user: User,
    @Query() params: SearchQueryDto,
  ): Promise<any> {
    return {
      data: await this.ticketService.getByAuthorId(user.id, params),
    };
  }

  @Get('/type')
  @Roles(Role.Admin, Role.User)
  @ApiOperation({
    description: 'get all tickets type',
  })
  async getTicketType() {
    return await this.ticketService.getTicketType();
  }

  @Get(':id')
  @ApiOperation({
    description: 'get ticket details by ticket id',
  })
  @Roles(Role.Admin, Role.User)
  async getByTicketId(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<any> {
    return await this.ticketService.getByTicketId(id);
  }

  @Post()
  @ApiOperation({
    summary: '(USER only)',
    description: 'create ticket',
  })
  async createTicket(
    @ReqUser() user: User,
    @Body() data: CreateTicketPayload,
  ): Promise<any> {
    data.authorId = user.id;
    return {
      statusCode: HttpStatus.OK,
      message: 'Ticket created successfully',
      data: await this.ticketService.create(data),
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: '(USER only)',
    description: 'update ticket',
  })
  async updateTicket(
    @ReqUser() user: User,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() data: UpdateTicketPayload,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Ticket updated successfully',
      data: await this.ticketService.update(id, {
        authorId: user.id,
        // ticketStatus: TicketStatus.PENDING,
        ...data,
      }),
    };
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: '(USER only)',
    description: 'cancel ticket',
  })
  async cancelTicket(
    @ReqUser() user: User,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Ticket cancelled successfully',
      data: await this.ticketService.update(id, {
        authorId: user.id,
        // ticketStatus: TicketStatus.CANCELLED,
      }),
    };
  }

  @Patch(':id/reject')
  @ApiOperation({
    summary: '(ADMIN only)',
    description: 'reject ticket',
  })
  @Roles(Role.Admin)
  async rejectTicket(
    @ReqUser() user: User,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Ticket rejected successfully',
      data: await this.ticketService.update(id, {
        recipientId: user.id,
        // ticketStatus: TicketStatus.REJECTED,
      }),
    };
  }

  @Patch(':id/approve')
  @ApiOperation({
    summary: '(ADMIN only)',
    description: 'approve ticket',
  })
  @Roles(Role.Admin)
  async approveTicket(
    @ReqUser() user: User,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Ticket approved successfully',
      data: await this.ticketService.update(id, {
        recipientId: user.id,
        // ticketStatus: TicketStatus.APPROVED,
      }),
    };
  }
}
