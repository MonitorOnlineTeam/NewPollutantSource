/**
 * 功  能：传输有效率
 * 创建人：吴建伟
 * 创建时间：2018.12.07
 */

import Model from '@/utils/model';
import { getMonthsTransmissionEfficiency, getEntMonthsTransmissionEfficiency, ExportData, RecalculateTransmissionEfficiency } from '@/services/TransmissionEfficiencyApi';
import moment from 'moment';

export default Model.extend({
    namespace: 'transmissionefficiency',
    state: {
        pageSize: 20,
        pageIndex: 1,
        tableDatas: [],
        beginTime: moment().format('YYYY-MM-01 HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        transmissionEffectiveRate: 'ascend',
        enttableDatas: [],
        entCode: null,
        total: 0,
        entTotal: 0,
        RegionCode: '',
        EnterpriseName: '',
    },
    subscriptions: {
    },
    effects: {
        * getData({ payload }, { call, put, update, select }) {
            const { beginTime, endTime, pageSize, transmissionEffectiveRate, entCode } = yield select(state => state.transmissionefficiency);
            let body = {
                EnterpriseCodes: (payload.entcode && payload.entcode != "null" && payload.entcode != "0") ? [payload.entcode] : null,
                BeginTime: beginTime,
                EndTime: endTime,
                PageSize: pageSize,
                TERSort: transmissionEffectiveRate,
                PageIndex: payload.pageIndex,
                EntCode: entCode
            };
            const response = yield call(getMonthsTransmissionEfficiency, { ...body });
            if (response.IsSuccess) {
                yield update({
                    tableDatas: response.Datas,
                    total: response.Total,
                    pageIndex: payload.pageIndex || 1,
                });
            }

        },
        * getEntData({ payload }, { call, put, update, select }) {
            const { beginTime, endTime, pageSize, pageIndex, transmissionEffectiveRate, RegionCode, EnterpriseName } = yield select(state => state.transmissionefficiency);
            debugger
            let body = {
                BeginTime: beginTime,
                EndTime: endTime,
                PageSize: pageSize,
                TERSort: transmissionEffectiveRate,
                PageIndex: pageIndex,
                RegionCode: RegionCode,
                EnterpriseName: EnterpriseName,
                ...payload
            };
            const response = yield call(getEntMonthsTransmissionEfficiency, { ...body });
            if (response.IsSuccess) {
                yield update({
                    enttableDatas: response.Datas,
                    entTotal: response.Total,
                });
            }

        },
        * ExportData({ payload }, { call, put, update, select }) {
            const { beginTime, endTime, pageSize, pageIndex, transmissionEffectiveRate, RegionCode, EnterpriseName } = yield select(state => state.transmissionefficiency);
            let body = {
                BeginTime: beginTime,
                EndTime: endTime,
                PageSize: pageSize,
                TERSort: transmissionEffectiveRate,
                PageIndex: pageIndex,
                RegionCode: RegionCode,
                EnterpriseName: EnterpriseName,
                ...payload
            };
            const response = yield call(ExportData, { ...body });
            if (response.IsSuccess) {
                payload.callback(response.Datas);
            }

        },
        * RecalculateTransmissionEfficiency({ payload }, { call, put, update, select }) {
            let body = {
                beginTime: payload.beginTime,
                endTime: payload.endTime,
                DGIMN: payload.DGIMN,
                ...payload
            };
            const response = yield call(RecalculateTransmissionEfficiency, { ...body });
            payload.callback(response.IsSuccess);
        },
    },
});
