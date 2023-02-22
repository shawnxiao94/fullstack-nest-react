import { Controller, Get, Post, Body, Query, Put, Req, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiOkResponse, ApiOperation, ApiBearerAuth, ApiSecurity, ApiTags, ApiQuery } from '@nestjs/swagger'

import { UserEntity } from './entities/user.entity'
import { CreateUserDto, AddUserDto } from './dto/create-user.dto'
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto'
import { InfoSearchDto, RetrieveUserDto, UpdateUserAvatarDto } from './dto/info-search.dto'
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

  // 根据 id 设置头像
  @Put('avatar/:id')
  @ApiOperation({ summary: '设置头像' })
  async updateAvatar(@Param() params: RetrieveUserDto, @Body() updateUserAvatar: UpdateUserAvatarDto): Promise<ResultData> {
    return await this.userService.updateAvatar({
      id: params.id,
      avatar: updateUserAvatar.avatar
    })
  }

  // 根据 id 重置密码
  @Put('resetPwd')
  @ApiOperation({ summary: '重置密码' })
  async resetPassword(@Body() dto: RetrieveUserDto): Promise<ResultData> {
    return await this.userService.resetPassword(dto)
  }

  // 根据 id 更新密码
  @Put('updatePwd')
  @ApiOperation({ summary: '更新密码' })
  async updatePassword(@Body() dto: UpdateUserPasswordDto): Promise<ResultData> {
    return await this.userService.updatePassword(dto)
  }

  @Post('infoById')
  @ApiOperation({
    summary: '根据ID查询用户信息及关联角色'
  })
  @ApiBearerAuth() // swagger文档设置token
  async findInfoById(@Body() dto: InfoSearchDto): Promise<ResultData> {
    return await this.userService.findInfoById(dto)
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
