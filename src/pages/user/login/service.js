import { post, get } from '@/utils/request';

import Cookie from 'js-cookie';

import { async } from 'q';
import configToken from '@/config'

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
    MenuId:'99dbc722-033f-481a-932a-3c6436e17245'//子系统ID 固定  污染源在线监控
  };
  const body = Object.assign(defaults);
  const result = await post('/api/rest/PollutantSourceApi/LoginApi/Login', body);
  if (result.IsSuccess && result.Datas) {
    Cookie.set(configToken.cookieName, result.Datas.Ticket);
  } else {
    Cookie.set(configToken.cookieName, "");
  }
  return result;
}


/**
 * 获取权限菜单
 */
export async function getFirstMenu() {
  // ;
  const body = {
    menu_id: '99dbc722-033f-481a-932a-3c6436e17245',
  };
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/GetSysMenuByUserID?authorCode=48f3889c-af8d-401f-ada2-c383031af92d', body);
  // ;
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
