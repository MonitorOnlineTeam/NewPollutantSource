/*
 * @Author: lzp
 * @Date: 2019-07-18 14:36:53
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:11:26
 * @Description: 导航树接口
 */
import Model from '@/utils/model';
import {
    getentandpoint, getPollutantTypeList
} from '../services/baseTreeApi';
import { message } from 'antd';

export default Model.extend({
    namespace: 'navigationtree',

    state: {
        EntAndPoint: [],
        PollutantType: [],
        selectTreeKeys: [],
        overallselkeys: [],
        overallexpkeys: [],
        IsTree: true,
    },
    subscriptions: {
        setup({
            dispatch,
            history
        }) {
            history.listen((location) => {
            });
        },
    },

    effects: {

        /*初始化**/
        * init({ payload }, { take, select }) {
            yield take('common/getPollutantTypeList/@@end');
            const dd = yield select(state => state.common);
            payload.callback(dd.defaultPollutantCode);
        },
        /*获取企业+排口**/
        * getentandpoint({
            payload
        }, {
            call,
            update,
            select,
            take
        }) {
            if (!payload.PollutantTypes || payload.PollutantTypes === "undefined") {
                let global = yield select(state => state.global);
                if (!global.configInfo) {
                    yield take('global/getSystemConfigInfo/@@end');
                    global = yield select(state => state.global);
                    console.log("///=", global.configInfo.SystemPollutantType)
                    payload = {
                        ...payload,
                        PollutantTypes: payload.PollutantTypes === "undefined" ? global.configInfo.SystemPollutantType[0] : global.configInfo.SystemPollutantType
                    }
                } else {
                    payload = {
                        ...payload,
                        PollutantTypes: payload.PollutantTypes === "undefined" ? global.configInfo.SystemPollutantType[0] : global.configInfo.SystemPollutantType
                    }
                }

            }
            const result = yield call(getentandpoint, { ...payload });
            if (result.IsSuccess) {
                yield update({
                    EntAndPoint: result.Datas
                });
            }
        },
        /*【智能监控】获取污染物系统污染物**/
        * getPollutantTypeList({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getPollutantTypeList, { ...payload });
            if (result.IsSuccess) {
                yield update({
                    PollutantType: result.Datas
                });
            }
        },
    },
    reducers: {
    },
});
