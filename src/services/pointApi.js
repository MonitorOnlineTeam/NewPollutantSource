/**
 * 功  能：监测点服务
 * 创建人：吴建伟
 * 创建时间：2019.10.30
 */

import Cookie from 'js-cookie';
import { post, get } from '@/utils/request';
import { API } from '@config/API';
import { async } from 'q';

/**
 * 添加监测点
 */
export async function addPoint(params) {
  const result = await post(API.EntAndPointApi.AddPoint, params);
  return result;
}

export async function getEnterpriseCorporationCode(params) {
  const result = await post(API.EntAndPointApi.GetEnterpriseCorporationCode, params);
  return result;
}

/**
 * 修改监测点
 */
export async function updatePoint(params) {
  const result = await post(API.EntAndPointApi.UpdatePoint, params);
  return result;
}

/**
 * 删除监测点（支持批量）
 * @params {
          "params": ["31011500000002"]
    }
 */
export async function deletePoints(params) {
  const result = await post(API.EntAndPointApi.DeletePoints, params, null);
  return result;
}
//出厂测试
export async function factoryTest(params) {
  const result = await get(
    '/api/rest/PollutantSourceApi/MonitorPointApi/FactoryTest',
    params,
    null,
  );
  return result;
}

/**
 * 根据批量监控目标Id获取监测点
 * @params {
          "params": ["31011500000002"]
    }
 */
export async function queryPointForTarget(params) {
  const result = await post(API.EntAndPointApi.queryPointForTarget, params, null);
  return result;
}

export async function GetComponent(params) {
  const result = await post('/api/rest/PollutantSourceApi/AnalyzerApi/GetComponent', params, null);
  return result;
}

export async function GetMainInstrumentName(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/AnalyzerApi/GetMainInstrumentName',
    params,
    null,
  );
  return result;
}
export async function GetChildCems(params) {
  const result = await post('/api/rest/PollutantSourceApi/AnalyzerApi/GetChildCems', params, null);
  return result;
}
export async function AddAnalyzer(params) {
  const result = await post('/api/rest/PollutantSourceApi/AnalyzerApi/AddAnalyzer', params, null);
  return result;
}
export async function GetAnalyzerListByDGIMN(params) {
  const result = await post(
    `/api/rest/PollutantSourceApi/AnalyzerApi/GetAnalyzerListByDGIMN?DGIMN=${params.DGIMN}`,
    null,
    null,
  );
  return result;
}

export async function UpdatePointDGIMN(params) {
  //更新MN号
  const result = await post(API.EntAndPointApi.UpdatePointDGIMN, params, null);
  return result;
}

export async function GetMonitorPointVerificationItem(params) {
  //获取点位关联数据核查信息
  const result = await post(API.EntAndPointApi.GetMonitorPointVerificationItem, params, null);
  return result;
}

export async function GetMonitorPointVerificationList(params) {
  //获取数据核查信息码表
  const result = await post(
    `${API.EntAndPointApi.GetMonitorPointVerificationList}?PollutantType=${params.pollutantType}`,
    {},
    null,
  );
  return result;
}

export async function AddMonitorPointVerificationItem(params) {
  //添加或者修改点位关联数据核查信息
  const result = await post(API.EntAndPointApi.AddPointVerificationItem, params, null);
  return result;
}

export async function GetParamInfoList(params) {
  //获取设备参数项列表
  const result = await post(API.EntAndPointApi.GetParamInfoList, params, null);
  return result;
}

export async function GetParamCodeList(params) {
  //设备参数项码表
  const result = await post(API.EntAndPointApi.GetEquipmentParameterItem, params, null);
  return result;
}

export async function AddPointParamInfo(params) {
  //添加设备参数项
  const result = await post(API.EntAndPointApi.AddPointParamItem, params, null);
  return result;
}

/*******监测点设备管理  ***** */
export async function GetPointEquipmentInfo(params) {
  //获取站点系统信息
  const result = await post(API.EntAndPointApi.GetPointSystemInfo, params, null);
  return result;
}

export async function AddOrUpdateEquipmentInfo(params) {
  //添加或者修改设备参数信息
  const result = await post(API.EntAndPointApi.AddOrUpdateSystemEquipmentInfo, params, null);
  return result;
}

