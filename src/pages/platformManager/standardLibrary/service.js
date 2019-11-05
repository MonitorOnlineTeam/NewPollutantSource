import { post, get } from '@/utils/request';

// 删除标准库
export async function deleteStandardLibrary(params) {
  const result = await get(`/api/rest/PollutantSourceApi/StandardLibraryApi/DeleteStandardLibrary`, params, null);
  return result;
}

// 添加标准库
export async function addStandardLibrary(params) {
  const result = await post(`/api/rest/PollutantSourceApi/StandardLibraryApi/AddStandardLibrary`, params, null);
  return result;
}

// 编辑标准库 - 保存
export async function updateStandardLibrary(params) {
  const result = await post(`/api/rest/PollutantSourceApi/StandardLibraryApi/UpdateStandardLibrary`, params, null);
  return result;
}

// 编辑标准库 - 获取数据
export async function getStandardLibraryByID(params) {
  const result = await get(`/api/rest/PollutantSourceApi/StandardLibraryApi/GetStandardLibraryByID`, params, null);
  return result;
}