import { message } from 'antd';
import * as services from '../services/commonApi';
import config from '@/config'
import Model from '@/utils/model';

export default Model.extend({
  namespace: 'qualityControlModel',
  state: {
    valueList: [],
    timeList: [],
    tableData: [],
    DGIMNList: [],
  },
  effects: {
    *updateRealtimeData({ payload }, { call, put, select }) {
      const DGIMNList = yield select(state => state.qualityControlModel.DGIMNList)
      yield put({
        type: "changeRealTimeThanData",
        payload: {
          ...payload
        }
      })
    }
  },
  reducers: {
    changeCurrentPollutantCode(state, { payload }) {
      return {
        ...state,
        currentPollutantCode: payload
      }
    },
    changeRealTimeThanData(state, { payload }) {
      let newTimeList = [];
      let newValueList = [];
      let newTableData = [];
      let DGIMNList = [
        ...state.DGIMNList
      ];
      let realtimeData = payload.message;


      if (realtimeData) {
        if (state.currentPollutantCode && state.currentDGIMN) {
          const filterDGIMNList = realtimeData.filter(item => item.DGIMN === state.currentDGIMN);
          DGIMNList = [
            ...DGIMNList,
            ...filterDGIMNList
          ]
          if (DGIMNList.length > 40) {
            DGIMNList = DGIMNList.slice(payload.message.length)
          }
          console.log("DGIMNList=", DGIMNList)
          let filterChartData = DGIMNList.filter(item => item.PollutantCode === state.currentPollutantCode)
          console.log("filterChartData=", filterChartData)
          // 污染物
          filterChartData.map(item => {
            newValueList.push(item.MonitorValue);
            newTimeList.push(item.MonitorTime);
            newTableData.push(
              {
                Time: item.MonitorTime,
                Value: item.MonitorValue,
                StandValue: item.StandardValue,
              }
            )
          })
        }
      }
      return {
        ...state,
        timeList: [
          ...newTimeList
        ],
        valueList: [
          ...newValueList
        ],
        DGIMNList: [
          ...DGIMNList
        ],
        tableData: newTableData

      }
    },
    setConfigInfo(state, { payload }) {
      return { ...state, configInfo: { ...payload } };
    },
  }
});
