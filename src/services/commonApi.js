import { post, get } from '@/utils/request';
import { API } from '@config/API';
// import

//根据行政区获取 大气站列表

export async function GetStationByRegion(params) {
  const result = post(
    // '/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetStationByRegion?RegionCode=' +
    `${API.CommonApi.GetStationByRegion}?RegionCode=` + params.RegionCode,
    null,
    null,
  );
  return result;
}

//根据行政区获取 企业列表
export async function GetEntByRegion(params) {
  const result = post(API.CommonApi.GetEntByRegion, params);
  return result;
}

// 根据行政区获取 企业列表 未过滤
export async function GetEntNoFilterList(params) {
  const result = await post(API.CommonApi.GetNoFilterEntList, params, null);
  return result;
}
//根据行政区获取 企业列表  启用未停用的企业
export async function GetEntList(params) {
  const result = post(API.AssetManagementApi.GetEntList,{regionCode:params.RegionCode},  null)
  return result;
}
//关注列表
export async function GetAttentionDegreeList(params) {
  const result = post(API.CommonApi.GetAttentionDegreeList, params);
  return result;
}

// 行政区划
export async function getEnterpriseAndPoint(params) {
  const result = await post(API.RegionApi.GetXuRegions, params, null);
  return result === null ? { data: null } : result;
}

// 获取污染物类型
export async function getPollutantTypeList(params) {
  console.log(params)
  let pollutantCodes;
  if(params.isOpera){ //运维特殊处理
   if(params.singleHidden){
    pollutantCodes =  sessionStorage.getItem('sysPollutantCodes')
   }else{
    pollutantCodes = params.pollutantCodes
   }
   
  }else{
    pollutantCodes = sessionStorage.getItem('sysPollutantCodes') || params.pollutantCodes
  }
  const result = await post(
    API.CommonApi.GetPollutantTypeList,
    {
      ...params,
      isOpera:undefined,
      singleHidden:undefined,
      pollutantCodes: pollutantCodes,
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
  const result = await get(API.SystemApi.GetSystemConfigInfo);
  return result;
}

// 获取运维日志详情图片
export async function getOperationImageList(params) {
  const result = await post(API.PredictiveMaintenanceApi.GetRecordAttachmentList, params, null);
  return result;
}

// 根据污染物类型获取污染物
export async function getPollutantTypeCode(params) {
  const result = await post(API.CommonApi.GetPollutantTypeCode, params);
  return result;
}

// 获取行业列表
export async function getIndustryTree(params) {
  const result = await post(API.CommonApi.GetIndustryTree, params, null);
  return result;
}

// 获取组件 - 企业及排口
export async function getEntAndPoint(params) {
  const result = await post(
    API.CommonApi.GetEntAndPoint,
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
  const result = await post(API.CommonApi.GetPointByEntCode, params);
  return result;
}

// 根据mn号获取站点下的所有污染物因子
export async function getPollutantListByDgimn(params) {
  const result = await post(API.CommonApi.GetPollutantListByDgimn, params);
  return result;
}

/**
 * 基本信息-更新监测点的运营开始结束时间
 * @param {传递参数} 传递参数
 * @param {操作} 操作项
 */
export async function CreatQRCode(params) {
  const result = post(API.EntAndPointApi.CreateQRCode, params, null);
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

// 获取质控污染物
export async function getQCAPollutantByDGIMN(params) {
  const result = await get(API.QualityControlApi.GetQCAPollutantByDGIMN, params, null);
  return result;
}

// 记录日志
export async function AddUserAccessLog(params) {
  const result = post('/rest/PollutantSourceApi/BaseDataApi/AddUserAccessLog', params, null);
  return result;
}

// 用户列表
export async function GetUserList(params) {
  const result = post(API.AuthorityApi.GetUserList, params, null);
  return result;
}

// 运维人员  督查人员 列表
export async function GetInspectorUserList(params) {
  const result = post(API.SupervisionVerificaApi.GetInspectorUserList, params, null);
  return result;
}

//行政区  列表
export async function GetNoFilterRegionList(params) {
  const result = post(API.RegionApi.GetNoFilterRegionList, params, null);
  return result;
}
// 角色列表
export async function GetRoleCodeList(params) {
  const result = post(API.SystemManageApi.GetAllRoleList, params, null);
  return result;
}

//行政区  列表  调试服务
export async function GetTestXuRegions(params) {
  const result = post(API.CtAssetManagementApi.GetTestXuRegions, params, params, null);
  return result;
}
//行政区  列表  成套
export async function GetCtTestXuRegions(params) {
  const result = post(API.CtAssetManagementApi.GetTestXuRegions, params, null);
  return result;
}
// 导出 运维监测点信息
export async function ExportProjectPointList(params) {
  const result = await post(API.AssetManagementApi.ExportProjectPointList, params, null);
  return result;
}

/*** 成套 ****/

//站点信息
export async function GetCtEntAndPointList(params) {
  const result = post(API.CtCommonApi.GetEntAndPointList, params);
  return result;
}

//项目列表
export async function GetCTProjectList(params) {
  const result = post(API.CtAssetManagementApi.GetCTProjectList, params);
  return result;
}

//获取所有用户
export async function GetAlluser(params) {
  const result = post(API.AuthorityApi.GetAllUser, params);
  return result;
}

//获取成套大区
export async function GetCtLargeRegionList(params) {
  const result = post(API.CtCommonApi.GetLargeRegionList, params);
  return result;
}
//获取运维大区和省份
export async function GetLargeRegion(params) {
  const result = post(API.CommonApi.GetLargeRegion, params);
  return result;
}

//设置人员信息
export async function AddSetUser (params) {
  const result = await post(API.CommonApi.AddSetUser,params, null);
  return result;
}
//获取设置人员信息
export async function GetSetUser (params) {
  const result = await post(API.CommonApi.GetSetUser,params, null);
  return result;
}
