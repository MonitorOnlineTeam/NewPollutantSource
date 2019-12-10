import Cookie from 'js-cookie';
import config from '../config';

// const ip = isInnerIPFn();
// cg add 2018.4.1
const ws = getWebSocket(config.webSocketPushURL.split(',')[0],config.webSocketPushURL.split(',')[1]);
function getWebSocket(innerIp, outIp) {
  let wss = new WebSocket(`ws://${innerIp}/`);
  if(!innerIp){
    wss = new WebSocket(`ws://${outIp}/`);
  }
  
  return wss;
  
}
try {
  window.ws = ws;
} catch (e) {
  // console.log(e);
}

export function listen(callback) {
  try {
    ws.onopen = event => {
      const response = Cookie.get('currentUser');
      if (response) {
        const user = JSON.parse(response);
        if (user) {
          ws.send(user.UserAccount);
          // console.log(`onopen:${user.UserAccount}`);
        }
      }
    };

    ws.onclose = event => {
      // console.log('disconnected');
    };

    ws.onerror = event => {
      // console.log(event.data);
    };

    ws.onmessage = event => {
      // setTimeout(() => {
      //     const response = Cookie.get('currentUser');
      //     if (response) {
      //         const user = JSON.parse(response);
      //         if (user) {
      //             ws.send(user.UserAccount);
      //             console.log(`onmessage:${user.UserAccount}`);
      //         }
      //     }
      // }, 30000);

      callback(event.data);
    };
  } catch (e) {
    // console.log(e);
  }
}

/* 判断是否是内网IP */
function isInnerIPFn() {
  var returnIP = '';
  
  const innerIp = config.webSocketPushURL.split(',')[0];
  const outIp = config.webSocketPushURL.split(',')[1];
  var returnIP = '';
  // 获取当前页面url
  let curPageUrl = window.location.href;
  if (curPageUrl.indexOf('localhost') !== -1) {
    returnIP = innerIp;
  } else {
    const reg1 = /(http|ftp|https|www):\/\//g;// 去掉前缀
    curPageUrl = curPageUrl.replace(reg1, '');
    // console.log('curPageUrl-1  '+curPageUrl);

    const reg2 = /\:+/g;// 替换冒号为一点
    curPageUrl = curPageUrl.replace(reg2, '.');
    // console.log('curPageUrl-2  '+curPageUrl);
    curPageUrl = curPageUrl.split('.');// 通过一点来划分数组
    // console.log(curPageUrl);

    // console.log("curPageUrl=======", curPageUrl);
    const ipAddress = `${curPageUrl[0] }.${ curPageUrl[1] }.${curPageUrl[2] }.${curPageUrl[3]}`;
    // console.log("ipAddress=======", ipAddress);
    let isInnerIp = false;// 默认给定IP不是内网IP
    const ipNum = getIpNum(ipAddress);
    const aBegin = getIpNum('10.0.0.0');
    const aEnd = getIpNum('10.255.255.255');
    const bBegin = getIpNum('172.16.0.0');
    const bEnd = getIpNum('172.31.255.255');
    const dBegin = getIpNum('127.0.0.0');
    const dEnd = getIpNum('127.255.255.255');
    isInnerIp = isInner(ipNum, aBegin, aEnd) || isInner(ipNum, bBegin, bEnd) || isInner(ipNum, dBegin, dEnd);
    // console.log('是否是内网:' + isInnerIp);
    if (isInnerIp) {
      returnIP = innerIp;
    } else {
      returnIP = outIp;
    }
  }
  return returnIP;
}
function getIpNum(ipAddress) { /* 获取IP数 */
  const ip = ipAddress.split('.');
  const a = parseInt(ip[0]);
  const b = parseInt(ip[1]);
  const c = parseInt(ip[2]);
  const d = parseInt(ip[3]);
  const ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
  return ipNum;
}

function isInner(userIp, begin, end) {
  return (userIp >= begin) && (userIp <= end);
}
