import { Controller, Get, Post, Body, Query, Patch, Put, Param, Delete, Req } from '@nestjs/common'
import { RoleService } from './role.service'
import { ApiOperation, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { ListSearchDto, InfoRoleDto } from './dto/list-search.dto'
import { ResultData } from '@/common/utils/result'
import { ApiResult } from '@/common/decorator/api-result.decorator'

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('add')
  @ApiOperation({ summary: '创建角色' })
  async create(@Body() dto: CreateRoleDto, @Req() req): Promise<ResultData> {
    return await this.roleService.create(dto)
  }

  @Post('list')
  @ApiOperation({ summary: '分页获取角色列表' })
  async findList(@Body() query: ListSearchDto): Promise<ResultData> {
    return await this.roleService.findList(query)
  }

  @Get('info')
  @ApiOperation({ summary: '获取角色信息' })
  async findByID(@Query() query: InfoRoleDto): Promise<ResultData> {
    return await this.roleService.findByID(query)
  }

  @ApiOperation({ summary: '更新角色' })
  @Put('update')
  async updateById(@Body() updateUserDto: UpdateRoleDto): Promise<ResultData> {
    return await this.roleService.updateById(updateUserDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @ApiResult()
  async remove(@Param('id') id: string): Promise<ResultData> {
    return await this.roleService.remove(id)
  }
}