export async function GetPointEquipmentParameters(params) {
  //获取站点设备信息
  const result = await post(API.EntAndPointApi.GetPointEquipmentInfo, params, null);
  return result;
}
// =-=--=-=-=-=-
export async function GetManufacturerList(params) {
  //设备厂商 列表
  const result = await post(API.AssetManagementApi.GetEquipmentManufacturerList, params, null);
  return result;
}

export async function GetMonitoringTypeList(params) {
  // 获取监测类别
  const result = await post(API.AssetManagementApi.GetMonitoringCategoryList, params, null);
  return result;
}

export async function GetSystemModelList(params) {
  //系统型号
  const result = await post(API.AssetManagementApi.GetSystemModelList, params, null);
  return result;
}

export async function GetEquipmentInfoList(params) {
  //设备信息
  const result = await post(API.AssetManagementApi.GetEquipmentList, params, null);
  return result;
}

export async function GetMonitoringTypeList2(params) {
  //设备信息  获取监测类别
  const result = await post(API.CommonApi.GetPollutantTypeMonitoringCategoryInfo, params, null);
  return result;
}

export async function GetPollutantById(params) {
  //设备信息  获取监测类型
  const result = await post(API.CommonApi.GetPollutantTypeMonitoringCategoryInfo, params, null);
  return result;
}

export async function GetPollutantById2(params) {
  //设备信息  获取监测类型
  const result = await post(API.CommonApi.GetPollutantTypeMonitoringCategoryInfo, params, null);
  return result;
}

export async function GetMonitoringCategoryType(params) {
  //设备信息  获取监测类型
  const result = await post(API.CommonApi.GetPollutantTypeMonitoringCategoryInfo, params, null);
  return result;
}

export async function GetPBList(params) {
  //设备信息  废气 配备
  const result = await post(API.AssetManagementApi.GetStandardGasEquipmentInfo, params, null);
  return result;
}

/*******监测点新增功能******* */
export async function PointSort(params) {
  //监测点排序
  const result = await post(API.EntAndPointApi.UpdatePointSortInfo, params, null);
  return result;
}

export async function GetPointCoefficientByDGIMN(params) {
  //获取监测点系数
  const result = await post(
    `${API.EntAndPointApi.GetPointCoefficientInfo}?DGIMN=${params.DGIMN}`,
    null,
    null,
  );
  return result;
}

//添加或修改监测点系数
export async function AddOrEditPointCoefficient(params) {
  const result = await post(API.EntAndPointApi.AddOrUpdatePointCoefficientInfo, params, null);
  return result;
}

export async function GetPointElectronicFenceInfo(params) {
  //获取电子围栏半径
  const result = await post(API.EntAndPointApi.GetPointElectronicFenceInfo, params, null);
  return result;
}
export async function AddOrUpdatePointElectronicFenceInfo(params) {
  //电子围栏半径  添加or更新
  const result = await post(API.EntAndPointApi.AddOrUpdatePointElectronicFenceInfo, params, null);
  return result;
}
export async function UpdatePointOprationStatus(params) {
  //修改运维状态
  const result = await post(API.AssetManagementApi.UpdatePointOprationStatus, params, null);
  return result;
}
export async function GetOprationStatusList(params) {
  //运维状态 修改记录
  const result = await post(API.AssetManagementApi.GetOprationStatusList, params, null);
  return result;
}

// 获取各个行业不同的工艺点
export async function GetCraftByIndustry(params) {
  const result = await post(
    '/rest/PollutantSourceApi/Mold/GetCraftByIndustry?IndustryTypeCode=' + params.IndustryTypeCode,
    {},
    null,
  );
  return result;
}

// 获取各个行业不同的工艺点
export async function GetCraftByPoint(params) {
  const result = await post(
    '/rest/PollutantSourceApi/Mold/GetCraftByPoint?DGIMN=' + params.DGIMN,
    {},
    null,
  );
  return result;
}

// 添加或编辑点位工艺
export async function AddOrUptCraftByPoint(params) {
  const result = await post('/rest/PollutantSourceApi/Mold/AddOrUptCraftByPoint', params);
  return result;
}

// 获取监测参数设备清单信息
export async function GetEquipmentParametersList(params) {
  const result = await post(API.AssetManagementApi.GetEquipmentParametersList, params);
  return result;
}
