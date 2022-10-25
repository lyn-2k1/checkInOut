import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from 'src/modules/auth/services/password.service';
import { SearchQueryDto } from '../dto/search.dto';
import { UserFillableFields } from '../entities/user.entity';
import { UserPayload } from '../payload/user.payload';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async getById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async getByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async getByEmailAndPass(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getByResetToken(token: string) {
    return await this.prisma.user.findFirst({ where: { resetToken: token } });
  }

  async getAdmin() {
    const users = await this.prisma.user.findMany({
      where: {
        role: Role.Admin,
      },
      select: {
        firstName: true,
        lastName: true,
        id: true,
      },
    });
    console.log('users', users);
    return users;
  }

  async create(payload: UserFillableFields): Promise<User> {
    const checkEmailExistence = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (checkEmailExistence) {
      throw new NotAcceptableException(
        'Another user with provided email already exists.',
      );
    }

    return await this.prisma.user.create({
      data: {
        email: payload.email,
        password: await this.passwordService.hashPassword(payload.password),
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: Role.User,
      },
    });
  }

  async updateToken(id: number, token: string): Promise<void> {
    const checkUserExistence = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUserExistence) {
      throw new NotAcceptableException('User does not exists.');
    }

    await this.prisma.user.update({
      where: { id },
      data: { resetToken: token },
    });
  }

  async updatePassword(id: number, password: string): Promise<void> {
    const checkUserExistence = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUserExistence) {
      throw new NotAcceptableException('User does not exists.');
    }
    const passHashed = await this.passwordService.hashPassword(password);
    await await this.prisma.user.update({
      where: { id },
      data: { password: passHashed },
    });
  }

  async update(id: number, payload: UserPayload): Promise<User> {
    const checkUserExistence = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!checkUserExistence) {
      throw new NotAcceptableException('User does not exists.');
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...payload,
        role: Role.User,
      },
    });
  }

  async search(params: SearchQueryDto): Promise<User[]> {
    return await this.prisma.user.findMany({
      skip: (params.page - 1) * params.limit,
      take: parseInt(`${params.limit}`),
      where: {
        email: { contains: params.search },
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  public async checkUserRole(id: number, role: Role): Promise<boolean> {
    const user = await this.getById(id);
    if (!user) throw new NotFoundException('User not found!');
    return user.role === role;
  }
}
