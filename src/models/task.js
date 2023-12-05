/*
 * @Author: lzp
 * @Date: 2019-08-22 09:39:19
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:12:33
 * @Description: 任务详情、运维单详情
 */
// 任务详情、运维单详情
import { message } from 'antd';
import moment, { months } from 'moment';
import {
    GetTaskRecord, GetJzRecord,
    GetRecordType, GetConsumablesReplaceRecord,
    GetStandardGasReplaceRecord, GetPatrolRecord,
    GetDeviceExceptionRecord, GetStopCemsRecord,
    GetBdTestRecord, RevokeTask,
    GetPatrolType, GetRepairRecord, MaintainRecordDetail, GetSparePartReplaceRecord,
    GetOperationLogList, GetFailureHoursRecord,
    GetOperationFormDetail, GetTaskDitailsAttachment, GetOperationTaskList,
    GetStandardLiquidRepalceRecordList,
    GetDataConsistencyRecordForPCList,
    GetDataConsistencyRecordNewForPCList,
    GetDetectionTimesRecordList,
    GetWaterCalibrationRecordForPCList,
    GetWaterCheckRecordRecordForPCList,
    GetWaterParametersChangeRecordForPCList,
    GetGasParametersChangeRecordForPCList,
    GetWaterComparisonTestRecordForPCList,
    GetCooperationInspectionRecordList,
    ExportOperationTaskList,
    PostRetransmission,
} from '../services/taskapi';
import Model from '@/utils/model';
import { EnumRequstResult } from '../utils/enum';
import { GetAlarmResponseList } from '../services/AlarmResponseApi';
import config from '@/config';
import { downloadFile } from '@/utils/utils';
export default Model.extend({
    namespace: 'task',
    state: {
        TaskRecord: null, // 任务详情
        JzRecord: null, // 校准记录
        PatrolRecord: null, // 日常例行运维记录
        StopCemsRecord: null, // 停机记录
        RepairRecord: null, // 维修记录
        ExceptionRecord: null, // 设备异常记录
        BdRecord: null, // 比对监测记录
        ConsumablesReplaceRecord: null, // 易耗品更换记录
        FailureHoursRecord: null, // 故障小时数记录表
        StandardGasRepalceRecord: null, // 标气更换记录
        MaintainRecordDetailRecord: null, // 保养项更换记录
        SparePartReplaceRecord: null, // 备品更换记录
        RepalceRecordList: null, // 试剂更换记录
        RecordTypes: [], // 运维表单类型
        AlarmResponseList: [],
        operationLogList: null, // 运维记录列表
        cooperatInspectionRecordList: null, //配合检查记录
        dataConsistencyRecordList: null,//数据一致性检查表 实时
        dataConsistencyDateRecordList: null,//数据一致性检查表 小时与日数据
        detectionTimesRecordList: null,//上月委托第三方检测次数
        waterCalibrationRecordList: null,//水质校准记录
        WaterCheckRecordRecordForPCList: null,//标准溶液核查记录
        WaterParametersChangeRecordForPCList: null,//设备参数变动记录 废水
        GasParametersChangeRecordForPCList: null,//设备参数变动记录 废气
        WaterComparisonTestRecordForPCList: null,//实际水样对比实验结果记录表
        // 运维记录参数
        operationRzWhere: {
            beginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            DGIMN: '',
            pageIndex: 1,
            pageSize: 10,
        },
        // 手机任务详情
        OperationFormDetail: [],
        // 手机任务详情(梳理记录附件)
        TaskDitailsAttachmentList: [],
        datatable: [],
        gettasklistqueryparams: {
            DGIMN: '',
            TaskCode: '',
            ExceptionType: '',
            TaskFrom: '',
            TaskStatus: '',
            OperationsUserId: '',
            TaskType: '',
            CompleteTime: '',
            CreateTime: [moment(moment().add(-6, 'day').format('YYYY-MM-DD 00:00:00')), moment(moment().format('YYYY-MM-DD 23:59:59'))],
            pageIndex: 1,
            pageSize: 20,
            total: 0,
        },
        TaskRecordLoading: true,

    },

    effects: {
        // 任务记录
        * GetTaskRecord({
            payload,
        }, { call, update, put, select, take }) {
            yield update({ TaskRecordLoading: true });
            const taskInfo = yield call(GetTaskRecord, payload);
            if (taskInfo !== null && taskInfo.IsSuccess) {
                if (taskInfo.Datas.length > 0) {
                    yield update({ TaskRecordLoading: false });
                    // yield put({
                    //     type: 'GetAlarmResponseList',
                    //     payload: {
                    //         DGIMN: payload.DGIMN,
                    //         TaskID: payload.TaskID,
                    //     },
                    // });
                    // yield take('GetAlarmResponseList/@@end');
                    // const { AlarmResponseList } = yield select(_ => _.task);
                    // if (AlarmResponseList.length > 0) {
                    //     taskInfo.Datas[0].AlarmList = AlarmResponseList;
                    //     yield update({
                    //         TaskRecord: taskInfo,
                    //     });
                    // } else {
                    //     yield update({
                    //         TaskRecord: taskInfo,
                    //     });
                    // }
                    yield update({ TaskRecord: taskInfo, });
                } else {
                    yield update({ TaskRecord: null, });
                }

            } else {
                message.error(taskInfo.Message)
                yield update({ TaskRecordLoading: false });
            }

        },

        // 手机端运维记录详情
        * GetOperationFormDetail({
            payload,
        }, { call, update, put, select, take }) {
            const taskInfo = yield call(GetOperationFormDetail, payload);
            if (taskInfo.IsSuccess) {
                yield update({
                    OperationFormDetail: taskInfo.Datas,
                });
            }
        },

        // 校准记录
        * GetJzRecord({
            payload,
        }, { call, update }) {
            const DataInfo = yield call(GetJzRecord, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                if (DataInfo.Datas !== null) {
                    yield update({ JzRecord: DataInfo.Datas });
                }
            } else {
                yield update({
                    JzRecord: null,
                });
            }
        },
        // 运维表单类型
        * GetRecordType({
            payload,
        }, { call, update }) {
            const DataInfo = yield call(GetRecordType, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({ RecordTypes: DataInfo.Datas });
            } else {
                yield update({ RecordTypes: [] });
            }
        },
        // 易耗品更换记录
        * GetConsumablesReplaceRecord({
            payload,
        }, {
            call,
            update,
        }) {
            const DataInfo = yield call(GetConsumablesReplaceRecord, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    ConsumablesReplaceRecord: DataInfo.Datas,
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    ConsumablesReplaceRecord: null,
                });
            }
        },

        // 故障小时数记录表
        * GetFailureHoursRecord({
            payload,
        }, {
            call,
            update,
        }) {
            const DataInfo = yield call(GetFailureHoursRecord, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    FailureHoursRecord: DataInfo.Datas,
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    FailureHoursRecord: null,
                });
            }
        },

        // 备品更换记录
        * GetSparePartReplaceRecord({
            payload,
        }, {
            call,
            update,
        }) {
            const DataInfo = yield call(GetSparePartReplaceRecord, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    SparePartReplaceRecord: DataInfo.Datas,
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    SparePartReplaceRecord: null,
                });
            }
        },

        // 标气更换记录
        * GetStandardGasReplaceRecord({
            payload,
        }, {
            call,
            update,
        }) {
            const DataInfo = yield call(GetStandardGasReplaceRecord, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    StandardGasRepalceRecord: DataInfo.Datas,
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    StandardGasRepalceRecord: null,
                });
            }
        },

        // 标气更换记录
        * MaintainRecordDetail({
            payload,
        }, {
            call,
            update,
        }) {
            const DataInfo = yield call(MaintainRecordDetail, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    MaintainRecordDetailRecord: DataInfo.Datas,
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    MaintainRecordDetailRecord: null,
                });
            }
        },

        // 日常巡检记录
        * GetPatrolRecord({
            payload,
        }, {
            call,
            update,
        }) {
            const DataInfo = yield call(GetPatrolRecord, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    PatrolRecord: DataInfo.Datas,
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    PatrolRecord: null,
                });
            }
        },

        // 停机记录
        * GetStopCemsRecord({
            payload,
        }, { call, update }) {
            const DataInfo = yield call(GetStopCemsRecord, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                if (DataInfo.Datas !== null) {
                    yield update({ StopCemsRecord: DataInfo.Datas });
                }
            } else {
                yield update({
                    StopCemsRecord: null,
                });
            }
        },

        // 维修记录
        * GetRepairRecord({
            payload,
        }, { call, update }) {
            const DataInfo = yield call(GetRepairRecord, payload);
            if (DataInfo.Datas !== null && DataInfo.IsSuccess) {
                yield update({ RepairRecord: DataInfo.Datas });
            } else {
                yield update({ RepairRecord: null });
            }
        },

        // 数据异常记录
        * GetDeviceExceptionRecord({
            payload,
        }, { call, update }) {
            const DataInfo = yield call(GetDeviceExceptionRecord, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                if (DataInfo.Datas !== null) {
                    yield update({ ExceptionRecord: DataInfo.Datas });
                }
            } else {
                yield update({
                    ExceptionRecord: null,
                });
            }
        },

        // 比对监测记录
        * GetBdTestRecord({
            payload,
        }, { call, update }) {
            const DataInfo = yield call(GetBdTestRecord, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                if (DataInfo.Datas !== null) {
                    yield update({ BdRecord: DataInfo.Datas });
                }
            } else {
                yield update({
                    BdRecord: null,
                });
            }
        },
        // // 撤单（运维人员）、打回（环保专工）
        // * RevokeTask({
        //     payload,
        // }, { call }) {
        //     const DataInfo = yield call(RevokeTask, payload);
        //     if (DataInfo !== null && DataInfo.IsSuccess) {
        //         message.success('操作成功!');
        //         payload.close();
        //         payload.reload();
        //     } else {
        //         message.error('操作失败!');
        //     }
        // },

        // // 根据任务id判断出所使用的日常巡检类型
        // * GetPatrolType({
        //     payload,
        // }, { call }) {
        //     const DataInfo = yield call(GetPatrolType, payload);
        //     payload.callback(DataInfo.Datas);
        // },

        // 获取报警响应列表
        * GetAlarmResponseList({
            payload,
        }, { call, update }) {
            const DataInfo = yield call(GetAlarmResponseList, payload);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({ TaskRecordLoading: false });
                if (DataInfo.Datas !== null) {
                    yield update({ AlarmResponseList: DataInfo.Datas });
                } else {
                    yield update({ AlarmResponseList: [] });
                }
            } else {
                yield update({ TaskRecordLoading: false });
            }
        },
        /** 获取任务列表 */
        * GetOperationTaskList({
            payload,
        }, { call, update, select }) {
            const { gettasklistqueryparams } = yield select(_ => _.task);
            const result = yield call(GetOperationTaskList, gettasklistqueryparams);
            if (result.IsSuccess) {
                yield update({
                    gettasklistqueryparams: {
                        ...gettasklistqueryparams,
                        total: result.Total,
                    },
                    datatable: result.Datas,
                })
            }
        },
        /** 任务列表 导出*/
        *ExportOperationTaskList({ payload, }, { call, update, select }) {
            const result = yield call(ExportOperationTaskList, payload);
            if (result.IsSuccess) {
                message.success('下载成功');
                downloadFile(`${result.Datas}`);
            }
        },

        // 获取运维记录
        * GetOperationLogList({
            payload,
        }, {
            call,
            update,
            select,
        }) {
            const { operationRzWhere } = yield select(a => a.task);
            const DataInfo = yield call(GetOperationLogList, operationRzWhere);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    operationLogList: DataInfo.Datas,
                });
            }
        },
        // 获取任务详情处理记录附件信息
        * GetTaskDitailsAttachment({
            payload,
        }, {
            call,
            update,
            select,
        }) {
            const DataInfo = yield call(GetTaskDitailsAttachment, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    TaskDitailsAttachmentList: DataInfo.Datas,
                });
            }
        },
        // 任务转发
        *postRetransmission({ payload, callback }, { call, put, update }) {
            const result = yield call(PostRetransmission, payload);
            if (result.IsSuccess) {
                message.success(result.Message);
                callback && callback(result.Datas);
            } else {
                message.error(result.Message);
            }
        },
        // 试剂更换表单
        * GetStandardLiquidRepalceRecordList({ payload, }, { call, update, select, }) {
            const DataInfo = yield call(GetStandardLiquidRepalceRecordList, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    RepalceRecordList: DataInfo.Datas,
                });
            }
        },
        // 配合检查表单
        * GetCooperationInspectionRecordList({ payload, }, { call, update, select, }) {
            const DataInfo = yield call(GetCooperationInspectionRecordList, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    cooperatInspectionRecordList: DataInfo.Datas,
                });
            }
        },
        //  数据一致性检查表 实时
        * GetDataConsistencyRecordForPCList({ payload, }, { call, update, select, }) {
            const DataInfo = yield call(GetDataConsistencyRecordForPCList, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    dataConsistencyRecordList: DataInfo.Datas,
                });
            }
        },
        //  数据一致性检查表 小时与与日数据
        *GetDataConsistencyRecordNewForPCList({ payload, }, { call, update, select, }) {
            const DataInfo = yield call(GetDataConsistencyRecordNewForPCList, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    dataConsistencyDateRecordList: DataInfo.Datas,
                });
            }
        },

        //上月委托第三方检测次数
        *GetDetectionTimesRecordList({ payload, }, { call, update, select, }) {
            const DataInfo = yield call(GetDetectionTimesRecordList, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    detectionTimesRecordList: DataInfo.Datas,
                });
            }
        },
        // 水质校准记录
        *GetWaterCalibrationRecordForPCList({ payload, }, { call, update, select, }) {
            const DataInfo = yield call(GetWaterCalibrationRecordForPCList, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    waterCalibrationRecordList: DataInfo.Datas,
                });
            }
        },
        //  标准溶液核查
        *GetWaterCheckRecordRecordForPCList({ payload, }, { call, update, select, }) {
            const DataInfo = yield call(GetWaterCheckRecordRecordForPCList, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    WaterCheckRecordRecordForPCList: DataInfo.Datas,
                });
            }
        },
        //  设备参数变动 废水
        *GetWaterParametersChangeRecordForPCList({ payload, }, { call, update, select, }) {
            const DataInfo = yield call(GetWaterParametersChangeRecordForPCList, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    WaterParametersChangeRecordForPCList: DataInfo.Datas,
                });
            }
        },
        //  设备参数变动 废气
        *GetGasParametersChangeRecordForPCList({ payload, }, { call, update, select, }) {
            const DataInfo = yield call(GetGasParametersChangeRecordForPCList, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    GasParametersChangeRecordForPCList: DataInfo.Datas,
                });
            }
        },
        //  实际水样对比实验结果记录表
        *GetWaterComparisonTestRecordForPCList({ payload, }, { call, update, select, }) {
            const DataInfo = yield call(GetWaterComparisonTestRecordForPCList, payload);
            if (DataInfo.IsSuccess) {
                yield update({
                    WaterComparisonTestRecordForPCList: DataInfo.Datas,
                });
            }
        },


    },


});
