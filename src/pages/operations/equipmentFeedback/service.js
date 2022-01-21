import { post, get, getNew } from '@/utils/request';

//首页 运营信息统计
export async function GetOperatePointList(params) {
  const result = await post('/api/rest/PollutantSourceApi/OperationHomeApi/GetOperatePointList', params, null);
  return result;
}

