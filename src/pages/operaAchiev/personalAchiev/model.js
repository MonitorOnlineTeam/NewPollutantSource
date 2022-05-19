import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'personalAchiev',
  state: {
    tableDatas: [],
    parametersList: [],
    tableTotal: 0,
    systemModelTableDatas:[],
    systemModelTableTotal:0,
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


  },
})