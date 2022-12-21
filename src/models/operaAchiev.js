//运维绩效
import moment from 'moment';
import * as services from '../services/operaAchiev';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operaAchiev', 
  state: {
    pointCoefficientList:[],
    pointCoefficientTotal:0,
    recordCoefficientList:[],
    recordCoefficientTotal:0,
    personalPerformanceRateList: [], //绩效查询
    personalPerformanceRateTotal: 0,
    individualApportionmentList: [], //个人分摊套数
    individualApportionmentTotal: 0,
    individualTaskInfo: [], //个人工单详情
    individualTaskTotal: 0,
    personalPerformanceRateInfoList: [],
    personalPerformanceRateInfoTotal: [],
  },
  effects: {
    *getPointCoefficientList({ payload,callback }, { call, put, update }) { //获取所有排口监测点系数列表
      const result = yield call(services.GetPointCoefficientList, payload);
      if (result.IsSuccess) {
        yield update({
          pointCoefficientTotal:result.Total,
          pointCoefficientList:result.Datas,
        })
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *addOrEditPointCoefficient({ payload,callback }, { call, put, update }) { //添加或修改监测点系数
      const result = yield call(services.AddOrEditPointCoefficient, {...payload,ID:payload.ID? payload.ID : ''});
      if (result.IsSuccess) {
        message.success(result.Message)
        callback&&callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *getRecordCoefficientList({ payload,callback }, { call, put, update }) { //获取工单系数列表
      const result = yield call(services.GetRecordCoefficientList, payload);
      if (result.IsSuccess) {
        yield update({
          recordCoefficientTotal:result.Total,
          recordCoefficientList:result.Datas,
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *getRecordTypesByPollutantType({ payload,callback }, { call, put, update }) { //根据污染物类型获取工单
      const result = yield call(services.GetRecordTypesByPollutantType, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *addOrEditRecordCoefficient({ payload,callback }, { call, put, update }) { //添加或修改工单系数
      const result = yield call(services.AddOrEditRecordCoefficient, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *deleteRecordCoefficient({ payload,callback }, { call, put, update }) { //删除工单系数
      const result = yield call(services.DeleteRecordCoefficient, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },
    *exportPointCoefficient({ payload,callback }, { call, put, update }) { //导出所有排口监测点系数列表
      const result = yield call(services.ExportPointCoefficient, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }

    },
  
    *getPersonalPerformanceRateList({ payload, callback }, { call, put, update }) { //绩效信息查询列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetPersonalPerformanceRateList, payload);
      if (result.IsSuccess) {
        yield update({
          personalPerformanceRateList: result.Datas,
          personalPerformanceRateTotal: result.Total,
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *exportPersonalPerformanceRate({ payload }, { call, put, update, select }) { //绩效信息 导出
      const result = yield call(services.ExportPersonalPerformanceRate, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },
    *getIndividualApportionmentList({ payload, callback }, { call, put, update }) { //个人分摊套数列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetIndividualApportionmentList, payload);
      if (result.IsSuccess) {
        yield update({
          individualApportionmentList: result.Datas,
          individualApportionmentTotal: result.Total,
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *exportIndividualApportionment({ payload }, { call, put, update, select }) { //导出 个人分摊套数
      const result = yield call(services.ExportIndividualApportionment, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },
    *getIndividualTaskInfo({ payload, callback }, { call, put, update }) { //获取个人工单详细
      yield update({ tableLoading: true })
      const result = yield call(services.GetIndividualTaskInfo, payload);
      if (result.IsSuccess) {
        yield update({
          individualTaskInfo: result.Datas,
          individualTaskTotal: result.Total,
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *exportIndividualTaskInfo({ payload }, { call, put, update, select }) { //个人工单详细 导出
      const result = yield call(services.ExportIndividualTaskInfo, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },

    *getPersonalPerformanceRateInfoList({ payload, callback }, { call, put, update }) { //绩效明细 查询列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetPersonalPerformanceRateInfoList, payload);
      if (result.IsSuccess) {
        console.log(result.Datas)
        yield update({
          personalPerformanceRateInfoList: result.Datas,
          personalPerformanceRateInfoTotal: result.Total,
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *exportPersonalPerformanceRateInfo({ payload }, { call, put, update, select }) { //绩效明细 导出
      const result = yield call(services.ExportPersonalPerformanceRateInfo, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },
  } 

})