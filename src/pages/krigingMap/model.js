import moment from 'moment';
import { message } from 'antd';
import * as services from './services';
import Model from '@/utils/model';

export default Model.extend({
  namespace: 'krigingMap',
  state: {
    rankHourData: [],
    mapData: [],
    dateTimeAllData: [],
    time: '',
  },

  effects: {
    // 获取监测点infoWindow数据
    *GetAirRankHour({ payload }, { call, update, select, put }) {
      const result = yield call(services.GetAirRankHour, payload);
      if (result.IsSuccess) {

        yield update({
          rankHourData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },


    // 根据时间获取地图数据
    *getMapData({ payload, callback }, { call, update, select, put }) {
      const result = yield call(services.GetAirRankHour, payload);
      if (result.IsSuccess) {
        let currentTime = moment().subtract(1, 'hours').format("YYYY-MM-DD HH:00:00")
        let filterData = result.Datas.filter(item => item.Time === currentTime);
        debugger
        let mapData = [];
        let time = "";
        if (filterData.length) {
          mapData = filterData[0].Value;
          time = filterData[0].Time;
        } else {
          mapData = result.Datas.length ? result.Datas[0].Value : [];
          time = result.Datas.length ? result.Datas[0].Time : "";
        }
        callback && callback()
        yield update({
          time: time,
          mapData: mapData,
          dateTimeAllData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
  }
});
