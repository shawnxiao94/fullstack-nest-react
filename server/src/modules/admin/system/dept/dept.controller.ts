import { Controller, Get, Post, Body, Put, Patch, Param, Delete } from '@nestjs/common'
import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'

import { ResultData } from '@/common/utils/result'
import { ApiResult } from '@/common/decorator/api-result.decorator'

import { DeptService } from './dept.service'
import { CreateDeptDto } from './dto/create-dept.dto'
import { UpdateDeptDto } from './dto/update-dept.dto'
import { FindListDto, InfoByIdDto, parentIdDto } from './dto/search.dto'

@ApiTags('部门模块')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post('add')
  @ApiOperation({ summary: '创建部门' })
  create(@Body() createDeptDto: CreateDeptDto): Promise<ResultData> {
    return this.deptService.create(createDeptDto)
  }
  @Post('list')
  @ApiOperation({ summary: '关键词模糊查询部门列表' })
  async findListPage(@Body() dto: FindListDto): Promise<ResultData> {
    return this.deptService.findListPage(dto)
  }

  @Put('updateById')
  @ApiOperation({ summary: '部门更新' })
  @ApiResult()
  async updateById(@Body() dto: UpdateDeptDto): Promise<ResultData> {
    return this.deptService.updateById(dto)
  }

  @ApiOperation({ summary: '根据id查询部门详情', description: '根据id查询部门' })
  @Post('getInfoById')
  async getById(@Body() dto: InfoByIdDto): Promise<ResultData> {
    return await this.deptService.getInfoById(dto)
  }

  @ApiOperation({ summary: '根据父级id获取组织架构树', description: '根据父级id获取组织架构树' })
  @Post('findTree')
  async findTree(@Body() dto: parentIdDto): Promise<ResultData> {
    return await this.deptService.findTree(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  @ApiResult()
  async delete(@Param('id') id: string): Promise<ResultData> {
    return this.deptService.delete(id)
  }
}
