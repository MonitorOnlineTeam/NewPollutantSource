/**
 * 功  能：运维信息统计
 * 创建人：jab
 * 创建时间：2021.3.2
 */
import moment from 'moment';
import * as services from '../services/operatingInfo';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message,Progress } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';


export default Model.extend({
  namespace: 'operatingInfo',
  state: {
    tableDatas:[],
  },
  effects: {
    *getOperateRIHPointList({ payload,callback }, { call, put, update, select }) { //列表
      const global = yield select(state => state.global);
      const result = yield call(services.getOperateRIHPointList, {...payload,isBW:global?.operationSettingInfo?.TaskPlanType == 2});
      if (result.IsSuccess) {
        yield update({
            tableDatas:result.Datas,
            tableTotal:result.Total,
        })
      }else{
        message.error(result.Message)
      }
    },
    *exportOperateRIHPointList({ payload,callback }, { call, put, update, select }) { //导出
        const global = yield select(state => state.global);
        const result = yield call(services.exportOperateRIHPointList,  {...payload,isBW:global?.operationSettingInfo?.TaskPlanType == 2});
         if (result.IsSuccess) {
            message.success('下载成功');
           downloadFile(`${result.Datas}`);
          } else {
         message.warning(result.Message);
         yield update(exportStatus(false))
       }
    },
  },
})