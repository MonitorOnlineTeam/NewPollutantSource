/**
 * 功  能：传输有效率
 * 创建人：贾安波
 * 创建时间：2020.09.27
 */

import Model from '@/utils/model';
import {
  GetDefectModel,
  GetEntByRegion,
  GetAttentionDegreeList,
  ExportDefectDataSummary,
  ExportDefectPointDetail,
  GetDefectPointDetail
} from './service';
import moment from 'moment';
import { message } from 'antd';
export default Model.extend({
  namespace: 'missingData',
  state: {
    exloading: false,
    loading: false,
    queryPar: {
      BeginTime: moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD 23:59:59'),
      AttentionCode: '',
      EntCode: '',
      RegionCode: '',
      PollutantType:'',
      DataType:'HourData',
      EntType:'',
      OperationEntCode:''
    },
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
        let entCount = 0,pointCount=0,responseRate=0,exceptionCount=0,weixiangyingCount=0,xiangyingCount=0;
        response.Datas.map(item=>{
          entCount += item.entCount;
          pointCount += item.pointCount;
          exceptionCount += item.exceptionCount;
          weixiangyingCount += item.weixiangyingCount;
          xiangyingCount += item.xiangyingCount;
        })
        const totalRow = {
          regionName:'全部合计',
          regionCode:'',
          entCount:entCount,
          pointCount:pointCount,
          exceptionCount:exceptionCount,
          weixiangyingCount:weixiangyingCount,
          xiangyingCount:xiangyingCount
        }
        yield update({
          tableDatas: response.Datas.length>0? [...response.Datas,totalRow] : response.Datas,
          // tableDatas:response.Datas,
          total: response.Total,
        });
      } 
    },
    *getDefectPointDetail({ payload }, { call, put, update, select }) {
      //列表 响应数据详情
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
      //导出  缺失数据报警响应
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
      //导出  缺失数据报警响应  详情
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
    
  },
});
