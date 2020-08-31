//运维任务列表
import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';
import {GetVisualizationChartList} from "./service"
export default Model.extend({
  namespace: 'working',
  state: {
    flowTableData: [],
    visualizaData:[],
    visLoading:true
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
    *getVisualizationChartList({ payload, }, { call, update, put, take, select }) { //可视化数据列表
      yield update({ visLoading: true })
      const result = yield call(GetVisualizationChartList, payload);
      if (result.IsSuccess) {
        yield update({ visualizaData: result.Datas,visLoading: false})
      } else {
        message.error(result.Message)
        yield update({ visLoading: false})
      }
    },
    
  }
});
