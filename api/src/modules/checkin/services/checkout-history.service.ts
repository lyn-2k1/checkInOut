import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CheckOutHistoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(id: number, image: string) {
    const history = await this.prisma.checkoutHistory.create({
      data: {
        checkinId: id,
        image,
      },
    });
    return history;
  }
  async getLastestCheckout(id) {
    return await this.prisma.checkoutHistory.findFirst({
      where: { checkinId: id },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
