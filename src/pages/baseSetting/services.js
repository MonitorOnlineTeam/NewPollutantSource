/**
 * 功  能：基础配置services
 * 创建人：dongxiaoyun
 * 创建时间：2020.8.12
 */
import { post, get } from '@/utils/request';

/**
 * 添加帮助中心信息
 */
export async function AddHelpInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/AddHelpInfo', params, null);
  return result;
}


/**
 * 删除帮助中心信息
 */
export async function DelHelpInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/DelHelpInfo', params, null);
  return result;
}

/**
 * 修改帮助中心信息
 */
export async function UpdateHelpInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/UpdateHelpInfo', params, null);
  return result;
}

/**
 * 添加监测点类型
 */
export async function AddMonitorPointTypeInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/AddMonitorPointTypeInfo', params, null);
  return result;
}

/**
 * 删除监测点类型
 */
export async function DelMonitorPointTypeInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/DelMonitorPointTypeInfo', params, null);
  return result;
}

/**
 * 编辑监测点类型
 */
export async function UpdateMonitorPointTypeInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/UpdateMonitorPointTypeInfo', params, null);
  return result;
}

/**
 * 获取所有设备类型
 */
export async function GetMonitorPointTypeList(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/GetMonitorPointTypeList', params, null);
  return result;
}

/**
 * 添加参数信息
 */
export async function AddDeviceParametersInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/AddDeviceParametersInfo', params, null);
  return result;
}

/**
 * 修改参数信息
 */
export async function UpdateDeviceParametersInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/UpdateDeviceParametersInfo', params, null);
  return result;
}
/**
 * 删除参数信息
 */
export async function DelDeviceParametersInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/DelDeviceParametersInfo', params, null);
  return result;
}


/**
 * 添加异常类别信息
 */
export async function AddExceptionTypeInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/AddExceptionTypeInfo', params, null);
  return result;
}

/**
 * 修改异常类别信息
 */
export async function UpdateExceptionTypeInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/UpdateExceptionTypeInfo', params, null);
  return result;
}

/**
 * 删除问题反馈信息
 */
export async function DelProblemFeedbackInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/DelProblemFeedbackInfo', params, null);
  return result;
}


/**
 * 添加故障单元信息
 */
export async function AddTroubleUnitInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/AddTroubleUnitInfo', params, null);
  return result;
}

/**
 * 修改故障单元信息
 */
export async function UpdateTroubleUnitInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/UpdateTroubleUnitInfo', params, null);
  return result;
}

/**
 * 添加系统型号
 */
export async function AddSystemModelInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/AddSystemModelInfo', params, null);
  return result;
}

/**
 * 修改系统型号
 */
export async function UpdateSystemModelInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/UpdateSystemModelInfo', params, null);
  return result;
}


/**
 * 添加设备主机名称
 */
export async function AddHostNameInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/AddHostNameInfo', params, null);
  return result;
}

/**
 * 修改设备主机名称
 */
export async function UpdateHostNameInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/UpdateHostNameInfo', params, null);
  return result;
}

/**
 * 获取符合条件的主机名称
 */
export async function GetHostNameInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/GetHostNameInfo', params, null);
  return result;
}

/**
 * 添加设备主机型号
 */
export async function AddHostModelInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/AddHostModelInfo', params, null);
  return result;
}

/**
 * 修改设备主机型号
 */
export async function UpdateHostModelInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/UpdateHostModelInfo', params, null);
  return result;
}

/**
 * 添加仓库信息
 */
export async function AddWarehouseInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/AddWarehouseInfo', params, null);
  return result;
}

/**
 * 修改仓库信息
 */
export async function UpdateWarehouseInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseSettingApi/UpdateWarehouseInfo', params, null);
  return result;
}


