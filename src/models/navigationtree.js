import Model from '@/utils/model';
import {
    getentandpoint, getPollutantTypeList
} from '../services/baseTreeApi';
import { message } from 'antd';
/*
用户管理相关接口
add by lzp
modify by
*/
export default Model.extend({
    namespace: 'navigationtree',

    state: {
        EntAndPoint: [],
        PollutantType: [],
        selectTreeKeys: [],
        overallselkeys: [],
        overallexpkeys: [],
        IsTree: true,
        BellList: ['51052216080302', '60827636000025', '62020131jhdj03']
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
            if(!payload.PollutantTypes)
            {
                //yield take('global/getSystemConfigInfo/@@end');
                const dd = yield select(state => state.global);
                payload={
                    ...payload,
                    PollutantTypes:dd.configInfo.SystemPollutantType
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
