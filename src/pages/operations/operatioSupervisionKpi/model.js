import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operatioSupervisionKpi',
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
    queryPar:{},
    exportLoading:false,
    exportLoading2:false,
    exportLoading3:false,

  },
  effects: {
    *getParamKPIList({ payload, callback }, { call, put, update }) { //异常精准识别核实率 列表
      payload.staticType==1?  yield update({tableLoading:true}) : payload.staticType==2? yield update({tableLoading2:true}) : payload.staticType==3? yield update({tableLoading3:true}) : yield update({tableLoading4:true})
      const result = yield call(services.getParamKPIList ,payload);
      if (result.IsSuccess) {
        if(payload.staticType==1){
          yield update({tableDatas:result.Datas,tableTotal:result.Total,queryPar: payload, });
        }else if(payload.staticType==2){
          yield update({tableDatas2:result.Datas,tableTotal2:result.Total, });
        }else if(payload.staticType==3){
          yield update({tableDatas3:result.Datas,tableTotal3:result.Total, });
        }else{
          yield update({tableDatas4:result.Datas,tableTotal4:result.Total,});
        }
        callback && callback(result.Datas)
    
      } else {
        message.error(result.Message)
      }
      payload.staticType==1?  yield update({tableLoading:false}) : payload.staticType==2? yield update({tableLoading2:false}) : payload.staticType==3? yield update({tableLoading3:false}) : yield update({tableLoading4:false})


    },
    *exportParamKPIList({ payload, callback }, { call, put, update }) { //异常精准识别核实率 导出
      payload.staticType==1?  yield update({exportLoading:true}) : payload.staticType==2? yield update({exportLoading2:true}) : yield update({exportLoading3:true})
      const result = yield call(services.exportParamKPIList,payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/wwwroot${result.Datas}`);
      } else {
        message.error(result.Message)
      }
      payload.staticType==1?  yield update({exportLoading:false}) : payload.staticType==2? yield update({exportLoading2:false}) : yield update({exportLoading3:false})

    },

  },
})