import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'airQualityAnalysis',
  state: {
    AQIMonthData: {},
    PrimaryData: {},
    MonthAvgData: {},
  },
  effects: {
    /*月份AQI分析**/
    * GetAirAQIMonth({
      payload
    }, {
      call,
      update,
    }) {
      const result = yield call(services.GetAirAQIMonth, { ...payload });
      if (result.IsSuccess) {
        yield update({
          AQIMonthData: result.Datas
        });
      } else {
        message.error(result.Message)
      }
    },
    /*月份首要污染物分析**/
    * GetAirPrimaryPolMonth({
      payload
    }, {
      call,
      update,
    }) {
      const result = yield call(services.GetAirPrimaryPolMonth, { ...payload });
      if (result.IsSuccess) {
        yield update({
          PrimaryData: result.Datas
        });
      } else {
        message.error(result.Message)
      }
    },
    /*月站点平均值分析**/
    * GetMonthPoint({
      payload
    }, {
      call,
      update,
    }) {
      const result = yield call(services.GetMonthPoint, { ...payload });
      if (result.IsSuccess) {
        yield update({
          MonthAvgData: result.Datas
        });
      } else {
        message.error(result.Message)
      }
    },
  }
})
