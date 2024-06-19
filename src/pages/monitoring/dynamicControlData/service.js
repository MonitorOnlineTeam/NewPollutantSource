import { post, get, getNew } from '@/utils/request';

import { API } from '@config/API'

//问题库信息
export async function GetQuestionList(params) {
  const result = post(API.TechExpertSystemApi.GetQuestionList, params);
  return result;
}

//问题库 导出
export async function ExportQuestion(params) {
  const result = post(API.TechExpertSystemApi.ExportQuestion, params);
  return result;
}

//获取问题库导入模板
export async function GetQuestionTemplate(params) {
  const result = post(API.TechExpertSystemApi.GetQuestionTemplate, params);
  return result;
}


//添加修改问题库
export async function AddOrUpdateQuestion(params) {
  const result = post(API.TechExpertSystemApi.AddOrUpdateQuestion, params);
  return result;
}

//删除问题库
export async function DeleteQuestion(params) {
  const result = post(`${API.TechExpertSystemApi.DeleteQuestion}?ID=${params.id}`, null);
  return result;
}