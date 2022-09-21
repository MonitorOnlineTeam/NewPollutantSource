import { async } from 'q';
import { post, get } from '@/utils/request';




// 获取部门详细信息及层级关系
export async function  getTestGroupList(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetTestGroupList', params);
  return result;
}

// 新增部门信息
export async function addOrUpdTestGroup(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/AddOrUpdTestGroup', params);
  return result;
}

// 删除部门信息
export async function  deleteTestGroup(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/DeleteTestGroup', params);
  return result;
}



// 获取当前部门的用户
export async function getTestMonitorUserList(params) {

  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetTestMonitorUserList', params, null);
  return result;
}


// 添加用户
export async function addTestMonitorUser(params) {

  const result = post('/api/rest/PollutantSourceApi/AuthorApi/AddTestMonitorUser', params, null);
  return result;
}


// 给部门添加行政区（可批量）
export async function insertregionbyuser(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/InsertRegionByUser', params, null);
  return result;
}
// 获取当前部门的行政区
export async function GetRegionByDepID(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetRegionByDepID', params, null);
  return result;
}
// 获取行政区详细信息及层级关系
export async function getregioninfobytree(params) {
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetXuRegions', params);
  return result;
}
