import { IoAdapter } from '@nestjs/platform-socket.io'
import { INestApplicationContext } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { ServerOptions, Server } from 'socket.io'

// https://stackoverflow.com/questions/69435506/how-to-pass-a-dynamic-port-to-the-websockets-gateway-in-nestjs
export class SocketIoAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext, private configService: ConfigService) {
    super(app)
  }

  create(port: number, options?: any): any {
    port = this.configService.get<number>('WS_PORT')
    options.path = this.configService.get<string>('WS_PATH')
    options.namespace = '/admin' // 客户端连接时注意这个命名空间
    return super.create(port, options)
  }

  createIOServer(port: number, options?: any): Server {
    port = this.configService.get<number>('WS_PORT')
    options.path = this.configService.get<string>('WS_PATH')
    // const origins = this.configService.get<string>(
    //   'SOCKETIO.SERVER.CORS.ORIGIN',
    // );
    // const origin = origins.split(',');
    // options.cors = { origin };
    options.namespace = '/admin'
    const io = super.createIOServer(port, options)
    return io
  }
}
