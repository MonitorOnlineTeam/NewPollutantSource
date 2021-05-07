/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import Cookie from 'js-cookie';
import router from 'umi/router';
import { async } from 'q';
import configToken from '@/config'
import CryptoJS from 'crypto-js';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export function getCookie(name) {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) {
    return decodeURIComponent(arr[2]);
  }
  return null;
}

export function getAuthHeader(ssoToken) {
  return {
    headers: {
      Accept: 'application/json',
      Authorization: (ssoToken != "null" && ssoToken != "") && `Bearer ${ssoToken}`,
      'Content-Type': 'application/json',
    },
  };
}

const checkStatus = response => {
  if ((response.status >= 200 && response.status < 300) || response.status === 500) {
    // console.log(`
    //     接口返回${response.status}：
    //     url: ${response.url}
    //     ssToken: ${getCookie(configToken.cookieName)}
    //     `)
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `请求错误 ${response.status}`, // : ${response.url}
  //   description: errortext,
  // });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

function parseJSON(response) {
  return response.json();
}

async function requestMy(url, options) {
  const ssoToken = `${getCookie(configToken.cookieName)}`;
  // console.log(`
  // ${url} - ssToken:
  // ${getCookie(configToken.cookieName)}
  // `)
  const authHeader = getAuthHeader(ssoToken);
  const resp = await fetch(url, { ...options, ...authHeader })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(e => {
      const status = e.name;

      if (status === 401) {
        // console.log(`
        // 接口401报错1：
        // url: ${url}
        // ssToken: ${getCookie(configToken.cookieName)}
        // `)
        Cookie.set(configToken.cookieName, null);
        Cookie.set('currentUser', null);
        // console.log(`
        // 接口401报错2：
        // url: ${url}
        // ssToken: ${getCookie(configToken.cookieName)}
        // `)
        router.push('/user/login');
        return;
      }
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      // if (status <= 504 && status >= 500) {
      //     router.push('/exception/500');
      //     return;
      // }
      if (status >= 404 && status < 422) {
        // router.push('/exception/404');
        notification.error({
          message: `请求错误`,
          // description: errortext,
        });
      }
    });
  return (resp && resp.data) || { IsSuccess: false, Datas: null, Message: '' };
}

export async function get(url, params, flag) {
  if (params) {
    const paramsArray = [];
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
    let urlbehind = '';
    if (url.indexOf('?') === -1) {
      if (url.search(/\?/) === -1) {
        url += `?${paramsArray.join('&')}`;
      } else {
        url += `&${paramsArray.join('&')}`;
      }
    } else {
      url += `&${paramsArray.join('&')}`;
    }
    //参数加密开关 2021.1.29 cg 增加所有接口调用参数加密功能
    if (process.env.NODE_ENV === 'production' && true) {
      // if (true) {
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
  return requestMy(url, { method: 'GET' });
}

export async function post(url, params) {
  let body = JSON.stringify(params);
  //参数加密开关 2021.1.29 cg 增加所有接口调用参数加密功能
  if (process.env.NODE_ENV === 'production' && true) {
    // if (true) {
    body = CryptoJS.AES.encrypt(body, CryptoJS.enc.Utf8.parse('DLFRAME/GjdnSp9PTfFDBY133QIDAQAB'), {
      iv: CryptoJS.enc.Utf8.parse('DLFRAME/GjdnSp9P'),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString();
  }
  return requestMy(url, {
    method: 'POST',
    body: body,
  });
}

/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    // notification.error({
    //   message: `请求错误 ${status}: ${url}`,
    //   description: errorText,
    // });
  }
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});
export default request;
