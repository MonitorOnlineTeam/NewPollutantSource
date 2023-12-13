import { post, get, getNew } from '@/utils/request';
import { API } from '@config/API';

//督查类别清单 列表
export async function GetInspectorTypeItemList(params) {
  const result = await post(API.SupervisionVerificaApi.GetSupervisionQuestionTypeList, params, null);
  return result;
}

//督查类别清单 添加or修改
export async function AddOrEditInspectorTypeItem(params) {
  const result = await post(API.SupervisionVerificaApi.AddOrUpdateSupervisionQuestionTypeInfo, params, null);
  return result;
}

//督查类别 下拉列表
export async function GetInspectorTypeCode(params) {
  const result = await post(API.SupervisionVerificaApi.GetSupervisionQuestionTypeCodeList, params, null);
  return result;
}

//督查类别清单 删除
export async function DeleteInspectorType(params) {
  const result = await post(`${API.SupervisionVerificaApi.DeleteSupervisionQuestionTypeInfo}?ID=${params.ID}`, null, null);
  return result;
}

//督查类别清单 更改状态
export async function ChangeInspectorTypeStatus(params) {
  const result = await post(`${API.SupervisionVerificaApi.ChangeSupervisionQuestionTypeStatus}?ID=${params.ID}&&Status=${params.Status}`, null, null);
  return result;
}


//督查模板 列表
export async function GetInspectorTemplateList(params) {
  const result = await post(API.SupervisionVerificaApi.GetSupervisionTemplateList, params, null);
  return result;
}
//督查模板 添加或修改
export async function AddOrEditInspectorTemplate(params) {
  const result = await post(API.SupervisionVerificaApi.AddOrUpdateSupervisionTemplateInfo, params, null);
  return result;
}
//督查模板 删除
export async function DeleteInspectorTemplate(params) {
  const result = await post(`${API.SupervisionVerificaApi.DeleteSupervisionTemplateInfo}?InspectorNum=${params.ID}`, null, null);
  return result;
}
//督查模板 类别描述
export async function GetInspectorTypeList(params) {
  const result = await post(`${API.SupervisionVerificaApi.GetSupervisionQuestionTypeDescribeList}?PollutantType=${params.PollutantType}`, null, null);
  return result;
}

//督查模板 更改模板状态
export async function ChangeInspectorTemplateStatus(params) {
  const result = await post(`${API.SupervisionVerificaApi.ChangeSupervisionTemplateStatus}?InspectorNum=${params.InspectorNum}&&Status=${params.Status}`, null, null);
  return result;
}
//督查模板 督查模板详细
export async function GetInspectorTemplateView(params) {
  const result = await post(`${API.SupervisionVerificaApi.GetSupervisionTemplateDetail}?InspectorNum=${params.InspectorNum}`, null, null);
  return result;
}

