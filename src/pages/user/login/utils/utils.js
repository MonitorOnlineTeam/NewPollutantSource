import { parse } from 'qs';
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function getDefaultNavigateUrl(menuData) {
  let NavigateUrl = "";
  menuData.forEach(item => {
    if (item.children.length) {
      debugger
      getDefaultNavigateUrl(item.children[0]);
    } else {
      console.log('menuData=', menuData)
      NavigateUrl = menuData[0].NavigateUrl;;
      return menuData[0].NavigateUrl;
    }
  })
  return NavigateUrl
}
