## description

> 基于 RABC 权限通用后台管理系统-给角色动态分配权限和用户

```
1.角色、用户、动态权限菜单
2.加解密通信：主体是后端公钥加密私钥解密
后端接口返回信息加密方案是：通过前端的公钥进行加密接口信息传输给到客户端且加签名，客户端通过客户端私钥进行解密
```

后端技术栈：nestjs9+typeOrm+mysql2+redis

前端技术栈：react17+ant-design+jsencrypt+socket.io-client+ reduxjs/toolkit+vite3

登录界面
![登录界面](https://gitee.com/front-learn/fullstack-nest-react/blob/master/web/public/2.jpg)

菜单管理
![菜单管理界面](https://gitee.com/front-learn/fullstack-nest-react/blob/master/web/public/1.jpg)

菜单新增
![菜单新增](https://gitee.com/front-learn/fullstack-nest-react/blob/master/web/public/5.jpg)

用户管理
![用户管理界面](https://gitee.com/front-learn/fullstack-nest-react/blob/master/web/public/3.jpg)

角色管理
![角色管理](https://gitee.com/front-learn/fullstack-nest-react/blob/master/web/public/4.jpg)

角色新增界面
![角色新增界面](https://gitee.com/front-learn/fullstack-nest-react/blob/master/web/public/6.jpg)

用户新增界面,通信加密
![用户新增界面,通信加密](https://gitee.com/front-learn/fullstack-nest-react/blob/master/web/public/7.jpg)

设置界面
![设置界面](https://gitee.com/front-learn/fullstack-nest-react/blob/master/web/public/8.jpg)
