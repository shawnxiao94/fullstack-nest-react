import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { Logger } from '@nestjs/common'
import { AuthService } from './auth.service'
import { EVENT_OFFLINE, EVENT_ONLINE } from './ws.event'

/**
 * Admin WebSokcet网关，不含权限校验，Socket端只做通知相关操作
 */
@WebSocketGateway({
  cors: {
    // 如果要允许所有来源的跨域请求，可以将 origin 属性设置为 ' * '
    origin: '*',
    // origin: ['http://localhost:3301'], // 允许的来源
    methods: ['GET', 'POST'], // 允许的 HTTP 请求方法
    allowedHeaders: ['Authorization', 'Content-Type'], // 允许的请求头
    credentials: true // 允许发送认证信息（如 Cookie 等）
  },
  path: '/ws-api'
})
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  // 将服务器声明为 WebSocketServer 装饰器
  @WebSocketServer()
  public server: Server

  get socketServer(): Server {
    return this.server
  }

  constructor(private authService: AuthService) {}

  private logger: Logger = new Logger('WebSocket')

  afterInit(server: any) {
    // this.logger.log('WebSocket server started.')
  }

  /**
   * OnGatewayConnection
   */
  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client ${client.id} connected.`)
    try {
      this.authService.checkAdminAuthToken(client.handshake?.query?.token)
    } catch (e) {
      // no auth
      client.disconnect()
      return
    }
    // broadcast online
    client.broadcast.emit(EVENT_ONLINE)
  }

  /**
   * OnGatewayDisconnect
   */
  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client ${client.id} disconnected.`)
    client.broadcast.emit(EVENT_OFFLINE)
  }

  // 实现 sendMessageToClient 方法用于主动向客户端发送信息
  sendMessageToClient(client: Socket, message: string) {
    client.emit('message', message)
  }

  @SubscribeMessage('message') // 监听客户端发送的 'message' 事件
  handleMessage(client: Socket, message: string): void {
    // 广播通知所有客户端
    this.logger.log(`Received message "${message}" from client ${client.id}`)
    this.sendMessageToClient(client, message)
  }
}
