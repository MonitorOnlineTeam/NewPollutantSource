/* eslint-disable import/prefer-default-export */
/**
 * 功  能：系统登录
 * 创建人：吴建伟
 * 创建时间：2019.07.12
 */

import Cookie from 'js-cookie';
import { post, get } from '@/utils/request';
import { async } from 'q';
import { API } from '@config/API'

/**
 * 获取登录配置信息
 * @params {}
 */
export async function getSystemLoginConfigInfo() {
  const result = await get(API.SystemApi.GetSystemConfigInfo);

  return result;
}

/**
 * 手机端下载特殊情况
 * @params {}
 */
export async function IfSpecial() {
  const result = await get(API.SystemApi.IfSpecial);
  return result;
}

export async function newLogin(body) {
  const result = await post('/newApi/rest/PollutantSourceApi/LoginApi/Login', body);
  return result;
}

export async function getToken(params) {
  const urlencoded = encodeURI(
    `client_id=WryWebClient&client_secret=Web_P@ssw0rd_!@#$%&grant_type=password&username=${params.username}&password=${params.password}`,
  );
  const result = await post('/newApi/rest/PollutantSourceOAuth/connect/token', urlencoded, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
  });
  if (result) {
    Cookie.set('newToken', result.access_token);
    params.callback && params.callback();
  } else {
    Cookie.set('newToken', '');
  }
  return result;
}
