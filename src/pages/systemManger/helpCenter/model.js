import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'helpCenter',
  state: {
    treeData : [
    {
      title: `网页端`,
      key: '0-0',
      children: [
        {
          title: `常见问题`,
          key: '0-0-1',
        },
        {
          title: `功能使用`,
          key: '0-0-2',
        },
      ],
    },
    {
      title: '运维APP端',
      key: '0-1',
      children: [
        {
          title: '常见问题',
          key: '0-1-1',
        },
        {
          title: '功能使用',
          key: '0-1-2',
        },
      ],
    },

],
    listData:[{content:'player支付凡是的设置文档',key:'1'}],
    listDataTotal:0,
  },
  effects: {
    *getManufacturerList({ payload,callback }, { call, put, update }) { //列表
      yield update({ tableLoading:true})
      const result = yield call(services.GetManufacturerList, payload);
      if (result.IsSuccess) {
        yield update({
          tableTotal:result.Total,
          tableDatas:result.Datas?result.Datas.mlist : [],
          maxNum:result.Datas.MaxNum,
          tableLoading:false,
        })
      }else{
        message.error(result.Message)
        yield update({ tableLoading:false})
      }
    },
    *addManufacturer({ payload,callback }, { call, put, update }) { //添加
      const result = yield call(services.AddManufacturer, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *editManufacturer({ payload,callback }, { call, put, update }) { //修改
      const result = yield call(services.EditManufacturer, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    }, 
    *delManufacturer({ payload,callback }, { call, put, update }) { //删除
      const result = yield call(services.DelManufacturer, payload);
      if (result.IsSuccess) {
        message.success(result.Message)
        callback()
      }else{
        message.error(result.Message)
      }
    },

  },
})