import { async } from 'q';
import { post, get, upload } from '@/utils/request';
// 用户列表
export async function getList(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    User_Account: params.UserAccount,
    DeleteMark: params.DeleteMark,
    ...params,
  };

  const result = post('/api/rest/PollutantSourceApi/PUserInfo/GetAllUserInfoNew', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 删除用户
export async function deleteuser(params) {
  const body = {
    UserId: params.UserId,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/DeleteUserInfo', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 用户 启用禁用
export async function enableduser(params) {
  const body = {
    UserId: params.UserId,
    Enalbe: params.Enalbe,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/EnableOrDisableUser', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 验证用户是否存在
export async function isexistenceuser(params) {
  const body = {
    User_Account: params.UserAccount,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/IsExistenceUser', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 增加用户
export async function adduser(params) {
  const body = {
    User_Account: params.UserAccount,
    User_Name: params.UserName,
    User_Sex: params.UserSex,
    Email: params.Email,
    Phone: params.Phone,
    Title: params.Title,
    User_Orderby: params.UserOrderby,
    SendPush: params.SendPush,
    AlarmType: params.AlarmType,
    AlarmTime: params.AlarmTime,
    User_Remark: params.UserRemark,
    DeleteMark: params.DeleteMark,
    Roles_Id: params.RolesId,
    Group_Id: params.Group_Id,
    PinYin: params.PinYin,
    User_Number: params.User_Number,
    RegionId: params.RegionId,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/AddUserInfo', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 根据id获取用户实体
export async function getuser(params) {
  const body = {
    UserId: params.UserId,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/GetUserInfo', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 编辑用户
export async function edituser(params) {
  const body = {
    User_ID: params.UserId,
    User_Account: params.UserAccount,
    User_Name: params.UserName,
    User_Sex: params.UserSex,
    Email: params.Email,
    Phone: params.Phone,
    Title: params.Title,
    User_Orderby: params.UserOrderby,
    SendPush: params.SendPush,
    AlarmType: params.AlarmType,
    AlarmTime: params.AlarmTime,
    User_Remark: params.UserRemark,
    DeleteMark: params.DeleteMark,
    Roles_Id: params.RolesId,
    Group_Id: params.Group_Id,
    PinYin: params.PinYin,
    User_Number: params.User_Number,
    RegionId: params.RegionId,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/EditUserInfo', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取数据过滤监测点列表
export async function userDgimnDataFilter(params) {
  const body = {
    UserId: params.UserId,
    TestKey: params.TestKey,
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/GetUserDgimnDataFilter', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
//  个人设置编辑用户
export async function editpersonaluser(params) {
  const body = {
    User_ID: params.UserId,
    User_Name: params.UserName,
    User_Sex: params.UserSex,
    Email: params.Email,
    Phone: params.Phone,
    SendPush: params.SendPush,
    AlarmType: params.AlarmType,
    AlarmTime: params.AlarmTime,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/EditUser', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取我的派单
export async function getmypielist(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    beginTime: params.beginTime,
    endTime: params.endTime,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/GetMyPieList', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取我的通知
export async function mymessagelist(params) {
  const body = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    beginTime: params.beginTime,
    endTime: params.endTime,
  };
  if (params.isView !== undefined)
    //保存是否已读
    body.isAsc = params.isView;
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/GetMyMessageList', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
/**
 * 【用户管理】设置用户企业权限（支持批量用户同时赋权限）
 * @params [
 * {"UserId":"766f911d-5e41-4bbf-b705-add427a16e77",
 * "EnterpriseIds":["51216eae-8f11-4578-ad63-5127f78f6cca","3cbfa1f4-3e0a-473b-aab0-5a9a168010ee"]
 * },
 * {"UserId":"eb85dbe8-49fd-4918-9ba1-34f7c337bd44",
 * "EnterpriseIds":["51216eae-8f11-4578-ad63-5127f78f6cca","3cbfa1f4-3e0a-473b-aab0-5a9a168010ee"]
 * },
 */
export async function setEnterpriseDataRole(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/UserInfoApi/SetEnterpriseDataRole',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

/**
 * 【用户管理】获取已授权的企业
 * @params {"UserId":"766f911d-5e41-4bbf-b705-add427a16e77"}
 */
export async function getEnterpriseDataRoles(params) {
  const result = post(
    '/api/rest/PollutantSourceApi/UserInfoApi/GetEnterpriseDataRoles',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}
// 获取二维码ip
export async function getip() {
  const body = {
    pageIndex: 1,
    pageSize: 1,
  };
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/GetMyPieList', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取某部门人员信息
export async function GetUserInfoListByGroupId(params) {
  const body = {
    userGroupID: params.userGroupID,
    type: params.type,
  };

  const result = await post(
    '/api/rest/PollutantSourceApi/PUserInfo/GetUserInfoListByGroupId',
    body,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取角色信息
export async function GetUserRoleList() {
  const result = await post('/api/rest/PollutantSourceApi/PUserInfo/GetUserRoleList', {}, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 获取人员行政区
export async function GetUserRegionList() {
  const result = await post('/api/rest/PollutantSourceApi/PUserInfo/GetUserRegionList', {}, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 重置密码
export async function resetPwd(params) {
  const result = await post('/api/rest/PollutantSourceApi/PUserInfo/UpdateUserPwd', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}
/**
 * 基本用户信息-下载模版
 * @param {传递参数} 传递参数
 * @param {操作} 操作项
 */
export async function CreatUserFiles(params) {
  const body = {};
  const result = post('/api/rest/PollutantSourceApi/PUserInfo/CreateUserTemplet', body, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

/**
 * 基本用户信息-上传附件
 * @param {传递参数} 传递参数
 * @param {操作} 操作项
 */
export async function UploadUserfiles(params) {
  const result = await post('/api/rest/PollutantSourceApi/PUserInfo/ImportUserInfo', params, null);
  return result === null
    ? {
        data: null,
      }
    : result;
}

/**
 * 基本用户信息-保存借调用户和部门关系
 * @param {传递参数} 传递参数
 * @param {操作} 操作项
 */
export async function AddUserInfoToLoan(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/PUserInfo/AddUserInfoToLoan',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

/**
 * 基本用户信息-保存借调用户和部门关系
 * @param {传递参数} 传递参数
 * @param {操作} 操作项
 */
export async function GetUserInfoToLoanByUserId(params) {
  const result = await post(
    '/api/rest/PollutantSourceApi/PUserInfo/GetUserInfoToLoanByUserId',
    params,
    null,
  );
  return result === null
    ? {
        data: null,
      }
    : result;
}

// 部门信息
export async function GetDepartmentTree(params) {
  const body = {};
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/GetDepartmentTree', body, null);
  return result === null ? { data: null } : result;
}
// 所有部门信息
export async function GetAllDepartmentTree(params) {
  const body = {};
  const result = await post(
    '/api/rest/PollutantSourceApi/AuthorApi/GetAllDepartmentTree',
    body,
    null,
  );
  return result === null ? { data: null } : result;
}
