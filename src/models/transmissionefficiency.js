/**
 * 功  能：传输有效率
 * 创建人：吴建伟
 * 创建时间：2018.12.07
 */

import Model from '@/utils/model';
import { getMonthsTransmissionEfficiency, getEntMonthsTransmissionEfficiency } from '@/services/TransmissionEfficiencyApi';
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
    },
    subscriptions: {
    },
    effects: {
        * getData({ payload }, { call, put, update, select }) {
            const { beginTime, endTime, pageSize, transmissionEffectiveRate,entCode } = yield select(state => state.transmissionefficiency);
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
            const { beginTime, endTime, pageSize, transmissionEffectiveRate } = yield select(state => state.transmissionefficiency);
            let body = {
                BeginTime: beginTime,
                EndTime: endTime,
                PageSize: pageSize,
                TERSort: transmissionEffectiveRate,
                PageIndex: payload.pageIndex,
            };
            const response = yield call(getEntMonthsTransmissionEfficiency, { ...body });
            if (response.IsSuccess) {
                yield update({
                    enttableDatas: response.Datas,
                    total: response.Total,
                    pageIndex: payload.pageIndex || 1,
                });
            }

        },

    },
});
