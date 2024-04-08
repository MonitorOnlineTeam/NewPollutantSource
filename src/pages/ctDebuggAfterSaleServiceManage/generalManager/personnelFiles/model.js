import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'personnelFiles',
  state: {
    tableDatas:[],
    queryPar:{},
    tableDetailTotal:0,
    detailQueryPar:{},
  },
  effects: {
    *GetUserList({ payload,callback }, { call, put, update }) { //获取人员档案
      const result = yield call(services.GetUserList, payload);
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
    *ExportUserList({ payload,callback }, { call, put, update }) { //人员档案 导出
      const result = yield call(services.ExportUserList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message);
      }
    },
    *GetCodList({ payload,callback }, { call, put, update }) { //岗位类别和行业属性
      const result = yield call(services.GetCodList, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },
    



  }
})