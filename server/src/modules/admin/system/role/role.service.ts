import { HttpException, Injectable, HttpStatus } from '@nestjs/common'
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm'
import { Repository, DataSource, Like, In } from 'typeorm'
import { instanceToPlain } from 'class-transformer'
import { RoleEntity } from './entities/role.entity'
import { MenuEntity } from '../menu/entities/menu.entity'
import { MenuService } from '../menu/menu.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { KeywordsListPageDto, KeywordsListDto, InfoRoleDto, InfoArrRoleDto } from './dto/list-search.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

import { ResultData } from '@/common/utils/result'
import { AppHttpCode } from '@/common/enums/code.enum'
import { clone, flatArrToTree } from '@/common/utils'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly dataSource: DataSource,
    private readonly menuService: MenuService
  ) {}

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
  async findInfoById({ id, requireMenus = false, treeType = false }: InfoRoleDto): Promise<ResultData> {
    let res = null
    if (requireMenus) {
      res = await this.roleRepository.find({ where: { id }, relations: ['menus'] })
      if (treeType) {
        res = await this.getRouteTree(res)
      }
    } else {
      res = await this.roleRepository.find({ where: { id } })
    }
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '该角色不存在或已删除')

    return ResultData.ok(res)
  }

  // 根据ids数组获取角色信息及关联的菜单
  async findInfosByIds({ ids, requireMenus = false, treeType = false }: InfoArrRoleDto): Promise<ResultData> {
    let res = null
    if (requireMenus) {
      res = await this.roleRepository.find({ where: { id: In(ids) }, relations: ['menus'] })
      if (treeType) {
        res = await this.getRouteTree(res)
      }
    } else {
      res = await this.roleRepository.find({ where: { id: In(ids) } })
    }
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '该角色不存在或已删除')

    return ResultData.ok(res)
  }

  //获取前端路由Tree
  private async getRouteTree(data: RoleEntity[]): Promise<RoleEntity[]> {
    if (!data?.length) {
      return []
    }
    const result = []
    data.forEach((item: RoleEntity) => {
      const obj = { ...item, menus: [] }
      if (item?.menus?.length) {
        item.menus.forEach((menu: MenuEntity) => {
          const router = {
            id: menu.id,
            parentId: menu.parentId,
            name: menu.name,
            path: menu.path,
            componentPath: menu.componentPath,
            redirect: menu.redirect,
            meta: {
              title: menu.title,
              icon: menu.icon,
              hidden: menu.hidden,
              keepalive: menu.keepalive,
              type: menu.type,
              isLink: menu.isLink,
              isIframe: menu.isIframe,
              level: menu.level,
              sort: menu.sort,
              openMode: menu.openMode
            },
            children: []
          }
          obj.menus.push(router)
        })
        const tmp = flatArrToTree(obj.menus)
        obj.menus = [...tmp]
      }
      result.push(obj)
    })
    return result
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
