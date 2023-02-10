import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto, IdNameDto } from './dto/update-menu.dto'

import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ResultData } from '@/common/utils/result'
import { ApiResult } from '@/common/decorator/api-result.decorator'

@ApiBearerAuth()
@ApiTags('系统菜单管理')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('add')
  @ApiOperation({ summary: '创建菜单', description: '新增菜单' })
  async create(@Body() createMenuDto: CreateMenuDto): Promise<ResultData> {
    return await this.menuService.create(createMenuDto)
  }

  @ApiOperation({ summary: '更新菜单', description: '修改菜单' })
  @Put('update')
  async updateById(@Body() updateDto: UpdateMenuDto): Promise<ResultData> {
    return await this.menuService.updateById(updateDto)
  }

  @ApiOperation({ summary: '修改菜单name', description: '修改菜单name' })
  @Put('updateName')
  async updateNameById(@Body() idNameDto: IdNameDto): Promise<ResultData> {
    return await this.menuService.updateNameById(idNameDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @ApiResult()
  async delete(@Param('id') id: string): Promise<ResultData> {
    return await this.menuService.deleteMenu(id)
  }
}
