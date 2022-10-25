import {
  BadRequestException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { Ticket } from '../entities/ticket.entity';

import { CreateTicketPayload } from '../payloads/create-ticket.payload';
import { UpdateTicketPayload } from '../payloads/update-ticket.payload';
import { SearchQueryDto } from '../dto/search.dto';
import * as moment from 'moment';
import { NotificationService } from '../../notification/services/notification.service';
import { Role, TicketType } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TicketService {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(UserService)
    private readonly userRepository: UserService,
    private readonly prisma: PrismaService,
  ) {}

  async getByRecipientId(id: number, params: SearchQueryDto): Promise<any> {
    return await this.prisma.ticket.findMany({
      where: { recipientId: id },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        Recipient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getByAuthorId(userId: number, params: SearchQueryDto): Promise<any> {
    // TODO: pagination
    return await this.prisma.ticket.findMany({
      where: { userId: userId },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        Recipient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getByUserIdAndTicketId(userId: number, id: number): Promise<any> {
    return this.prisma.ticket.findUnique({
      where: {
        id,
      },
    });
  }

  async getByRecipientIdAndTicketId(userId: number, id: number): Promise<any> {
    return this.prisma.ticket.findUnique({ where: { id } });
  }

  async getTicketType(): Promise<string[]> {
    return Object.values(TicketType);
  }

  async getByTicketId(id: number): Promise<any> {
    return this.prisma.ticket.findUnique({ where: { id } });
  }

  async create(data: CreateTicketPayload): Promise<any> {
    if (data.authorId === data.recipientId)
      throw new NotAcceptableException('Unable to send ticket to self.');

    const checkRecipientRole = await this.userRepository.checkUserRole(
      data.recipientId,
      Role.User,
    );

    if (checkRecipientRole)
      throw new NotAcceptableException('Unable to send ticket to this user.');

    /* Checking if the ticket time is in conflict with the lastest ticket. */
    // const isConflict = await this.checkTicketTimeConflict(data);
    // if (isConflict)
    //   throw new NotAcceptableException('Ticket date is in conflict.');

    const isValid = this.validateTicketTime(data);
    if (!isValid) throw new NotAcceptableException('Ticket date is invalid.');
    const newTicket = await this.prisma.ticket.create({
      data: {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        title: data.title,
        content: data.content,
        recipientId: data.recipientId,
        userId: data.authorId,
        ticketType: data.ticketType,
      },
    });
    const ticket = await this.getByTicketId(newTicket.id);
    // await this.notificationService.create({
    //   content: `has sent you a ticket`,
    //   url: newTicket.id.toString(),
    //   authorId: data.authorId,
    //   recipients: [ticket.recipient],
    // });
    return;
  }

  async update(id: number, data: UpdateTicketPayload): Promise<void> {
    // Check ticket update permission
    // let ticket;
    // data.authorId
    //   ? (ticket = await this.ticketRepository.findOne({
    //       where: { id, authorId: data.authorId },
    //     }))
    //   : (ticket = await this.ticketRepository.findOne({
    //       where: { id, recipientId: data.recipientId },
    //     }));
    // if (!ticket) throw new NotFoundException('Ticket is not found');
    // // Check update condition
    // if (ticket.ticketStatus !== TicketStatus.PENDING)
    //   throw new NotAcceptableException(
    //     'This ticket is no longer be able to modify.',
    //   );
    // // await this.notificationService.create({
    // //   content: `has sent you a ticket`,
    // //   url: createdTicket.id.toString(),
    // //   authorId: data.authorId,
    // //   recipients: [ticket.recipient],
    // // });
    // // update
    // await this.ticketRepository.save({
    //   id,
    //   ...data,
    // });
  }

  async checkTicketTimeConflict(data: CreateTicketPayload): Promise<any> {
    // const lastestTicket = await this.ticketRepository.findOne({
    //   where: [
    //     { authorId: data.authorId, ticketStatus: TicketStatus.APPROVED },
    //     { authorId: data.authorId, ticketStatus: TicketStatus.PENDING },
    //   ],
    //   order: { endDate: 'DESC' },
    // });
    // if (!lastestTicket) return false;
    // const a = moment(lastestTicket.endDate);
    // const b = moment(data.startDate);
    // return b.diff(a, 'days') < 0;
  }

  validateTicketTime(data: CreateTicketPayload): boolean {
    const start = moment(data.startDate);
    const end = moment(data.endDate);
    return end.diff(start, 'seconds') >= 0;
  }
}
