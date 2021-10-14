import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'planWorkOrderStatistics',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
    pointDatas:[],
    abnormalTypes:1,
  },
  effects: {
    *getProjectInfoList({ payload,callback }, { call, put, update }) { //项目信息列表
      yield update({ tableLoading:true})
      const result = yield call(services.GetProjectInfoList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas,
          tableLoading:false
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *addOrUpdateProjectInfo({ payload,callback }, { call, put, update }) { //添加和修改
      const result = yield call(services.AddOrUpdateProjectInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *deleteProjectInfo({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DeleteProjectInfo, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },



  },
})