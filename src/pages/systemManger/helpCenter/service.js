import { post, get, getNew } from '@/utils/request';

/**
 * 帮助中心
 */

 
// 问题列表  
export async function GetQuestionDetialList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetQuestionDetialList',params, null);
  return result;
}


// 问题类别
export async function GetHelpCenterList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetHelpCenterList',params, null);
  return result;
}
