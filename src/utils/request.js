import request from '@/utils/requestUtil';
export async function post(url, params) {
  return request(url, { method: 'POST', data: params });
}

export async function get(url, params, flag) {
  // if (flag !== 0)
  //   url += '?authorCode=48f3889c-af8d-401f-ada2-c383031af92d';
  if (params) {
    const paramsArray = [];
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${encodeURIComponent(params[key])}`));

    if (url.indexOf('?') === -1) {
      if (url.search(/\?/) === -1) {
        url += `?${paramsArray.join('&')}`;
      } else {
        url += `&${paramsArray.join('&')}`;
      }
    } else {
      url += `&${paramsArray.join('&')}`;
    }
  }
  return request(url, { method: 'GET' });
}