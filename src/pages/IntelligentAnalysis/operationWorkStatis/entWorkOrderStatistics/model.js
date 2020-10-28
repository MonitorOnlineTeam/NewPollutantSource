import Model from '@/utils/model';
import * as services from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'entWorkOrderStatistics',
  state: {
    attentionList: [],//关注程度
    entList: [],//企业列表
    tableTitleData: [],//一级标题
    tableDataSource: [],//一级数据内容
    secondTableTitleData:[],//二级标题
    secondTableDataSource:[],//二级数据内容
    exceptionPointList: [],
    secondTableDataSource: [],
    searchForm: {
    },
    entWorkOrderTime: [moment().subtract(30, "days").startOf("day"), moment().endOf("day")],//企业工单默认时间
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
        message.error(response.Message)
      }
    },
    // 获取企业列表
    *getEntByRegion({ payload }, { call, put, update, select }) {
      const response = yield call(services.getEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          entList: response.Datas,
        });
      } else {
        message.error(response.Message)
      }
    },
    // table title数据-一级
    *getTableTitleData({ payload }, { call, put, update, select }) {
      const result = yield call(services.getTableTitleData, { ...payload });
      if (result.IsSuccess) {
        yield update({
          tableTitleData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },

    // table数据-一级
    *getTableDataSource({ payload }, { call, put, update, select }) {
      const result = yield call(services.getTableDataSource, { ...payload });
      if (result.IsSuccess) {
        yield update({
          tableDataSource: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },

    // 导出一级
    *exportReport({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportReport, { ...payload });
      if (result.IsSuccess) {
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },

    // table title数据-二级
    *getSecondTableTitleData({ payload }, { call, put, update, select }) {
      const result = yield call(services.getSecondTableTitleData, { ...payload });
      if (result.IsSuccess) {
        yield update({
          secondTableTitleData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // table数据-二级
    *getSecondTableDataSource({ payload }, { call, put, update, select }) {
      const result = yield call(services.getSecondTableDataSource, { ...payload });
      if (result.IsSuccess) {
        yield update({
          secondTableDataSource: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },

    // 导出-师二级
    *exportSecond({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportSecond, { ...payload });
      if (result.IsSuccess) {
        window.open(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    // 根据行政区查询企业
    *getEntByRegion({ payload }, { call, put, update, select }) {
      const result = yield call(services.getEntByRegion, payload);
      if (result.IsSuccess) {
        yield update({
          entByRegionList: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },

  },
});
