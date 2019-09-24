/**
 * 功  能：工作台相关服务
 * 创建人：吴建伟
 * 创建时间：2018.12.26
 */

import {post} from '@/utils/request';
 const pageUrl = {
    Login: '/api/rest/PollutantSourceApi/PAuthor/IsLogins',
    PhoneLogin: '/api/rest/PollutantSourceApi/PUserLogin/PostUserPhoneLogin',
    SendCaptcha: '/api/rest/PollutantSourceApi/PUserLogin/SendCode',
    Menu: '/api/rest/PollutantSourceApi/SysMenu/GetSysMenuByUserId',
    workbench:{
        /**运维历史记录 */
        operationHistoryRecord:'/api/rest/PollutantSourceApi/PTaskProcessing/GetOperationHistoryRecordPageList',
        /**异常报警记录 */
        dataExceptionAlarm:'/api/rest/PollutantSourceApi/NoticeApi/GetDataExceptionAlarmPageList',
        /**率统计 */
        rateStatistics:'/api/rest/PollutantSourceApi/PWorkbench/GetRateStatistics',
        /**排口传输有效率 */
        transmissionEfficiencyForPoints:'/api/rest/PollutantSourceApi/DataStatistics/GetTransmissionEfficiencyForPoints',
        /**排口设备运转率 */
        equipmentOperatingRateForPoints:'/api/rest/PollutantSourceApi/DataStatistics/GetEquipmentOperatingRateForPoints',
        /**排口实时联网率 */
        realTimeNetWorkingRateForPointsPageList:'/api/rest/PollutantSourceApi/DataStatistics/GetRealTimeNetWorkingRateForPointsPageList',
        /**小时监测预警 */
        hourDataOverWarningPageList:'/api/rest/PollutantSourceApi/NoticeApi/GetDataOverWarningPageList',
        /**所有排口超标汇总 */
        allPointOverDataList:'/api/rest/PollutantSourceApi/PWorkbench/GetDataOverAlarmPageList',
        /**获取当前超标排口 */
        overPoints:'/api/rest/PollutantSourceApi/PWorkbench/GetOverPoints',
        /**统计排口状态 */
        statisticsPointStatus:'/api/rest/PollutantSourceApi/PWorkbench/GetStatisticsPointStatus',
    },
    changeMyMessageStatus:'/api/rest/PollutantSourceApi/PWorkbench/SetMyMessageStatus',
    EnterpriseManager:{
        getEnterprise:'/api/rest/PollutantSourceApi/UserInfoApi/GetEnterprise',
        getEnterprisePageList:'/api/rest/PollutantSourceApi/UserInfoApi/GetEnterprisePageList',
        addEnterprise:'/api/rest/PollutantSourceApi/UserInfoApi/AddEnterprise',
        editEnterprise:'/api/rest/PollutantSourceApi/UserInfoApi/EditEnterprise',
        deleteEnterprise:'/api/rest/PollutantSourceApi/UserInfoApi/DeleteEnterprise',
        getAllPointQRCoderZip:'/api/rest/PollutantSourceApi/UserInfoApi/GetAllPointQRCoderZip'
    },
    UserManager:{
        setEnterpriseDataRole:'/api/rest/PollutantSourceApi/UserInfoApi/SetEnterpriseDataRole',
        getEnterpriseDataRoles:'/api/rest/PollutantSourceApi/UserInfoApi/GetEnterpriseDataRoles',
    }
};
/**
 * 【运维记录】运维历史记录
 * @params {"pageIndex": 1,"pageSize": 10,"beginTime": "2018-12-01 00:00:00","endTime": "2019-01-01 00:00:00"}
 */
export async function getOperationHistoryRecordPageList(params) {
    const result = post(pageUrl.workbench.operationHistoryRecord, params, null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 【异常报警】获取异常报警列表
 * @params {"pageIndex": 1,"pageSize": 10,"beginTime": "2018-12-01 00:00:00","endTime": "2018-12-30 00:00:00"}
 */
export async function getDataExceptionAlarmPageList(params) {
    const result = post(pageUrl.workbench.dataExceptionAlarm, params, null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 【率统计】获取率的统计
 * @params { "beginTime": "2018-12-01 00:00:00","endTime": "2018-12-30 00:00:00"}
 */
export async function getRateStatistics(params) {
    const result = post(pageUrl.workbench.rateStatistics, params, null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 【排口联网率】获取排口实时联网率列表
 * @params { "beginTime": "2018-12-01 00:00:00","endTime": "2018-12-30 00:00:00"}
 */
export async function getRealTimeNetWorkingRateForPointsPageList(params) {
    const result = post(pageUrl.workbench.realTimeNetWorkingRateForPointsPageList, params, null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 【设备运转率】获取一个或多个设备运转率（不传MN则查询所有设备）
 * @params {"DGIMNs": ["sgjt001003","sgjt001004"],"beginTime":"2018-09-01 00:00:00","endTime":"2018-11-30 00:00:00"}
 */
export async function getEquipmentOperatingRateForPoints(params) {
    const result = post(pageUrl.workbench.equipmentOperatingRateForPoints, params, null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 【传输有效率】获取一个或多个排口传输有效率等等
 * @params {"DGIMNs": ["sgjt001003","sgjt001004"],"beginTime":"2018-11-01 00:00:00","endTime":"2018-11-30 00:00:00"}
 */
export async function getTransmissionEfficiencyForPoints(params) {
    const result = post(pageUrl.workbench.transmissionEfficiencyForPoints, params, null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 【监测预警】获取监测预警排口列表
 * @params {"beginTime":"2018-11-01 00:00:00","endTime":"2018-11-30 00:00:00"}
 */
export async function getDataOverWarningPageList(params) {
    const result = post(pageUrl.workbench.hourDataOverWarningPageList, params, null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 【超标汇总】获取超标汇总数据
 * @params {}
 */
export async function getAllPointOverDataList(params) {
    const result = post(pageUrl.workbench.allPointOverDataList, params||{}, null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 【修改消息状态】修改消息状态
 * @params {}
 */
export async function setMyMessageStatus(params) {
    const result = post(pageUrl.changeMyMessageStatus, params||{}, null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 【超标排口】获取当前超标排口
 * @params {}
 */
export async function getOverPoints(params) {
    const result = post(pageUrl.workbench.overPoints, params||{}, null);
    return result === null ? {
        data: null
    } : result;
}

/**
 * 【统计排口状态】统计排口状态
 * @params {}
 */
export async function getStatisticsPointStatus(params) {
    const result = post(pageUrl.workbench.statisticsPointStatus, params||{}, null);
    return result === null ? {
        data: null
    } : result;
}