import { WsException } from '@nestjs/websockets';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { createHmac } from 'crypto';
import { bool, boolean, object } from 'joi';
import { ConfigService } from '../../../common/config/config.service';
import { UserService } from '../../user/services/user.service';
import { TokenQueryDto } from '../dto/token.dto';
import { ForgotPayload } from '../payloads/forgot.payload';
import { LoginPayload } from '../payloads/login.payload';
import { ResetPayload } from '../payloads/reset.payload';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly passwordService: PasswordService,
  ) {}

  generateAccessToken(user: User): string {
    return this.jwtService.sign({ ...user });
  }
  async validateAccessToken(authToken: string) {
    const dt = this.jwtService.decode(authToken);
    if (!dt['id']) throw new WsException('Token invalid!');
    const user = await this.userService.getById(dt['id']);
    // console.log('user', user);
    return user;

    // throw new Error('Method not implemented.');
  }

  generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { ...user },
      {
        secret: this.configService.jwtRefreshTokenSecret,
        expiresIn: this.configService.jwtRefreshTokenExpiration,
      },
    );
  }

  generateResetToken(user: User): string {
    return this.jwtService.sign(
      { ...user },
      {
        expiresIn: '15m',
      },
    );
  }

  async refreshToken(token: string): Promise<string> {
    try {
      if (!token) throw new Error();
      const payload = this.jwtService.verify(token, {
        secret: this.configService.jwtRefreshTokenSecret,
      });

      if (!payload) throw new Error();
      const user = await this.userService.getById(payload.userId);
      if (!user) throw new Error();

      return this.generateAccessToken(user);
    } catch (err) {
      throw new UnauthorizedException('Token invalid. Please re-login now.');
    }
  }

  async validateUser({ email, password }: LoginPayload): Promise<User> {
    const user = await this.userService.getByEmailAndPass(email);
    if (!user) throw new UnauthorizedException('Invalid credentials.');
    const isValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Wrong email or password!');
    }
    return user;
  }

  async validateToken({ email }: LoginPayload): Promise<User> {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Token invalid!');
    }
    return user;
  }

  async forgot({ email }: ForgotPayload): Promise<any> {
    // Check user existance
    const user = await this.userService.getByEmail(email);
    if (!user) throw new NotFoundException('User not exist!');

    // Generate 15m token
    const token = this.generateResetToken(user);

    const url = `http://localhost:3001/account/recover?token=${token}`;
    // Send email
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Reset your password!',
        html: `Click <a href="${url}">here<a/> to reset your password.`,
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'Something wrong in sending email.',
        );
      });
    // Save token to db
    await this.userService.updateToken(user.id, token);
    return 'Please check your email!';
  }

  async reset(
    { password, password2 }: ResetPayload,
    params: TokenQueryDto,
  ): Promise<any> {
    if (password !== password2)
      throw new NotAcceptableException(
        'Password does not match the confirmed one.',
      );

    try {
      const user = await this.userService.getByResetToken(params.token);
      if (!user) throw new Error('User not exist!');
      await this.jwtService.verify(params.token);
      await this.userService.updatePassword(user.id, password);
      await this.userService.updateToken(user.id, '');

      return 'Password has been reset.';
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'Token expired. Please make another forgot password request.',
      );
    }
  }
}
