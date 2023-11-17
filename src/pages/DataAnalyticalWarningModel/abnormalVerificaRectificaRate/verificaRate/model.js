import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'verificaRate',
  state: {
    tableDatas:[],
    tableLoading:false,
    tableTotal:0,
    tableDatas2:[],
    tableLoading2:false,
    tableTotal2:0,
    tableDatas3:[],
    tableLoading3:false,
    tableTotal3:0,
    tableDatas4:[],
    tableLoading4:false,
    tableTotal4:0,
    queryPar:{},
    exportLoading:false,
    exportLoading2:false,
    exportLoading3:false,

  },
  effects: {
    *getModelWarningChecked({ payload, callback }, { call, put, update }) { //异常精准识别核实率 列表
      payload.pointType==1?  yield update({tableLoading:true}) : payload.pointType==2? yield update({tableLoading2:true}) : payload.pointType==3? yield update({tableLoading3:true}) : yield update({tableLoading4:true})
      const result = yield call(payload.pointType==1? services.getModelWarningCheckedForRegion :  payload.pointType==2? services.getModelWarningCheckedForCity: payload.pointType==3? services.getModelWarningCheckedForEnt : services.getModelWarningCheckedForPoint,{...payload,pointType:undefined});
      if (result.IsSuccess) {
        if(payload.pointType==1){
          yield update({tableDatas:result.Datas,tableTotal:result.Total,queryPar: payload, });
        }else if(payload.pointType==2){
          yield update({tableDatas2:result.Datas,tableTotal2:result.Total, });
        }else if(payload.pointType==3){
          yield update({tableDatas3:result.Datas,tableTotal3:result.Total, });
        }else{
          yield update({tableDatas4:result.Datas,tableTotal4:result.Total,});
        }
        callback && callback(result.Datas)
    
      } else {
        message.error(result.Message)
      }
      payload.pointType==1?  yield update({tableLoading:false}) : payload.pointType==2? yield update({tableLoading2:false}) : payload.pointType==3? yield update({tableLoading3:false}) : yield update({tableLoading4:false})


    },
    *exportModelWarningChecked({ payload, callback }, { call, put, update }) { //异常精准识别核实率 导出
      payload.pointType==1?  yield update({exportLoading:true}) : payload.pointType==2? yield update({exportLoading2:true}) : yield update({exportLoading3:true})
      const result = yield call(payload.pointType==1? services.exportModelWarningCheckedForRegion :  payload.pointType==2? services.exportModelWarningCheckedForCity: services.exportModelWarningCheckedForEnt,{...payload,pointType:undefined});
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.error(result.Message)
      }
      payload.pointType==1?  yield update({exportLoading:false}) : payload.pointType==2? yield update({exportLoading2:false}) : yield update({exportLoading3:false})

    },

  },
})