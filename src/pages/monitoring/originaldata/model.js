/*
 * @desc: 原始数据包
 * @Author: JianWei
 * @Date: 2019.07.31
 */
import Model from '@/utils/model';
import {
    getOriginalData
} from './service';
import { formatPollutantPopover } from '@/utils/utils';
import moment from 'moment';

export default Model.extend({
    namespace: 'originalData',
    state: {
        tableDatas: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        beginTime: moment().startOf('day').format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        packageType: "OriginalPackage",
        dgimn:""
    },
    effects: {
        * getOriginalData(
            {
                payload,
            },
            {
                call,
                update,
                put,
                take,
                select
            }) {
            const { dgimn, beginTime, endTime, packageType, pageIndex, pageSize } = yield select(state => state.originalData);
            console.log("dgimn=",dgimn);
            // debugger;
            const body = {
                dgimn: dgimn,
                beginTime: beginTime,
                endTime: endTime,
                packageType: packageType,
                pageIndex: pageIndex,
                pageSize: pageSize
            }
            const result = yield call(getOriginalData, {...body});
            if (result.IsSuccess) {
                yield update({ tableDatas: result.Datas, total: result.Total });
            }
        },
    },
});
