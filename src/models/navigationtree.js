import Model from '@/utils/model';
import {
    getentandpoint,getPollutantTypeList
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
        EntAndPoint:[],
        PollutantType:[],
        selectTreeKeys:[],
        overallselkeys:[],
        overallexpkeys:[],
        IsTree:true
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
        /*获取企业+排口**/
        * getentandpoint({
            payload
        }, {
            call,
            update,
        }) {
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
