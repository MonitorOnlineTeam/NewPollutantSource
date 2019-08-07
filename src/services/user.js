import { post, get } from '@/utils/request';
import request from '@/utils/request';

import Cookie from 'js-cookie';

import { async } from 'q';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return [];//request('/api/notices');
}

/**
 * 获取权限菜单
 */
export async function getMenuData() {
  // ;
  const body = {
    menu_id: '99dbc722-033f-481a-932a-3c6436e17245',
  };
  const result = await post(`/api/rest/PollutantSourceApi/AuthorApi/GetSysMenuByUserID`, body);
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

//  个人设置编辑用户
export async function editpersonaluser(params) {
  const body = {
    User_ID: params.UserId,
    User_Name: params.UserName,
    User_Sex: params.UserSex,
    Email: params.Email,
    Phone: params.Phone,
    SendPush: params.SendPush,
    AlarmType: params.AlarmType,
    AlarmTime: params.AlarmTime,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/EditUser', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

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
