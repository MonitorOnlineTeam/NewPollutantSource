/*
 * @Author: lzp
 * @Date: 2019-08-22 09:40:55
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:09:14
 * @Description: 运维记录表单api
 */
import { post, get, authorpost } from '@/utils/request';
import { EnumRejectFlag } from '../utils/enum';
// 污染源运维的相关接口
export async function GetTaskRecord(params) {
    const body = {
        TaskID: params.TaskID,
    };

    const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetTaskDetails', body, null);
    return result === null ? { Datas: null } : result;
}

// 获取运维大事记信息
export async function GetYwdsj(params) {
    const body = {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        taskType: params.taskType,
        DGIMNs: params.DGIMN,
        IsAlarmTimeout: params.IsAlarmTimeout,
        beginTime: params.beginTime,
        endTime: params.endTime,
    };
    const result = await post('/api/rest/PollutantSourceApi/PTaskProcessing/GetOperationPageList', body, null);
    return result === null ? { Datas: null } : result;
}

// 获取校准记录
export async function GetJzRecord(params) {
    const body = {
        TaskID: params.TaskID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetJzRecord?', body, null);
    return result === null ? { Datas: null } : result;
}

// 获取校准记录
export async function GetRecordType(params) {
    const body = {
        DGIMN: params.DGIMN,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetRecordType?', body, null);
    return result === null ? { Datas: null } : result;
}

// 获取校准历史记录
export async function GetJzHistoryList(params) {
    const body = {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        DGIMN: params.DGIMN,
        BeginTime: params.beginTime,
        EndTime: params.endTime,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetJzHistoryInfo', body, null);
    return result === null ? { Datas: null } : result;
}
// 根据任务id和类型id获取易耗品列表
export async function GetConsumablesReplaceRecord(params) {
    const body = {
        TaskID: params.TaskID,
        TypeID: params.TypeIDs,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetConsumablesReplaceRecordList?', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}

// 根据任务id和类型id获取故障小时数记录表
export async function GetFailureHoursRecord(params) {
    const body = {
        TaskID: params.TaskID,
        TypeID: params.TypeID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/FaultRecordDetail?', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}

// 根据任务id和类型id获取备品列表
export async function GetSparePartReplaceRecord(params) {
    const body = {
        TaskID: params.TaskID,
        TypeID: params.TypeIDs,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetSparePartReplaceRecordList?', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}


// 获取易耗品历史记录列表
export async function GetConsumablesReplaceHistoryList(params) {
    const body = {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        TypeID: params.TypeID,
        DGIMN: params.DGIMN,
        BeginTime: params.beginTime,
        EndTime: params.endTime,
    };
    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/GetFormHistoryList', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}
// 根据任务id和类型id获取标气列表
export async function GetStandardGasReplaceRecord(params) {
    const body = {
        TaskID: params.TaskID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetStandardGasRepalceRecordList?', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}
// 根据任务id和类型id获取保养项表单
export async function MaintainRecordDetail(params) {
    const body = {
        TaskID: params.TaskID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/MaintainRecordDetail?', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}


// 获取标气历史记录列表
export async function GetStandardGasRepalceHistoryList(params) {
    const body = {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        TypeID: params.TypeID,
        DGIMN: params.DGIMN,
        BeginTime: params.beginTime,
        EndTime: params.endTime,
    };
    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/GetStandardGasRepalceRecordHistoryList', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}
// 根据任务id和类型id获取巡检记录表（不通于手机端PC单独做接口)
export async function GetPatrolRecord(params) {
    const body = {
        TaskID: params.TaskID,
    };
    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/GetPatrolRecordListPC?', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}
// 获取CEMS日常巡检记录表（历史记录表）
export async function GetInspectionHistoryList(params) {
    const body = {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        TypeID: params.TypeID,
        DGIMN: params.DGIMN,
        BeginTime: params.beginTime,
        EndTime: params.endTime,
    };

    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/GetPatrolRecordHistoryList', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}


// 获取停机记录内容
export async function GetStopCemsRecord(params) {
    const body = {
        TaskID: params.TaskID,
        TypeID: params.TypeID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/PostStopCemsDetail?', body, null);
    return result === null ? { Datas: null } : result;
}
// 获取停机记录列表（历史记录表）
export async function GetStopCemsHistoryList(params) {
    const body = {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        TypeID: params.TypeID,
        DGIMN: params.DGIMN,
        BeginTime: params.beginTime,
        EndTime: params.endTime,
    };
    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/PostStopCemsList', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}
// 获取维修记录内容
export async function GetRepairRecord(params) {
    const body = {
        TaskID: params.TaskID,
        TypeID: params.TypeID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/RepairRecordDetail?', body, null);
    if (result === null || result === undefined) {
        return { Datas: null };
    }

    return result;

    // return result === null ? { data: null } : result === undefined ? { data: null } : result;
}
// 获取维修记录列表（历史记录表）
export async function GetRepairHistoryList(params) {
    const body = {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        DGIMN: params.DGIMN,
        BeginTime: params.beginTime,
        EndTime: params.endTime,
    };
    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/RepairRecordList', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}
// 获取异常记录列表（历史记录表）
export async function GetDeviceExceptionHistoryList(params) {
    const body = {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        TypeID: params.TypeID,
        DGIMN: params.DGIMN,
        BeginTime: params.beginTime,
        EndTime: params.endTime,
    };
    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/DeviceExceptionList', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}
// 获取异常记录内容
export async function GetDeviceExceptionRecord(params) {
    const body = {
        TaskID: params.TaskID,
        TypeID: params.TypeID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/DeviceExceptionDetail?', body, null);
    return result === null ? { Datas: null } : result;
}
// 校验测试历史记录列表（历史记录表）
export async function GetBdTestHistoryList(params) {
    const body = {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        TypeID: params.TypeID,
        DGIMN: params.DGIMN,
        BeginTime: params.beginTime,
        EndTime: params.endTime,
    };
    const result = post('/api/rest/PollutantSourceApi/TaskFormApi/GetBdHistoryInfo', body, null);
    return result === null ? {
        Datas: null,
    } : result;
}

// 获取比对监测记录
export async function GetBdTestRecord(params) {
    const body = {
        TaskID: params.TaskID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetBdRecord?', body, null);
    return result === null ? { Datas: null } : result;
}
// 打回
export async function RevokeTask(params) {
    const body = {
        taskID: params.taskID,
        revokeReason: params.revokeReason,
        rejectFlag: EnumRejectFlag.Repulse,
        revokeUserId: params.userID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/PostRevokeTask', body, null);
    return result === null ? { Datas: null } : result;
}

// 根据任务id判断出巡检记录表详情
export async function GetPatrolType(params) {
    const body = {
        TaskID: params.TaskID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetPatrolTypeIdbyTaskId', body, null);
    return result;
}
// 获取运维记录
export async function GetOperationLogList(params) {
    const result = await post('/api/rest/PollutantSourceApi/SMCManagerApi/GetOperationLogList', params, null);
    return result;
}

// 污染源运维的相关接口
export async function GetOperationFormDetail(params) {
    const result = await get('/api/rest/PollutantSourceApi/SMCManagerApi/GetTaskDitails', params, null);
    return result === null ? { Datas: null } : result;
}
// 获取任务详情处理记录附件信息
export async function GetTaskDitailsAttachment(params) {
    const result = await get('/api/rest/PollutantSourceApi/SMCManagerApi/GetTaskDitailsAttachment', params, null);
    return result === null ? { Datas: null } : result;
}
/** 任务列表 */
export async function GetOperationTaskList(params) {
    const body = {
        params: {
            ...params,
            CompleteTime: params.CompleteTime != undefined && params.CompleteTime != '' ? `${params.CompleteTime[0].format('YYYY-MM-DD HH:mm:ss')},${params.CompleteTime[1].format('YYYY-MM-DD HH:mm:ss')}` : '',
            CreateTime: params.CreateTime != undefined && params.CreateTime != '' ? `${params.CreateTime[0].format('YYYY-MM-DD HH:mm:ss')},${params.CreateTime[1].format('YYYY-MM-DD HH:mm:ss')}` : '',
        },
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskProcessingApi/GetOperationTaskList', body.params, null);
    return result === null ? { Datas: null } : result;
}
/** 试剂更换列表 */
export async function GetStandardLiquidRepalceRecordList(params) {
    const body = {
        TaskID: params.TaskID,
    };
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetStandardLiquidRepalceRecordList', body , null);
    return result === null ? { Datas: null } : result;
}

/** 配合检查列表 */
export async function GetCooperationInspectionRecordList(params) {
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetCooperationInspectionRecordList', params , null);
    return result === null ? { Datas: null } : result;
}

/** 数据一致性检查表 实时 */
export async function GetDataConsistencyRecordForPCList(params) {
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetDataConsistencyRecordForPCList', params , null);
    return result === null ? { Datas: null } : result;
}

/** 数据一致性检查表 小时与日数据 */
export async function GetDataConsistencyRecordNewForPCList(params) {
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetDataConsistencyRecordNewForPCList', params , null);
    return result === null ? { Datas: null } : result;
}

/** 上月委托第三方检测次数列表 */
export async function GetDetectionTimesRecordList(params) {
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetDetectionTimesRecordList', params , null);
    return result === null ? { Datas: null } : result;
}

/** 水质校准记录列表 */
export async function GetWaterCalibrationRecordForPCList(params) {
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetWaterCalibrationRecordForPCList', params , null);
    return result === null ? { Datas: null } : result;
}

/** 标准溶液核查记录列表 */
export async function GetWaterCheckRecordRecordForPCList(params) {
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetWaterCheckRecordRecordForPCList', params , null);
    return result === null ? { Datas: null } : result;
}

/** 设备参数变动记录列表 废水*/
export async function GetWaterParametersChangeRecordForPCList(params) {
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetWaterParametersChangeRecordForPCList', params , null);
    return result === null ? { Datas: null } : result;
}

/** 设备参数变动记录列表 废气*/
export async function GetGasParametersChangeRecordForPCList(params) {
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetGasParametersChangeRecordForPCList', params , null);
    return result === null ? { Datas: null } : result;
}
/** 实际水样对比实验结果记录表*/
export async function GetWaterComparisonTestRecordForPCList(params) {
    const result = await post('/api/rest/PollutantSourceApi/TaskFormApi/GetWaterComparisonTestRecordForPCList', params , null);
    return result === null ? { Datas: null } : result;
}