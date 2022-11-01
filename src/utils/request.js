import request from '@/utils/requestUtil';
import CryptoJS from 'crypto-js';
import { getToken } from '@/pages/user/login/service'
import _request from "umi-request";
import config from '@/config';
import Cookie from 'js-cookie';
import { API } from '@config/API'


export function getTokenTimeAndRefreshToken(callback) {
  // 获取数据
  let data = window.localStorage.getItem('loginTokenData')
  if (!data) return callback && callback();
  let dataObj = JSON.parse(data)
  let exp = dataObj.expires_in * 1000;
  // 与过期时间比较
  // if (new Date().getTime() - dataObj.time > exp) {
  if (false) {
    console.log("token过期！！")
    // 过期刷新token
    // getToken({
    //   grant_type: 'refresh_token',
    //   username: 'system',
    //   password: 'system',
    // });
    let params = {
      grant_type: 'refresh_token',
      refresh_token: dataObj.refresh_token,
      username: 'system',
      password: 'system',
    };
    const urlencoded = encodeURI(`client_id=WryWebClient&client_secret=Web_P@ssw0rd_!@#$%&grant_type=${params.grant_type}&refresh_token=${params.refresh_token}`)
    request
      .post(API.LoginApi.getToken, {
        data: urlencoded,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      })
      .then(function (result) {
        console.log('刷新token-', result);
        Cookie.set(config.cookieName, result.access_token);
        window.localStorage.setItem('loginTokenData', JSON.stringify({
          expires_in: result.expires_in,
          time: new Date().getTime(),
          username: params.username,
          password: params.password,
          refresh_token: params.refresh_token,
        }))
        callback && callback();
      })
      .catch(() => {
        callback && callback();
      })
  } else {
    callback && callback();
  }
}

export async function post(url, params, options) {
  // let body = JSON.stringify(params);
  let body = params;
  let sysConfigInfo = JSON.parse(localStorage.getItem('sysConfigInfo'));
  if (sysConfigInfo.ClearTransmission === '0') {
    body = CryptoJS.AES.encrypt(body, CryptoJS.enc.Utf8.parse('DLFRAME/GjdnSp9PTfFDBY133QIDAQAB'), {
      iv: CryptoJS.enc.Utf8.parse('DLFRAME/GjdnSp9P'),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString();
  }
  let result;
  getTokenTimeAndRefreshToken(() => {
    result = request(url, { method: 'POST', data: body, ...options })
  })
  return result;
}

export async function get(url, params) {
  if (params) {
    const paramsArray = [];
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));

    if (url.indexOf('?') === -1) {
      if (url.search(/\?/) === -1) {
        url += `?${paramsArray.join('&')}`;
      } else {
        url += `&${paramsArray.join('&')}`;
      }
    } else {
      url += `&${paramsArray.join('&')}`;
    }

    let sysConfigInfo = JSON.parse(localStorage.getItem('sysConfigInfo'));
    if (sysConfigInfo.ClearTransmission === '0') {
      const urlbehinds = url.split('?').map(item => ({ item }));
      if (urlbehinds.length > 1) {
        if (Object.keys(urlbehinds[1]).length !== 0) {
          const AESurlbehind = CryptoJS.AES.encrypt(urlbehinds[1].item, CryptoJS.enc.Utf8.parse('DLFRAME/GjdnSp9PTfFDBY133QIDAQAB'), {
            iv: CryptoJS.enc.Utf8.parse('DLFRAME/GjdnSp9P'),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }).ciphertext.toString();
          url = urlbehinds[0].item + "?" + AESurlbehind;
        }
      }
    }
  }
  let result = { Datas: {}, IsSuccess: true };
  getTokenTimeAndRefreshToken(() => {
    result = request(url, { method: 'GET' });
  })
  console.log('result=', result)
  return result;
  // return request(url, { method: 'GET' });
}