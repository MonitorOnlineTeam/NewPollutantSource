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
  
  
  } 

})