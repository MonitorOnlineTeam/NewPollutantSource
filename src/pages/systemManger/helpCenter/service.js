import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'

/**
 * 帮助中心
 */

 
// 问题列表  
export async function GetQuestionDetialList(params) {
  const result = await post(API.SystemManageApi.GetQuestionList,params, null);
  return result;
}


// 问题类别
export async function GetQuestionType(params) {
  const result = await post(API.SystemManageApi.GetQuestionType,params, null);
  return result;
}
