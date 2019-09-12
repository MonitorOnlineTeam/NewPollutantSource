import Model from '@/utils/model';
import {
    getrecordtypebymn, getjzhistoryinfo
} from '../services/operationBaseApi';
import { message } from 'antd';
import moment from 'moment';
/*
运维记录相关接口
add by lzp
modify by
*/
export default Model.extend({
    namespace: 'operationform',

    state: {
        RecordTypeTree: [],
        JZDatas: [],
        RecordType: '',
        rangDate: [moment(new Date()).add(-3, 'month'), moment(new Date())],
        PollutantTypes: '',
        BeginTime: moment(new Date()).add(-3, 'month'),
        EndTime: moment(new Date())
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
        /*【智能运维】获取污染物系统污染物**/
        * getrecordtypebymn({
            payload, callback
        }, {
            call,
            update,
        }) {
            const result = yield call(getrecordtypebymn, { ...payload });
            if (result.IsSuccess) {
                yield update({
                    RecordTypeTree: result.Datas,
                    RecordType: result.Datas && result.Datas[0].key
                });
                callback && callback(result)
            }
        },
        /*【智能运维】获取零点量程漂移与校准记录表**/
        * getjzhistoryinfo({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getjzhistoryinfo, { ...payload });
            if (result.IsSuccess) {
                yield update({
                    JZDatas: result.Datas
                });
            }
        },
    },
    reducers: {
    },
});
