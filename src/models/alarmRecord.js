import Model from '@/utils/model';
import moment from 'moment'
import {
  queryoverdatalist,
} from '../services/alarmRecordApi';
import {
  querypollutantlist,
}
from '../services/baseapi';

export default Model.extend({
    namespace: 'alarmrecord',
    state: {
        pollutantlist: [],
        overdata: [],
        overtotal: 0,
        overdataparams: {
          DGIMN: null,
          pollutantCode: null,
          beginTime: moment(new Date()).add(-1, 'month').format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          pageIndex: 1,
          pageSize: 15,
        },
    },
    effects: {
        * querypollutantlist({ payload,
        }, { call, update, put, take }) {
            const body = {
                DGIMNs: payload.dgimn,
            }
            const result = yield call(querypollutantlist, body);
            if (result && result[0]) {
                yield update({ pollutantlist: result });
                if (!payload.overdata) {
                yield put({
                  type: 'queryoverdatalist',
                  payload,
                });
                yield take('queryoverdatalist/@@end');
            }
            } else {
                yield update({ pollutantlist: [] });
            }
        },
        /** 报警记录 */
         * queryoverdatalist({
            payload,
        }, { call, update, select }) {
            const { overdataparams } = yield select(a => a.alarmrecord);
            const postData = {
                ...overdataparams,
                DGIMN: payload.dgimn ? payload.dgimn : overdataparams.DGIMN,
                beginTime: payload.beginTime ? payload.beginTime : overdataparams.beginTime,
                endTime: payload.endTime ? payload.endTime : overdataparams.endTime,
            }

            const res = yield call(queryoverdatalist, postData);
            if (res.IsSuccess) {
                yield update({
                  overdata: res.Datas,
                  overtotal: res.Total,
                });
            } else {
                yield update({ overdata: [], overtotal: 0 });
            }
        },
    },
});
