import { post, get, getNew } from '@/utils/request';


//运营信息

export async function getOperateRIHPointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOperateRIHPointList',params, null);
  return result;
}


export async function exportOperateRIHPointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/ExportOperateRIHPointList',params, null);
  return result;
}
