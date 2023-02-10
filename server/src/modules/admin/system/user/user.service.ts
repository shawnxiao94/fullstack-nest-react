import { Injectable, HttpStatus, HttpException } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { Repository, Like } from 'typeorm'
import { RedisService } from '@/common/libs/redis/redis.service'
import { ConfigService } from '@nestjs/config'
import { RoleService } from '../role/role.service'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindUserListDto } from './dto/find-user-list.dto'

import { ResultData } from '@/common/utils/result'
import { AppHttpCode } from '@/common/enums/code.enum'
import { instanceToPlain, plainToInstance } from 'class-transformer'

import { getRedisKey } from '@/common/utils'
import { RedisKeyPrefix } from '@/common/enums/redis-key-prefix.enum'
import ms from 'ms'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService
  ) {}
  /**
   * 账号密码注册
   * @param SignupDto
   */
  async register(signupDto: CreateUserDto): Promise<ResultData> {
    const { password, confirmPassword, mobile, username, email } = signupDto
    if (password !== confirmPassword) return ResultData.fail(AppHttpCode.USER_PASSWORD_INVALID, '两次输入密码不一致，请重试')
    // 防止重复创建 start
    if (await this.findOneByUsername(username)) return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '帐号已存在，请调整后重新注册！')
    if (mobile) {
      if (await this.usersRepository.findOne({ where: { mobile: mobile } })) {
        return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前手机号已存在，请调整后重新注册')
      }
    }
    if (email) {
      if (await this.usersRepository.findOne({ where: { email: email } })) return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前邮箱已存在，请调整后重新注册')
    }
    // 防止重复创建 end
    // const hash = await this.getPasswordHash(password); //实体里面去加密密码更好
    // 注意得create生成下才能触发实体里的BeforeInsert生命周期对入库前的password进行加密
    const newUser = await this.usersRepository.create({
      ...signupDto
    })
    const res = await this.usersRepository.save(newUser)
    return ResultData.ok(instanceToPlain({ id: res.id }))
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { username } })
  }

  getUserByMobile(mobile: string) {
    return this.usersRepository.find({
      where: {
        mobile
      }
    })
  }

  /** 查询单个用户 */
  async findOne(id: string): Promise<ResultData> {
    const user = await this.findOneById(id)
    if (!user) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该用户不存在或已删除')
    return ResultData.ok(instanceToPlain(user))
  }

  async findOneById(id: string): Promise<UserEntity> {
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, id)
    const result = await this.redisService.hGetAll(redisKey)
    // plainToInstance 去除 password slat
    let user = plainToInstance(UserEntity, result, { enableImplicitConversion: true })
    if (!user?.id) {
      user = await this.usersRepository.findOne({ where: { id } })
      user = plainToInstance(UserEntity, { ...user }, { enableImplicitConversion: true })
      await this.redisService.hmset(redisKey, instanceToPlain(user), parseInt(this.configService.get<string>('jwt.expiresIn')) / 1000)
    }
    return user
  }

  /** 查询用户列表， 查询 角色、部门,用户名等 */
  async findList(dto: FindUserListDto): Promise<ResultData> {
    const { pageNumber, pageSize, userName, status, roleId, hasCurrRole = 0, deptId, hasCurrDept = 0 } = dto
    if (roleId) {
      const result = await this.roleService.findUserByRoleId(roleId, pageNumber, pageSize, !!Number(hasCurrRole))
      return result
    }
    const where = {
      ...(status ? { status } : null),
      ...(userName ? { userName: Like(`%${userName}%`) } : null)
    }
    const users = await this.usersRepository.findAndCount({ where, order: { id: 'DESC' }, skip: pageSize * (pageNumber - 1), take: pageSize })
    return ResultData.ok({ list: instanceToPlain(users[0]), total: users[1] })
  }
}
