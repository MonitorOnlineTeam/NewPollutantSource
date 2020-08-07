import { post, get } from '@/utils/request';

// 行政区划
export async function GetXuRegions(params) {
  const body = {
    RegionCode: params.RegionCode,
    PollutantTypes: params.PollutantTypes,
  };

  const result = await post('/api/rest/PollutantSourceApi/PRegion/GetXuRegions', body, null);
  return result === null ? { data: null } : result;
}
// 行政区划
export async function GetRegions(params) {
  const body = {
    RegionCode: params.RegionCode,
    IsLoadAllRegion: params.IsLoadAllRegion,
    pointType: params.pointType,
  };

  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/GetRegion', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 部门信息
export async function GetDepartmentTree(params) {
  const body = {};
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/GetDepartmentTree', body, null);
  return result === null ? { data: null } : result;
}
// 所有部门信息
export async function GetAllDepartmentTree(params) {
  const body = {};
  const result = await post(
    '/api/rest/PollutantSourceApi/AuthorApi/GetAllDepartmentTree',
    body,
    null,
  );
  return result === null ? { data: null } : result;
}

// 获取企业列表
export async function GetEntRegion(params) {
  const result = await post('/api/rest/PollutantSourceApi/PRegion/GetEntRegion', params, null);
  return result === null ? { data: null } : result;
}
// 获取人员行政区
export async function GetUserRegionList() {
  const result = await post('/api/rest/PollutantSourceApi/PUserInfo/GetUserRegionList', {}, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
