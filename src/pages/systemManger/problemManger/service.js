import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API'
/**
 * 问题清单
 */

 
// 列表  
export async function GetQuestionDetialList(params) {
  const result = await post(API.SystemManageApi.GetQuestionList,params, null);
  return result;
}
// 添加or修改
export async function AddOrUpdQuestionDetial(params) {
  const result = await post(API.SystemManageApi.AddOrUpdateQuestionInfo,params, null);
  return result;
}

// 删除
export async function DeleteQuestionDetial(params) {
  const result = await post(API.SystemManageApi.DeleteQuestionInfo,params, null);
  return result;
}
// 问题类别
export async function GetQuestionType(params) {
  const result = await post(API.SystemManageApi.GetQuestionType,params, null);
  return result;
}

