/* eslint-disable import/prefer-default-export */
/**
 * 功  能：监测点服务
 * 创建人：吴建伟
 * 创建时间：2019.10.30
 */

import Cookie from 'js-cookie';
import { post, get } from '@/utils/request';
import { async } from 'q';

/**
 * 添加监测点
 * @params {
            "BaseType": 1,
            "TargetId": "sample string 2",
            "Point": {
            "PointCode": "sample string 1",
            "PointName": "sample string 2",
            "DGIMN": "sample string 3",
            "PointType": 1,
            "RunState": 1,
            "Longitude": 1.0,
            "Latitude": 1.0,
            "RegionCode": "sample string 4",
            "UpdateDate": "2019-10-30 11:40:50",
            "Linkman": "sample string 5",
            "MobilePhone": "sample string 6",
            "MonitorDepartment": "sample string 7",
            "Comment": "sample string 8",
            "Photo": "sample string 9",
            "AirArea": 1,
            "IsExistCamera": "sample string 10",
            "PollutantType": "sample string 11",
            "DevicePassword": "sample string 12",
            "ValleyCode": "sample string 13",
            "TargetQuality": 1,
            "GridTypeCode": 14,
            "RelationControl": "sample string 15",
            "AutoMonitorInstrument": "sample string 16",
            "IsSj": "sample string 17",
            "FuelTypeCode": "sample string 18",
            "BurningModeCode": "sample string 19",
            "GasOutputTypeCode": "sample string 20",
            "OutputDiameter": "sample string 21",
            "OutputHigh": "sample string 22",
            "SurfaceWaterLevel": "sample string 23",
            "SurfaceWaterProperty": "sample string 24",
            "QualityStatus": 1,
            "OutputType": "sample string 25",
            "OutPutWhitherCode": "sample string 26",
            "Col1": "sample string 27",
            "Col2": "sample string 28",
            "Col3": "sample string 29",
            "Col4": "sample string 30",
            "Col5": "sample string 31",
            "Col6": "sample string 32",
            "Col7": "sample string 33",
            "Col8": "sample string 34",
            "Col9": "sample string 35",
            "Col10": "sample string 36",
            "LockAlarmDateTime": "2019-10-30 11:40:50",
            "Sort": 1,
            "CemsCode": "sample string 37",
            "CemsSupplier": "sample string 38",
            "GasCemsSupplier": "sample string 39",
            "GasCemsCode": "sample string 40",
            "PmCemsSupplier": "sample string 41",
            "PmCemsCode": "sample string 42",
            "WhetherToSend": true,
            "MinuteDataCount": 1
            }
}
 */
export async function addPoint(params) {
    // console.log("params=",params);
    const result = await post('/api/rest/PollutantSourceApi/MonitorPointApi/AddPoint', params);
    return result;
}


export async function getEnterpriseCorporationCode(params) {
    // console.log("params=",params);
    const result = await post('/api/rest/PollutantSourceApi/MonitorPointApi/GetEnterpriseCorporationCode', params);
    return result;
}

/**
 * 修改监测点
 * @params {
            "BaseType": 1,
            "TargetId": "sample string 2",
            "Point": {
            "PointCode": "sample string 1",
            "PointName": "sample string 2",
            "DGIMN": "sample string 3",
            "PointType": 1,
            "RunState": 1,
            "Longitude": 1.0,
            "Latitude": 1.0,
            "RegionCode": "sample string 4",
            "UpdateDate": "2019-10-30 11:40:50",
            "Linkman": "sample string 5",
            "MobilePhone": "sample string 6",
            "MonitorDepartment": "sample string 7",
            "Comment": "sample string 8",
            "Photo": "sample string 9",
            "AirArea": 1,
            "IsExistCamera": "sample string 10",
            "PollutantType": "sample string 11",
            "DevicePassword": "sample string 12",
            "ValleyCode": "sample string 13",
            "TargetQuality": 1,
            "GridTypeCode": 14,
            "RelationControl": "sample string 15",
            "AutoMonitorInstrument": "sample string 16",
            "IsSj": "sample string 17",
            "FuelTypeCode": "sample string 18",
            "BurningModeCode": "sample string 19",
            "GasOutputTypeCode": "sample string 20",
            "OutputDiameter": "sample string 21",
            "OutputHigh": "sample string 22",
            "SurfaceWaterLevel": "sample string 23",
            "SurfaceWaterProperty": "sample string 24",
            "QualityStatus": 1,
            "OutputType": "sample string 25",
            "OutPutWhitherCode": "sample string 26",
            "Col1": "sample string 27",
            "Col2": "sample string 28",
            "Col3": "sample string 29",
            "Col4": "sample string 30",
            "Col5": "sample string 31",
            "Col6": "sample string 32",
            "Col7": "sample string 33",
            "Col8": "sample string 34",
            "Col9": "sample string 35",
            "Col10": "sample string 36",
            "LockAlarmDateTime": "2019-10-30 11:40:50",
            "Sort": 1,
            "CemsCode": "sample string 37",
            "CemsSupplier": "sample string 38",
            "GasCemsSupplier": "sample string 39",
            "GasCemsCode": "sample string 40",
            "PmCemsSupplier": "sample string 41",
            "PmCemsCode": "sample string 42",
            "WhetherToSend": true,
            "MinuteDataCount": 1
            }
}
 */
