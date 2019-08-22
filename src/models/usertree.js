import Model from '@/utils/model';

import * as services from '@/services/usertree';


export default Model.extend({
  namespace: 'usertree',
  state: {
    UserList: [],
  },
  effects: {
      /** 获取用户信息组件 */
    * GetUserList({ payload }, { call, update }) {
        const result = yield call(services.GetUserList, {
          ...payload,
        });
         if (result.IsSuccess && result.Datas.length > 0) {
           yield update({
             UserList: result.Datas,
           });
         } else {
           yield update({
             UserList: [],
           });
         }
      },
  },
});
