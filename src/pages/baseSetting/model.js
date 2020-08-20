/**
 * 功  能：手工数据上传自动model
 * 创建人：dongxiaoyun
 * 创建时间：2019.08.9
 */
import Model from '@/utils/model';
import {
    AddHelpInfo,
    DelHelpInfo,
    AddMonitorPointTypeInfo,
    DelMonitorPointTypeInfo,
    GetMonitorPointTypeList,
    AddDeviceParametersInfo,
    DelDeviceParametersInfo,
    UpdateHelpInfo,
    UpdateMonitorPointTypeInfo,
    UpdateDeviceParametersInfo,
    AddExceptionTypeInfo,
    UpdateExceptionTypeInfo,
    DelProblemFeedbackInfo,
    UpdateTroubleUnitInfo,
    AddTroubleUnitInfo,
    UpdateSystemModelInfo,
    AddSystemModelInfo,
    AddHostNameInfo,
    UpdateHostNameInfo,
    HostNameInfoList,
    UpdateHostModelInfo,
    AddHostModelInfo,
    GetHostNameInfo,
    UpdateWarehouseInfo,
    AddWarehouseInfo
} from './services';
import config from '@/config';
import {
    message,
} from 'antd';
import * as services from './services';
import moment from "moment";
import { formatPollutantPopover, getDirLevel } from '@/utils/utils';

export default Model.extend({
    namespace: 'BaseSetting',
    state: {
        MonitorPointTypeList: [],
        HostNameInfoList: [],
    },
    effects: {
        * AddHelpInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(AddHelpInfo, payload);
            payload.callback && payload.callback(result);
        },
        * DelHelpInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(DelHelpInfo, payload);
            payload.callback && payload.callback(result);
        },
        * UpdateHelpInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateHelpInfo, payload);
            payload.callback && payload.callback(result);
        },

        * AddMonitorPointTypeInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(AddMonitorPointTypeInfo, payload);
            payload.callback && payload.callback(result);
        },
        * DelMonitorPointTypeInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(DelMonitorPointTypeInfo, payload);
            payload.callback && payload.callback(result);
        },
        * UpdateMonitorPointTypeInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateMonitorPointTypeInfo, payload);
            payload.callback && payload.callback(result);
        },

        * GetMonitorPointTypeList({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(GetMonitorPointTypeList, payload);
            if (result.IsSuccess) {
                yield update({
                    MonitorPointTypeList: result.Datas,
                });
            }
        },

        * AddDeviceParametersInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(AddDeviceParametersInfo, payload);
            payload.callback && payload.callback(result);
        },
        * UpdateDeviceParametersInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateDeviceParametersInfo, payload);
            payload.callback && payload.callback(result);
        },

        * DelDeviceParametersInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(DelDeviceParametersInfo, payload);
            payload.callback && payload.callback(result);
        },


        * AddExceptionTypeInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(AddExceptionTypeInfo, payload);
            payload.callback && payload.callback(result);
        },
        * UpdateExceptionTypeInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateExceptionTypeInfo, payload);
            payload.callback && payload.callback(result);
        },
        * DelProblemFeedbackInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(DelProblemFeedbackInfo, payload);
            payload.callback && payload.callback(result);
        },

        * AddTroubleUnitInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(AddTroubleUnitInfo, payload);
            payload.callback && payload.callback(result);
        },
        * UpdateTroubleUnitInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateTroubleUnitInfo, payload);
            payload.callback && payload.callback(result);
        },

        * AddSystemModelInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(AddSystemModelInfo, payload);
            payload.callback && payload.callback(result);
        },
        * UpdateSystemModelInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateSystemModelInfo, payload);
            payload.callback && payload.callback(result);
        },
        * AddHostNameInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(AddHostNameInfo, payload);
            payload.callback && payload.callback(result);
        },
        * UpdateHostNameInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateHostNameInfo, payload);
            payload.callback && payload.callback(result);
        },
        * GetHostNameInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(GetHostNameInfo, payload);
            if (result.IsSuccess) {
                yield update({
                    HostNameInfoList: result.Datas,
                });
            }
        },
        * AddHostModelInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(AddHostModelInfo, payload);
            payload.callback && payload.callback(result);
        },
        * UpdateHostModelInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateHostModelInfo, payload);
            payload.callback && payload.callback(result);
        },
        
        * AddWarehouseInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(AddWarehouseInfo, payload);
            payload.callback && payload.callback(result);
        },
        * UpdateWarehouseInfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateWarehouseInfo, payload);
            payload.callback && payload.callback(result);
        },
    },
});
