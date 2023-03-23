import { ApiProperty } from '@nestjs/swagger'
export class ResultData {
  constructor(code = 200, success = true, msg?: string, data?: any) {
    this.code = code
    this.success = success
    this.msg = msg || 'ok'
    this.data = data || null
  }

  @ApiProperty({ type: 'number', default: 200 })
  code: number

  @ApiProperty({ type: 'boolean', default: true })
  success: boolean

  @ApiProperty({ type: 'string', default: 'ok' })
  msg?: string

  data?: any

  static ok(data?: any, msg?: string): ResultData {
    return new ResultData(200, true, msg, data)
  }

  static fail(code: number, msg?: string, data?: any): ResultData {
    return new ResultData(code || 500, false, msg || 'fail', data)
  }
}