export async function updatePoint(params) {
    // console.log("params=",params);
    const result = await post('/api/rest/PollutantSourceApi/MonitorPointApi/UpdatePoint', params);
    return result;
}

/**
 * 删除监测点（支持批量）
 * @params {
          "params": ["31011500000002"]
    }
 */
export async function deletePoints(params) {
    // console.log("params=",params);
    const result = await post('/api/rest/PollutantSourceApi/MonitorPointApi/DeletePoints', params, null);
    return result;
}
//出厂测试
export async function factoryTest(params) {
    // console.log("params=",params);
    const result = await get('/api/rest/PollutantSourceApi/MonitorPointApi/FactoryTest', params, null);
    return result;
}

/**
 * 根据批量监控目标Id获取监测点
 * @params {
          "params": ["31011500000002"]
    }
 */
export async function queryPointForTarget(params) {
    const result = await post('/api/rest/PollutantSourceApi/MonitorPointApi/queryPointForTarget', params, null);
    return result;
}
export async function GetComponent(params) {
    const result = await post('/api/rest/PollutantSourceApi/AnalyzerApi/GetComponent', params, null);
    return result;
}
export async function GetMainInstrumentName(params) {
    const result = await post('/api/rest/PollutantSourceApi/AnalyzerApi/GetMainInstrumentName', params, null);
    return result;
}
export async function GetChildCems(params) {
    const result = await post('/api/rest/PollutantSourceApi/AnalyzerApi/GetChildCems', params, null);
    return result;
}
export async function AddAnalyzer(params) {
    const result = await post('/api/rest/PollutantSourceApi/AnalyzerApi/AddAnalyzer', params, null);
    return result;
}
export async function GetAnalyzerListByDGIMN(params) {
    const result = await post(`/api/rest/PollutantSourceApi/AnalyzerApi/GetAnalyzerListByDGIMN?DGIMN=${params.DGIMN}`, null, null);
    return result;
}
export async function UpdatePointDGIMN(params) { //更新MN号
    const result = await post(`/api/rest/PollutantSourceApi/MonitorPointApi/UpdatePointDGIMN`, params, null);
    return result;
}
export async function GetMonitorPointVerificationItem(params) { //获取点位关联数据核查信息
    const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/GetMonitorPointVerificationItem`, params, null);
    return result;
}

export async function GetMonitorPointVerificationList(params) { //获取数据核查信息码表
    const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/GetMonitorPointVerificationList`, params, null);
    return result;
}

export async function AddMonitorPointVerificationItem(params) { //添加或者修改点位关联数据核查信息
    const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/AddMonitorPointVerificationItem`, params, null);
    return result;
}

export async function GetParamInfoList(params) { //获取设备参数项列表
    const result = await post(`/api/rest/PollutantSourceApi/OperationBasicApi/GetParamInfoList`, params, null);
    return result;
}

export async function GetParamCodeList(params) { //设备参数项码表
    const result = await post(`/api/rest/PollutantSourceApi/OperationBasicApi/GetParamCodeList`, params, null);
    return result;
}

export async function AddPointParamInfo(params) { //添加设备参数项
    const result = await post(`/api/rest/PollutantSourceApi/OperationBasicApi/AddPointParamInfo`, params, null);
    return result;
}



/*******监测点设备管理  ***** */
export async function GetPointEquipmentInfo(params) { //获取站点设备信息
    const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/GetPointEquipmentInfo`, params, null);
    return result;
}

export async function AddOrUpdateEquipmentInfo(params) { //添加或者修改设备参数信息
    const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/AddOrUpdateEquipmentInfo`, params, null);
    return result;
}

export async function GetPointEquipmentParameters(params) { //列表显示
    const result = await post(`/api/rest/PollutantSourceApi/BaseDataApi/GetPointEquipmentParameters`, params, null);
    return result;
}


export async function GetManufacturerList(params) { //设备厂商 列表
    const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetManufacturerList',params, null);
    return result;
  }

export async function GetMonitoringTypeList(params) { // 获取监测类别
    const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetMonitoringTypeList',params, null);
    return result;
  }