## mywebsocket 工具类

对`websocket`使用的封装

##说明

- config.webSocketPushURL：联网程序配置的 websocket 地址
- user.User_Account：当前登录人的账号

## 使用

全局监听 websocket 消息

- data：监听到的 socket 包信息
- saveFeed：接收到消息后续的 effect 操作

默认配置如下:

```javascript
import * as service from '../dvapack/websocket/mywebsocket';

subscriptions: {
    feedSubscriber({dispatch}) {
      return service.listen((data) => {
        dispatch({type: 'saveFeed', payload: {
            data
          }});
      });
    }
}

```
