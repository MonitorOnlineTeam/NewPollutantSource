import request, { post, get } from '@/utils/request';
import { API } from '@config/API'

import Cookie from 'js-cookie';

export async function query() {
    return request('/api/users');
}
export async function queryCurrent() {
    return request('/api/currentUser');
}
export async function queryNotices() {
    return []; // request('/api/notices');
}

/**
 * 获取权限菜单
 */
export async function getMenuData(payload) {
    const body = {
        menu_id: sessionStorage.getItem("sysMenuId") || '99dbc722-033f-481a-932a-3c6436e17245',
        // ...payload
    };
    const result = await post(API.systemApi.GetSysMenuByUserID, body);
    // return {
    //     "IsSuccess": true,
    //     "Message": "操作成功！",
    //     "Datas": [
    //         {
    //             "id": "289c2fe0-b4cf-437f-8cfd-808ae8a0c7c3",
    //             "name": "应急值守",
    //             "path": "/emergency/emergencyDuty",
    //             "icon": "AlertOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergency/emergencyDuty",
    //             "desc": "应急值守",
    //             "breadcrumbNames": "应急值守",
    //             "parentUrl": "/emergency/emergencyDuty",
    //             "children": []
    //         },
    //         {
    //             "id": "002c5afb-a3de-46f8-a529-d5b7bef5a48d",
    //             "name": "应急处置",
    //             "path": "/emergency/disposal",
    //             "icon": "FileProtectOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergency/disposal",
    //             "desc": "应急处置",
    //             "breadcrumbNames": "应急处置",
    //             "parentUrl": "/emergency/disposal",
    //             "children": []
    //         },
    //         {
    //             "id": "7d3d940e-2fab-4b12-bbe8-97e7a8d166fd",
    //             "name": "应急专家管理",
    //             "path": "/emergencyManagement/autoformmanager/Expert",
    //             "icon": "UserOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergencyManagement/autoformmanager/Expert",
    //             "desc": "应急专家管理",
    //             "breadcrumbNames": "应急专家管理",
    //             "parentUrl": "/emergencyManagement/autoformmanager/Expert",
    //             "children": []
    //         },
    //         {
    //             "id": "e2e14bdf-787e-4146-a104-2f71a1578fc8",
    //             "name": "应急物资管理",
    //             "path": "/emergencyManagement/autoformmanager/Material",
    //             "icon": "InboxOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergencyManagement/autoformmanager/Material",
    //             "desc": "应急物资管理",
    //             "breadcrumbNames": "应急物资管理",
    //             "parentUrl": "/emergencyManagement/autoformmanager/Material",
    //             "children": []
    //         },
    //         {
    //             "id": "f4c04eb3-78d4-474e-b294-88d95983fcee",
    //             "name": "应急车辆管理",
    //             "path": "/emergencyManagement/autoformmanager/Vehicle",
    //             "icon": "CarOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergencyManagement/autoformmanager/Vehicle",
    //             "desc": "应急车辆管理",
    //             "breadcrumbNames": "应急车辆管理",
    //             "parentUrl": "/emergencyManagement/autoformmanager/Vehicle",
    //             "children": []
    //         },
    //         {
    //             "id": "2f38ea54-e56d-4425-8ffe-3e8497cf04a4",
    //             "name": "应急装备管理",
    //             "path": "/emergencyManagement/autoformmanager/EquipmentNew",
    //             "icon": "AppstoreOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergencyManagement/autoformmanager/EquipmentNew",
    //             "desc": "应急装备管理",
    //             "breadcrumbNames": "应急装备管理",
    //             "parentUrl": "/emergencyManagement/autoformmanager/EquipmentNew",
    //             "children": []
    //         },
    //         {
    //             "id": "98900a2a-2c83-4c8e-86c3-7b63db709983",
    //             "name": "应急预案管理",
    //             "path": "/emergencyManagement/autoformmanager/Plan",
    //             "icon": "FileExclamationOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergencyManagement/autoformmanager/Plan",
    //             "desc": "应急预案管理",
    //             "breadcrumbNames": "应急预案管理",
    //             "parentUrl": "/emergencyManagement/autoformmanager/Plan",
    //             "children": []
    //         },
    //         {
    //             "id": "7d3fa916-2e9c-4b01-8574-4147835ea946",
    //             "name": "救援队伍管理",
    //             "path": "/emergencyManagement/autoformmanager/RescueTeam",
    //             "icon": "UsergroupAddOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergencyManagement/autoformmanager/RescueTeam",
    //             "desc": "应急队伍管理",
    //             "breadcrumbNames": "救援队伍管理",
    //             "parentUrl": "/emergencyManagement/autoformmanager/RescueTeam",
    //             "children": []
    //         },
    //         {
    //             "id": "1b6cf029-62d6-4e8a-9b62-5dfe58232515",
    //             "name": "应急志愿者管理",
    //             "path": "/emergencyManagement/autoformmanager/Volunteer",
    //             "icon": "UserOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergencyManagement/autoformmanager/Volunteer",
    //             "desc": "应急志愿者管理",
    //             "breadcrumbNames": "应急志愿者管理",
    //             "parentUrl": "/emergencyManagement/autoformmanager/Volunteer",
    //             "children": []
    //         },
    //         {
    //             "id": "15fa7bf3-f91e-4104-aa33-736eddafbf3f",
    //             "name": "应急医院管理",
    //             "path": "/emergencyManagement/autoformmanager/Hospital",
    //             "icon": "BankOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergencyManagement/autoformmanager/Hospital",
    //             "desc": "应急医院管理",
    //             "breadcrumbNames": "应急医院管理",
    //             "parentUrl": "/emergencyManagement/autoformmanager/Hospital",
    //             "children": []
    //         },
    //         {
    //             "id": "890f257a-fd02-4f21-990c-d4b0b5740b2e",
    //             "name": "应急避难场所管理",
    //             "path": "/emergencyManagement/autoformmanager/Shelter",
    //             "icon": "HomeOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergencyManagement/autoformmanager/Shelter",
    //             "desc": "应急避难场所管理",
    //             "breadcrumbNames": "应急避难场所管理",
    //             "parentUrl": "/emergencyManagement/autoformmanager/Shelter",
    //             "children": []
    //         },
    //         {
    //             "id": "641357d0-ae1e-480b-a1ee-13b8f097d063",
    //             "name": "应急人员管理",
    //             "path": "/emergencyManagement/autoformmanager/EmergencyCrew",
    //             "icon": "UserOutlined",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergencyManagement/autoformmanager/EmergencyCrew",
    //             "desc": "应急人员管理",
    //             "breadcrumbNames": "应急人员管理",
    //             "parentUrl": "/emergencyManagement/autoformmanager/EmergencyCrew",
    //             "children": []
    //         },
    //         {
    //             "id": "bc9df78c-971a-4d79-9980-cf1f86bf6263",
    //             "name": "值班计划管理",
    //             "path": "/emergency/dutyPlan",
    //             "icon": "32/32",
    //             "Target": "Iframe",
    //             "NavigateUrl": "/emergency/dutyPlan",
    //             "desc": "值班计划管理",
    //             "breadcrumbNames": "值班计划管理",
    //             "parentUrl": "/emergency/dutyPlan",
    //             "children": []
    //         }
    //     ],
    //     "Total": 13,
    //     "StatusCode": 200
    // }
    return result;
}

