import Model from '@/utils/model';

import * as services from '@/services/autoformapi';


export default Model.extend({
  namespace: 'operationsysmanage',
  state: {
  },
  effects: {
      /** 添加设备资料信息 */
    * AddEquipmentInfo({ payload }, { call }) {
        debugger
        const result = yield call(services.postAutoFromDataAdd, { ...payload, FormData: JSON.stringify(payload.FormData) });
        payload.callback(result);
      },
  },
});
