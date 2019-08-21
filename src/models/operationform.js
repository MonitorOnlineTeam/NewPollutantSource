import Model from '@/utils/model';
import {
    getrecordtypebymn
} from '../services/operationBaseApi';
import { message } from 'antd';
/*
运维记录相关接口
add by lzp
modify by
*/
export default Model.extend({
    namespace: 'operationform',

    state: {
        RecordTypeTree: [],
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
        /*【智能监控】获取污染物系统污染物**/
        * getrecordtypebymn({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getrecordtypebymn, { ...payload });
            if (result.IsSuccess) {
                yield update({
                    RecordTypeTree: result.Datas
                });
            }
        },
    },
    reducers: {
    },
});
