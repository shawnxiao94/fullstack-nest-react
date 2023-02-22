import { Injectable } from '@nestjs/common'
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm'

import { Repository, EntityManager, Like } from 'typeorm'
import { DeptEntity } from './entities/dept.entity'
import { ResultData } from '@/common/utils/result'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { AppHttpCode } from '@/common/enums/code.enum'

import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'

import { CreateDeptDto } from './dto/create-dept.dto'
import { UpdateDeptDto } from './dto/update-dept.dto'
import { FindListDto, InfoByIdDto, parentIdDto } from './dto/search.dto'

import { clone } from '@/common/utils'

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(DeptEntity)
    private readonly deptRepo: Repository<DeptEntity>,
    private readonly userService: UserService // 注意循环引用问题，dept里引用了userService就不能在user里引用deptService
  ) {}

  /** 创建部门 */
  async create(dto: CreateDeptDto): Promise<ResultData> {
    // 查询父部门是否存在
    if (dto.parentId !== 'root') {
      const existing = await this.deptRepo.findOne({ where: { id: dto.parentId } })
      if (!existing) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '上级部门不存在或已被删除，请修改后重新添加')
    }
    // 防止重复创建 start
    if (await this.deptRepo.findOne({ where: { code: dto.code } })) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '部门已存在，请调整后重新新增！')
    // 防止重复创建 end

    let deptEntity = new DeptEntity()
    deptEntity = clone(deptEntity, dto)
    if (dto.userId) {
      let leader = null
      const resUser = await this.userService.findInfoById({ id: dto.userId, requireRoles: false, requireDept: false })
      leader = resUser?.data?.id ? resUser.data : null //注意返回结果类型得为数据库实体
      deptEntity.leader = leader
    }
    deptEntity.createTime = new Date()
    deptEntity.updateTime = new Date()
    const dept = await this.deptRepo.create({
      ...deptEntity
    })
    const res = await this.deptRepo.save(dept)
    if (!res) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试')
    return ResultData.ok(res)
  }

  /** 关键词模糊查询所有部门 */
  async findListPage(dto: FindListDto): Promise<ResultData> {
    const { pageNumber, pageSize, keywords, status } = dto
    const where = {
      ...(status ? { status } : null),
      ...{ name: Like(`%${keywords}%`) },
      ...{ remark: Like(`%${keywords}%`) }
    }
    const departments = await this.deptRepo.findAndCount({
      where,
      order: { updateTime: 'DESC' },
      skip: pageSize * (pageNumber - 1),
      take: pageSize
    })
    return ResultData.ok({ list: departments[0], total: departments[1] })
  }

  /** 更新部门 */
  async updateById(dto: UpdateDeptDto): Promise<ResultData> {
    let deptEntity = await this.deptRepo.findOne({ where: { id: dto.id } })
    if (!deptEntity) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '当前部门不存在或已被删除')
    deptEntity = clone(deptEntity, dto, ['createTime'])
    if (dto.userId) {
      let leader = null
      const resUser = await this.userService.findInfoById({ id: dto.userId, requireRoles: false, requireDept: false })
      leader = resUser?.data?.id ? resUser.data : null //注意返回结果类型得为数据库实体
      deptEntity.leader = leader
    }
    deptEntity.updateTime = new Date()
    const res = await this.deptRepo.save(deptEntity)
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前部门更新失败，请稍后尝试')
    return ResultData.ok(res)
  }

  // 根据id查询部门
  async getInfoById(dto: InfoByIdDto): Promise<ResultData> {
    const { status, id, requireLeader = false, requireMembers = false } = dto
    const qb = await this.deptRepo.createQueryBuilder('sys_dept')
    if (requireLeader) {
      qb.leftJoinAndSelect('sys_dept.leader', 'leader')
    }
    if (requireMembers) {
      qb.leftJoinAndSelect('sys_dept.members', 'users')
    }
    qb.where('sys_dept.status = :status', { status }).andWhere('sys_dept.id = :id', { id })
    qb.orderBy('sys_dept.updateTime', 'DESC')
    const res = await qb.getOne()
    if (!res) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '当前部门不存在或已被删除')
    return ResultData.ok(res)
  }

  /** 删除部门 */
  async delete(id: string): Promise<ResultData> {
    const deptEntity = await this.deptRepo.findOne({ where: { id } })
    if (!deptEntity) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '部门不存在或已被删除')
    await this.deptRepo.remove(deptEntity)
    return ResultData.ok()
  }

  // 获取Tree
  async findTree(dto: parentIdDto): Promise<ResultData> {
    const result = await this.loopTree(dto)
    if (!result) return ResultData.fail(AppHttpCode.MENU_NOT_FOUND, '当前菜单不存在或已被删除')
    return ResultData.ok(result)
  }

  // 根据父id递归获取Tree
  async loopTree({ parentId, requireMembers = false }: parentIdDto): Promise<DeptEntity[]> {
    const qb = await this.deptRepo.createQueryBuilder('sys_dept')
    if (requireMembers) {
      qb.leftJoinAndSelect('sys_dept.members', 'users')
    }
    qb.where({ parentId }).orderBy('sys_dept.name', 'ASC')
    const result = await qb.getMany()
    // const result = await this.deptRepo.createQueryBuilder('sys_dept').where({ parentId }).orderBy('sort', 'ASC').getMany()
    const treeList: DeptEntity[] = new Array<DeptEntity>()
    for await (const info of result) {
      const children = await this.loopTree({ parentId: info.id, requireMembers })
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
