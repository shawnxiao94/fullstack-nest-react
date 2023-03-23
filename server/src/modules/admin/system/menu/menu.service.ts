import { Injectable } from '@nestjs/common'
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm'
import { Repository, Equal, Brackets, Like, In, IsNull, Not } from 'typeorm'

import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto, IdNameDto } from './dto/update-menu.dto'
import {
  ListSearchDto,
  ListPageSearchDto,
  InfoIdDto,
  MenuIdsDto,
  parentMenuIdDto
} from './dto/list-search.dto'

import { ResultData } from '@/common/utils/result'

import { MenuEntity } from './entities/menu.entity'
import { AppHttpCode } from '@/common/enums/code.enum'
import { clone } from '@/common/utils'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>
  ) {}

  // 创建菜单
  async create(dto: CreateMenuDto): Promise<ResultData> {
    if (dto.parentId !== 'root') {
      // 查询当前父级菜单是否存在
      const parentMenu = await this.menuRepository.findOne({ where: { id: dto.parentId } })
      if (!parentMenu)
        return ResultData.fail(AppHttpCode.MENU_NOT_FOUND, '当前父级菜单不存在，请调整后重新添加')
    }
    if (~~dto.type !== 2 && !dto.path.length) {
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, '非按钮的菜单的path不能为空')
    }
    if (await this.menuRepository.findOne({ where: { name: dto.name.trim() } })) {
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前name已存在！')
    }

    if (dto.type !== 2) {
      if (await this.menuRepository.findOne({ where: { path: dto.path.trim() } })) {
        return ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前path已存在！')
      }
    }
    const newData = await this.menuRepository.create({
      ...dto,
      isIframe: dto?.isIframe ? dto.isIframe : false,
      isLink: dto?.isLink ? dto.isLink : ''
    })
    const res = await this.menuRepository.save(newData)
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '菜单创建失败，请稍后重试')
    return ResultData.ok(res.id)
  }

  // 更新菜单
  async updateById(dto: UpdateMenuDto): Promise<ResultData> {
    let exit = await this.menuRepository.findOne({ where: { id: dto.id } })
    if (!exit) return ResultData.fail(AppHttpCode.ROLE_NOT_FOUND, '当前菜单不存在或已被删除')

    exit = clone(exit, dto, ['createTime'])
    exit.updateTime = new Date()
    const res = await this.menuRepository.save(exit)
    return ResultData.ok(res)
  }

  // 修改菜单name
  async updateNameById(dto: IdNameDto): Promise<ResultData> {
    const result = await this.menuRepository
      .createQueryBuilder('sys_menu')
      .update()
      .set({
        name: dto.name
      })
      .where('id = :id', { id: dto.id })
      .execute()
    if (result.affected > 0) {
      return await ResultData.ok(result)
    } else {
      return await ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前菜单更新失败，请稍后重试')
    }
  }

  // 删除菜单
  async deleteMenu(id: string): Promise<ResultData> {
    const existing = await this.menuRepository.findOne({ where: { id } })
    if (!existing) return ResultData.fail(AppHttpCode.MENU_NOT_FOUND, '当前菜单不存在或已删除')
    const res = await this.menuRepository.findOne({ where: { parentId: id } })
    if (res)
      return ResultData.fail(
        AppHttpCode.PARAM_INVALID,
        '当前菜单有关联子集暂不能删除，请先解除父子关联'
      )
    await this.menuRepository.remove(existing)
    return ResultData.ok()
  }

  // 根据id查询菜单
  async getById(dto: InfoIdDto): Promise<ResultData> {
    const existing = await this.menuRepository.findOne({ where: { id: dto.id } })
    if (!existing) return ResultData.fail(AppHttpCode.MENU_NOT_FOUND, '当前菜单不存在或已删除')
    return ResultData.ok(existing)
  }

  // 根据ids查询菜单
  async getByIds(dto: MenuIdsDto): Promise<ResultData> {
    const existing = await this.menuRepository.find({ where: { id: In(dto.menuIds) } })
    if (!existing) return ResultData.fail(AppHttpCode.MENU_NOT_FOUND, '当前菜单不存在或已删除')
    return ResultData.ok(existing)
  }

  // 查询菜单列表
  async findList(dto: ListSearchDto): Promise<ResultData> {
    const { keywords } = dto
    const data = await this.menuRepository.find({
      where: [{ name: Like('%' + keywords + '%') }, { title: Like('%' + keywords + '%') }],
      order: {
        id: 'DESC'
      }
    })
    return ResultData.ok(data)
  }

  // 查询所有菜单列表（除按钮外）
  async findAllList(): Promise<ResultData> {
    const data = await this.menuRepository.find({
      where: { perms: Not(IsNull()), type: 2 },
      order: {
        id: 'DESC'
      }
    })
    return ResultData.ok(data)
  }

  // 分页查询菜单列表
  async findListPage(dto: ListPageSearchDto): Promise<ResultData> {
    const { pageNumber = 1, pageSize = 10, keywords } = dto
    // createQueryBuilder写法
    // const qb = await this.menuRepository.createQueryBuilder('sys_menu').orderBy('sys_menu.update_time', 'DESC')
    // qb.where('sys_menu.name LIKE :name', { name: `%${keywords}%` }).orWhere('sys_menu.title LIKE :title', { title: `%${keywords}%` })
    // qb.orderBy('sys_menu.create_time', 'DESC')
    // const count = await qb.getCount()
    // qb.limit(pageSize)
    // qb.offset(pageSize * (pageNumber - 1))
    // const data = await qb.getMany()
    // return ResultData.ok({ list: data, total: count })

    // findAndCount写法
    const data = await this.menuRepository.findAndCount({
      where: [{ title: Like('%' + keywords + '%') }, { name: Like('%' + keywords + '%') }],
      order: {
        updateTime: 'DESC'
      },
      skip: pageNumber - 1,
      take: pageSize
    })
    return ResultData.ok({ data: data[0], total: data[1], pageSize, current: pageNumber })
  }

  // 根据父id获取菜单Tree
  async getMenuTree(dto: parentMenuIdDto): Promise<ResultData> {
    const result = await this.loopMenuTree(dto.parentId)
    if (!result) return ResultData.fail(AppHttpCode.MENU_NOT_FOUND, '当前菜单不存在或已被删除')
    return ResultData.ok(result)
  }

  // 根据父id递归获取菜单Tree
  async loopMenuTree(parentId: string): Promise<MenuEntity[]> {
    const result = await this.menuRepository
      .createQueryBuilder()
      .where({ parentId })
      .orderBy('sort', 'ASC')
      .getMany()
    const treeList: MenuEntity[] = new Array<MenuEntity>()
    for await (const info of result) {
      const children = await this.loopMenuTree(info.id)
      const node: any = {
        id: info.id,
        ...info,
        children: []
      }
      if (children.length) {
        node.children = children
      }
      treeList.push(node)
    }
    return treeList
  }
}
