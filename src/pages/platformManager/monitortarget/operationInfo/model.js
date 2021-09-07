import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'

export default Model.extend({
  namespace: 'operationInfo',
  state: {
    tableDatas:[],
    projectTableDatas:[],
    parametersList:[],
    tableLoading:true,
    projectNumList:[],
    
  },
  effects: {
    *getEntProjectRelationList({ payload,callback }, { call, put, update }) { //监测运维列表
      yield update({ tableLoading:true})
      const result = yield call(services.GetEntProjectRelationList, payload);
      if (result.IsSuccess) {
        yield update({ tableDatas:result.Datas,tableLoading:false  })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *updateOrAddProjectRelation({ payload,callback }, { call, put, update }) { //添加和更新
      const result = yield call(services.UpdateOrAddProjectRelation, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },
    *deleteOperationPoint({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DeleteOperationPoint, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },
    *projectNumList({ payload,callback }, { call, put, update }) { //项目编号列表
      const result = yield call(services.ProjectNumList, payload);
      if (result.IsSuccess) {
        yield update({ projectTableDatas:result.Datas, })
      }else{
        message.error(result.Message)
      }
    },
  },
})