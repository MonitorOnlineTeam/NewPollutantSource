import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'newestHome',
  state: {
    totalDatas:{},
    tableLoading:false,
    operationDataSource: [
      {
        key: '1',
        name: '总数',
        age: 32,
        address: '12',
        tags: 23,
      },
      {
        key: '2',
        name: '暂停运维',
        age: 42,
        address: '13',
        tags: 23,
      },
      {
        key: '3',
        name: '结束运维',
        age: 32,
        address: 25,
        tags: 56
      },
    ],
    operaOrderData: [1823, 2348, 2903, 1049, 1317, 6302, 2302, 34234],
    planOperaList:[],
    planCompleteList:[
      {sort:1,name:'北京',roat:'99.98%'},
      {sort:2,name:'北京',roat:'99.98%'},
      {sort:3,name:'北京',roat:'99.98%'},
      {sort:4,name:'北京',roat:'99.98%'},
      {sort:5,name:'北京',roat:'99.98%'},
      {sort:6,name:'北京',roat:'99.98%'},
      {sort:7,name:'北京',roat:'99.98%'},
      {sort:8,name:'北京',roat:'99.98%'},
      {sort:9,name:'北京',roat:'99.98%'},
      {sort:10,name:'北京',roat:'99.98%'},
      {sort:11,name:'北京',roat:'99.98%'},
      {sort:12,name:'北京',roat:'99.98%'},
      {sort:13,name:'北京',roat:'99.98%'},
      {sort:14,name:'北京',roat:'99.98%'},
    ],
    dataAlarmResData:[100.00,99.00,88.33,12.88]
  },
  effects: {
    *getOperationExpirePointList({ payload,callback }, { call, put, update }) { //运维到期点位统计
      yield update({ tableLoading:true})
      const result = yield call(services.GetOperationExpirePointList, payload);
      if (result.IsSuccess) {
        yield update({
          totalDatas:result.Datas,
          tableLoading:false
        })
        callback(result.Datas)
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *exportOperationExpirePointList({ callback,payload }, { call, put, update, select }) { //运维到期点位统计 导出
      const response = yield call(services.ExportOperationExpirePointList, { ...payload });
      if (response.IsSuccess) {
        message.success('下载成功');
        downloadFile(`/upload${response.Datas}`);
      } else {
        message.warning(response.Message);
      }
    },
  },
})