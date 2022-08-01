import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'pollutantQuery',
  state: {
    TestEntTableDatas:[],
    TestEntTableTotal:0,
    testPointTableDatas:0,
    testPointTableTotal:0,
    testPointEquipmentTableDatas:[],
    testPointEquipmentTableTotal:0,
    testPointSystemTableDatas:[],
    testPointSystemTableTotal:0,
    testPointParamTableDatas: [],
    testPointParamTableTotal: 0,

  },

  //   GetTestEntList  调试企业信息
// GetTestPointList  调试站点信息
// GetTestPointEquipmentList  调试站点CEMS设备信息
//  GetTestPointSystemList  调试站点CEMS型号信息
// GetTestPointParamList 调试站点参比仪器设备信息
  effects: {
    *getTestEntList({ payload, callback }, { call, put, update }) { //调试企业信息
      yield update({ tableLoading: true })
      const result = yield call(services.GetTestEntList, payload);
      if (result.IsSuccess) {
        yield update({
          TestEntTableDatas: result.Datas,
          TestEntTableTotal: result.Total,
        })
      } else {
        message.error(result.Message)
        yield update({ tableLoading: false })
      }
    },
    *exportTestEntList({ payload }, { call, put, update, select }) { //导出 调试企业信息
      const result = yield call(services.ExportTestEntList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },    
    *getTestPointList ({ payload, callback }, { call, put, update }) { //调试站点信息
      const result = yield call(services.GetTestPointList, payload);
      if (result.IsSuccess) {
        yield update({
          testPointTableDatas: result.Datas,
          testPointTableTotal: result.Total,
        })
      } else {
        message.error(result.Message)
      }
    },
    *exportTestPointList({ payload }, { call, put, update, select }) { //导出 调试站点信息
      const result = yield call(services.ExportTestPointList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    },  
    *getTestPointEquipmentList ({ payload, callback }, { call, put, update }) { //调试站点CEMS设备信息
      const result = yield call(services.GetTestPointEquipmentList, payload);
      if (result.IsSuccess) {
        yield update({
          testPointEquipmentTableDatas: result.Datas,
          testPointEquipmentTableTotal: result.Total,
        })
      } else {
        message.error(result.Message)
      }
    },
    *exportTestPointEquipmentList({ payload }, { call, put, update, select }) { //导出 调试站点CEMS设备信息
      const result = yield call(services.ExportTestPointEquipmentList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    }, 
    *getTestPointSystemList ({ payload, callback }, { call, put, update }) { //调试站点CEMS型号信息
      const result = yield call(services.GetTestPointSystemList, payload);
      if (result.IsSuccess) {
        yield update({
          testPointSystemTableDatas: result.Datas,
          testPointSystemTableTotal: result.Total,
        })
        callback();
      } else {
        message.error(result.Message)
      }
    },
    *exportTestPointSystemList({ payload }, { call, put, update, select }) { //导出 调试站点CEMS型号信息
      const result = yield call(services.ExportTestPointSystemList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      }else{
        message.warning(result.Message)
       }
    },
    *getTestPointParamList ({ payload, callback }, { call, put, update }) { //调试站点参比仪器设备信息
      const result = yield call(services.GetTestPointParamList, payload);
      if (result.IsSuccess) {
        yield update({
          testPointParamTableDatas: result.Datas,
          testPointParamTableTotal: result.Total,
        })
      } else {
        message.error(result.Message)
      }
    },
    *exportTestPointParamList({ payload }, { call, put, update, select }) { //导出 调试站点参比仪器设备信息
      const result = yield call(services.ExportTestPointParamList, { ...payload });
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      }else{
        message.warning(result.Message)
      }
    }, 

  }
})