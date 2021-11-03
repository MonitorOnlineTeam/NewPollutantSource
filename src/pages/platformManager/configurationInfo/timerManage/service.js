import { post, get, getNew } from '@/utils/request';

//定时器 列表
export async function GetOnlineTimerManageList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetOnlineTimerManageList',params, null);
  return result;
}
//定时器 添加
export async function AddOnlineTimerManage(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOnlineTimerManage',params, null);
  return result;
}

// 定时器 修改
export async function EditOnlineTimerManage(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/EditOnlineTimerManage',params, null);
  return result;
}
 
// 定时器  删除
export async function DelOnlineTimerManage(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DelOnlineTimerManage',params, null);
  return result;
}



// AddOnlineTimerManage，EditOnlineTimerManage，DelOnlineTimerManage