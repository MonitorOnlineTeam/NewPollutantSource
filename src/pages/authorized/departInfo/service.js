import { async } from 'q';
import { post, get } from '@/utils/request';

//报警关联列表
export async function GetAlarmPushDepOrRole(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetAlarmPushDepOrRole', params, null);

  return result;
}
//报警关联  选择
export async function InsertAlarmDepOrRole(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/InsertAlarmDepOrRole', params, null);

  return result;
}
// 获取部门详细信息及层级关系
export async function getdepartinfobytree(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetDepInfoByTree', params);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取单个部门信息
export async function getdepartinfobyid(params) {
  const body = {
    UserGroup_ID: params.UserGroup_ID,
  };
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetDepartInfoByID', body);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 新增部门信息
export async function insertdepartinfo(params) {
  const body = {
    ParentId: params.ParentId,
    UserGroup_Name: params.UserGroup_Name,
    UserGroup_Remark: params.UserGroup_Remark,
  };
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/InsertDepartInfo', body);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 删除部门信息
export async function deldepartinfo(params) {
  const body = {
    UserGroup_ID: params.UserGroup_ID,
  };
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/DelDepartInfo', body);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 修改部门信息
export async function upddepartinfo(params) {
  const body = {
    UserGroup_ID: params.UserGroup_ID,
    ParentId: params.ParentId,
    UserGroup_Name: params.UserGroup_Name,
    UserGroup_Remark: params.UserGroup_Remark,
  };
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/UpdDepartInfo', body);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取部门树(带根节点)
export async function getdeparttreeandobj(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetDepartTreeAndObj', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取所有用户
export async function getalluser(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetAllUser', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取当前部门的用户
export async function getuserbydepid(params) {
  const body = {
    UserGroup_ID: params.UserGroup_ID,
  };
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetUserByDepID', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 给部门添加用户（可批量）
export async function insertdepartbyuser(params) {
  const body = {
    UserGroup_ID: params.UserGroup_ID,
    User_ID: params.User_ID,
  };
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/InsertDepartByUser', body, null);
  // return result === null
  //   ? {
  //       data: null,
  //     }
  //   : result;
  return result;
}
// 给部门添加行政区（可批量）
export async function insertregionbyuser(params) {
  const body = {
    UserGroup_ID: params.UserGroup_ID,
    RegionCode: params.RegionCode,
    ...params,
  };
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/InsertRegionByUser', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取当前部门的行政区
export async function getregionbydepid(params) {
  const body = {
    UserGroup_ID: params.UserGroup_ID,
  };
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetRegionByDepID', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取行政区详细信息及层级关系
export async function getregioninfobytree(params) {
  // const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetRegionInfoByTree', params);
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetXuRegions', params);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取企业+排口
export async function getentandpoint(params) {
  const body = {
    PollutantTypes: params.PollutantType,
    RegionCode: params.RegionCode,
    Name:params.Name,
    Status: [],
  };
  const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntAndPoint', body);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取当前部门的排口
export async function getpointbydepid(params, isUser) {
  const body = {
    UserGroup_ID: params.UserGroup_ID,
    PollutantType: params.PollutantType,
  };
  const result = post(
    `/api/rest/PollutantSourceApi/AuthorApi/${isUser ? 'GetPointByDepID' : 'GetPointByDepIDBW'}`,
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 给当前部门添加排口权限(可批量)
export async function insertpointfilterbydepid(params) {
  const body = {
    UserGroup_ID: params.UserGroup_ID,
    DGIMN: params.DGIMN,
    Type: params.Type,
    RegionCode: params.RegionCode,
  };
  const result = post(
    '/api/rest/PollutantSourceApi/AuthorApi/InsertPointFilterByDepID',
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 是否显示区域过滤
export async function getGroupRegionFilter(params) {
  const result = get('/api/rest/PollutantSourceApi/BaseDataApi/GetGroupRegionFilter', params, null);
  return result;
}

// 更新运维区域
export async function UpdateOperationArea(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/UserInfosApi/UpdateOperationArea',
    params,
    null,
  );
  return result;
}

// 审核流程列表
export async function GetUserDepApproveInfo(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetUserDepApproveInfo', params, null);
  return result;
}

// 审核流程 添加or修改
export async function AddOrUpdateUserDepApprove(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/AuthorApi/AddOrUpdateUserDepApprove',
    params,
    null,
  );
  return result;
}
// 用户列表
export async function GetUserList(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetUserList', params, null);
  return result;
}
// 审核流程 添加or修改
export async function DeleteUserDepApprove(params) {
  const result = post('/api/rest/PollutantSourceApi/AuthorApi/DeleteUserDepApprove', params, null);
  return result;
}
// 获取省区
export async function GetAllProvince(params) {
  const result = post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/GetAllProvince',
    params,
    null,
  );
  return result;
}
// 添加/编辑大区经理或省区经理
export async function InsOrUpdProvinceOrRegional(params) {
  const result = post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/InsOrUpdProvinceOrRegional',
    params,
    null,
  );
  return result;
}
// 获取大区下的所有经理详情
export async function GetProvinceOrRegionalList(params) {
  const result = post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/GetProvinceOrRegionalList',
    params,
    null,
  );
  return result;
}
// 删除大区或省区经理
export async function DeleteProvinceOrRegionalOne(params) {
  const result = post(
    '/newApi/rest/PollutantSourceApi/DailyWorkBaseApi/DeleteProvinceOrRegionalOne',
    params,
    null,
  );
  return result;
}
