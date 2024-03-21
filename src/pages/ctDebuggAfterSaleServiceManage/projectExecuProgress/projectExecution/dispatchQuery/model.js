import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'dispatchQuery',
  state: {
    tableDatas:[],
    tableLoading:false,
    tableTotal:0,
    queryPar:{},
    serviceDispatchTypeAndRecordData:[],
  },
  effects: {
    *getServiceDispatch({ payload,callback }, { call, put, update }) { //派单信息
      const result = yield call(services.getServiceDispatch, payload);
      if (result.IsSuccess) {
        yield update({
          queryPar:payload,
          tableDatas:result.Datas,
          tableTotal:result.Total,
        })
      }else{
        message.error(result.Message)
      }
    },
    *getServiceDispatchTypeAndRecord({ payload,callback }, { call, put, update }) { //派单信息 服务填报内容 要加载的项
      const result = yield call(services.getServiceDispatchTypeAndRecord, payload);
      if (result.IsSuccess) {
        yield update({
          serviceDispatchTypeAndRecordData:result.Datas,
        })
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    *getAcceptanceServiceRecord({ payload,callback }, { call, put, update }) { // 服务填报内容 详情内容
      const result = yield call(services.getAcceptanceServiceRecord, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    *getPublicRecord({ payload,callback }, { call, put, update }) { // 服务填报内容 
      const result = yield call(services.getPublicRecord, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    *getWorkRecord({ payload,callback }, { call, put, update }) { // 服务填报内容 工作记录
      const result = yield call(services.getWorkRecord, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    *getInstallationPhotosRecord({ payload,callback }, { call, put, update }) { // 服务填报内容 安装照片
      const result = yield call(services.getInstallationPhotosRecord, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    *getParameterSettingsPhotoRecord({ payload,callback }, { call, put, update }) { // 服务填报内容 参数设置照片
      const result = yield call(services.getParameterSettingsPhotoRecord, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    *getCooperateRecord({ payload,callback }, { call, put, update }) { // 服务填报内容 配合检查
      const result = yield call(services.getCooperateRecord, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    *getRepairRecord({ payload,callback }, { call, put, update }) { // 服务填报内容 维修记录
      const result = yield call(services.getRepairRecord, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    *exportServiceDispatch({ callback,payload }, { call, put, update, select }) { //导出
      const response = yield call(services.exportServiceDispatch, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${response.Datas}`);
      } else {
        message.warning(response.Message);
      }
    },

  },
})