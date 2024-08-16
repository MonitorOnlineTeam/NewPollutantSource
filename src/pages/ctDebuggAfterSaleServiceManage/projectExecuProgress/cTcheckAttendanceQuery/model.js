import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'cTcheckAttendanceQuery',
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
        result.Message && message.error(result.Message)
      }
    },
    *ExportSignInAndOffsiteSign({ payload,callback }, { call, put, update }) { //签到考勤查询信息 导出
      const result = yield call(services.ExportSignInAndOffsiteSign, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        result.Message && message.error(result.Message);
      }
    },
    *GetOffWorkType({ payload,callback }, { call, put, update }) { //工作类型
      const result = yield call(services.GetOffWorkType, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        result.Message && message.error(result.Message)
      }
    },
    



  }
})