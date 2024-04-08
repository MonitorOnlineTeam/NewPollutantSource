import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'vehicleManager',
  state: {
    tableLoading:false,
    tableDatas:[],
    queryPar:{},
    tableDetailTotal:0,
    detailQueryPar:{},
  },
  effects: {
    *GetCarList({ payload,callback }, { call, put, update }) { //获取车辆信息
      !payload.id? yield update({ tableLoading:true}) : null
      const result = yield call(services.GetCarList, payload);
      if (result.IsSuccess) {
        if(payload.id){
          callback && callback(result.Datas?result.Datas :  {} )
        }else{
         yield update({
           queryPar:payload,
           tableDatas:result.Datas,
           tableTotal:result.Total,
         })
        }
      }else{
        message.error(result.Message)
        callback && callback({})
      }
      !payload.id? yield update({ tableLoading:false}) : null
    },
    *ExportCarList({ payload,callback }, { call, put, update }) { //车辆信息 导出
      const result = yield call(services.ExportCarList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message);
      }
    },
    



  }
})