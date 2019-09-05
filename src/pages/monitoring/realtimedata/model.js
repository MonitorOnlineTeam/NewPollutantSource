import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';

export default Model.extend({
  namespace: 'realtimeserver',
  state: {
    
  },
  effects: {
    * GetProcessFlowChartStatus({
        payload
    }, {call, update}) {
        const res = yield call(services.GetProcessFlowChartStatus, payload);
        if(res && res.Datas) {
            yield update({
                operationInfo:res.Datas.operationInfo,
                stateInfo:res.Datas.stateInfo,
                paramsInfo:res.Datas.paramsInfo,
                dataInfo:res.Datas.dataInfo,
                stateNameInfo:res.Datas.stateNameInfo,
                paramNameInfo:res.Datas.paramNameInfo,
                paramstatusInfo:res.Datas.paramstatusInfo
            });
        }
        else
        {
            yield update({
                operationInfo:null,
                stateInfo:null,
                paramsInfo:null,
                dataInfo:null,
                stateNameInfo:null,
                paramNameInfo:null,
                paramstatusInfo:null
            });
        }
     }
    }
})
