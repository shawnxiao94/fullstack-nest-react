import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionLogService } from './action-log.service';
import { CreateActionLogDto } from './dto/create-action-log.dto';
import { UpdateActionLogDto } from './dto/update-action-log.dto';

@Controller('action-log')
export class ActionLogController {
  constructor(private readonly actionLogService: ActionLogService) {}

  @Post()
  create(@Body() createActionLogDto: CreateActionLogDto) {
    return this.actionLogService.create(createActionLogDto);
  }

  @Get()
  findAll() {
    return this.actionLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActionLogDto: UpdateActionLogDto) {
    return this.actionLogService.update(+id, updateActionLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actionLogService.remove(+id);
  }
}
