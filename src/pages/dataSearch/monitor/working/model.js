//运维任务列表
import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';
import { GetVisualizationChartList } from "./service"
export default Model.extend({
  namespace: 'working',
  state: {
    flowTableData: [],
    visualizaData: {
      pollutant: [],
    },
    visLoading: true
  },

  effects: {
    *getFlowTableData({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getFlowTableData, payload);
      if (result.IsSuccess) {
        yield update({ flowTableData: result.Datas })
      } else {
        message.error(result.Message)
      }
    },
    *getVisualizationChartList({ callback, payload, }, { call, update, put, take, select }) { //可视化数据列表
      yield update({ visLoading: true })
      const result = yield call(GetVisualizationChartList, payload);
      if (result.IsSuccess) {
        let pollutant = result.Datas.pollutant;
        let isShowKLW = false;
        let newPollutant = [], otherParams = [];
        for (let key in pollutant) {
          let valueObj = pollutant[key].find(item => item.Code === 'i13051') || {};
          // 排除烟尘参数
          if (key !== 'a34013' &&
            key !== "a00000" &&
            key !== 'a01011' &&
            key !== 'a01012' &&
            key !== 'a01013' &&
            key !== 'a01014'
          ) {
            newPollutant.push({
              PollutantName: pollutant[key][0].PollutantName,
              PollutantCode: pollutant[key][0].PollutantCode,
              value: valueObj.Value || '-',
              Unit: valueObj.Unit || '',
              params: pollutant[key]
            })
          } else {
            isShowKLW = true;
            otherParams.push(pollutant[key][0])
          }
        }
        let visualizaData = {
          ...result.Datas,
          pollutant: newPollutant,
          otherParams: otherParams,
          isShowKLW: isShowKLW,
          isCO2: !!newPollutant.find(item => item.PollutantCode === 'a05001')
        };
        console.log("visualizaData=", visualizaData)
        yield update({
          visualizaData: visualizaData, visLoading: false
        })
        callback(visualizaData);
      } else {
        message.error(result.Message)
        yield update({ visLoading: false })
      }
    },
  }
});
