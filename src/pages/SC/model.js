import Model from '@/utils/model';
import * as services from './services';
import { message } from 'antd';
import { formatPollutantPopover } from '@/utils/utils';

export default Model.extend({
  namespace: 'SC',
  state: {
    columns: [],
    realdata: [{}],
  },
  effects: {
    /** 获取实时视频的污染物表头 */
    *getPollutantList({ payload }, { call, update }) {
      const response = yield call(services.querypollutantlist, payload);
      if (response.IsSuccess) {
        let pollutants = [];
        // pollutants.push({ title: "监测时间", dataIndex: "MonitorTime", key: "MonitorTime", align: 'center', width: '200px' });
        if (response.Datas.length > 0) {
          response.Datas.map((item, key) => {
            if (item.PollutantName !== '经度' && item.PollutantName !== '维度') {
              let unit = item.Unit ? `(${item.Unit})` : '';
              pollutants = pollutants.concat({
                // title: `${item.PollutantName}(${item.Unit ? item.Unit : ''})`,
                title: item.PollutantName + unit,
                dataIndex: item.PollutantCode,
                key: item.PollutantCode,
                StandardValue: item.StandardValue,
                align: 'center',
                render: (value, record, index) =>
                  formatPollutantPopover(value, record[`${item.PollutantCode}_params`]),
              });
            }
          });
        }
        if (pollutants.length === 1) {
          pollutants = [];
        }
        yield update({
          columns: pollutants,
        });
      } else {
        message.error(response.Message)
      }
    },
    // 获取监控实时数据
    *getRealTimeData({ payload }, { call, update, select }) {
      const response = yield call(services.getRealTimeData, payload);
      if (response.IsSuccess) {
        yield update({
          realdata: [
            {
              key: '1',
              ...response.Datas[0],
            }
          ]
        })
      } else {
        message.error(response.Message)
      }
    },
  },
});
