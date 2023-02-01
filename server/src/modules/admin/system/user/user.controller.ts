import { Controller, Get, Post, Body, Query, Req, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common'
import { UserService } from './user.service'
import { ApiOkResponse, ApiOperation, ApiBearerAuth, ApiSecurity, ApiTags, ApiQuery } from '@nestjs/swagger'

import { UserEntity } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InfoSearchDto } from './dto/info-search.dto'
import { FindUserListDto } from './dto/find-user-list.dto'

import { ResultData } from '@/common/utils/result'
import { ApiResult } from '@/common/decorator/api-result.decorator'

@ApiTags('用户模块')
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

  @Post('infoById')
  @ApiOperation({
    summary: '查询用户信息'
  })
  @ApiBearerAuth() // swagger文档设置token
  async findOne(@Body() dto: InfoSearchDto): Promise<ResultData> {
    return await this.userService.findOne(dto.id)
  }

  @Post('list')
  @ApiOperation({ summary: '查询用户列表' })
  @ApiResult(UserEntity, true, true)
  async findList(@Body() dto: FindUserListDto): Promise<ResultData> {
    return await this.userService.findList(dto)
  }
}
