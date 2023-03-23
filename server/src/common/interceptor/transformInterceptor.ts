import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { Response, Request } from 'express'

import { Logger } from '../libs/log4js/log4j.util'

/** 每次请求的记数器 */
let requestSeq = 0
const check_list = ['/api/', '/nodeApi/']

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * 拦截器入口
   * @param context 上下文对象
   * @param next 后续调用函数
   * @returns
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> | Promise<Observable<any>> {
    /** 请求开始时间 */
    const start = Date.now()
    /** 当前环境 */
    const host = context.switchToHttp()
    /** 请求对象 */
    const req = host.getRequest<Request>()
    /** 响应对象 */
    const res = host.getResponse<Response>()
    /** 当前计数 */
    const seq = requestSeq++
    /** 当前URL */
    const url = req.url // req.path;
    return next.handle().pipe(
      map((data) => {
        res.header('Content-Type', 'application/json; charset=utf-8')
        /* 这里拦截POST返回的statusCode，它默认返回是201, 这里改为200 */
        if (res.statusCode === HttpStatus.CREATED && req.method === 'POST') {
          res.statusCode = HttpStatus.OK
        }
        const logFormat = `-----------------------------------------------------------------------
        Request original url: ${req.originalUrl}
        Method: ${req.method}
        IP: ${req.ip}
        User: ${JSON.stringify(req.user)}
        Response data: ${JSON.stringify(data.data)}
        -----------------------------------------------------------------------`
        Logger.info(logFormat)
        Logger.access(logFormat)
        return data
        // return {
        //   code: 200,
        //   status: 'OK',
        //   data
        // }
      })
    )
  }
}
