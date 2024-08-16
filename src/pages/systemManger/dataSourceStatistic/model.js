import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'dataSourceStatistic',
  state: {
    tableDatas:[],
    tableTotal:0,
    queryPar:{},
  },
  effects: {
    *GetPGZXPointStatusList({ payload,callback }, { call, put, update }) { //列表
      const result = yield call(services.GetPGZXPointStatusList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas?result.Datas : [],
        })
      }else{
        result.Message && message.error(result.Message)
      }
    },
    *ExportPGZXPointStatusList({ payload, callback }, { call, select, update }) { //导出
      const result = yield call(services.ExportPGZXPointStatusList, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },



  },
})