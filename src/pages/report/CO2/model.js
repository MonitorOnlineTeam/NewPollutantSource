// 运维任务列表
import moment from 'moment';
import { message } from 'antd';
import * as services from './services';
import Model from '@/utils/model';
// import { EnumRequstResult } from '../utils/enum';

export default Model.extend({
  namespace: 'CO2Report',
  state: {
    entByRegionAndAttList: [],
    dayReportTableData: [],
  },

  effects: {
    // 获取企业列表
    *getEntByRegionAndAtt({ payload }, { call, put, update, select }) {
      const result = yield call(services.getEntByRegionAndAtt, payload, null)
      if (result.IsSuccess) {
        yield update({
          entByRegionAndAttList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // 获取日报表数据
    *getDayReportTableData({ payload }, { call, put, update, select }) {
      const result = yield call(services.getDayReportTableData, payload, null)
      if (result.IsSuccess) {
        yield update({
          dayReportTableData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
  }
});
