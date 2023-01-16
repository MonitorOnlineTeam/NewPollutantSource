import moment from 'moment';
import { message } from 'antd';
import Model from '@/utils/model';
import { post, get } from '@/utils/request';
import { API } from '@config/API'

export default Model.extend({
  namespace: 'EPAndProduction111',
  state: {
    startTime: moment().startOf('day'),
    endTime: moment(),
    selectListData: {
      dus: [],
      pro: []
    }
  },

  effects: {
    // 根基点位查询治理设施和生产设施
    * GetFacByPoint({ payload }, { call, update, select }) {
      const result = yield call(_post, API.TYGTApi.GetFacByPoint, payload);
      if (result.IsSuccess)
        yield update({
          selectListData: result.Datas
        })
    },
    // 根据DGIMN，设施，参数查询数据
    * GetDataByParams({ payload, callback }, { call, update, select }) {
      const { startTime, endTime } = yield select(state => state.EPAndProduction);
      const body = {
        ...payload,
        // beginTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
        // endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
        beginTime: '2023-01-11 08:00:00',
        endTime: '2023-01-11 09:00:00',
      }
      const result = yield call(_post, API.TYGTApi.GetDataByParams, body);
      if (result.IsSuccess) {
        callback(result.Datas)
      }
    },
    // 获取点位数据
    * GetAllTypeDataList({ payload, callback }, { call, update, select }) {
      // const { pollutantListByDgimn } = yield select(state => state.common);
      const { pollutantCodes, pollutantNames } = payload;
      const body = {
        ...payload,
        "pollutantCodes": pollutantCodes.toString(),
        "pollutantNames": pollutantNames.toString(),
      }
      const result = yield call(_post, API.MonitorDataApi.GetAllTypeDataList, body);
      // debugger
      if (result.IsSuccess) {
        let xAxisData = [], flag = false;
        let seriesData = pollutantCodes.map((pollutant, index) => {
          let serieData = [];
          result.Datas.map(item => {
            flag === false && xAxisData.push(item.MonitorTime);
            serieData.push(item[pollutant] == 0 ? undefined : item[pollutant]);

            // item1[item] == 0 ? undefined : item1[item]
          })
          console.log('serieData', serieData)
          flag = true;
          return {
            data: serieData,
            type: 'line',
            name: pollutantNames[index],
            // smooth: true
          }
        })
        callback({ seriesData, xAxisData })
      }
    },
  }
});

async function _post(url, params) {
  return post(url, params)
    .then(res => {
      if (res.IsSuccess) {
        return res;
      } else {
        message.error(res.Message)
        return false;
      }
    })
    .catch((error) => {
      console["error"](error);
      return error;
    });
}
