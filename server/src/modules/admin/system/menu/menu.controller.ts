import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto, IdNameDto } from './dto/update-menu.dto'
import {
  ListSearchDto,
  ListPageSearchDto,
  InfoIdDto,
  MenuIdsDto,
  parentMenuIdDto
} from './dto/list-search.dto'

import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ResultData } from '@/common/utils/result'
import { ApiResult } from '@/common/decorator/api-result.decorator'

@ApiBearerAuth()
@ApiTags('菜单模块')
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

  @ApiOperation({ summary: '根据父级id获取菜单树', description: '根据父级id获取菜单Tree' })
  @Post('getMenuTree')
  async getMenuTree(@Body() dto: parentMenuIdDto): Promise<ResultData> {
    return await this.menuService.getMenuTree(dto)
  }

  @ApiOperation({ summary: '查询菜单列表', description: '查询菜单列表' })
  @Post('list')
  async findList(@Body() dto: ListSearchDto): Promise<ResultData> {
    return await this.menuService.findList(dto)
  }

  @ApiOperation({ summary: '分页查询菜单列表', description: '分页查询菜单列表' })
  @Post('listPage')
  async listPage(@Body() dto: ListPageSearchDto): Promise<ResultData> {
    return await this.menuService.findListPage(dto)
  }

  @ApiOperation({ summary: '根据id查询菜单', description: '根据id查询菜单' })
  @Post('getById')
  async getById(@Body() dto: InfoIdDto): Promise<ResultData> {
    return await this.menuService.getById(dto)
  }

  @ApiOperation({ summary: '根据ids查询菜单', description: '根据ids查询菜单' })
  @Post('getByIds')
  async getByIds(@Body() dto: MenuIdsDto): Promise<ResultData> {
    return await this.menuService.getByIds(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @ApiResult()
  async delete(@Param('id') id: string): Promise<ResultData> {
    return await this.menuService.deleteMenu(id)
  }
}
