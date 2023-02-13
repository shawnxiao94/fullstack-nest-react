import { HttpException, Injectable, HttpStatus } from '@nestjs/common'
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm'
import { Repository, DataSource, EntityManager, Like } from 'typeorm'
import { plainToInstance, instanceToPlain } from 'class-transformer'
import { RoleEntity } from './entities/role.entity'
import { UserEntity } from '../user/entities/user.entity'
import { MenuService } from '../menu/menu.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { KeywordsListPageDto, KeywordsListDto, InfoRoleDto } from './dto/list-search.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

import { ResultData } from '@/common/utils/result'
import { AppHttpCode } from '@/common/enums/code.enum'
import { UserType } from '@/common/enums/common.enum'
import { clone } from '@/common/utils'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly dataSource: DataSource,
    private readonly menuService: MenuService,
    @InjectEntityManager()
    private readonly roleManager: EntityManager
  ) {}

  /**
   * @param roleId 角色 id
   * @param isCorrelation 是否相关联， true 查询拥有当前 角色的用户， false 查询无当前角色的用户
   */
  async findUserByRoleId(roleId: string, page: number, size: number, isCorrelation: boolean): Promise<ResultData> {
    let res
    if (isCorrelation) {
      const qb = await this.roleRepository
        .createQueryBuilder('sys_role')
        .leftJoinAndSelect('sys_role.user_id', 'user_id')
        .leftJoinAndSelect('sys_role.tags', 'tag')
        .leftJoinAndSelect('sys_role.author', 'user')
        .orderBy('post.updateTime', 'DESC')

      // res = await this.dataSource
      //   .createQueryBuilder('sys_role')
      //   .leftJoinAndSelect('sys_user_role', 'ur', 'ur.user_id = su.id')
      //   .where('su.status = 1 and ur.role_id = :roleId', { roleId })
      //   .skip(size * (page - 1))
      //   .take(size)
      //   .getManyAndCount()
    } else {
      res = await this.dataSource
        .createQueryBuilder('sys_user', 'su')
        .where((qb: any) => {
          const subQuery = qb.subQuery().select(['sur.user_id']).from('sys_role', 'sur').where('sur.role_id = :roleId', { roleId }).getQuery()
          return `su.status = 1 and su.id not in ${subQuery}`
        })
        .skip(size * (page - 1))
        .take(size)
        .getManyAndCount()
    }
    return ResultData.ok({ list: instanceToPlain(res[0]), total: res[1] })
  }

  // 新增角色
  async create(dto: CreateRoleDto): Promise<ResultData> {
    // 防止重复创建 start
    if (await this.roleRepository.findOne({ where: { code: dto.code } })) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '角色已存在，请调整后重新新增！')
    // 防止重复创建 end
    let roleEntity = new RoleEntity()
    roleEntity = clone(roleEntity, dto)
    let menus = []
    const resMenu = await this.menuService.getByIds({ menuIds: dto.menuIds })
    menus = resMenu.data.length ? resMenu.data : []
    roleEntity.createTime = new Date()
    roleEntity.updateTime = new Date()
    // roleEntity.dataStatus = 1;
    roleEntity.menus = menus
    const res = await this.roleRepository.save(roleEntity)
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '角色创建失败，请稍后重试')
    return ResultData.ok()
  }

  // 根据id获取角色信息及关联的菜单
  async findInfoById({ id }: InfoRoleDto): Promise<ResultData> {
    const res = await this.roleRepository.find({ where: { id }, relations: ['menus'] })
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '该角色不存在或已删除')
    return ResultData.ok(res)
  }

  /** 模糊分页查询角色列表 */
  async findListPage(query: KeywordsListPageDto): Promise<ResultData> {
    const { pageNumber = 1, pageSize = 10, keywords, orderBy } = query
    const qb = await this.roleRepository.createQueryBuilder('sys_role').orderBy('sys_role.update_time', 'DESC')
    // 9827e1bc-dfb8-458d-8ebd-679358999d93超级管理员id
    // qb.where('sys_role.id != :id', { id: '9827e1bc-dfb8-458d-8ebd-679358999d93' })
    qb.andWhere('sys_role.name LIKE :name', { name: `%${keywords}%` }).orWhere('sys_role.remark LIKE :remark', { remark: `%${keywords}%` })
    qb.orderBy('sys_role.create_time', 'DESC')
    const count = await qb.getCount()
    qb.limit(pageSize)
    qb.offset(pageSize * (pageNumber - 1))
    const roles = await qb.getMany()
    return ResultData.ok({ list: roles, total: count })
  }

  /** 查询角色列表 */
  async findList(query: KeywordsListDto): Promise<ResultData> {
    const { keywords, orderBy } = query
    const result = await this.roleRepository.find({
      where: [{ name: Like(`%${keywords}%`) }, { remark: Like(`%${keywords}%`) }],
      order: {
        updateTime: 'DESC'
      }
    })

    return ResultData.ok(result)
  }

  // 根据id更新角色
  async updateById(dto: UpdateRoleDto): Promise<ResultData> {
    let roleEntity = await this.roleRepository.findOne({ where: { id: dto.id } })
    if (!roleEntity) return ResultData.fail(AppHttpCode.ROLE_NOT_FOUND, '当前角色不存在或已被删除')
    roleEntity = clone(roleEntity, dto, ['createTime'])
    const resMenu = await this.menuService.getByIds({ menuIds: dto.menuIds })
    const menus = resMenu.data.length ? resMenu.data : []
    roleEntity.menus = menus
    roleEntity.updateTime = new Date()
    // const updateRole = this.roleRepository.merge(existRole, newRole)
    const res = await this.roleRepository.save(roleEntity)
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前角色更新失败，请稍后尝试')
    return ResultData.ok(res)
  }

  async remove(id: string): Promise<ResultData> {
    const existing = await this.roleRepository.findOne({ where: { id } })
    if (!existing) return ResultData.fail(AppHttpCode.ROLE_NOT_FOUND, '当前角色不存在或已被删除')
    await this.roleRepository.remove(existing)
    return ResultData.ok()
  }
}
