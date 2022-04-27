import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'pollutantInfo',
  state: {
    tableDatas: [],
    parametersList: [],
    tableTotal: 0,
    systemModelTableDatas:[],
    systemModelTableTotal:0,
    monitorParamTableDatas:[],
    verificationTableTotal:0,
    monitorParamTableDatas:[],
    monitorParamTableTotal:0,
    pointListTableDatas:[],
    pointListTableTotal:0,
    operationInfoTableDatas: [],
    operationInfoTableTotal: 0,
    projectRelationLoading:true,
    historyProjectRelationLoading:true,
    historyOperationInfo:[],
    entListTableDatas: [],
    entListTableTotal: 0,
    pollutantTypeList:[],
    deviceInfoTableDatas: [],
    deviceInfoTableTotal: 0,
  },
  effects: {
    *getSystemModelOfPoint({ payload, callback }, { call, put, update }) { //系统信息
      yield update({ tableLoading: true })
      const result = yield call(services.GetSystemModelOfPoint, payload);
      if (result.IsSuccess) {
        yield update({
          systemModelTableDatas: result.Datas,
          systemModelTableTotal: result.Total,
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *exportSystemModelOfPoint({ payload }, { call, put, update, select }) { //导出 系统信息
      const result = yield call(services.ExportSystemModelOfPoint, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },    
    *getVerificationItemOfPoint ({ payload, callback }, { call, put, update }) { //数据核查
      const result = yield call(services.GetVerificationItemOfPoint, payload);
      if (result.IsSuccess) {
        yield update({
          verificationTableDatas: result.Datas,
          verificationTableTotal: result.Total,
        })
      } else {
        message.error(result.Message)
      }
    },
    *exportVerificationItemOfPoint({ payload }, { call, put, update, select }) { //导出 数据核查
      const result = yield call(services.ExportVerificationItemOfPoint, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },  
    *getMonitorPointParamOfPoint ({ payload, callback }, { call, put, update }) { //设备参数
      const result = yield call(services.GetMonitorPointParamOfPoint, payload);
      if (result.IsSuccess) {
        yield update({
          monitorParamTableDatas: result.Datas,
          monitorParamTableTotal: result.Total,
        })
      } else {
        message.error(result.Message)
      }
    },
    *exportMonitorPointParamOfPoint({ payload }, { call, put, update, select }) { //导出 设备参数
      const result = yield call(services.ExportMonitorPointParamOfPoint, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    }, 
    *getPointInfoList ({ payload, callback }, { call, put, update }) { //监测点信息
      const result = yield call(services.GetPointInfoList, payload);
      if (result.IsSuccess) {
        yield update({
          pointListTableDatas: result.Datas,
          pointListTableTotal: result.Total,
        })
        callback();
      } else {
        message.error(result.Message)
      }
    },
    *exportPointInfoList({ payload }, { call, put, update, select }) { //导出 监测点信息
      const result = yield call(services.ExportPointInfoList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      }else{
        message.warning(result.Message)
       }
    },
    *getEntProjectRelationList ({ payload, callback }, { call, put, update }) { //运营信息
      !payload.EntID?   yield update({ projectRelationLoading:true }) : yield update({ historyProjectRelationLoading:true })
      const result = yield call(services.GetEntProjectRelationList, payload);
      if (result.IsSuccess) {
        if(!payload.EntID){
          yield update({ projectRelationLoading:false })
          yield update({
            operationInfoTableDatas: result.Datas,
            operationInfoTableTotal: result.Total,
          })
        }else{ //历史运营信息
          yield update({ historyProjectRelationLoading:false })
          yield update({
            historyOperationInfo: result.Datas,
          })
        }

      } else {
        !payload.EntID?   yield update({ projectRelationLoading:false }) : yield update({ historyProjectRelationLoading:false })
        message.error(result.Message)
      }
    },
    *exportEntProjectRelationList({ payload }, { call, put, update, select }) { //导出 运营信息
      const result = yield call(services.ExportEntProjectRelationList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      }else{
        message.warning(result.Message)
       }
    },
    *getEntInfoList ({ payload, callback }, { call, put, update }) { //企业信息
      const result = yield call(services.GetEntInfoList, payload);
      if (result.IsSuccess) {
        yield update({
          entListTableDatas: result.Datas,
          entListTableTotal: result.Total,
        })
      } else {
        message.error(result.Message)
      }
    },
    *exportEntInfoList({ payload }, { call, put, update, select }) { //导出 企业信息
      const result = yield call(services.ExportEntInfoList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    }, 

    *getEquipmentParametersOfPont ({ payload, callback }, { call, put, update }) { //设备信息
      const result = yield call(services.GetEquipmentParametersOfPont, payload);
      if (result.IsSuccess) {
        yield update({
          deviceInfoTableDatas: result.Datas,
          deviceInfoTableTotal: result.Total,
        })
        callback();
      } else {
        message.error(result.Message)
      }
    },
    *exportEquipmentParametersOfPont({ payload }, { call, put, update, select }) { //导出 设备信息
      const result = yield call(services.ExportEquipmentParametersOfPont, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    }, 
    *getPollutantById({ payload, callback }, { call, put, update }) { //获取监测类型
        const result = yield call(services.GetPollutantById, payload);

        if (result.IsSuccess) {
          let data = [];
           if(result.Datas&&result.Datas.mlist){
            result.Datas.mlist.map((item,index)=>{
              if(index<=1){
                data.push(item)
              }
            })
           }else{
             data = []
           }
          yield update({ pollutantTypeList: data})
          callback(data)
        } else {
          message.error(result.Message)
          yield update({ pollutantTypeList: []})
        }
    },
  },
})