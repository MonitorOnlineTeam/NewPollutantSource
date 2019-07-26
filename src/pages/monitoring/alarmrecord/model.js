import Model from '@/utils/model';
import moment from 'moment'
import {
  querypollutantlist,
  queryhistorydatalist,
} from './services';
import { formatPollutantPopover } from '@/utils/utils';

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
                  type: 'queryhistorydatalist',
                  payload,
                });
                yield take('queryhistorydatalist/@@end');
            }
            } else {
                yield update({ pollutantlist: [], datalist: null, chartdata: null, columns: null, datatable: null, total: 0 });
            }
        },

    },
});