// 根据id获取用户实体
export async function getUserInfo(params) {
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

// //  个人设置编辑用户
// export async function editpersonaluser(params) {
//   const body = {
//     User_ID: params.UserId,
//     User_Name: params.UserName,
//     User_Sex: params.UserSex,
//     Email: params.Email,
//     Phone: params.Phone,
//     SendPush: params.SendPush,
//     AlarmType: params.AlarmType,
//     AlarmTime: params.AlarmTime,
//   };
//   const result = post('/api/rest/PollutantSourceApi/PUserInfo/EditUser', body, null);
//   return result === null
//     ? {
//       data: null,
//     }
//     : result;
// }


// 验证旧密码是否一致
export async function vertifyOldPwd(params) {
    const result = await post(API.LoginApi.VertifyOldPwd, params);
    return result;
}

// 修改密码
export async function changePwd(params) {
    const body = Object.assign(params);
    const result = await post(API.LoginApi.ChangePwd, body);
    return result;
}

// 获取角色或部门报警权限数据
export async function getAlarmPushAuthor(params) {
    const result = await get(API.AuthorityApi.GetAlarmPushAuthor, params);

    return result;
}

// 获取角色或部门报警权限数据
export async function insertAlarmPushAuthor(params) {
    const result = await post(API.AuthorityApi.InsertAlarmPushAuthor, params);
    return result;
}
// 是否显示预警多选框
export async function getAlarmState(params) {
    const result = await get('/api/rest/PollutantSourceApi/BaseDataApi/GetAlarmState', params);
    return result;
}

/**
 * 获取企业
 */
export async function getEnterpriseList(params) {
    const result = await post(
        `/api/rest/PollutantSourceApi/MonitorTargetApi/GetTargetList?regionCode=${params.regionCode}&pollutantTypeCode=${params.pollutantTypeCode}`,
        {},
        null,
    );
    return result === null ? { data: null } : result;
}

/**
 * 获取下载手机端二维码信息
 */
export async function GetAndroidOrIosSettings(params) {
    const result = await get(
        '/api/rest/PollutantSourceApi/SystemSettingApi/GetAndroidOrIosSettings',
        params,
    );
    return result;
}
