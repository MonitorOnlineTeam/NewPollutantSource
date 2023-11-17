import { post, get } from '@/utils/request';

import Cookie from 'js-cookie';

import { async } from 'q';
import configToken from '@/config';

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
    // MenuId:  "140496b1-ab85-474a-9278-3ca7c6df3f9b,99dbc722-033f-481a-932a-3c6436e17245", //子系统ID 固定  污染源在线监控
    MenuId:  0,
    IsAgree: params.IsAgree,
    VerificationStatus:params.verificationCode&&1,
    VerificationCode:params.verificationCode,
  };
  const body = Object.assign(defaults);
  const result = await post('/api/rest/PollutantSourceApi/LoginApi/Login', body,{credentials:'include'});
  if (result.IsSuccess && result.Datas) {
    Cookie.set(configToken.cookieName, result.Datas.Ticket);
  } else {
    Cookie.set(configToken.cookieName, '');
  }
  return result;
}


//手机验证
export async function PostMessageCode(body) {
  const result = await post('/api/rest/PollutantSourceApi/LoginApi/PostMessageCode', body,{credentials:'include'});
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
