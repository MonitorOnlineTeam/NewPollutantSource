/**
 * 功  能：菜单管理
 * 创建人：张哲
 * 创建时间：2019.09.19
 */
import { post, get } from '@/utils/request';
import { API } from '@config/API'

/**
 * 获取菜单管理列表
 */
export async function GetMenuInfos(params) {
    const body = {
    };
    const result = await post('/rest/PollutantSourceApi/AutoFormDataApi/GetMenuInfos', body, null);
    return result === null ? null : result;
}

/**
 * 添加菜单
 */
export async function AddMenuManagement(params) {
    const body = {
        ParentId: params.ParentId,
        Menu_Name: params.Menu_Name,
        Menu_Title: params.Menu_Title,
        Menu_Img: params.Menu_Img,
        NavigateUrl: params.NavigateUrl,
        Target: params.Target,
        SortCode: params.SortCode,
        DeleteMark: params.DeleteMark,
        AllowEdit: params.AllowEdit,//是否首页
    };
    const result = await post(API.autoFormApi.AddMenuManagement, body, null);
    return result === null ? null : result;
}
/** 
 * 修改菜单
 */
export async function UpdateMenuManagement(params) {
    const body = {
        Menu_Id: params.Menu_Id,
        Menu_Name: params.Menu_Name,
        Menu_Title: params.Menu_Title,
        Target: params.Target,
        Menu_Img: params.Menu_Img,
        NavigateUrl: params.NavigateUrl,
        SortCode: params.SortCode,
        DeleteMark: params.DeleteMark,
        TopMenu: params.TopMenu,
        ParentId: params.ParentId,
        AllowEdit: params.AllowEdit,//是否首页
    };
    const result = await post(API.autoFormApi.UpdateMenuManagement, body, null);
    return result === null ? null : result;
}
/**
 * 删除菜单
 */
export async function DelectMenuManagement(params) {
    const body = {
        Menu_Id: params.Menu_Id
    };
    const result = await post(API.autoFormApi.DelectMenuManagement, body, null);
    return result === null ? null : result;
}



