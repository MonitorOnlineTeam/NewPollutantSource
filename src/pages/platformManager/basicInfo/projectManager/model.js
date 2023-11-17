import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'projectManager',
  state: {
    tableDatas:[],
    parametersList:[],
    tableLoading:false,
    tableTotal:0,
    pointDatasTotal:0,
    pointDatas:[],
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
    *getProjectPointList({ payload,callback }, { call, put, update }) { //运维监测点信息
      const result = yield call(services.GetProjectPointList, payload);
      if (result.IsSuccess) {
        yield update({
          pointDatas:result.Datas,
          pointDatasTotal:result.Total,
        })
      }else{
        message.error(result.Message)
      }
    },
    *exportProjectInfoList({ callback,payload }, { call, put, update, select }) { //导出
      const response = yield call(services.ExportProjectInfoList, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${response.Datas}`);
      } else {
        message.warning(response.Message);
      }
    },
    *exportProjectPointList({ callback,payload }, { call, put, update, select }) { //导出 运维信息监测点
      const response = yield call(services.ExportProjectPointList, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${response.Datas}`);
      } else {
        message.warning(response.Message);
      }
    },
    
  },
})