import Model from '@/utils/model';
import moment from 'moment'
import {
  queryoverdatalist,
  UpdateExceptionProcessing,
  GetAlarmRecordDetails,
  AlarmVerifyAdd,
  getPollutantByType
} from '../services/alarmRecordApi';
import { getAlarmNotices } from '@/services/globalApi';
import {
  querypollutantlist,
}
  from '../services/baseapi';
import * as services from '@/services/autoformapi';
import {
  message,
} from 'antd';

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
      pageSize: 20,
    },
    AlarmRecordList: [],
    divisorList:[],
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
        ...payload,
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
    /** 保存核查单 */
    * AddExceptionVerify({
      payload,
    }, {
      call,
      put,
    }) {
      //AlarmVerifyAdd
      const result = yield call(AlarmVerifyAdd, {
        ExceptionProcessingID: payload.ExceptionProcessingID,
        Data: payload.FormData,
      });
      if (result.IsSuccess) {
        payload.callback(result);
      } else {
        message.error(result.Message);
      }
      // const result = yield call(services.postAutoFromDataAdd, {
      //   ...payload,
      //   FormData: JSON.stringify(payload.FormData),
      // });
      // if (result.IsSuccess) {
      //   yield put({
      //     type: 'UpdateExceptionProcessing',
      //     payload: {
      //       ExceptionProcessingID: payload.ExceptionProcessingID,
      //       ExceptionVerifyID: result.Datas,
      //     },
      //   });
      //   payload.callback(result);
      // } else {
      //   message.error(result.Message);
      // }
    },
    /** 更新报警表 */
    * UpdateExceptionProcessing({
      payload,
    }, {
      call,
    }) {
      const result = yield call(UpdateExceptionProcessing, {
        ...payload,
      });
    },
    /** 报警记录详情 */
    * GetAlarmRecordDetails({
      payload,
    }, {
      call,
      update,
    }) {
      const result = yield call(GetAlarmRecordDetails, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield update({
          AlarmRecordList: result.Datas,
        });
      } else {
        yield update({
          AlarmRecordList: [],
        });
      }
    },
        // 根据企业类型查询监测因子
        *getPollutantByType({ payload, callback }, { call, put, update, select }) {
          const response = yield call(getPollutantByType, { ...payload });
          if (response.IsSuccess) {
            yield update({
              divisorList: response.Datas,
            });
            callback && callback(response.Datas)
          } else {
            message.error(response.Message)
          }
        },
  },
});
