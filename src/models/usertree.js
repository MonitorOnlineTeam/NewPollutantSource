import Model from '@/utils/model';

import * as services from '@/services/usertree';


export default Model.extend({
  namespace: 'usertree',
  state: {
    UserList: [],
    selectedKeys: [],
    RolesTree: [],
    DepartTree: [],
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
         payload.callback(result.Datas);
      },
      /* 获取角色树(带根结点)* */
      * getrolestreeandobj({
        payload,
      }, {
        call,
        update,
      }) {
        const result = yield call(services.getrolestreeandobj, {
          ...payload,
        });
        if (result.IsSuccess) {
          yield update({
            RolesTree: result.Datas,
          });
        }
      },
       /* 获取部门树(带根结点)* */
        * getdeparttreeandobj({
            payload,
        }, {
            call,
            update,
        }) {
            const result = yield call(services.getdeparttreeandobj, {
                ...payload,
            });
            if (result.IsSuccess) {
                yield update({
                    DepartTree: result.Datas,
                });
            }
        },
  },
});
