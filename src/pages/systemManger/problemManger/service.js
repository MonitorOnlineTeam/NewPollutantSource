import { post, get, getNew } from '@/utils/request';

/**
 * 问题清单
 */

 
// 列表  
export async function GetQuestionDetialList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetQuestionDetialList',params, null);
  return result;
}
// 添加or修改
export async function AddOrUpdQuestionDetial(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/AddOrUpdQuestionDetial',params, null);
  return result;
}

// 删除
export async function DeleteQuestionDetial(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/DeleteQuestionDetial',params, null);
  return result;
}
// 问题类别
export async function GetHelpCenterList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetHelpCenterList',params, null);
  return result;
}

