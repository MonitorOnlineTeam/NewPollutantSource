import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'


//报警列表
export async function GetAlarmDataList(params) {
  const result = await post(API.QualityControlApi.GetAlarmDataList, params, null);
  return result.Datas === null ? {
    ...result,
    Datas: [],
  } : result;
}

//报警类型
export async function GetAlarmType(params) {
  const result = await post(API.QualityControlApi.GetAlarmType, params, null);
  return result;
}

// 导出数据
export async function exportDatas(params) {
  const result = await post(API.QualityControlApi.ExportGetAlarmDataList, params, null);
  return result;
}