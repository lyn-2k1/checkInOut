import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentPayload } from '../payloads/comment.payload';
import { UpdateCommentPayload } from '../payloads/update-comment.payload';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';

@Controller('comment')
@ApiTags('comment')
@ApiBearerAuth()
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({
    description: 'create comment',
  })
  async create(@ReqUser() user: User, @Body() data: CommentPayload) {
    data.userId = user.id;

    return {
      statusCode: HttpStatus.OK,
      message: 'Comment created successfully',
      data: await this.commentService.create(data),
    };
  }

  @Get(':id')
  @ApiOperation({
    description: 'get all comments by ticket id',
  })
  async getAllByTicketId(
    @ReqUser() user: User,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.commentService.getAllByTicketId(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({
    description: 'update a comment by id',
  })
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @ReqUser() user: User,
    @Body() data: UpdateCommentPayload,
  ) {
    data.userId = user.id;
    return {
      statusCode: HttpStatus.OK,
      message: 'Comment updated successfully',
      data: await this.commentService.update(id, data),
    };
  }

  @Delete(':id')
  @ApiOperation({
    description: 'delete a comment by id',
  })
  async remove(
    @ReqUser() user: User,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.commentService.remove(id, user.id);
  }
}
