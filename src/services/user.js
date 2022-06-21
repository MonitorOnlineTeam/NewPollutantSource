import request, { post, get } from '@/utils/request';

import Cookie from 'js-cookie';

import { async } from 'q';
// import { JSEncrypt } from 'jsencrypt';
import { encryptKey } from '@/utils/utils';

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
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/GetSysMenuByUserID', body);
  // ;
  // return result;
  return {
    "IsSuccess": true,
    "Message": "操作成功！",
    "Datas": [
        {
            "id": "22d7063e-9bd4-4118-b157-358dbc41ac2e",
            "name": "基础信息库",
            "path": "/map/thematicMap",
            "icon": "AimOutlined",
            "Target": "Iframe",
            "NavigateUrl": "/map/thematicMap",
            "desc": "基础信息库",
            "breadcrumbNames": "基础信息库",
            "parentUrl": "/map/thematicMap",
            "children": []
        },
        {
            "id": "3a28c422-621e-4974-9e3a-6b383ce0374e",
            "name": "环境GIS专题应用",
            "path": "/30",
            "icon": "AimOutlined",
            "Target": "Iframe",
            "NavigateUrl": "/30",
            "desc": "环境GIS专题应用",
            "breadcrumbNames": "环境GIS专题应用",
            "parentUrl": "/30",
            "children": [
                {
                    "id": "597b1148-bf64-4fc8-ae41-6a0b712c5e34",
                    "name": "空气质量专题图",
                    "path": "/map/thematicMap/5",
                    "icon": "AimOutlined",
                    "Target": "Iframe",
                    "NavigateUrl": "/map/thematicMap/5",
                    "desc": "空气质量专题图",
                    "breadcrumbNames": "环境GIS专题应用/空气质量专题图",
                    "parentUrl": "/30,/map/thematicMap/5",
                    "children": []
                },
                {
                    "id": "f0b4f57f-c22e-40de-915b-a0af6227ecd3",
                    "name": "污染源管控专题图",
                    "path": "/map/thematicMap/2",
                    "icon": "AimOutlined",
                    "Target": "Iframe",
                    "NavigateUrl": "/map/thematicMap/2",
                    "desc": "污染源管控专题图",
                    "breadcrumbNames": "环境GIS专题应用/污染源管控专题图",
                    "parentUrl": "/30,/map/thematicMap/2",
                    "children": []
                },
                {
                    "id": "60a36f79-3186-4e2c-9c06-7f8be9cc230e",
                    "name": "污染溯源分析",
                    "path": "/31",
                    "icon": "FileTextOutlined",
                    "Target": "Iframe",
                    "NavigateUrl": "/31",
                    "desc": "污染溯源分析",
                    "breadcrumbNames": "环境GIS专题应用/污染溯源分析",
                    "parentUrl": "/30,/31",
                    "children": []
                },
                {
                    "id": "6c6a7a11-a039-41c3-a5e4-8ca4e3c1683f",
                    "name": "克里金差值图测试",
                    "path": "/krigingMap",
                    "icon": "CompassOutlined",
                    "Target": "Iframe",
                    "NavigateUrl": "/krigingMap",
                    "desc": "克里金差值图测试",
                    "breadcrumbNames": "环境GIS专题应用/克里金差值图测试",
                    "parentUrl": "/30,/krigingMap",
                    "children": []
                },
                {
                    "id": "45e3362a-bf26-4bc8-9ae0-a4f58b784ea0",
                    "name": "排放量克里金插值测试",
                    "path": "/emissionsKrigingMap",
                    "icon": "CompassOutlined",
                    "Target": "Iframe",
                    "NavigateUrl": "/emissionsKrigingMap",
                    "desc": "排放量克里金插值测试",
                    "breadcrumbNames": "环境GIS专题应用/排放量克里金插值测试",
                    "parentUrl": "/30,/emissionsKrigingMap",
                    "children": []
                }
            ]
        }
    ],
    "Total": 2,
    "StatusCode": 200
}
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

// 获取登陆配置信息
export async function getSystemConfigInfo() {
  const body = {};
  const result = authorpost(
    '/api/rest/PollutantSourceApi/SystemSettingApi/getLoginInfo?authorCode=48f3889c-af8d-401f-ada2-c383031af92d',
    body,
    null,
  );
  return result === null
    ? {
      data: null,
    }
    : result;
}

// 验证旧密码是否一致
export async function vertifyOldPwd(params) {
  // const results = await get('/api/rest/PollutantSourceApi/SystemSettingApi/GetSystemConfigInfo');
  // //获取配置，判断配置是否开启弱口令0开启 1禁止
  // if (results.Datas.ClearTransmission == 0) {
  //   var encrypt = new window.JSEncrypt();
  //   encrypt.setPublicKey(encryptKey);
  //   params.pwd = encrypt.encrypt(params.pwd);
  // }
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/VertifyOldPwd', params);
  return result;
}

// 修改密码
export async function changePwd(params) {
  const body = Object.assign(params);
  // const results = await get('/api/rest/PollutantSourceApi/SystemSettingApi/GetSystemConfigInfo');
  // //获取配置，判断配置是否开启弱口令0开启 1禁止
  // if (results.Datas.ClearTransmission == 0) {
  //   var encrypt = new window.JSEncrypt();
  //   encrypt.setPublicKey(encryptKey);
  //   body.pwd = encrypt.encrypt(params.pwd);
  // }
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/ChangePwd', body);
  return result;
}

// 获取角色或部门报警权限数据
export async function getAlarmPushAuthor(params) {
  const result = await get('/api/rest/PollutantSourceApi/AuthorApi/GetAlarmPushAuthor', params);

  return result;
}

// 获取角色或部门报警权限数据
export async function insertAlarmPushAuthor(params) {
  const result = await post('/api/rest/PollutantSourceApi/AuthorApi/InsertAlarmPushAuthor', params);
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
