import request from '@/utils/requestUtil';
import CryptoJS from 'crypto-js';


export async function post(url, params) {
  let body = JSON.stringify(params);
  if (true) {
    body = CryptoJS.AES.encrypt(body, CryptoJS.enc.Utf8.parse('DLFRAME/GjdnSp9PTfFDBY133QIDAQAB'), {
      iv: CryptoJS.enc.Utf8.parse('DLFRAME/GjdnSp9P'),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString();
  }
  return request(url, { method: 'POST', data: body });
}

export async function get(url, params, flag) {
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

    if (true) {
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
  return request(url, { method: 'GET' });
}