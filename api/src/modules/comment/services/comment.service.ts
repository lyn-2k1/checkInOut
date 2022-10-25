import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { SocketService } from 'src/modules/socket/socket.service';
import { TicketService } from 'src/modules/ticket/services/ticket.service';
import { Comment } from '../entities/comment.entity';
import { CommentPayload } from '../payloads/comment.payload';
import { UpdateCommentPayload } from '../payloads/update-comment.payload';

@Injectable()
export class CommentService {
  constructor(
    private readonly ticketService: TicketService,
    private readonly socketService: SocketService,
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  async checkOwnership(userId: number, ticketId: number) {
    const check = await this.ticketService.getByUserIdAndTicketId(
      userId,
      ticketId,
    );
    const check2 = await this.ticketService.getByRecipientIdAndTicketId(
      userId,
      ticketId,
    );
    if (check.length === 0 && check2.length === 0) return false;
    return true;
  }

  async create(data: CommentPayload) {
    // check user ownership & check user in recipients
    const checkOwnership = await this.checkOwnership(
      data.userId,
      data.ticketId,
    );
    if (!checkOwnership)
      throw new ForbiddenException(
        'You are not allowed to comment on this ticket!',
      );
    //DDoi ten thanh author roi ma no van send user a ?
    // const newComment = await this.commentRepository.create(data);
    // console.log({ data });

    // const newComment = await this.prisma.comment.create({
    //   data: data,
    // });
    // const ticket = await this.ticketService.getByTicketId(data.ticketId);
    // await this.notificationService.create({
    //   content: `has commented on your ticket`,
    //   url: data.ticketId.toString(),
    //   authorId: data.userId,
    //   recipients: [ticket.recipient],
    // });

    // return ticket;
    return {};
  }

  async getAllByTicketId(userId: number, ticketId: number): Promise<any> {
    const checkOwnership = await this.checkOwnership(userId, ticketId);
    if (!checkOwnership)
      throw new ForbiddenException(
        'You are not allowed to comment on this ticket!',
      );

    return await this.prisma.comment.findMany({
      where: { ticketId: ticketId },
    });
  }

  async findOneByIdAndUserId(id: number, userId: number): Promise<any> {
    return await this.prisma.comment.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateCommentPayload) {
    // const comment = await this.findOneByIdAndUserId(id, data.userId);
    // if (!comment) throw new NotFoundException('Comment not exist!');
    // comment.content = data.content;
    // return await this.commentRepository.save(comment);
  }

  async remove(id: number, userId: number) {
    // const comment = await this.findOneByIdAndUserId(id, userId);
    // if (!comment) throw new NotFoundException('Comment not exist!');
    // return await this.commentRepository.delete(id);
  }
}
