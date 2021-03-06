import { post, get } from '@/utils/request';
import { encryptKey } from '@/utils/utils';
import Cookie from 'js-cookie';

import { async } from 'q';
import configToken from '@/config';
// import { JSEncrypt } from 'jsencrypt';
// import {CryptoJS} from 'crypto-js';
var CryptoJS = require("crypto-js");

/**
 * 系统登录
 * @params {"UserAccount": "system","UserPwd": "system","RememberMe": true}
 */
export async function systemLogin(params) {
  const defaults = {
    RememberMe: true,
    UserAccount: params.userName,
    UserPwd: params.password,
    MenuId: params.MenuId,
    LoginFlag: true
  };
  let body = Object.assign(defaults);  
  const result = await post('/api/rest/PollutantSourceApi/LoginApi/Login', body);
  if (result.IsSuccess && result.Datas) {
    Cookie.set(configToken.cookieName, result.Datas.Ticket);
  } else {
    Cookie.set(configToken.cookieName, '');
  }
  return result;
}

// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }
// export async function getFakeCaptcha(mobile) {
//   return request(`/api/login/captcha?mobile=${mobile}`);
// }
