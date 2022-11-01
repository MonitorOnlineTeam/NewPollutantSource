
import { async } from 'q';
import { post, get } from '@/utils/request';
import { API } from '@config/API'

// 获取角色详细信息及层级关系
export async function getroleinfobytree(params) {
    const result = post(API.AuthorityApi.GetRoleInfoByTree, params);
    return result;
}
// 获取单个角色信息
export async function getroleinfobyid(params) {
    const body = {
        Roles_ID: params.Roles_ID
    };
    const result = post(API.AuthorityApi.GetRoleInfoByID, body);
    return result;
}
// 新增角色信息
export async function insertroleinfo(params) {
    const body = {
        ParentId: params.ParentId,
        Roles_Name: params.Roles_Name,
        Roles_Remark: params.Roles_Remark,
    };
    const result = post(API.AuthorityApi.InsertRoleInfo, body);
    return result === null ? {
        data: null
    } : result;
}
// 删除角色信息
export async function delroleinfo(params) {
    const body = {
        Roles_ID: params.Roles_ID,
    };
    const result = post(API.AuthorityApi.DelRoleInfo, body);
    return result === null ? {
        data: null
    } : result;
}
// 修改角色信息
export async function updroleinfo(params) {
    const body = {
        Roles_ID: params.Roles_ID,
        ParentId: params.ParentId,
        Roles_Name: params.Roles_Name,
        Roles_Remark: params.Roles_Remark,
    };
    const result = post(API.AuthorityApi.UpdRoleInfo, body);
    return result === null ? {
        data: null
    } : result;
}
// 获取角色树(带根节点)
export async function getrolestreeandobj(params) {
    const result = post(API.AuthorityApi.GetRolesTreeAndObj, params);
    return result;
}
// 获取所有用户
export async function getalluser(params) {
    const result = post(API.AuthorityApi.GetAllUser, params);
    return result;
}
// 获取当前角色的用户
export async function getuserbyroleid(params) {
    const body = {
        Roles_ID: params.Roles_ID
    }
    const result = post(API.AuthorityApi.GetUserByRoleId, body, null);
    return result === null ? {
        data: null
    } : result;
}
// 给角色添加用户（可批量）
export async function insertrolebyuser(params) {
    const body = {
        Roles_ID: params.Roles_ID,
        User_ID: params.User_ID
    }
    const result = post(API.AuthorityApi.InsertRoleByUser, body, null);
    return result === null ? {
        data: null
    } : result;
}
// 获取根节点下拉选择权限（角色）
export async function getparenttree(params) {
    const result = post(API.AuthorityApi.GetParentTree, params, null);
    return result === null ? {
        data: null
    } : result;
}
// 获取菜单列表层级关系
export async function getrolemenutree(params) {
    const body = {
        Type: params.Type,
        AuthorID: params.AuthorID
    }
    const result = post(API.AuthorityApi.GetRoleMenuTree, body);
    return result === null ? {
        data: null
    } : result;
}
// 获取当前角色的菜单
export async function getmenubyroleid(params) {
    const body = {
        Roles_ID: params.Roles_ID
    }
    const result = post(API.AuthorityApi.GetMenuByRoleID, body, null);
    return result === null ? {
        data: null
    } : result;
}
// 给角色添加菜单（可批量）
export async function insertmenubyroleid(params) {
    const body = {
        Roles_ID: params.Roles_ID,
        MenuID: params.MenuID
    }
    const result = post(API.AuthorityApi.InsertMenuByRoleID, body, null);
    return result === null ? {
        data: null
    } : result;
}
