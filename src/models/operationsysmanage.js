import Model from '@/utils/model';

import * as services from '@/services/autoformapi';
import { DeleteOperationSys, addoutputstop, deleteoutputstop, editoutputstop } from '@/services/operationsysmanage';

export default Model.extend({
  namespace: 'operationsysmanage',
  state: {
  },
  effects: {
      /** 添加 */
    * Add({ payload }, { call }) {
        const result = yield call(services.postAutoFromDataAdd, { ...payload, FormData: JSON.stringify(payload.FormData) });
        payload.callback(result);
      },
       /** 编辑 */
    * Edit({ payload }, { call }) {
        const result = yield call(services.postAutoFromDataUpdate, { ...payload, FormData: JSON.stringify(payload.FormData) });
        payload.callback(result);
      },
      /** 逻辑删除运维系统设置 */
      * DeleteOperationSys({
        payload,
      }, {
        call, put,
      }) {
        const result = yield call(DeleteOperationSys, {
          ...payload,
        });
        if (result.IsSuccess && result.Datas) {
          yield put({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: payload.configId,
            searchParams: payload.searchParams ? payload.searchParams : '',
          },
        })
        }
      },
       /** 添加停产 */
       * addoutputstop({ payload }, { call }) {
        const result = yield call(addoutputstop, { ...payload, FormData: payload.FormData });
        payload.callback(result);
        },
           /** 编辑停产 */
       * editoutputstop({ payload }, { call }) {
        const result = yield call(editoutputstop, { ...payload, FormData: payload.FormData });
        payload.callback(result);
        },
       /** 删除停产 */
       * deleteoutputstop({
        payload,
      }, {
        call, put,
      }) {
        const result = yield call(deleteoutputstop, {
          ...payload,
        });
        if (result.IsSuccess) {
          yield put({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: payload.configId,
            searchParams: payload.searchParams ? payload.searchParams : '',
          },
        })
        }
      },
  },
});
