
import { async } from 'q';
import { post, get } from '@/utils/request';

// 获取部门详细信息及层级关系
export async function getdepartinfobytree(params) {
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetDepInfoByTree', params);
    return result === null ? {
        data: null,
    } : result;
}
// 获取单个部门信息
export async function getdepartinfobyid(params) {
    const body = {
        UserGroup_ID: params.UserGroup_ID,
    };
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetDepartInfoByID', body);
    return result === null ? {
        data: null,
    } : result;
}
// 新增部门信息
export async function insertdepartinfo(params) {
    const body = {
        ParentId: params.ParentId,
        UserGroup_Name: params.UserGroup_Name,
        UserGroup_Remark: params.UserGroup_Remark,
    };
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/InsertDepartInfo', body);
    return result === null ? {
        data: null,
    } : result;
}
// 删除部门信息
export async function deldepartinfo(params) {
    const body = {
        UserGroup_ID: params.UserGroup_ID,
    };
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/DelDepartInfo', body);
    return result === null ? {
        data: null,
    } : result;
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
    return result === null ? {
        data: null,
    } : result;
}
// 获取部门树(带根节点)
export async function getdeparttreeandobj(params) {
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetDepartTreeAndObj', params, null);
    return result === null ? {
        data: null,
    } : result;
}
// 获取所有用户
export async function getalluser(params) {
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetAllUser', params, null);
    return result === null ? {
        data: null,
    } : result;
}
// 获取当前部门的用户
export async function getuserbydepid(params) {
    const body = {
        UserGroup_ID: params.UserGroup_ID,
    }
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetUserByDepID', body, null);
    return result === null ? {
        data: null,
    } : result;
}
// 给部门添加用户（可批量）
export async function insertdepartbyuser(params) {
    const body = {
        UserGroup_ID: params.UserGroup_ID,
        User_ID: params.User_ID,
    }
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/InsertDepartByUser', body, null);
    return result === null ? {
        data: null,
    } : result;
}
// 给部门添加行政区（可批量）
export async function insertregionbyuser(params) {
    const body = {
        UserGroup_ID: params.UserGroup_ID,
        RegionCode: params.RegionCode,
    }
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/InsertRegionByUser', body, null);
    return result === null ? {
        data: null,
    } : result;
}
// 获取当前部门的行政区
export async function getregionbydepid(params) {
    const body = {
        UserGroup_ID: params.UserGroup_ID,
    }
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetRegionByDepID', body, null);
    return result === null ? {
        data: null,
    } : result;
}
// 获取行政区详细信息及层级关系
export async function getregioninfobytree(params) {
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetRegionInfoByTree', params);
    return result === null ? {
        data: null,
    } : result;
}
// 获取企业+排口
export async function getentandpoint(params) {
    const body = {
        PollutantTypes: params.PollutantType,
        RegionCode: params.RegionCode,
    }
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetEntAndPoint', body);
    return result === null ? {
        data: null,
    } : result;
}
// 获取当前部门的排口
export async function getpointbydepid(params) {
    const body = {
        UserGroup_ID: params.UserGroup_ID,
        PollutantType: params.PollutantType,
    }
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/GetPointByDepID', body, null);
    return result === null ? {
        data: null,
    } : result;
}
// 给当前部门添加排口权限(可批量)
export async function insertpointfilterbydepid(params) {
    const body = {
        UserGroup_ID: params.UserGroup_ID,
        DGIMN: params.DGIMN,
        Type: params.Type,
        RegionCode: params.RegionCode,
    }
    const result = post('/api/rest/PollutantSourceApi/AuthorApi/InsertPointFilterByDepID', body, null);
    return result === null ? {
        data: null,
    } : result;
}
// 是否显示区域过滤
export async function getGroupRegionFilter(params) {
    const result = get('/api/rest/PollutantSourceApi/BaseDataApi/GetGroupRegionFilter', params, null);
    return result;
}
