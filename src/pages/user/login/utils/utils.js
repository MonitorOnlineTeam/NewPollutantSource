import { parse } from 'qs';
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

// 获取系统跳转url
export function getFirstChildNavigateUrl(element) {
  // 如果没有 children 或 children 为空，直接返回自己的 NavigateUrl
  if (!element.children || element.children.length === 0) {
    return element.NavigateUrl;
  }

  let current = element;
  while (current.children && current.children.length > 0) {
    current = current.children[0];
  }

  return current.NavigateUrl;
}
