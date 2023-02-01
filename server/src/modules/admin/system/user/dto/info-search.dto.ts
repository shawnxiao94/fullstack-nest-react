import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty } from 'class-validator'

export class InfoSearchDto {
  @ApiProperty({
    description: '用户ID'
  })
  @IsString()
  @IsNotEmpty({ message: '缺少用户id' })
  @Type(() => String)
  id: string
}
