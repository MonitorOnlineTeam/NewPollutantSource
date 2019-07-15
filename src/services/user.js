
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
  return request('/api/notices');
}


/**
 * 获取权限菜单
 */
export async function getMenuData() {
  // ;
  const body = {
    menu_id: '99dbc722-033f-481a-932a-3c6436e17245'
  };
  const result = await post(`/api/rest/PollutantSourceApi/AuthorApi/GetSysMenuByUserID`, body);
  // ;
  return result;
}
