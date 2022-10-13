import moment from 'moment';
import * as services from './services';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';


/**
 * 台账填报设置
 */

export default Model.extend({
  namespace: 'accountFillingSet',
  state: {
    tableDatas: [],
    tableTotal: 0,
    statePointList:[],
    tableDetailDatas: [],
    tableDetailTotal: 0,
    entStateList:[],
    StateEntID:undefined,
  },
  effects: {
    *getEntAccountTypeList({ payload, callback }, { call, put, update }) { //列表
      yield update({ tableLoading: true })
      const result = yield call(services.GetEntAccountTypeList, payload);
      if (result.IsSuccess) { 
        yield update({
          tableTotal: result.Total,
          tableDatas:result.Datas? result.Datas:[],
        })
      } else {
        message.error(result.Message)
      }
    },


    *addOrUpaAccountType({ payload, callback }, { call, put, update }) { //添加修改填报方式
      const result = yield call(services.AddOrUpaAccountType, payload);
      if (result.IsSuccess) {
        callback(result.Datas)
      } else {
        message.error(result.Message)
      }
    },
    *exportEntAccountTypeList({ payload, callback }, { call, put, update }) { //导出
      const result = yield call(services.ExportEntAccountTypeList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${result.Datas}`);
      } else {
        message.warning(result.Message);
      }
    },
  },
})