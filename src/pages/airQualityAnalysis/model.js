import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'airQualityAnalysis',
  state: {
    AQIMonthData: {},
    PrimaryData: {},
    MonthAvgData: {},
    yearAndChainData: {
      xData: [],
      current: { date: '', data: [] },
      year: { date: '', data: [] },
      chain: { date: '', data: [] }
    },
    calendarData: [],
    weatherAnalysisData: {
      xData: [],
      wind: [],
      temp: [], // 温度
      humi: [], // 湿度
      press: [], // 气压
    },
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
    // 获取同比环比数据
    *getYearAndChain({ payload }, { call, put, update }) {
      const result = yield call(services.GetMonthPoint, payload);
      if (result.IsSuccess) {
        yield update({
          yearAndChainData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取污染日历数据
    *getPolCalendar({ payload }, { call, put, update }) {
      const result = yield call(services.GetPolCalendar, payload);
      if (result.IsSuccess) {
        yield update({
          calendarData: [...result.Datas]
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取气象图数据
    *getWeatherAnalysis({ payload }, { call, put, update }) {
      const result = yield call(services.getWeatherAnalysisData, payload);
      if (result.IsSuccess) {
        yield update({
          weatherAnalysisData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },

  }
})
