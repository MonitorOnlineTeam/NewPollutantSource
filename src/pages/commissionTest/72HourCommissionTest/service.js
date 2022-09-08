import { post, get, getNew } from '@/utils/request';




//企业树
export async function GetTestEntTree(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTestEntTree',params, null);
  return result;
}
//右侧tab栏

export async function Get72TestRecordType(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/Get72TestRecordType',params, null);
  return result;
}

export async function Get72TestRecordPollutant(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/Get72TestRecordPollutant',params, null);
  return result;
}

/****颗粒物参比****/

//导入
export async function ImportData(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ImportData',params, null);
  return result;
}
//获取参数
export async function GetPMReferenceCalibrationRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetPMReferenceCalibrationRecord',params, null);
  return result;
}

//提交 暂存
export async function AddPMReferenceCalibrationRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddPMReferenceCalibrationRecord',params, null);
  return result;
}

//删除
export async function DeletePMReferenceCalibrationRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/DeletePMReferenceCalibrationRecord',params, null);
  return result;
}


/*** 参比方法评估气态污染物CEMS（含氧量）准确度 ***/


//根据污染物获取时间
export async function GetTimesListByPollutant(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTimesListByPollutant',params, null);
  return result;
}
//获取
export async function GetGasReferenceMethodAccuracyRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetGasReferenceMethodAccuracyRecord',params, null);
  return result;
}

//初始添加
export async function AddGasReferenceMethodAccuracyInfo(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddGasReferenceMethodAccuracyInfo',params, null);
  return result;
}

//添加或修改
export async function AddGasReferenceMethodAccuracyRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddGasReferenceMethodAccuracyRecord',params, null);
  return result;
}

//删除
export async function DeleteGasReferenceMethodAccuracyRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/DeleteGasReferenceMethodAccuracyRecord',params, null);
  return result;
}
//导入
export async function ImportDataNew(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ImportDataNew',params, null);
  return result;
}

/*** 气态污染物CEMS示值误差和系统响应时间检测表单 ***/

//获取
export async function GetGasIndicationErrorSystemResponseRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetGasIndicationErrorSystemResponseRecord',params, null);
  return result;
}

//添加修改
export async function AddGasIndicationErrorSystemResponseRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddGasIndicationErrorSystemResponseRecord',params, null);
  return result;
}
//删除
export async function DeleteGasIndicationErrorSystemResponseRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/DeleteGasIndicationErrorSystemResponseRecord',params, null);
  return result;
}

/*** 速度场系数检测表单 ***/

export async function GetVelocityFieldCheckingRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetVelocityFieldCheckingRecord',params, null);
  return result;
}

//添加修改
export async function AddVelocityFieldCheckingRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddVelocityFieldCheckingRecord',params, null);
  return result;
}
//删除
export async function DeleteVelocityFieldCheckingRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/DeleteVelocityFieldCheckingRecord',params, null);
  return result;
}

/*** 温度CMS准确度检测表单 ***/

//获取
export async function GetTemperatureCheckingRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetTemperatureCheckingRecord',params, null);
  return result;
}

//添加修改
export async function AddTemperatureCheckingRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddTemperatureCheckingRecord',params, null);
  return result;
}
//删除
export async function DeleteTemperatureCheckingRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/DeleteTemperatureCheckingRecord',params, null);
  return result;
}

/*** 湿度CMS准确度检测表单 ***/

//获取
export async function GetHumidityCheckingRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetHumidityCheckingRecord',params, null);
  return result;
}

//添加修改
export async function AddHumidityCheckingRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddHumidityCheckingRecord',params, null);
  return result;
}
//删除
export async function DeleteHumidityCheckingRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/DeleteHumidityCheckingRecord',params, null);
  return result;
}

/*** 气态污染物CEMS（含氧量）零点和量程漂移检测 ***/

//获取
export async function GetGasZeroRangeRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetGasZeroRangeRecord',params, null);
  return result;
}

//添加修改
export async function AddGasZeroRangeInfoRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddGasZeroRangeInfoRecord',params, null);
  return result;
}
//删除
export async function DeleteGasZeroRangeRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/DeleteGasZeroRangeRecord',params, null);
  return result;
}

/*** 颗粒物CEMS零点和量程漂移检测  ***/

//获取
export async function GetPMZeroRangeRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetPMZeroRangeRecord',params, null);
  return result;
}

//添加修改
export async function AddPMZeroRangeRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/AddPMZeroRangeRecord',params, null);
  return result;
}
//删除
export async function DeletePMZeroRangeRecord(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/DeletePMZeroRangeRecord',params, null);
  return result;
}
