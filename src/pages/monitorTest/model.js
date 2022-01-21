import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'monitorTest',
  state: {
    excellentDaysReportData: [],
    chartData:{}
  },
  effects: {
    /*月份AQI分析**/
    * GetMonitorTest({
      payload
    }, {
      call,
      update,
    }) {
      const result = yield call(services.GetMonitorTest, { ...payload });
      if (result.IsSuccess) {
        yield update({
          excellentDaysReportData: result.Datas.Data,
          chartData:result.Datas.Chart,
        });
      } else {
        message.error(result.Message)
      }
    },
  }
})
