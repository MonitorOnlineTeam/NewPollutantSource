import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'



//企业树
export async function GetTestEntTree(params) {
  const result = await post(API.CtDebugServiceApi.GetDebuggingEntTree,params, null);
  return result;
}
//右侧tab栏 表单类型

export async function Get72TestRecordType(params) {
  const result = await post(API.CtDebugServiceApi.Get72HoursDebuggingItem,params, null);
  return result;
}

export async function Get72TestRecordPollutant(params) {
  const result = await post(API.CtDebugServiceApi.Get72TestRecordPollutant,params, null);
  return result;
}
/*** 颗粒物CEMS零点和量程漂移检测  ***/

//获取
export async function GetPMZeroRangeRecord(params) {
  const result = await post(API.CtDebugServiceApi.GetPMDriftInfo,params, null);
  return result;
}

//添加修改
export async function AddPMZeroRangeRecord(params) {
  const result = await post(API.CtDebugServiceApi.AddOrUpdatePMDriftInfo,params, null);
  return result;
}
//删除
export async function DeletePMZeroRangeRecord(params) {
  const result = await post(API.CtDebugServiceApi.DeletePMDriftInfo,params, null);
  return result;
}

/****颗粒物参比****/

//导入
export async function ImportData(params) {
  const result = await post(API.CtDebugServiceApi.ImportData,params, null);
  return result;
}
//获取参数
export async function GetPMReferenceCalibrationRecord(params) {
  const result = await post(API.CtDebugServiceApi.GetReferenceCalibrationPMInfo,params, null);
  return result;
}

//提交 暂存
export async function AddPMReferenceCalibrationRecord(params) {
  const result = await post(API.CtDebugServiceApi.AddOrUpdateReferenceCalibrationPMInfo,params, null);
  return result;
}

//删除
export async function DeletePMReferenceCalibrationRecord(params) {
  const result = await post(API.CtDebugServiceApi.DeleteReferenceCalibrationPMInfo,params, null);
  return result;
}


/*** 参比方法评估气态污染物CEMS（含氧量）准确度 ***/


//根据污染物获取时间
export async function GetTimesListByPollutant(params) {
  const result = await post(API.CtDebugServiceApi.GetTimesListByPollutant,params, null);
  return result;
}
//获取
export async function GetGasReferenceMethodAccuracyRecord(params) {
  const result = await post(API.CtDebugServiceApi.GetGasReferenceMethodAccuracyInfo,params, null);
  return result;
}

//初始添加
export async function AddGasReferenceMethodAccuracyInfo(params) {
  const result = await post(API.CtDebugServiceApi.AddReferenceMethodCemsAccuracyTime,params, null);
  return result;
}

//添加或修改
export async function AddGasReferenceMethodAccuracyRecord(params) {
  const result = await post(API.CtDebugServiceApi.AddOrUpdateReferenceMethodCemsAccuracyInfo,params, null);
  return result;
}

//删除
export async function DeleteGasReferenceMethodAccuracyRecord(params) {
  const result = await post(API.CtDebugServiceApi.DeleteGasReferenceMethodAccuracyInfo,params, null);
  return result;
}
//导入
export async function ImportDataNew(params) {
  const result = await post(API.CtDebugServiceApi.ImportDataNew,params, null);
  return result;
}

/*** 气态污染物CEMS示值误差和系统响应时间检测表单 ***/

//获取
export async function GetGasIndicationErrorSystemResponseRecord(params) {
  const result = await post(API.CtDebugServiceApi.GetGasIndicationErrorResponseTimeInfo,params, null);
  return result;
}

//添加修改
export async function AddGasIndicationErrorSystemResponseRecord(params) {
  const result = await post(API.CtDebugServiceApi.AddOrUpdateGasIndicationErrorResponseTimeInfo,params, null);
  return result;
}
//删除
export async function DeleteGasIndicationErrorSystemResponseRecord(params) {
  const result = await post(API.CtDebugServiceApi.DeleteGasIndicationErrorResponseTimeInfo,params, null);
  return result;
}

/*** 速度场系数检测表单 ***/

//获取
export async function GetVelocityFieldCheckingRecord(params) {
  const result = await post(API.CtDebugServiceApi.GetVelocityFieldCoefficientInfo,params, null);
  return result;
}

//添加修改
export async function AddVelocityFieldCheckingRecord(params) {
  const result = await post(API.CtDebugServiceApi.AddOrUpdateVelocityFieldCoefficientInfo,params, null);
  return result;
}
//删除
export async function DeleteVelocityFieldCheckingRecord(params) {
  const result = await post(API.CtDebugServiceApi.DeleteVelocityFieldCoefficientInfo,params, null);
  return result;
}

/*** 温度CMS准确度检测表单 ***/

//获取
export async function GetTemperatureCheckingRecord(params) {
  const result = await post(API.CtDebugServiceApi.GetTemperatureAccuracyInfo,params, null);
  return result;
}

//添加修改
export async function AddTemperatureCheckingRecord(params) {
  const result = await post(API.CtDebugServiceApi.AddOrUpdateTemperatureAccuracyInfo,params, null);
  return result;
}
//删除
export async function DeleteTemperatureCheckingRecord(params) {
  const result = await post(API.CtDebugServiceApi.DeleteTemperatureAccuracyInfo,params, null);
  return result;
}

/*** 湿度CMS准确度检测表单 ***/

//获取
export async function GetHumidityCheckingRecord(params) {
  const result = await post(API.CtDebugServiceApi.GetHumidityAccuracyInfo,params, null);
  return result;
}

//添加修改
export async function AddHumidityCheckingRecord(params) {
  const result = await post(API.CtDebugServiceApi.AddOrUpdateHumidityAccuracyInfo,params, null);
  return result;
}
//删除
export async function DeleteHumidityCheckingRecord(params) {
  const result = await post(API.CtDebugServiceApi.DeleteHumidityAccuracyInfo,params, null);
  return result;
}

/*** 气态污染物CEMS（含氧量）零点和量程漂移检测 ***/

//获取
export async function GetGasZeroRangeRecord(params) {
  const result = await post(API.CtDebugServiceApi.GetGasDriftInfo,params, null);
  return result;
}

//添加修改
export async function AddGasZeroRangeInfoRecord(params) {
  const result = await post(API.CtDebugServiceApi.AddOrUpdateGasDriftInfo,params, null);
  return result;
}
//删除
export async function DeleteGasZeroRangeRecord(params) {
  const result = await post(API.CtDebugServiceApi.DeleteGasZeroRangeRecord,params, null);
  return result;
}


/*** 生成检测报告  ***/
export async function exportTestPeport(params) {
  const result = await post(API.CtDebugServiceApi.Export72HoursCommissioningTestReport,params, null);
  return result;
}
/*** 生成采样时间  ***/
export async function usePMReferenceTimes(params) {
  const result = await post(API.CtDebugServiceApi.UsePMReferenceTimes,params, null);
  return result;
}
