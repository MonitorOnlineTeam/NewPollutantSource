//运维任务列表
import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'working',
  state: {
    flowTableData: []
  },

  effects: {
    *getFlowTableData({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getFlowTableData, payload);
      if (result.IsSuccess) {
        let rowSpan1 = result.Datas.filter(item => item.monitoringItems === "cems").length;
        // let rowSpan2 = result.Datas.filter(item => item.monitoringItems === "cems").length;
        let data = result.Datas.map((item, index) => {
          if (index === 0) {
            return {...item, rowSpan: 2}
          }
          if (index === 1) {
            return {...item, rowSpan: 0}
          }
          if (index === 2) {
            return {...item, rowSpan: 2}
          }
          if (index === 3) {
            return {...item, rowSpan: 0}
          }
        })
        yield update({ flowTableData: data, rowSpan1: rowSpan1 - 1 })
      } else {
        message.error(result.Message)
      }
    },
  }
});
