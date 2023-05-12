/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import Cookie from 'js-cookie';
import router from 'umi/router';
import { async } from 'q';
import configToken from '@/config';

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

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response, data } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    if (status === 401) {
      Cookie.set(configToken.cookieName, null);
      Cookie.set('currentUser', null);
      Cookie.set('newToken', null);
      router.push('/user/login');
      console.log('401Data=', data);
      return data;
    }
    if (status === 403) {
      router.push('/exception/403');
      return data;
    }
    if (status >= 404 && status < 422) {
      // router.push('/exception/404');
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
    return data;
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
    return data;
  }
};

/**
 * 配置request请求时的默认参数
 */
if (window.location.search && window.location.search.split('=')) {
  //小程序和移动端 电子表单 token
  if (window.location.search.split('=')[0] && window.location.search.split('=')[0] === '?Ticket') {
    const mobileToken = window.location.search.split('=')[1];
    Cookie.set(configToken.cookieName, mobileToken);
  }
}

// const ssoToken = `${getCookie(configToken.cookieName)}`;
const request = extend({
  errorHandler,
  // timeout: 30000,
  // 默认错误处理
  credentials: 'omit', // 默认请求是否带上cookie
});
request.interceptors.request.use(async (url, options) => {
  if (
    options.method === 'post' ||
    options.method === 'put' ||
    options.method === 'delete' ||
    options.method === 'get'
  ) {
    let token = Cookie.get(configToken.cookieName);

    //
    const urls = url.split('/');
    if (urls[1] === 'newApi') {
      token = Cookie.get('newToken');
    }

    const headers = {
      'Content-Type': options.headers['Content-Type'] || 'application/json',
      Accept: 'application/json',
      Authorization:
        token && token != 'null' && token != 'undefined' && token != '' ? `Bearer ${token}` : null,
    };
    return {
      url,
      options: { ...options, headers },
    };
  }
});
export default request;
