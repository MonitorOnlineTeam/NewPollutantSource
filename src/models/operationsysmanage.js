import Model from '@/utils/model';

import * as services from '@/services/autoformapi';
import { DeleteOperationSys } from '@/services/operationsysmanage';

export default Model.extend({
  namespace: 'operationsysmanage',
  state: {
  },
  effects: {
      /** 添加设备资料信息 */
    * AddEquipmentInfo({ payload }, { call }) {
        const result = yield call(services.postAutoFromDataAdd, { ...payload, FormData: JSON.stringify(payload.FormData) });
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
          },
        })
        }
      },
  },
});
