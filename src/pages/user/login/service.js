import { post, get } from '@/utils/request';
import { API } from '@config/API'
import { encryptKey } from '@/utils/utils';
import Cookie from 'js-cookie';
import request from 'umi-request';
import { async } from 'q';
import config from '@/config';
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
    LoginFlag: 'true'
  };
  let body = Object.assign(defaults);
  const result = await post(API.LoginApi.Login, body);
  // if (result.isSuccess && result.datas) {
  //   Cookie.set(configToken.cookieName, result.Datas.Ticket);
  // } else {
  //   Cookie.set(configToken.cookieName, '');
  // }
  return result;
}

// 获取token
export async function getToken(params) {
  const urlencoded = encodeURI(`client_id=WryWebClient&client_secret=Web_P@ssw0rd_!@#$%&grant_type=${params.grant_type}&username=${params.username}&password=${params.password}`)
  const result = await post(API.LoginApi.getToken, urlencoded, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
  });
  if (result) {
    Cookie.set(config.cookieName, result.access_token);
    window.localStorage.setItem('loginTokenData', JSON.stringify({
      expires_in: result.expires_in,
      time: new Date().getTime(),
      username: params.username,
      password: params.password,
      refresh_token: result.refresh_token,
    }))
  } else {
    Cookie.set(config.cookieName, '');
  }
  return result;
}

export async function getFakeCaptcha(params) {
  const result = await post(API.LoginApi.GetVerificationCode, params);
  return result;
}
