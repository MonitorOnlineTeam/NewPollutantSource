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
    standardValueList: [],
    start: 0,
    end: 20,
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
      if (payload.flag) {
        return {
          ...state,
          valueList: [],
          timeList: [],
          tableData: [],
          DGIMNList: [],
          standardValueList: [],
          start: 0,
          end: 20,
        }
      } else {


        console.log('payload12321311111111=', payload)
        let newTimeList = [];
        let newValueList = [];
        let newTableData = [];
        let newStandardValueList = [];
        let DGIMNList = [
          ...state.DGIMNList
        ];
        let start = state.start;
        let end = state.end;
        let realtimeData = payload.message;


        if (realtimeData) {
          if (state.currentPollutantCode && state.currentDGIMN) {
            const filterDGIMNList = realtimeData.filter(item => item.DGIMN === state.currentDGIMN);
            DGIMNList = [
              ...DGIMNList,
              ...filterDGIMNList
            ]
            // if (DGIMNList.length > 40) {
            //   DGIMNList = DGIMNList.slice(payload.message.length)
            // }
            if (DGIMNList.length > 20) {
              start += payload.message.length
              end += payload.message.length;
            }
            // let filterChartData = DGIMNList.filter(item => item.PollutantCode === state.currentPollutantCode)
            let filterChartData = DGIMNList;
            // 污染物
            filterChartData.map(item => {
              newValueList.push(item.MonitorValue);
              newTimeList.push(item.MonitorTime);
              newStandardValueList.push(item.QCAStandardValue)
              newTableData.push(
                {
                  Time: item.MonitorTime,
                  Value: item.MonitorValue,
                  StandValue: item.QCAStandardValue,
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
          tableData: [
            ...newTableData
          ],
          standardValueList: newStandardValueList,
          // start, end
        }
      }
    },
    setConfigInfo(state, { payload }) {
      return { ...state, configInfo: { ...payload } };
    },
  }
});
