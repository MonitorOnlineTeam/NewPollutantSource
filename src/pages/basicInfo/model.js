/**
 * 功  能：点位model
 * 创建人：dongxiaoyun
 * 创建时间：2019.08.26
 */
import Model from '@/utils/model';
import {
  AddPoint,
  UpdatePoint,
  DeletePoint,
} from './service';
import config from '@/config';
import {
  message,
} from 'antd';
import * as services from './service';

export default Model.extend({
  namespace: 'surfaceWater',
  state: {
    rowmodel: null,
  },
  effects: {
    * AddPoint({
      payload
    }, {
      call,
      update,
    }) {
      const result = yield call(AddPoint, payload);
      payload.callback && payload.callback(result);
    },
    
    * UpdatePoint({
      payload
    }, {
      call,
      update,
    }) {
      const result = yield call(UpdatePoint, payload);
      payload.callback && payload.callback(result);
    },
    
    * DeletePoint({
      payload
    }, {
      call,
      update,
    }) {
      const result = yield call(DeletePoint, payload);
      payload.callback && payload.callback(result);
    },
  },
});
