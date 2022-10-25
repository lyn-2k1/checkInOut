import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AdminUserPayload {
  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional()
  role?: Role;
}
