/*
 * @desc: 原始数据包
 * @Author: JianWei
 * @Date: 2019.07.31
 */
import Model from '@/utils/model';
import {
    getOriginalData
} from '@/pages/monitoring/originaldata/service.js';
import { formatPollutantPopover } from '@/utils/utils';
import moment from 'moment';

export default Model.extend({
    namespace: 'originalData',
    state: {
        tableDatas: [],
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        beginTime: moment().startOf('day').format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        packageType: "OriginalPackage",
        dgimn: "",
        dataType: '',
        keyword: '',
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
            const { dgimn, beginTime, endTime, packageType, keyword, pageIndex, pageSize, dataType } = yield select(state => state.originalData);
            console.log("payload=", payload);
            const body = {
                dgimn: payload.dgimn || dgimn,
                Keyword: keyword,
                beginTime: beginTime,
                endTime: endTime,
                packageType: packageType,
                pageIndex: pageIndex,
                pageSize: pageSize,
                dataType: dataType,
            }
            const result = yield call(getOriginalData, { ...body });
            if (result.IsSuccess) {
                yield update({ tableDatas: result.Datas, total: result.Total });
            }
        },
    },
});
