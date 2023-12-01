import request, { post, get } from '@/utils/request';


import Cookie from 'js-cookie';

import { async } from 'q';

import config from '@/config';

import { API } from '@config/API'

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return [];// request('/api/notices');
}

/**
 * 获取权限菜单
 */
export async function getMenuData() {
  // ;
  const body = {
    // menu_id: sessionStorage.getItem('sysMenuId'),
    menu_id: Cookie.get('sysMenuId'),
  };
  const result = await post(API.MenuApi.GetSysMenuByUserId, body);
  // ;
  return result;
}

// 根据id获取用户实体
export async function getUserInfo(params) {
  const body = {
    UserId: params.UserId,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/GetUserInfo', body, null);
  return result === null
    ? {
      data: null,
    }
    : result;
}

// //  个人设置编辑用户
// export async function editpersonaluser(params) {
//   const body = {
//     User_ID: params.UserId,
//     User_Name: params.UserName,
//     User_Sex: params.UserSex,
//     Email: params.Email,
//     Phone: params.Phone,
//     SendPush: params.SendPush,
//     AlarmType: params.AlarmType,
//     AlarmTime: params.AlarmTime,
//   };
//   const result = post('/api/rest/PollutantSourceApi/PUserInfo/EditUser', body, null);
//   return result === null
//     ? {
//       data: null,
//     }
//     : result;
// }

// 获取登陆配置信息
export async function getSystemConfigInfo() {
  const body = {};
  const result = authorpost(
    '/api/rest/PollutantSourceApi/SystemSettingApi/getLoginInfo?authorCode=48f3889c-af8d-401f-ada2-c383031af92d',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}

// 验证旧密码是否一致
export async function vertifyOldPwd(params) {
  const result = await post(API.LoginApi.VertifyOldPwd, params);

  return result;
}

// 修改密码
export async function changePwd(params) {
  const result = await post(API.LoginApi.ChangePwd, params);

  return result;
}

// 获取角色或部门报警权限数据
export async function getAlarmPushAuthor(params) {
  const result = await get('/api/rest/PollutantSourceApi/AuthorApi/GetAlarmPushAuthor', params);

  return result;
}

// 获取角色或部门报警权限数据
export async function insertAlarmPushAuthor(params) {
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/InsertAlarmPushAuthor', params);
  return result;
}
// 是否显示预警多选框
export async function getAlarmState(params) {
  const result = await get('/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmState', params);
  return result;
}

/**
 * 获取企业
 */
export async function getEnterpriseList(params) {
  const result = await post(`/api/rest/PollutantSourceApi/MonitorTargetApi/GetTargetList?regionCode=${params.regionCode}&pollutantTypeCode=${params.pollutantTypeCode}`, {}, null);
  return result === null ? { data: null } : result;
}

/**
 * 获取下载手机端二维码信息
 */
export async function GetAndroidOrIosSettings(params) {
  const result = await get('/api/rest/PollutantSourceApi/SystemSettingApi/GetAndroidOrIosSettings', params);
  return result;
}


/**
 * 用户恢复
 */
export async function RecoveryUser(params) {
  const result = await post(API.AssetManagementApi.RecoveryUserInfo, params);
  return result;
}