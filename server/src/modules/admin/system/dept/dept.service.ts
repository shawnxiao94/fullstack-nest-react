import { Injectable } from '@nestjs/common'
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm'

import { Repository, EntityManager } from 'typeorm'
import { DeptEntity } from './entities/dept.entity'
import { ResultData } from '@/common/utils/result'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { AppHttpCode } from '@/common/enums/code.enum'

import { CreateDeptDto } from './dto/create-dept.dto'
import { UpdateDeptDto } from './dto/update-dept.dto'

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(DeptEntity)
    private readonly deptRepo: Repository<DeptEntity>,
    @InjectEntityManager()
    private readonly deptManager: EntityManager
  ) {}

  /** 创建部门 */
  async create(dto: CreateDeptDto): Promise<ResultData> {
    // 查询父部门是否存在
    if (dto.parentId !== '0') {
      const existing = await this.deptRepo.findOne({ where: { parentId: dto.parentId } })
      if (!existing) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '上级部门不存在或已被删除，请修改后重新添加')
    }

    // 防止重复创建 start
    if (await this.deptRepo.findOne({ where: { code: dto.code } })) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '部门已存在，请调整后重新新增！')

    // 防止重复创建 end

    const newDept = await this.deptRepo.create({
      ...dto
    })
    const res = await this.deptRepo.save(newDept)
    if (!res) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试')
    return ResultData.ok(instanceToPlain({ id: res.id }))

    // const dept = plainToInstance(DeptEntity, dto)
    // const res = await this.deptManager.transaction(async (transactionalEntityManager) => {
    //   return await transactionalEntityManager.save<DeptEntity>(dept)
    // })
    // if (!res) ResultData.fail(AppHttpCode.SERVICE_ERROR, '创建失败，请稍后重试')
    // return ResultData.ok(res)
  }

  /** 查询所有部门 */
  async find(): Promise<ResultData> {
    const depts = await this.deptRepo.find()
    return ResultData.ok(depts)
  }

  /** 更新部门 */
  async update(dto: UpdateDeptDto): Promise<ResultData> {
    const existing = await this.deptRepo.findOne({ where: { id: dto.id } })
    if (!existing) return ResultData.fail(AppHttpCode.ROLE_NOT_FOUND, '当前部门不存在或已被删除')

    const newDept = {
      ...existing,
      name: dto.name,
      remark: dto.remark,
      parent_id: dto.parentId,
      leader_user_id: dto.leader,
      status: dto.status,
      order_num: dto.orderNum
    }

    const updateDept = this.deptRepo.merge(existing, newDept)
    const res = await this.deptRepo.save(updateDept)
    if (!res) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '当前部门更新失败，请稍后尝试')
    return ResultData.ok(res)
  }

  /** 删除部门 */
  async delete(id: string): Promise<ResultData> {
    const existing = await this.deptRepo.findOne({ where: { id } })
    if (!existing) return ResultData.fail(AppHttpCode.ROLE_NOT_FOUND, '部门不存在或已被删除')
    await this.deptRepo.remove(existing)
    return ResultData.ok()

    // const existing = await this.deptRepo.findOne({ where: { id } })
    // if (!existing) return ResultData.fail(AppHttpCode.DEPT_NOT_FOUND, '部门不存在或已被删除')
    // const { affected } = await this.deptManager.transaction(async (transactionalEntityManager) => {
    //   await transactionalEntityManager.delete<DeptEntity>(DeptEntity, { parentId: id })
    //   return await transactionalEntityManager.delete<DeptEntity>(DeptEntity, id)
    // })
    // if (!affected) return ResultData.fail(AppHttpCode.SERVICE_ERROR, '删除部门失败，请稍后尝试')
    // return ResultData.ok()
  }
}
