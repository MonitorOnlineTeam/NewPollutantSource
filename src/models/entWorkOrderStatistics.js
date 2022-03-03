import Model from '@/utils/model';
import * as services from '@/services/entWorkOrderStatistics';
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';
export default Model.extend({
  namespace: 'entWorkOrderStatistics',
  state: {
    attentionList: [],//关注程度
    entList: [],//企业列表
    initialForm:{
      Time:[moment().subtract(30, "days").startOf("day"), moment().endOf("day")],
      RegionCode:undefined,
      AttentionCode:undefined,
      PollutantTypeCode:'1',
    },
    tableTitleData: [],//一级标题
    tableDataSource: [],//一级数据内容
    secondTableTitleData:[],//二级标题
    secondTableDataSource:[],//二级数据内容
    thirdTableTitleData:[],//三级标题
    thirdTableDataSource:[],//三级数据内容
    fourTableTitleData:[],//四级标题
    fourTableDataSource:[],//四级数据内容
    exceptionPointList: [],
    secondTableDataSource: [],
    entWorkOrderTime: [moment().subtract(30, "days").startOf("day"), moment().endOf("day")],//企业工单默认时间
    entByRegionList: [],
    param:{}
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
        message.error(response.Message);
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
          tableDataSource: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },

    // 导出一级
    *exportReport({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportReport, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      }else{
        message.warning(result.Message)
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
          secondTableDataSource: result.Datas,
        });
      } else {
        message.error(result.Message);
      }
    },

    // 导出-师二级
    *exportSecond({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportSecond, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },
    
    // table title数据-三级
    *getThirdTableTitleData({ payload }, { call, put, update, select }) {
      const result = yield call(services.getThirdTableTitleData, { ...payload });
      if (result.IsSuccess) {
        yield update({
          thirdTableTitleData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // table数据-三级
    *getThirdTableDataSource({ payload }, { call, put, update, select }) {
      const result = yield call(services.getThirdTableDataSource, { ...payload });
      if (result.IsSuccess) {
        yield update({
          thirdTableDataSource: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },

    // 导出-师三级
    *exportThird({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportThird, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },

    // table title数据-四级
    *getFourTableTitleData({ payload }, { call, put, update, select }) {
      const result = yield call(services.getFourTableTitleData, { ...payload });
      if (result.IsSuccess) {
        yield update({
          fourTableTitleData: result.Datas
        })
      } else {
        message.error(result.Message)
      }
    },
    // table数据-四级
    *getFourTableDataSource({ payload }, { call, put, update, select }) {
      const result = yield call(services.getFourTableDataSource, { ...payload });
      if (result.IsSuccess) {
        yield update({
          fourTableDataSource: result.Datas
        })
      } else {
        message.error(result.Message);
      }
    },

    // 导出-师四级
    *exportFour({ payload }, { call, put, update, select }) {
      const result = yield call(services.exportFour, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },
  },
});
