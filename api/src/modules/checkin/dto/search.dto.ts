import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiPropertyOptional({ type: Date })
  fromDate: string;

  @ApiPropertyOptional({ type: Date })
  toDate: string;
}
