import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/tasks/create-task.dto';
import { UpdateTaskDto } from '../dto/tasks/update-task.dto';
import { QueryTaskDto } from '../dto/tasks/query-task.dto';
import { Response } from '../common/utils/response.util';
import { DefaultMessages } from '../common/constants/message.constants';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateTaskDto) {
    const task = await this.tasksService.create(req.user.userId, dto);
    return Response.success(DefaultMessages.TASKS.CREATED, task);
  }

  @Get()
  async findAll(@Req() req: any, @Query() query: QueryTaskDto) {
    const data = await this.tasksService.findAll(req.user.userId, query);
    return Response.success(DefaultMessages.TASKS.LISTED, data);
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const task = await this.tasksService.update(req.user.userId, id, dto);
    return Response.success(DefaultMessages.TASKS.UPDATED, task);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const result = await this.tasksService.softDelete(req.user.userId, id);
    return Response.success(DefaultMessages.TASKS.DELETED, result);
  }
}


