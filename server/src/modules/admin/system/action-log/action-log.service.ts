import { Injectable } from '@nestjs/common';
import { CreateActionLogDto } from './dto/create-action-log.dto';
import { UpdateActionLogDto } from './dto/update-action-log.dto';

@Injectable()
export class ActionLogService {
  create(createActionLogDto: CreateActionLogDto) {
    return 'This action adds a new actionLog';
  }

  findAll() {
    return `This action returns all actionLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} actionLog`;
  }

  update(id: number, updateActionLogDto: UpdateActionLogDto) {
    return `This action updates a #${id} actionLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} actionLog`;
  }
}
