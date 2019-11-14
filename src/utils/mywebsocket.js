import Cookie from 'js-cookie';
import config from '../config';

 // cg add 2018.4.1
 const ws = new WebSocket(`ws://${config.webSocketPushURL}/`);
try {
window.ws = ws;
} catch(e) {
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
    } catch(e) {
      // console.log(e);
    }
}
