import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from '../schemas/task.schema';
import { CreateTaskDto } from '../dto/tasks/create-task.dto';
import { UpdateTaskDto } from '../dto/tasks/update-task.dto';
import { QueryTaskDto } from '../dto/tasks/query-task.dto';
import { DefaultMessages } from 'src/common/constants/message.constants';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) {}

  async create(userId: string, dto: CreateTaskDto) {
    const now = new Date();
    const task = await this.taskModel.create({
      title: dto.title,
      description: dto.description,
      status: dto.status ?? TaskStatus.TODO,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      userId: new Types.ObjectId(userId),
      createdBy: new Types.ObjectId(userId),
      updatedBy: new Types.ObjectId(userId),
      createdAt: now,
      updatedAt: now,
    } as any);

    const populated = await task.populate([
      { path: 'userId', select: 'firstName lastName email' },
      { path: 'createdBy', select: 'firstName lastName email' },
      { path: 'updatedBy', select: 'firstName lastName email' },
      { path: 'deletedBy', select: 'firstName lastName email' },
    ]);
    return this.toResponse(populated as TaskDocument);
  }

  async findAll(userId: string, query: QueryTaskDto) {
    const filter: FilterQuery<TaskDocument> = { userId: new Types.ObjectId(userId), isDeleted: false } as any;

    if (query.status) {
      filter.status = query.status;
    }
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }
    if (query.startDate || query.endDate) {
      const dueDate: any = {};
      if (query.startDate) dueDate.$gte = new Date(query.startDate);
      if (query.endDate) dueDate.$lte = new Date(query.endDate);
      filter.dueDate = dueDate;
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.taskModel
        .find(filter)
        .sort({ dueDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate([
          { path: 'userId', select: 'firstName lastName email' },
          { path: 'createdBy', select: 'firstName lastName email' },
          { path: 'updatedBy', select: 'firstName lastName email' },
          { path: 'deletedBy', select: 'firstName lastName email' },
        ])
        .lean(),
      this.taskModel.countDocuments(filter),
    ]);

    return {
      items: items.map(this.toResponseLean),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    const task = await this.taskModel.findById(id);
    if (!task || task.isDeleted) {
      throw new NotFoundException(DefaultMessages.TASKS.NOT_FOUND);
    }
    if (task.userId.toString() !== userId) {
      throw new ForbiddenException(DefaultMessages.TASKS.NOT_ALLOWED);
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.dueDate !== undefined) task.dueDate = dto.dueDate ? new Date(dto.dueDate) : undefined;
    task.updatedBy = new Types.ObjectId(userId);
    task.updatedAt = new Date();

    await task.save();
    const populated = await task.populate([
      { path: 'userId', select: 'firstName lastName email' },
      { path: 'createdBy', select: 'firstName lastName email' },
      { path: 'updatedBy', select: 'firstName lastName email' },
      { path: 'deletedBy', select: 'firstName lastName email' },
    ]);
    return this.toResponse(populated as TaskDocument);
  }

  async softDelete(userId: string, id: string) {
    const task = await this.taskModel.findById(id);
    if (!task || task.isDeleted) {
      throw new NotFoundException('Task not found');
    }
    if (task.userId.toString() !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    task.isDeleted = true;
    task.deletedAt = new Date();
    task.deletedBy = new Types.ObjectId(userId);
    task.updatedBy = new Types.ObjectId(userId);
    task.updatedAt = new Date();
    await task.save();
    return { id: task._id };
  }

  private toResponse(doc: TaskDocument) {
    return {
      id: doc._id,
      title: doc.title,
      description: doc.description ?? null,
      status: doc.status,
      dueDate: doc.dueDate ?? null,
      user: this.toUserRef((doc as any).userId),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      createdBy: this.toUserRef((doc as any).createdBy),
      updatedBy: this.toUserRef((doc as any).updatedBy),
    };
  }

  private toResponseLean = (doc: any) => {
    return {
      id: doc._id,
      title: doc.title,
      description: doc.description ?? null,
      status: doc.status,
      dueDate: doc.dueDate ?? null,
      user: this.toUserRef(doc.userId),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      createdBy: this.toUserRef(doc.createdBy),
      updatedBy: this.toUserRef(doc.updatedBy),
    };
  };

  private toUserRef(user: any) {
    if (!user) return null;
    // if populated object
    if (typeof user === 'object' && user._id) {
      return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
    }
    // if ObjectId
    if (typeof user === 'string' || user instanceof Types.ObjectId) {
      return { id: user };
    }
    return null;
  }
}



