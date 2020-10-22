/**
 * 功  能：报警核实率
 * 创建人：张赟
 * 创建时间：2020.09.27
 */

import Model from '@/utils/model';
import {
  GetDefectModel,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportDefectDataSummary,
  ExportDefectPointDetail,
  GetDefectPointDetail,
  GetPollutantByType
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'overVerifyRate',
  state: {
    exloading: false,
    loading: false,
    
    overVerifyRateForm: {
      beginTime: moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      AttentionCode: '',
      RegionCode: '',
      PollutantType:'1',
      PollutantList :[],
      Rate :1,
      EntCode:''
    },
    divisorList: [],
    tableDatas: [],
    total: '',
    attentionList:[],
    priseList: [],
    airList:[],
    tableDatil:[]
  },
  subscriptions: {},
  effects: {
    *getDefectModel({ payload }, { call, put, update, select }) {
      //列表
      const response = yield call(GetDefectModel, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatas: response.Datas,
          total: response.Total,
        });
      }
    },
    *getDefectPointDetail({ payload }, { call, put, update, select }) {
      //超标核实率详情
      const response = yield call(GetDefectPointDetail, { ...payload });
      if (response.IsSuccess) {
        yield update({
          tableDatil: response.Datas,
        });
      }
    },
    *getAttentionDegreeList({ payload }, { call, put, update, select }) {
      //关注列表
      const response = yield call(GetAttentionDegreeList, { ...payload });
      if (response.IsSuccess) {
        yield update({
          attentionList: response.Datas,
        });
      }
    },
    *getEntByRegion({ payload }, { call, put, update, select }) {
      //获取所有企业列表
      const response = yield call(GetEntByRegion, { ...payload });
      if (response.IsSuccess) {
        yield update({
          priseList: response.Datas,
        });
      }
    },
    *exportDefectDataSummary({callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出  报警核实率首页
      const response = yield call(ExportDefectDataSummary, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exloading: false });
      }
    },
    *exportDefectPointDetail({callback, payload }, { call, put, update, select }) {
      yield update({ exloading: true });
      //导出  报警核实率  详情
      const response = yield call(ExportDefectPointDetail, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        callback(response.Datas);
        yield update({ exloading: false });
      } else {
        message.warning(response.Message);
        yield update({ exloading: false });
      }
    },
     // 根据企业类型查询监测因子
     *getPollutantByType({ payload, callback }, { call, put, update, select }) {
      const response = yield call(GetPollutantByType, { ...payload });
      if (response.IsSuccess) {
        yield update({
          divisorList: response.Datas,
        });
        callback && callback(response.Datas)
      } else {
        message.error(response.Message)
      }
    },
    
  },
});
