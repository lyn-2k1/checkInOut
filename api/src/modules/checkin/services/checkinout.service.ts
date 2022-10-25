import { Injectable, NotAcceptableException } from '@nestjs/common';
import { SearchQueryDto } from '../dto/search.dto';
import { Between } from 'typeorm';
import { CheckinoutPayload } from '../payloads/checkinout.payload';
import { CheckOutHistoryService } from './checkout-history.service';
import { PrismaService } from 'nestjs-prisma';
import * as fs from 'fs';
import { Prisma } from '@prisma/client';
import { date } from 'joi';
import { formatDatePrisma, formatDateToUtc0 } from 'src/utils/datetimeprisa';
import * as moment from 'moment';
@Injectable()
export class CheckinService {
  constructor(
    private readonly checkoutHistoryService: CheckOutHistoryService,
    private readonly prisma: PrismaService,
  ) {}

  async getByUserId(id: number) {
    return this.prisma.checkin.findFirst({
      where: {
        userId: id,
        AND: [
          {
            createdAt: {
              gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
              ),
            },
          },
          {
            createdAt: {
              lte: new Date(),
            },
          },
        ],
      },
    });
  }

  async search(userId: number, data: SearchQueryDto) {
    console.log(
      '🚀 ~ file: checkinout.service.ts ~ line 41 ~ CheckinService ~ search ~ data',
      data,
    );
    if (!data.fromDate || !data.toDate) {
      return await this.prisma.checkin.findMany({ where: { userId } });
    }
    return await this.prisma.checkin.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: formatDateToUtc0(data.fromDate),
          lte: formatDateToUtc0(data.toDate),
        },
      },
    });
  }

  async checkTodayCheckedin(userId) {
    const data: SearchQueryDto = {
      fromDate: moment().format('YYYY-MM-DD'),
      toDate: moment().add(1, 'd').format('YYYY-MM-DD'),
    };
    const todayChecked = await this.search(userId, data);
    console.log(
      '🚀 ~ file: checkinout.service.ts ~ line 68 ~ CheckinService ~ checkTodayCheckedin ~ todayChecked',
      todayChecked,
    );

    return todayChecked; //todayChecked;
  }

  async checkIfCheckoutAllowed(id) {
    const lastestCheckout =
      await this.checkoutHistoryService.getLastestCheckout(id);
    if (lastestCheckout) {
      const diffMilisec =
        (new Date().getTime() - lastestCheckout.createdAt.getTime()) / 1000;
      const diffMinute = Math.abs(Math.round(diffMilisec / 60));
      return diffMinute >= 5;
    }
    return true;
  }

  private async saveBase64ToFile(base64string: string) {
    const base64Data = base64string.replace(/^data:image\/png;base64,/, '');
    fs.mkdir('images/', { recursive: true }, (err) => {
      if (err) throw err;
    });
    const imageName = `${+new Date()}.png`;
    fs.writeFile(`images/${imageName}`, base64Data, 'base64', function (err) {
      return null;
    });
    return imageName;
  }

  async create(data: CheckinoutPayload) {
    const todayChecked = await this.checkTodayCheckedin(data.userId);
    if (todayChecked.length > 0) {
      throw new NotAcceptableException('You have checked in today.');
    }
    const imageName = await this.saveBase64ToFile(data.image);
    if (!imageName)
      throw new NotAcceptableException('Can not convert base64 to image');

    const newCheck = {
      checkinImage: imageName,
      checkinLatitude: data.latitude,
      checkinLongitude: data.longitude,
      userId: data.userId,
    } as Prisma.CheckinCreateInput;

    const newCheckin = await this.prisma.checkin.create({
      data: newCheck,
    });
    return newCheckin;
  }

  async update(data: CheckinoutPayload) {
    const checkedInToday = await this.getByUserId(data.userId);
    if (!checkedInToday) {
      throw new NotAcceptableException(
        'You have not checked in today. Please check in.',
      );
    }
    const allowedCheckout = await this.checkIfCheckoutAllowed(
      checkedInToday.id,
    );
    if (!allowedCheckout) {
      throw new NotAcceptableException(
        `Checkout is on cooldown for 5 minutes since your last checkout.`,
      );
    }
    const imageName = await this.saveBase64ToFile(data.image);

    const [checkOutCreate, checkInUpdate] = await this.prisma.$transaction([
      this.prisma.checkoutHistory.create({
        data: {
          checkinId: checkedInToday.id,
          image: imageName,
        },
      }),
      this.prisma.checkin.update({
        where: { id: checkedInToday.id },
        data: {
          checkoutImage: imageName,
          checkoutLatitude: data.latitude,
          checkoutLongitude: data.longitude,
        },
      }),
    ]);
    return checkInUpdate;
  }
}
