import { Controller, Get, Post, Body, Put, Patch, Param, Delete } from '@nestjs/common'
import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'

import { ResultData } from '@/common/utils/result'
import { ApiResult } from '@/common/decorator/api-result.decorator'

import { DeptService } from './dept.service'
import { CreateDeptDto } from './dto/create-dept.dto'
import { UpdateDeptDto } from './dto/update-dept.dto'

@ApiTags('部门模块')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post('add')
  @ApiOperation({ summary: '创建部门' })
  create(@Body() createDeptDto: CreateDeptDto): Promise<ResultData> {
    return this.deptService.create(createDeptDto)
  }
  @Get('list')
  @ApiOperation({ summary: '查询部门列表' })
  async find(): Promise<ResultData> {
    return this.deptService.find()
  }

  @Put()
  @ApiOperation({ summary: '部门更新' })
  @ApiResult()
  async update(@Body() dto: UpdateDeptDto): Promise<ResultData> {
    return this.deptService.update(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  @ApiResult()
  async delete(@Param('id') id: string): Promise<ResultData> {
    return this.deptService.delete(id)
  }
}
