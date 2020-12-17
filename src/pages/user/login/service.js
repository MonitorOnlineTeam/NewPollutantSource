import { post, get } from '@/utils/request';
import { encryptKey } from '@/utils/utils';
import Cookie from 'js-cookie';

import { async } from 'q';
import configToken from '@/config';
import { JSEncrypt } from 'jsencrypt';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

/**
 * 系统登录
 * @params {"UserAccount": "system","UserPwd": "system","RememberMe": true}
 */
export async function systemLogin(params) {
  // ;
  const defaults = {
    RememberMe: true,
    UserAccount: params.userName,
    UserPwd: params.password,
    MenuId: '99dbc722-033f-481a-932a-3c6436e17245', //子系统ID 固定  污染源在线监控
  };
  const body = Object.assign(defaults);
  const results = await get('/api/rest/PollutantSourceApi/SystemSettingApi/GetSystemConfigInfo'); //获取配置，判断配置是否开启明文传输0开启 1关闭
  if (results.Datas.ClearTransmission == 0) {
    // body.UserAccount = Base64.stringify(Utf8.parse(body.UserAccount))
    // body.UserPwd = Base64.stringify(Utf8.parse(body.UserPwd))
    // body.MenuId = Base64.stringify(Utf8.parse(body.MenuId))
    var encrypt = new window.JSEncrypt();
    encrypt.setPublicKey(encryptKey);
    body.UserAccount = encrypt.encrypt(body.UserAccount); //加密后的字符串
    body.UserPwd = encrypt.encrypt(body.UserPwd); //加密后的字符串
    body.MenuId = encrypt.encrypt(body.MenuId); //加密后的字符串
  }
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
