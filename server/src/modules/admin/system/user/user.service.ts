import { Injectable, HttpStatus, HttpException } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { Repository, In, Like, Equal, Brackets } from 'typeorm'
import { RedisService } from '@/common/libs/redis/redis.service'
import { ConfigService } from '@nestjs/config'
import { RoleService } from '../role/role.service'
import { DeptService } from '../dept/dept.service'

import { CreateUserDto, AddUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InfoSearchDto } from './dto/info-search.dto'
import { FindUserListDto } from './dto/find-user-list.dto'

import { ResultData } from '@/common/utils/result'
import { AppHttpCode } from '@/common/enums/code.enum'
import { instanceToPlain, plainToInstance } from 'class-transformer'

import { getRedisKey } from '@/common/utils'
import { RedisKeyPrefix } from '@/common/enums/redis-key-prefix.enum'
import { plainToClass } from 'class-transformer'
import { clone } from '@/common/utils'
import ms from 'ms'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService
  ) {}
  /**
   * 账号密码注册
   * @param SignupDto
   */
  async register(signupDto: CreateUserDto): Promise<ResultData> {
    const { password, confirmPassword, mobile, account, email } = signupDto

    // 防止重复创建 start
    if (await this.usersRepository.findOne({ where: { account } })) return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '帐号已存在，请调整后重新注册！')
    if (mobile) {
      if (await this.usersRepository.findOne({ where: { mobile: mobile } })) {
        return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前手机号已存在，请调整后重新注册')
      }
    }
    if (email) {
      if (await this.usersRepository.findOne({ where: { email: email } })) return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前邮箱已存在，请调整后重新注册')
    }
    if (password !== confirmPassword) return ResultData.fail(AppHttpCode.USER_PASSWORD_INVALID, '两次输入密码不一致，请重试')
    // 防止重复创建 end
    // const hash = await this.getPasswordHash(password); //实体里面去加密密码更好
    // 注意得create生成下才能触发实体里的BeforeInsert生命周期对入库前的password进行加密
    const newUser = await this.usersRepository.create({
      ...signupDto
    })
    newUser.createTime = new Date()
    newUser.updateTime = new Date()
    const res = await this.usersRepository.save(newUser)
    return ResultData.ok(instanceToPlain({ id: res.id }))
  }

  // 新增用户账号
  async addAccount(dto: AddUserDto): Promise<ResultData> {
    if (!(dto.mobile || dto.email || dto.account)) {
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, '账号/手机号/邮箱必须有一个值不空！')
    }
    const model = plainToClass(UserEntity, dto)
    if (model.account) {
      if (await this.usersRepository.findOne({ where: { account: dto.account.trim() } })) {
        return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前account已存在！')
      }
    }
    if (model.mobile) {
      if (await this.usersRepository.findOne({ where: { mobile: dto.mobile.trim() } })) {
        return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前mobile已存在！')
      }
    }
    if (model.email) {
      if (await this.usersRepository.findOne({ where: { email: dto.email.trim() } })) {
        return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前email已存在！')
      }
    }
    //给新用户设置个默认密码：888888，用户登录后可以自行修改密码
    model.password = '888888'
    model.createTime = new Date()
    model.updateTime = new Date()
    let userId
    await this.usersRepository
      .createQueryBuilder()
      .insert() // 不接受任何参数
      .into(UserEntity) //
      .values(model) // 先更新关联以外的属性
      .execute() // 必须execute才会产生SQL送到DB
      .then(async (result) => {
        // Logger.log(result) // 到console看回传的格式
        userId = result.identifiers[0].id // 取得新增后回传的id
        // 以下更新关联属性
        await this.usersRepository
          .createQueryBuilder()
          .relation('sys_user', 'roles')
          .of(userId)
          .add(dto.roleIds)
          .then(async () => {
            if (dto.deptId) {
              await this.usersRepository
                .createQueryBuilder()
                .relation('sys_user', 'dept')
                .of(userId)
                .set(dto.deptId)
                .catch(async () => {
                  return await ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前用户关联部门新增失败，请稍后重试')
                })
            }
          })
          .catch(async () => {
            return await ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前用户关联角色新增失败，请稍后重试')
          })
      })
    return ResultData.ok()
  }

  /** 根据id更新用户信息及关联的角色 */
  async updateById(dto: UpdateUserDto): Promise<ResultData> {
    const { id, status, nickName, avatar, remark, sex, roleIds, deptId } = dto
    const resArr = await this.usersRepository.find({ where: { id }, relations: ['roles', 'dept'] })
    // const resArr = await this.usersRepository.createQueryBuilder().relation('sys_user', 'roles').of(id).loadMany()
    const userEntity = resArr[0]
    if (!userEntity) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前用户不存在或已被删除')

    // 更新非relation关联相关的数据查询语句
    const result = await this.usersRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ status, nickName, avatar, remark, sex, updateTime: new Date() })
      .where('id = :id', { id }) // 或者.whereInIds(id)
      .execute() // 執行d
    if (result.affected > 0) {
      // 更新有关联关系的数据查询语句
      await this.usersRepository
        .createQueryBuilder()
        // many-to-many
        .relation('sys_user', 'roles') // 指定载入relation
        .of(id) // 找对应的entity，可以是id或是queryed entity
        .addAndRemove(
          roleIds, // 第一个为新增的参数
          userEntity.roles.map((role) => role.id) // 第二个为需要删除的参数
        )
        .then(async () => {
          // one-to-many/many-to-one
          await this.usersRepository
            .createQueryBuilder()
            .relation('sys_user', 'dept')
            .of(id)
            .set(deptId ? deptId : null)
            .catch(async () => {
              return await ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前用户关联部门更新失败，请稍后重试')
            })
        })
        .catch(async (e) => {
          return await ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前用户关联角色更新失败，请稍后重试')
        })
      return await ResultData.ok(result)
    } else {
      return await ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前用户非关联信息更新失败，请稍后重试')
    }

    // let userEntity = await this.usersRepository.findOne({ where: { id: dto.id } })
    // if (!userEntity) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前用户不存在或已被删除')
    // userEntity = clone(userEntity, dto, ['createTime', 'mobile', 'email', 'account'])
    // const resRoles = await this.roleService.findInfosByIds({ ids: dto.roleIds, requireMenus: false, treeType: false })
    // const roles = resRoles.data.length ? resRoles.data : []
    // // let deptEntity = await this.deptService.getInfoById({ id: dto.deptId, status: 1, requireLeader: false, requireMembers: false })
    // // deptEntity = deptEntity?.data?.id ? deptEntity.data : null //注意返回结果类型得为数据库实体
    // userEntity.roles = roles
    // // userEntity.dept = deptEntity as any
    // userEntity.updateTime = new Date()
    // const res = await this.usersRepository.save(userEntity)
    // if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前用户信息更新失败，请稍后尝试')
    // return ResultData.ok(res)
    // return ResultData.ok()
  }

  /** 查询单个用户及关联的角色 */
  async findOne(dto: InfoSearchDto): Promise<ResultData> {
    const user = await this.findOneByIdFn(dto)
    if (!user) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '该用户不存在或已删除')
    return ResultData.ok(user)
  }

  // 走redis缓存
  async findOneByIdFn({ id, requireRoles = false, requireDept = false }: InfoSearchDto): Promise<UserEntity> {
    let res = null
    if (requireRoles || requireDept) {
      if (requireRoles && requireDept) {
        res = await this.usersRepository.find({ where: { id }, relations: ['roles', 'dept'] })
      } else {
        if (requireRoles) {
          res = await this.usersRepository.find({ where: { id }, relations: ['roles'] })
        }
        if (requireDept) {
          res = await this.usersRepository.find({ where: { id }, relations: ['dept'] })
        }
      }
    } else {
      res = await this.usersRepository.findOne({ where: { id } })
    }
    return res
    // const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, id)
    // const redisRes = await this.redisService.hGetAll(redisKey)
    // let res = null
    // if (!redisRes?.id || (redisRes?.id && !String(requireRoles).includes(String(redisRes?.requireRoles)))) {
    //   if (requireRoles || requireDept) {
    //     if (requireRoles && requireDept) {
    //       res = await this.usersRepository.find({ where: { id }, relations: ['roles', 'dept'] })
    //     } else {
    //       if (requireRoles) {
    //         res = await this.usersRepository.find({ where: { id }, relations: ['roles'] })
    //       }
    //       if (requireDept) {
    //         res = await this.usersRepository.find({ where: { id }, relations: ['dept'] })
    //       }
    //     }
    //   } else {
    //     res = await this.usersRepository.findOne({ where: { id } })
    //   }
    //   const user = plainToInstance(UserEntity, { ...res, requireRoles }, { enableImplicitConversion: true })
    //   await this.redisService.hmset(redisKey, instanceToPlain(user), parseInt(this.configService.get<string>('jwt.expiresIn')) / 1000)
    // }
    // return redisRes?.id && String(requireRoles).includes(String(redisRes?.requireRoles)) ? redisRes : res
  }

  /** 关键词模糊分页查询账户/昵称/备注&角色id、部门id对应的用户列表 */
  async findList(dto: FindUserListDto): Promise<ResultData> {
    const { pageNumber, pageSize, keywords, status, roleIds, deptId } = dto
    const qb = await this.usersRepository
      .createQueryBuilder('sys_user')
      .leftJoinAndSelect('sys_user.roles', 'roles')
      // .leftJoinAndSelect('sys_user.roles', 'roles', 'roles.id IN (:...roleIds)', { roleIds })
      .leftJoinAndSelect('sys_user.dept', 'dept')
      .where('sys_user.status = :status', { status })
      .andWhere(
        new Brackets((subQb) => {
          subQb
            .where('sys_user.account LIKE :account', { account: `%${keywords}%` })
            .orWhere('sys_user.nickName LIKE :nickName', { nickName: `%${keywords}%` })
            .orWhere('sys_user.remark LIKE :remark', { remark: `%${keywords}%` })
        })
      )
    if (roleIds.length) {
      qb.andWhere('roles.id IN (:...roleIds)', { roleIds })
    }
    if (deptId) {
      qb.andWhere('dept.id = :deptId', { deptId })
    }
    qb.orderBy('sys_user.updateTime', 'DESC')
    qb.addOrderBy('sys_user.account')
    qb.cache(60000) //缓存 1 min內

    const count = await qb.getCount()
    qb.limit(pageSize)
    qb.offset(pageSize * (pageNumber - 1))
    const users = await qb.getMany()
    return ResultData.ok({ list: users, total: count })

    // const where = {
    //   ...(status ? { status } : null),
    //   ...{ account: Like(`%${keywords}%`) },
    //   ...{ nickName: Like(`%${keywords}%`) },
    //   ...{ remark: Like(`%${keywords}%`) }
    //   // ...{ id: In(roleIds) }
    // }
    // const users = await this.usersRepository.findAndCount({
    //   where,
    //   order: { updateTime: 'DESC' },
    //   skip: pageSize * (pageNumber - 1),
    //   take: pageSize
    // })
    // return ResultData.ok({ list: instanceToPlain(users[0]), total: users[1] })
    // return ResultData.ok()
  }

  async remove(id: string): Promise<ResultData> {
    const existing = await this.usersRepository.findOne({ where: { id } })
    if (!existing) return ResultData.fail(AppHttpCode.USER_NOT_FOUND, '当前用户不存在或已被删除')
    await this.usersRepository.remove(existing)
    return ResultData.ok()
  }
}
