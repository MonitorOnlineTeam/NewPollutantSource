/*
 * @desc: 一企一档 企业列表
 * @Author: jab
 * @Date: 2021.03.15
 */
import Model from '@/utils/model';
import { GetEntsList  } from './service';
import moment from 'moment';
import {  message } from 'antd';
import { downloadFile} from '@/utils/utils';

export default Model.extend({
  namespace: 'entList',
  state: {
    dataSource: [],
    loading:true,
    total:'',
    queryParams: {
      indexStr: '',
    }
  },
  effects: {
     //获取企业列表
        *getEntsList({callback, payload }, { call, update }) {
          yield update({ loading:true  })
          const result = yield call(GetEntsList, payload);
          if (result.IsSuccess) {
            yield update({ dataSource: result.Datas,total:result.Datas.length, loading:false  })
            callback(result.Datas)
          } else {
            message.error(result.Message)
          }
        },
  }


});
