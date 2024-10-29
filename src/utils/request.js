import request from '@/utils/requestUtil';
import CryptoJS from 'crypto-js';
import _request from 'umi-request';
import config from '@/config';
import Cookie from 'js-cookie';
import { API } from '@config/API';
import { encryptionRequest, decryptionResponse } from '@/utils/utils';
import webConfig from '@public/webConfig';
import { getToken } from '@/pages/user/login/service.js';

export function getTokenTimeAndRefreshToken(callback) {
  // 获取数据
  let data = window.localStorage.getItem('loginTokenData');
  if (!data) return callback && callback();
  let dataObj = JSON.parse(data);
  let interval = dataObj.expires_in * 0.9 * 1000;
  // debugger;
  // console.log('Cookie.get(config.cookieName)', Cookie.get(config.cookieName));
  // if (!window.refreshTokenTimer && Cookie.get(config.cookieName)) {
  //   window.refreshTokenTimer = setInterval(() => {
  //     getToken({
  //       grant_type: 'password',
  //       username: dataObj.username,
  //       password: dataObj.password,
  //     });
  //   }, 10000);
  // } else if (window.refreshTokenTimer && !Cookie.get(config.cookieName)) {
  //   clearInterval(window.refreshTokenTimer);
  // }
  callback && callback();

  // // 与过期时间比较
  // // if (new Date().getTime() - dataObj.time > exp) {
  // if (false) {
  //   console.log('token过期！！');
  //   // 过期刷新token
  //   // getToken({
  //   //   grant_type: 'refresh_token',
  //   //   username: 'system',
  //   //   password: 'system',
  //   // });

  //   clearInterval(window.refreshTokenTimer);
  //   let data = window.localStorage.getItem('loginTokenData');
  //   let diff = moment().diff(data.loginTime, 'seconds');
  //   window.refreshTokenTimer = setInterval(() => {
  //     getToken({
  //       grant_type: 'password',
  //       username: params.username,
  //       password: params.password,
  //     });
  //   }, 60000);

  //   let params = {
  //     grant_type: 'refresh_token',
  //     refresh_token: dataObj.refresh_token,
  //     username: 'system',
  //     password: 'system',
  //   };
  //   const urlencoded = encodeURI(
  //     `client_id=WryWebClient&client_secret=Web_P@ssw0rd_!@#$%&grant_type=${params.grant_type}&refresh_token=${params.refresh_token}`,
  //   );
  //   request
  //     .post(API.LoginApi.getToken, {
  //       data: urlencoded,
  //       headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
  //     })
  //     .then(function(result) {
  //       console.log('刷新token-', result);
  //       Cookie.set(config.cookieName, result.access_token);
  //       window.localStorage.setItem(
  //         'loginTokenData',
  //         JSON.stringify({
  //           expires_in: result.expires_in,
  //           time: new Date().getTime(),
  //           username: params.username,
  //           password: params.password,
  //           refresh_token: params.refresh_token,
  //         }),
  //       );
  //       callback && callback();
  //     })
  //     .catch(() => {
  //       callback && callback();
  //     });
  // } else {
  //   callback && callback();
  // }
}

export async function post(url, params, options) {
  let isGetToken = url === '/rest/PollutantSourceOAuth/connect/token';
  let body = params;
  if (!isGetToken) {
    body = encryptionRequest(params);
  }
  let result;
  getTokenTimeAndRefreshToken(() => {
    result = request(url, { method: 'POST', data: body, ...options });
  });

  if (isGetToken) {
    return result;
  }

  return result
    .then(res => {
      if (res.errors) {
        return { IsSuccess: false, Message: '', Datas: {} };
      }
      return decryptionResponse(res);
    })
    .catch(e => {
      console.log('error-123', e);
    });
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
    // if (sysConfigInfo.ClearTransmission === '0') {
    if (webConfig.isEncryption) {
      // if (true) {
      const urlbehinds = url.split('?').map(item => ({ item }));
      if (urlbehinds.length > 1) {
        if (Object.keys(urlbehinds[1]).length !== 0) {
          const AESurlbehind = CryptoJS.AES.encrypt(
            urlbehinds[1].item,
            CryptoJS.enc.Utf8.parse('DLFRAME/GjdnSp9PTfFDBY133QIDAQAB'),
            {
              iv: CryptoJS.enc.Utf8.parse('DLFRAME/GjdnSp9P'),
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7,
            },
          ).ciphertext.toString();
          url = urlbehinds[0].item + '?' + AESurlbehind;
        }
      }
    }
  }
  let result = { Datas: {}, IsSuccess: true };
  getTokenTimeAndRefreshToken(() => {
    result = request(url, { method: 'GET' });
  });
  return result.then(res => {
    if (res.errors) {
      return { IsSuccess: false, Message: '', Datas: {} };
    }
    return decryptionResponse(res);
  });
  // console.log('result222', newResult)
  // return newResult;
  // return request(url, { method: 'GET' });
}
