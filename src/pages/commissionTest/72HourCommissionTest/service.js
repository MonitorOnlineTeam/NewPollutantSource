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
export async function importDataNew(params) {
  const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/ImportDataNew',params, null);
  return result;
}
