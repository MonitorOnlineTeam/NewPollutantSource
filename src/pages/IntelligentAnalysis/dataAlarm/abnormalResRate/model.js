import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'abnormalResRate1',
  state: {
    attentionList: [],
    divisorList: [],
    tableDataSource: [],
    exceptionPointList: [],
    secondTableDataSource: [],
    searchForm: {},
    exceptionTime: [
      moment()
        .subtract(1, 'days')
        .startOf('day'),
      moment().endOf('day'),
    ],
    entByRegionList: [],
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
        response.Message && message.error(response.Message);
      }
    },
    // table数据-师一级
    *getTableDataSource({ payload }, { call, put, update, select }) {
      const result = yield call(services.getTableDataSource, { ...payload });
      if (result.IsSuccess) {
        yield update({
          tableDataSource: result.Datas,
        });
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 导出-师一级
    *exportReport({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportReport, { ...payload });
      if (result.IsSuccess) {
        downloadFile(result.Datas);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // table数据-二级页面
    *getSecondTableDataSource({ payload }, { call, put, update, select }) {
      const result = yield call(services.getSecondTableDataSource, { ...payload });
      if (result.IsSuccess) {
        yield update({
          secondTableDataSource: result.Datas,
        });
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 导出-师二级
    *exportSecond({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportSecond, { ...payload });
      if (result.IsSuccess) {
        downloadFile(result.Datas);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    // 根据行政区查询企业
    *getEntByRegion({ payload }, { call, put, update, select }) {
      const result = yield call(services.getEntByRegion, payload);
      if (result.IsSuccess) {
        yield update({
          entByRegionList: result.Datas,
        });
      } else {
        result.Message && message.error(result.Message);
      }
    },
  },
});
