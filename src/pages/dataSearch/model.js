import moment from 'moment';
import { message } from 'antd';
import Model from '@/utils/model';
import { post, get } from '@/utils/request';
import { API } from '@config/API';
import _ from 'lodash';

export default Model.extend({
  namespace: 'dataSearch',
  state: {
    dataTrustDataSource: [],
    dataTrustTotal: 0,
  },

  effects: {
    // 获取数据不可信列表
    *getUnTrustedList({ payload }, { call, update, select }) {
      const result = yield call(_post, API.MonitorDataApi.GetUnTrustedList, payload);
      if (result.IsSuccess) {
        yield update({
          dataTrustDataSource: result.Datas,
          dataTrustTotal: result.Total,
        });
      }
    },
    // 数据不可信 - 导出
    *exportUnTrustedList({ payload }, { call, update, select }) {
      const result = yield call(_post, API.ExportApi.ExportUnTrustedList, payload);
      if (result.IsSuccess) {
        window.open(result.Datas);
      }
    },
    // 获取表头
    *getReportColumns({ payload, callback }, { call, update, select }) {
      const result = yield call(_post, API.ReportApi.GetPointPollutantColumnByDGIMN, payload);
      if (result.IsSuccess) {
        // let data = _.sortBy(result.Datas, function (o) { return o.SortCode; });
        let data = result.Datas.filter(item => item.ParenntColumnCode !== 'Time');
        callback(data);
      }
    },
  },
});

async function _post(url, params) {
  return post(url, params)
    .then(res => {
      if (res.IsSuccess) {
        return res;
      } else {
        message.error(res.Message);
        return false;
      }
    })
    .catch(error => {
      console['error'](error);
      return error;
    });
}
