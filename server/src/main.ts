import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'

import { AppModule } from './app.module'

import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpExceptionFilter } from './common/filter/http-exception.filter'
import { TransformInterceptor } from './common/interceptor/transformInterceptor'

import { setupSwagger } from './setupSwagger'

const GlobalPrefix = 'nestApi'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  //设置全局前缀
  app.setGlobalPrefix(GlobalPrefix)
  // 注册全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  // 注册全局错误的拦截器
  app.useGlobalInterceptors(new TransformInterceptor())
  // 全局注册一下管道ValidationPipe;
  app.useGlobalPipes(new ValidationPipe())

  // 设置swagger文档
  setupSwagger(app)

  await app.listen(process.env.SERVER_PORT, '0.0.0.0')
  const serverUrl = await app.getUrl()
  Logger.log(`api服务已经启动,请访问: ${serverUrl}/${GlobalPrefix}`)
  Logger.log(`API文档已生成,请访问: ${serverUrl}/${process.env.SWAGGER_PATH}/`)
  Logger.log(`ws服务已经启动,请访问: http://localhost:${process.env.WS_PORT}${process.env.WS_PATH}`)
}
bootstrap()