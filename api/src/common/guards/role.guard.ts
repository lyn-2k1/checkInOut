import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtAuthGuard } from './jwt.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;
    const { user } = context.switchToHttp().getRequest();

    return roles.some((role) => user.role === role);
  }
}
