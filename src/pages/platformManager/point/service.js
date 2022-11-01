import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

// 添加排口
export async function addPoint(params) {
  const result = await post(API.PointApi.AddPoint, params);
  return result;
}

// 更新排口
export async function updatePoint(params) {
  const result = await post(API.PointApi.UpdatePoint, params);
  return result;
}

// 获取仪器信息table
export async function getPointInstrument(params) {
  const result = await post(API.InstrumentApi.GetPointInstrument, params);
  return result;
}

// 获取仪器信息列表
export async function getInstrumentSelectList(params) {
  const result = await post(API.InstrumentApi.GetInstrumentNameList, params);
  return result;
}

// 获取仪器厂商列表
export async function getFactorySelectList(params) {
  const result = await post(API.InstrumentApi.GetInstrumentFactoryList, params);
  return result;
}

// 获取仪器分析方法
export async function getMethodSelectList(params) {
  const result = await post(API.InstrumentApi.GetInstrumentFactoryMethod, params);
  return result;
}

// 获取监测项目
export async function getMonitorItem(params) {
  const result = await post(API.InstrumentApi.GetInstrumentMonitorItem, params);
  return result;
}

// 保存监测项目
export async function saveInstrument(params) {
  const result = await post(API.InstrumentApi.AddInstrumentPointRelation, params);
  return result;
}

// 删除仪器信息
export async function deleteInstrument(params) {
  const result = await post(API.InstrumentApi.DeleteInstrumentPointRelation, params);
  return result;
}

// 获取机组列表数据
export async function getUnitList(params) {
  const result = await post(API.CO2EmissionsApi.GetCrewInfo, params);
  return result;
}

// 添加机组
export async function AddCrewInfo(params) {
  const result = await post(API.CO2EmissionsApi.AddCrewInfo, params);
  return result;
}

// 删除机组
export async function DeleteCrewInfo(params) {
  const result = await post(API.CO2EmissionsApi.DeleteCrewInfo, params);
  return result;
}

// 修改机组
export async function UpdateCrewInfo(params) {
  const result = await post(API.CO2EmissionsApi.UpdateCrewInfo, params);
  return result;
}
