//运维任务列表
import moment from 'moment';
import * as services from './service';
import { getPollutantListByDgimn } from "@/services/commonApi"
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'qcaCheck',
  state: {
    // 响应时间核查
    resTimeCheckTableData: [],
    pollutantList: [],
    // 零点核查
    zeroCheckTableData:[],
    zeroCheck24TableData: [],
  },

  effects: {
    // 获取响应时间核查数据
    *getResTimeCheckTableData({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getResTimeCheckTableData, payload);
      if (result.IsSuccess) {
        yield update({ resTimeCheckTableData: result.Datas })
      } else {
        message.error(result.Message)
      }
    },
    // 获取污染物类型
    *getPollutantListByDgimn({ payload, }, { call, update, put, take, select }) {
      const result = yield call(getPollutantListByDgimn, payload);
      if (result.IsSuccess) {
        yield update({ pollutantList: result.Datas })
      } else {
        message.error(result.Message)
      }
    },

    // 获取响应时间核查数据
    *getZeroCheckTableData({ payload, }, { call, update, put, take, select }) {
      const result = yield call(services.getZeroCheckTableData, payload);
      if (result.IsSuccess) {
        yield update({ zeroCheckTableData: result.Datas.rtnData, zeroCheck24TableData: result.Datas.rtnData24 })
      } else {
        message.error(result.Message)
      }
    },



  }
});
