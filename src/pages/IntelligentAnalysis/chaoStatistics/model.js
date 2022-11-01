import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'chaoStatistics',
  state: {
    attentionList: [],
    tableDataSource: [],
  },
  effects: {
    // 获取关注列表
    *getAttentionDegreeList({ payload }, { call, put, update, select }) {
      const response = yield call(services.getAttentionDegreeList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          attentionList: response.Datas,
        });
      } else {
        message.error(response.Message)
      }
    },
    // 获取表格数据
    *getTableDataSource({ payload }, { call, put, update, select }) {
      const response = yield call(services.getTableDataSource, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDataSource: response.Datas,
        });
      } else {
        message.error(response.Message)
      }
    },
    // 导出表格数据
    *exportData({ payload }, { call, put, update, select }) {
      const response = yield call(services.exportData, { ...payload });
      if (response.IsSuccess) {
        window.open(response.Datas)
      } else {
        message.error(response.Message)
      }
    },

  },
});
