import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'hourCommissionTest',
  state: {
    particleMatterReferTableDatas:[1,2,3,4,5,1,2,3,4,5,1,2,3,4,5],
    treeList:[],
  },
  effects: {
    *importData({ payload,callback }, { call, put, update }) { //列表
      yield update({ tableLoading:true})
      const result = yield call(services.ImportData, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *getTestEntTree({ payload,callback }, { call, put, update }) { //企业树
      yield update({ tableLoading:true})
      const result = yield call(services.GetTestEntTree, payload);
      if (result.IsSuccess) {
        yield update({
          treeList: result.Datas,
        })
        callback(result.Datas)
      }else{
        message.error(result.Message)
      }
    },  
  },
})