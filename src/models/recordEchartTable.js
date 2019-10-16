/*
 * @Author: lzp
 * @Date: 2019-07-29 02:56:44
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:12:23
 * @Description: 异常超标记录
 */
import Model from '@/utils/model';
import {
    getexmodellist, getexceptiondata, getovermodellist, getoverdata
} from '@/services/recordEchartApi';
import { formatPollutantPopover } from '@/utils/utils';

export default Model.extend({
    namespace: 'recordEchartTable',
    state: {
        exlist: [],
        excount: [],
        exmodellist: [],
        exceptionData: [],
        overlist: [],
        overcount: 0,
        overmodellist: [],
        overData: [],
        exfirstData: [],
        overfirstData: [],
        pageIndex: 1,
        pageSize: 15
    },
    effects: {
        //获取异常记录汇总
        * getexmodellist({ payload,
        }, { call, update, put, take }) {
            const result = yield call(getexmodellist, payload);
            if (result.IsSuccess) {
                yield update({
                    exlist: result.Datas.rtnExList,
                    excount: result.Datas.rtnExBar,
                    exmodellist: result.Datas.rtnVal,
                    exfirstData: result.Datas.firstData
                })
                if (result.Datas.rtnExList.length > 1 && result.Datas.rtnVal.length > 0) {
                    yield put({
                        type: 'getexceptiondata',
                        payload: {
                            ...payload,
                            ExceptionType: result.Datas.rtnExList[1],
                            Pollutant: result.Datas.rtnVal[0].product,
                        }
                    });
                }

            }

        },
        //获取异常记录明细
        * getexceptiondata({ payload,
        }, { call, update, put, take, select }) {
            var size = yield select(state => state.recordEchartTable.pageSize)
            var index = yield select(state => state.recordEchartTable.pageIndex)
            const body = {
                ...payload,
                pageSize: size,
                pageIndex: index
            }
            const result = yield call(getexceptiondata, body);
            if (result.IsSuccess) {
                yield update({
                    exfirstData: result.Datas,
                    ExceptionTotal: result.Total
                })
            }

        },
        //获取超标记录汇总
        * getovermodellist({ payload,
        }, { call, update, put, take }) {
            const result = yield call(getovermodellist, payload);
            if (result.IsSuccess) {
                yield update({
                    overlist: result.Datas.rtnExList,
                    overcount: result.Datas.rtnExBar,
                    overmodellist: result.Datas.rtnVal,
                    overfirstData: result.Datas.firstData
                })
                if (result.Datas.rtnExList.length > 1 && result.Datas.rtnVal.length > 0) {
                    yield put({
                        type: 'getoverdata',
                        payload: {
                            ...payload,
                            Pollutant: result.Datas.rtnVal[0].product,
                        }
                    });
                }
            }

        },
        //获取超标记录明细
        * getoverdata({ payload,
        }, { call, update, put, take,select }) {
            var size = yield select(state => state.recordEchartTable.pageSize)
            var index = yield select(state => state.recordEchartTable.pageIndex)
            const body = {
                ...payload,
                pageSize: size,
                pageIndex: index
            }
            const result = yield call(getoverdata, body);
            if (result.IsSuccess) {
                yield update({
                    overfirstData: result.Datas,
                    OverTotal: result.Total
                })
            }

        },
    },
});
