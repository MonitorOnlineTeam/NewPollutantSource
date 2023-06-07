import { post } from '@/utils/request';

// 获取模型列表
export async function GetModelList(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Mold/GetMoldList', params);
  return result;
}

// 获取报警记录
export async function GetWarningList(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/GetWarningList', params);
  return result;
}

// 获取报警及核实信息（上、下）
export async function GetSingleWarning(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Warning/GetSingleWarning', params);
  return result;
}

// 获取模型快照数据
export async function GetSnapshotData(params) {
  const result = await post(
    '/newApi/rest/PollutantSourceApi/Warning/GetSnapshotData?ID=' + params.ID,
    {},
  );
  return result;
}

// 模型开启、管理
export async function SetMoldStatus(params) {
  const result = await post('/newApi/rest/PollutantSourceApi/Mold/SetMoldStatus', params);
  return result;
}
