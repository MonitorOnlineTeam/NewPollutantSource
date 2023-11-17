import { post } from '@/utils/request';



// 获取用户访问率--大区
export async function GetDaQuUserActivity(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/UserInfosApi/GetDaQuUserActivity',
    params,
    null,
  );

  return result;
}
//获取用户访问率--服务区
export async function GetFuWuQuUserActivity(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/UserInfosApi/GetFuWuQuUserActivity',
    params,
    null,
  );

  return result;
}

//获取用户访问率--访问状态
export async function GetUserActivity(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/UserInfosApi/GetUserActivity',
    params,
    null,
  );

  return result;
}
// 获取用户访问率--导出大区
export async function ExportDaQuUserActivity(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/UserInfosApi/ExportDaQuUserActivity',
    params,
    null,
  );

  return result;
}


//获取用户访问率--导出服务区

export async function ExportFuWuQuUserActivity(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/UserInfosApi/ExportFuWuQuUserActivity',
    params,
    null,
  );

  return result;
}

// 获取用户访问率--导出大区
export async function ExportUserActivity(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/UserInfosApi/ExportUserActivity',
    params,
    null,
  );

  return result;
}

// 系统访问率  业务属性和行业属性
export async function GetIndustryBusiness(params) {
  const result = post('/api/rest/PollutantSourceApi/UserInfosApi/GetIndustryBusiness', params, null, );
  return result;
}


