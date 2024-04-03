import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operaCheckAttendanceQuery',
  state: {
    tableDatas:[],
    queryPar:{},
    tableDetailDatas:[],
    tableDetailTotal:0,
    detailQueryPar:{},
  },
  effects: {
    *GetSignInAndOffsiteSignList({ payload,callback }, { call, put, update }) { //获取签到考勤信息
      const result = yield call(services.GetSignInAndOffsiteSignList, payload);
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
    *ExportSignInAndOffsiteSign({ payload,callback }, { call, put, update }) { //签到考勤查询信息 导出
      const result = yield call(services.ExportSignInAndOffsiteSign, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message);
      }
    },
    *GetSignInType({ payload,callback }, { call, put, update }) { //工作类型
      const result = yield call(services.GetSignInType, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    



  }
})