//运维表单历史记录（运维记录、质控记录）
import moment from 'moment';
import {
    GetJzHistoryList, GetConsumablesReplaceHistoryList,
    GetStandardGasRepalceHistoryList, GetInspectionHistoryList,
    GetRepairHistoryList, GetStopCemsHistoryList,
    GetDeviceExceptionHistoryList, GetBdTestHistoryList
} from '@/services/taskapi';
import Model from '@/utils/model';
import { EnumRequstResult } from '../utils/enum';

export default Model.extend({
    namespace: 'maintenancelist',
    state: {
        total: null,
        DGIMN: null,
        JzHistoryList: [], //校准历史记录
        RepairHistoryList: [], //维修历史记录
        ConsumablesReplaceHistoryList: [], //易耗品更换历史记录
        StandardGasRepalceHistoryList: [], //标气更换历史记录
        InspectionHistoryList: [], //日常巡检历史记录
        StopCemsHistoryList: [], //停机历史记录
        BdTestHistoryList: [], //比对监测历史记录
        DeviceExceptionHistroyList: [], //设备异常历史记录
        beginTime: moment().subtract(3, 'month').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        pageIndex: 1,
        pageSize: 10,
    },

    effects: {
        // 获取校准历史记录
        * GetJzHistoryList({
            payload,
        }, { call, update, select }) {
            const { pageIndex, pageSize, beginTime, endTime, DGIMN } = yield select(_ => _.maintenancelist);
            let body = {
                pageIndex,
                pageSize,
                beginTime,
                endTime,
                DGIMN
            };
            if (!body.DGIMN) {
                body.DGIMN = payload.DGIMN;
            }
            const DataInfo = yield call(GetJzHistoryList, body);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                if (DataInfo.Datas !== null) {
                    yield update({
                        requstresult: DataInfo.IsSuccess,
                        JzHistoryList: DataInfo.Datas,
                        total: DataInfo.Total
                    });
                }
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    JzHistoryList: [],
                    total: DataInfo.Total
                });
            }
        },

        // 获取易耗品更换历史记录
        * GetConsumablesReplaceHistoryList({
            payload
        }, {
            call,
            update,
            select
        }) {
            const { pageIndex, pageSize, beginTime, endTime, DGIMN } = yield select(_ => _.maintenancelist);
            let body = {
                pageIndex,
                pageSize,
                beginTime,
                endTime,
                DGIMN
            };
            if (!body.DGIMN) {
                body.DGIMN = payload.DGIMN;
            }
            const DataInfo = yield call(GetConsumablesReplaceHistoryList, body);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    ConsumablesReplaceHistoryList: DataInfo.Datas,
                    total: DataInfo.Total
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    ConsumablesReplaceHistoryList: [],
                    total: DataInfo.Total
                });
            }
        },

        // 获取标气更换历史记录
        * GetStandardGasRepalceHistoryList({
            payload
        }, {
            call,
            update,
            select
        }) {
            const { pageIndex, pageSize, beginTime, endTime, DGIMN } = yield select(_ => _.maintenancelist);
            let body = {
                pageIndex,
                pageSize,
                beginTime,
                endTime,
                DGIMN
            };
            if (!body.DGIMN) {
                body.DGIMN = payload.DGIMN;
            }
            const DataInfo = yield call(GetStandardGasRepalceHistoryList, body);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    StandardGasRepalceHistoryList: DataInfo.Datas,
                    total: DataInfo.Total
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    StandardGasRepalceHistoryList: [],
                    total: DataInfo.Total
                });
            }
        },

        // 获取日常巡检历史记录
        * GetInspectionHistoryList({
            payload
        }, {
            call,
            update,
            select
        }) {
            const { pageIndex, pageSize, beginTime, endTime, DGIMN } = yield select(_ => _.maintenancelist);
            let body = {
                pageIndex,
                pageSize,
                beginTime,
                endTime,
                DGIMN
            };
            if (!body.DGIMN) {
                body.DGIMN = payload.DGIMN;
            }
            const DataInfo = yield call(GetInspectionHistoryList, body);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    InspectionHistoryList: DataInfo.Datas,
                    total: DataInfo.Total,
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    InspectionHistoryList: null,
                    total: DataInfo.Total,
                });
            }
        },

        //获取停机历史记录
        * GetStopCemsHistoryList({
            payload,
        }, {
            call,
            update,
            select
        }) {
            const { pageIndex, pageSize, beginTime, endTime, DGIMN } = yield select(_ => _.maintenancelist);
            let body = {
                pageIndex,
                pageSize,
                beginTime,
                endTime,
                DGIMN
            };
            if (!body.DGIMN) {
                body.DGIMN = payload.DGIMN;
            }
            const DataInfo = yield call(GetStopCemsHistoryList, body);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    StopCemsHistoryList: DataInfo.Datas,
                    total: DataInfo.Total,
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    StopCemsHistoryList: [],
                    total: DataInfo.Total,
                });
            }
        },

        //获取维修历史记录
        * GetRepairHistoryList({
            payload
        }, {
            call,
            update,
            select
        }) {
            const { pageIndex, pageSize, beginTime, endTime, DGIMN } = yield select(_ => _.maintenancelist);
            let body = {
                pageIndex,
                pageSize,
                beginTime,
                endTime,
                DGIMN
            };
            if (!body.DGIMN) {
                body.DGIMN = payload.DGIMN;
            }
            const DataInfo = yield call(GetRepairHistoryList, body);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    RepairHistoryList: DataInfo.Datas,
                    total: DataInfo.Total
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    RepairHistoryList: [],
                    total: DataInfo.Total
                });
            }
        },

        //设备异常历史记录
        * GetDeviceExceptionHistoryList({
            payload
        }, {
            call,
            update,
            select
        }) {
            const { pageIndex, pageSize, beginTime, endTime, DGIMN } = yield select(_ => _.maintenancelist);
            let body = {
                pageIndex,
                pageSize,
                beginTime,
                endTime,
                DGIMN
            };
            if (!body.DGIMN) {
                body.DGIMN = payload.DGIMN;
            }
            const DataInfo = yield call(GetDeviceExceptionHistoryList, body);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    DeviceExceptionHistroyList: DataInfo.Datas,
                    total: DataInfo.Total,
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    DeviceExceptionHistroyList: [],
                    total: DataInfo.Total,
                });
            }
        },

        //对比监测历史记录
        * GetBdTestHistoryList({
            payload
        }, {
            call,
            update,
            select
        }) {
            const { pageIndex, pageSize, beginTime, endTime, DGIMN } = yield select(_ => _.maintenancelist);
            let body = {
                pageIndex,
                pageSize,
                beginTime,
                endTime,
                DGIMN
            };
            if (!body.DGIMN) {
                body.DGIMN = payload.DGIMN;
            }
            const DataInfo = yield call(GetBdTestHistoryList, body);
            if (DataInfo !== null && DataInfo.IsSuccess) {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    BdTestHistoryList: DataInfo.Datas,
                    total: DataInfo.Total
                });
            } else {
                yield update({
                    requstresult: DataInfo.IsSuccess,
                    BdTestHistoryList: [],
                    total: DataInfo.Total
                });
            }
        }
    },
});
