/*
 * @Author: lzp
 * @Date: 2019-07-29 02:56:44
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:12:23
 * @Description: 异常超标记录
 */
import Model from '@/utils/model';
import {
    getexmodellist,getexceptiondata,getovermodellist,getoverdata
} from '@/services/recordEchartApi';
import { formatPollutantPopover } from '@/utils/utils';

export default Model.extend({
    namespace: 'recordEchartTable',
    state: {
        exlist: [],
        excount: [],
        exmodellist: [],
        exceptionData:[],
        overlist:[],
        overcount: 0,
        overmodellist: [],
        overData:[],
        exfirstData:[],
        overfirstData:[]
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
                    exfirstData:result.Datas.firstData
                })
            }

        },
         //获取异常记录明细
         * getexceptiondata({ payload,
         }, { call, update, put, take }) {
             const result = yield call(getexceptiondata, payload);
             if (result.IsSuccess) {
                //  debugger
                 yield update({
                    exfirstData: result.Datas,
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
                    overfirstData:result.Datas.firstData
                })
            }

        },
           //获取超标记录明细
         * getoverdata({ payload,
         }, { call, update, put, take }) {
             const result = yield call(getoverdata, payload);
             if (result.IsSuccess) {
                //  debugger
                 yield update({
                    overfirstData: result.Datas,
                 })
             }
 
         },
    },
});
