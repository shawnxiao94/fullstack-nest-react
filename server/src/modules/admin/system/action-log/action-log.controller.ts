import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ActionLogService } from './action-log.service'

import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ResultData } from '@/common/utils/result'
import { ApiResult } from '@/common/decorator/api-result.decorator'

import { CreateActionLogDto } from './dto/create-action-log.dto'
import { UpdateActionLogDto } from './dto/update-action-log.dto'

@ApiTags('日志模块')
@Controller('log')
export class ActionLogController {
  constructor(private readonly actionLogService: ActionLogService) {}

  @Post()
  create(@Body() createActionLogDto: CreateActionLogDto) {
    return this.actionLogService.create(createActionLogDto)
  }

  @Get()
  findAll() {
    return this.actionLogService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionLogService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActionLogDto: UpdateActionLogDto) {
    return this.actionLogService.update(+id, updateActionLogDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actionLogService.remove(+id)
  }
}
