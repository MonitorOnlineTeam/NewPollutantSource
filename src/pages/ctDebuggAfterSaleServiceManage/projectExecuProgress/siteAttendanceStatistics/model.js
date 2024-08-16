import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'siteAttendanceStatistics',
  state: {
    tableDatas:[],
    queryPar:{},
    tableDetailDatas:[],
    tableDetailTotal:0,
    detailQueryPar:{},
  },
  effects: {
    *GetSignInAnalysis({ payload,callback }, { call, put, update }) { //获取现场工作时长信息
      const result = yield call(services.GetSignInAnalysis, payload);
      if (result.IsSuccess) {
        yield update({
          queryPar:payload,
          tableDatas:result.Datas,
          tableTotal:result.Total,
        })
      }else{
        result.Message && message.error(result.Message)
      }
    },
    *ExportSignInAnalysis({ payload,callback }, { call, put, update }) { //现场工作时长信息 导出
      const result = yield call(services.ExportSignInAnalysis, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.warning(result.Message);
      }
    },
    *GetSignInAnalysisInfo({ payload,callback }, { call, put, update }) { //获取现场工作时长详情信息
      const result = yield call(services.GetSignInAnalysisInfo, payload);
      if (result.IsSuccess) {
        yield update({
          tableDetailDatas:result.Datas,
          tableDetailTotal:result.Total,
          detailQueryPar:payload,
        })
      }else{
        result.Message && message.error(result.Message)
      }
    },
    *ExportSignInAnalysisInfo({ callback,payload }, { call, put, update, select }) { //现场工作时长详情信息 导出
      const response = yield call(services.ExportSignInAnalysisInfo, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${response.Datas}`);
      } else {
        response.Message && message.error(response.Message);
      }
    },




  }
})