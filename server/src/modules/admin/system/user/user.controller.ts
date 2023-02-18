import { Controller, Get, Post, Body, Query, Req, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiOkResponse, ApiOperation, ApiBearerAuth, ApiSecurity, ApiTags, ApiQuery } from '@nestjs/swagger'

import { UserEntity } from './entities/user.entity'
import { CreateUserDto, AddUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InfoSearchDto } from './dto/info-search.dto'
import { FindUserListDto } from './dto/find-user-list.dto'

import { ResultData } from '@/common/utils/result'
import { ApiResult } from '@/common/decorator/api-result.decorator'

@ApiTags('管理员模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '用户注册'
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() signupDto: CreateUserDto): Promise<ResultData> {
    return this.userService.register(signupDto)
  }

  @ApiOperation({
    summary: '新增用户账号'
  })
  @Post('/add')
  async addAccount(@Body() dto: AddUserDto): Promise<ResultData> {
    return this.userService.addAccount(dto)
  }

  @ApiOperation({
    summary: '更新用户信息',
    description: '更新用户信息'
  })
  @Post('/update')
  async updateById(@Body() dto: UpdateUserDto): Promise<ResultData> {
    return this.userService.updateById(dto)
  }

  @Post('infoById')
  @ApiOperation({
    summary: '根据ID查询用户信息及关联角色'
  })
  @ApiBearerAuth() // swagger文档设置token
  async findOne(@Body() dto: InfoSearchDto): Promise<ResultData> {
    return await this.userService.findOne(dto)
  }

  @Post('list')
  @ApiOperation({ summary: '查询用户列表' })
  @ApiResult(UserEntity, true, true)
  async findList(@Body() dto: FindUserListDto): Promise<ResultData> {
    return await this.userService.findList(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiResult()
  async remove(@Param('id') id: string): Promise<ResultData> {
    return await this.userService.remove(id)
  }
}
