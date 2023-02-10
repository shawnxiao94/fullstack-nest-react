import { Injectable } from '@nestjs/common'
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm'
import { Repository, Equal } from 'typeorm'

import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto, IdNameDto } from './dto/update-menu.dto'

import { ResultData } from '@/common/utils/result'

import { MenuEntity } from './entities/menu.entity'
import { AppHttpCode } from '@/common/enums/code.enum'
import { plainToClass } from 'class-transformer'
import { clone } from '@/common/utils'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>
  ) {}

  // 创建菜单
  async create(dto: CreateMenuDto): Promise<ResultData> {
    if (dto.parentId !== '0') {
      // 查询当前父级菜单是否存在
      const parentMenu = await this.menuRepository.findOne({ where: { id: dto.parentId } })
      if (!parentMenu) return ResultData.fail(AppHttpCode.MENU_NOT_FOUND, '当前父级菜单不存在，请调整后重新添加')
    }
    const model = plainToClass(MenuEntity, dto)
    const isRepeat = await this.menuRepository
      .createQueryBuilder()
      .orWhere({ name: Equal(model.name.trim()) })
      // .orWhere({ Permission: Equal(model.Permission.trim()) })
      .getCount()
    if (isRepeat > 0) {
      return ResultData.fail(AppHttpCode.SERVICE_ERROR, '路由名称重复！')
    }
    const result = await this.menuRepository.save(model)
    return ResultData.ok(result)
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
      .createQueryBuilder()
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
    if (!existing) return ResultData.fail(AppHttpCode.ROLE_NOT_FOUND, '当前菜单不存在或已删除')
    await this.menuRepository.remove(existing)
    return ResultData.ok()
  }
}
