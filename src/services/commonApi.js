import { post, get } from '@/utils/request';
import { API } from '@config/API';
// import

//根据行政区获取 大气站列表

export async function GetStationByRegion(params) {
  const result = post(
    // '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetStationByRegion?RegionCode=' +
    `${API.commonApi.GetStationByRegion}?RegionCode=` + params.RegionCode,
    null,
    null,
  );
  return result;
}

//根据行政区获取 企业列表
export async function GetEntByRegion(params) {
  const result = post(API.RegionApi.GetEntByRegion, params);
  return result;
}

//关注列表
export async function GetAttentionDegreeList(params) {
  const result = post(API.commonApi.GetAttentionDegreeList, params);
  return result;
}

// 行政区划
export async function getEnterpriseAndPoint(params) {
  const result = await post(API.RegionApi.GetXuRegions, params, null);
  return result === null ? { data: null } : result;
}

// 获取污染物类型
export async function getPollutantTypeList(params) {
  const result = await post(
    API.commonApi.GetPollutantTypeList,
    {
      ...params,
      pollutantCodes: sessionStorage.getItem('sysPollutantCodes') || params.pollutantCodes,
    },
    null,
  );
  return result;
}

/**
 * 获取系统配置信息
 * @params {}
 */
export async function getSystemConfigInfo() {
  const result = await get(API.systemApi.GetSystemConfigInfo);
  return result;
}

// 获取运维日志详情图片
export async function getOperationImageList(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/TaskProcessingApi/GetRecordPhotoName',
    params,
    null,
  );
  return result;
}

// 根据污染物类型获取污染物
export async function getPollutantTypeCode(params) {
  const result = await post(API.commonApi.GetPollutantTypeCode, params);
  return result;
}

// 获取行业列表
export async function getIndustryTree(params) {
  const result = await post(API.commonApi.GetIndustryTree, params, null);
  return result;
}

// 获取组件 - 企业及排口
export async function getEntAndPoint(params) {
  const result = await post(
    API.commonApi.GetEntAndPoint,
    {
      ...params,
      PollutantTypes: params.PollutantTypes || sessionStorage.getItem('sysPollutantCodes'),
    },
    null,
  );
  return result;
}

// 根据企业获取排口
export async function getPointByEntCode(params) {
  const result = await post(API.BaseDataApi.GetPointByEntCode, params);
  return result;
}

// 根据mn号获取站点下的所有污染物因子
export async function getPollutantListByDgimn(params) {
  const result = await post(API.commonApi.GetPollutantListByDgimn, params);
  return result;
}

/**
 * 基本信息-更新监测点的运营开始结束时间
 * @param {传递参数} 传递参数
 * @param {操作} 操作项
 */
export async function CreatQRCode(params) {
  const result = post(API.PointApi.CreateQRCode, params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取系统菜单名称
export async function getMenuNameList(params) {
  const result = post(API.AuthorityApi.GetMenuByLoginUser, params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取所有企业
export async function getEntList(params) {
  // const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntList', params, null);
  const result = await post(API.RegionApi.GetEntByRegion, params, null);
  return result;
}

// 获取质控污染物
export async function getQCAPollutantByDGIMN(params) {
  const result = await get(API.QualityControlApi.GetQCAPollutantByDGIMN, params, null);
  return result;
}

// 记录日志
export async function AddUserAccessLog(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/AddUserAccessLog', params, null);
  return result;
}
