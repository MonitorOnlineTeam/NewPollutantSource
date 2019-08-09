import { post, get } from '../dvapack/request';
export async function GetAlarmNotices(params) {
  const body = {
    beginTime: params.beginTime,
    endTime: params.endTime,
  };
  const result = await get('/api/rest/PollutantSourceApi/PAlarmData/GetAlarmNotices', body, null);
  return result === null ? { data: null } : result;
}
// 获取我的通知
export async function mymessagelist(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    beginTime: params.beginTime,
    endTime: params.endTime,
  };
  if (params.isView !== undefined)
    //保存是否已读
    body.isAsc = params.isView;
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/GetMyMessageList', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
