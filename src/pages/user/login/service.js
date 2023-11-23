import { post, get } from '@/utils/request';

import Cookie from 'js-cookie';

import { async } from 'q';
import configToken from '@/config';
import { API } from '@config/API'
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
  const result = await post(API.LoginApi.Login, body,{credentials:'include'});
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
export async function getToken(params) {
  const urlencoded = encodeURI(
    `client_id=WryWebClient&client_secret=Web_P@ssw0rd_!@#$%&grant_type=password&username=${params.username}&password=${params.password}`,
  );
  const result = await post(API.LoginApi.Token, urlencoded, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
  });
  return result;
}