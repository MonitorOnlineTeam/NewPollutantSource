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
 