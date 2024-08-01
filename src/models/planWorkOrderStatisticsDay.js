import moment from 'moment';
import * as services from '../services/planWorkOrderStatistics';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'planWorkOrderStatisticsDay',
  state: {
    tableDatas: [],
    parametersList: [],
    tableLoading: false,
    tableTotal: 0,
    abnormalTypes: 1,
    pointDatas: [],
    entTableDatas: [],
    abnormalList: [],
    queryPar: {},
    dateCol: [],
    cityTableTotal: 0,
    cityTableDatas: [],
    cityTableLoading: false,
    cityDateCol: [],
    cityAbnormalList: [],
    entAbnormalList: {},
    taskList: [],
    getPointExceptionLoading: true,
    regPointTableDatas: [],
    insideOrOutsiderWorkTableDatas: [],
    entOutsidePointListTotal: [],
    entOutsidePointListDatas: [],
    regPointTableDatasTotal: 0,
  },
  effects: {
    *regEntGetTaskWorkOrderList({ payload, callback }, { call, put, update }) { //行政区省级 企业第一级
      yield update({ tableLoading: true })
      const result = yield call(requestPost, API.VisualKanbanApi.GetWorkOrderAnalysisListDay, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal: result.Total,
          tableDatas: result.Datas,
          tableLoading: false,
          queryPar: { ...payload,regionCode:undefined, entCode: undefined, entName: undefined, pointName: undefined },
        })
      } else {
        yield update({ tableLoading: false })
      }
    },

    *cityGetTaskWorkOrderList({ payload, callback }, { call, put, update }) { //行政区市级别 第一级
      const result = yield call(requestPost, API.VisualKanbanApi.GetWorkOrderAnalysisListDay, payload);
      if (result.IsSuccess) {
        yield update({
          cityTableTotal: result.Total,
          cityTableDatas: result.Datas,
          queryPar: { ...payload,entCode: undefined, entName: undefined, pointName: undefined },
        })
      }
    },
    *regPointGetTaskWorkOrderList({ payload, callback }, { call, put, update }) { //行政区 省级 运维监测点
      const result = yield call(requestPost, API.VisualKanbanApi.GetWorkOrderAnalysisListDay, payload);
      if (result.IsSuccess) {
        yield update({
          regPointTableDatasTotal: result.Total,
          regPointTableDatas: result.Datas,
        })
      }
    },

    *insideOrOutsideWorkGetTaskWorkOrderList({ payload, callback }, { call, put, update }) { //行政区  计划内 计划外 工单数弹框
      const result = yield call(requestPost, API.VisualKanbanApi.GetWorkOrderAnalysisListDay, payload);
      if (result.IsSuccess && result.Datas) {
        yield update({
          insideOrOutsiderWorkTableDatas: result.Datas?.resList || [],
          insideOrOutsiderWorkTableTotal: result.Total,
          dateCol: result.Datas?.colList || [],
          queryPar: { ...payload,entCode: undefined, entName: undefined, pointName: undefined },
        })
      }
    },
    *exportTaskWorkOrderList({ payload, callback }, { call, put, update }) { //企业 行政区 导出
      const result = yield call(requestPost, API.VisualKanbanApi.ExportWorkOrderAnalysisListDay, payload);
      if (result.IsSuccess) {
        message.success('导出成功');
        downloadFile(`${result.Datas}`);
      }
    },
    *workRegExportTaskWorkList({ payload, callback }, { call, put, update }) { //城市详情 导出
      const result = yield call(requestPost, API.VisualKanbanApi.ExportWorkOrderAnalysisListDay, payload);
      if (result.IsSuccess) {
        message.success('导出成功');
        downloadFile(`${result.Datas}`);
      }
    },
    *cityRegExportTaskWorkList({ payload, callback }, { call, put, update }) { //市级别 导出
      const result = yield call(requestPost, API.VisualKanbanApi.ExportWorkOrderAnalysisListDay, payload);
      if (result.IsSuccess) {
        message.success('导出成功');
        downloadFile(`${result.Datas}`);
      }
    },


  },
})