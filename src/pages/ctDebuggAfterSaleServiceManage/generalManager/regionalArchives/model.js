import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'regionalArchives',
  state: {
    tableDatas:[],
    queryPar:{},
    tableDetailTotal:0,
    detailQueryPar:{},
  },
  effects: {
    *GetProvinceList({ payload,callback }, { call, put, update }) { //获取大区档案
      const result = yield call(services.GetProvinceList, payload);
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
    *ExportProvinceList({ payload,callback }, { call, put, update }) { //大区档案 导出
      const result = yield call(services.ExportProvinceList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message);
      }
    },
    *GetManagerSelect({ payload,callback }, { call, put, update }) { //获取大区系统类型、档案执行大区、项目所在地、大区经理、省区经理信息
      const result = yield call(services.GetManagerSelect, payload);
      if (result.IsSuccess) {
        callback&&callback(result.Datas)
      }else{
        message.error(result.Message)
        callback&&callback([])
      }
    },
    



  }
})