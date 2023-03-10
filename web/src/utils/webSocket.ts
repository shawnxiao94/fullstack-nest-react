export default class WebSocketClass {
  url: string
  msgCallback: Function
  name: string
  ws: any
  status: any
  num: number
  timer: number
  pingPong: string
  pongInterval: NodeJS.Timer
  /**
   * @description: 初始化实例属性，保存参数
   * @param {String} url ws的接口
   * @param {Function} msgCallback 服务器信息的回调传数据给函数
   * @param {String} name 可选值 用于区分ws，用于debugger
   */
  constructor(url: string, msgCallback: Function, name: string = 'default') {
    this.url = url
    this.msgCallback = msgCallback
    this.name = name
    this.ws = null // websocket对象
    this.status = null // websocket是否关闭
    this.num = 5
  }
  /**
   * @description: 初始化 连接websocket或重连webSocket时调用
   * @param {*} 可选值 要传的数据
   */
  connect() {
    // 新建 WebSocket 实例
    this.ws = new WebSocket(this.url)
    this.ws.onopen = () => {
      // 连接ws成功回调
      this.status = 'open'
      this.timer = +new Date()
      this.heartCheck()
    }
    // 监听服务器端返回的信息
    this.ws.onmessage = e => {
      // 把数据传给回调函数，并执行回调
      this.pingPong = 'pong'
      this.timer = +new Date()
      if (e.data !== 'heartbeat') {
        return this.msgCallback(e.data)
      }
    }
    // ws关闭回调
    this.ws.onclose = e => {
      this.closeHandle(e) // 判断是否关闭
    }
    // ws出错回调
    this.ws.onerror = e => {
      this.closeHandle(e) // 判断是否关闭
    }
  }
  heartCheck() {
    this.pongInterval = setInterval(() => {
      if (this.timer - new Date() > 5000) {
        this.closeHandle()
      }
    }, 10000)
  }
  // 发送信息给服务器
  sendHandle(data) {
    return this.ws.send(data)
  }
  closeHandle() {
    // 因为webSocket并不稳定，规定只能手动关闭(调closeMyself方法)，否则就重连
    // if (this.pingInterval !== undefined && this.pongInterval !== undefined) {
    // 清除定时器
    clearInterval(this.pongInterval)
    // }
    if (this.status !== 'close' && this.num > 0) {
      --this.num
      this.connect() // 重连
    } else {
      this.closeMyself()
    }
  }
  // 手动关闭WebSocket
  closeMyself() {
    this.status = 'close'
    return this.ws.close()
  }
}
