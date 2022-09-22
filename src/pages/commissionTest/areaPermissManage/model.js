import Model from '@/utils/model';
import {
    getTestGroupList, addOrUpdTestGroup, deleteTestGroup, getTestMonitorUserList, addTestMonitorUser, getAllUser,
    getRegionByDepID,  insertRegionByUser,
} from './service';
import { message } from 'antd';
/*
   检测调试 区域权限管理
*/
export default Model.extend({
    namespace: 'areaPermissManage',
    state: {
        allUser: [],
    },
    effects: {

        /*获取部门详细信息及层级关系**/
        *getTestGroupList({ payload, callback }, { call, update, }) {
            const result = yield call(getTestGroupList, { ...payload });
            if (result.IsSuccess) {
                yield update({ DepartInfoTree: result.Datas });
                callback && callback(result.Datas)
            }
        },
        /*新增部门信息**/
        *addOrUpdTestGroup({ payload, callback }, { call, put, update, }) {
            const result = yield call(addOrUpdTestGroup, { ...payload });
            callback(result);
        },
        /*删除部门信息**/
        *deleteTestGroup({ payload, callback }, { call, update, }) {
            const result = yield call(deleteTestGroup, { ...payload });
            callback(result);
        },

        /*获取所有用户**/
        *getAllUser({ payload }, { call, update, }) {
            const result = yield call(getAllUser, { ...payload });
            if (result.IsSuccess) {
                yield update({ allUser: result.Datas });
            } else {
                message.error(result.Message)
            }

        },
        *getTestMonitorUserList({ payload ,callback}, { call, update, }) {
            const result = yield call(getTestMonitorUserList, { ...payload });
            if (result.IsSuccess) {
                callback && callback(result.Datas)
                
            } else {
                message.error(result.Message)
                callback && callback(result.Datas)
            }
          
        },

        /*给部门添加用户（可批量）**/
        *addTestMonitorUser({ payload, callback, }, { call, update, }) {
            const result = yield call(addTestMonitorUser, { ...payload });
            if (result.IsSuccess) {
                message.success(result.Message)
            } else {
                message.error(result.Message)
            }
            callback && callback(result.IsSuccess)
        },

      /*获取当前部门的行政区**/
      * getRegionByDepID({payload,  callback }, {  call,  update,  }) {
          const result = yield call(getRegionByDepID, {...payload  });
          if (result.IsSuccess) {
            callback(result.Datas)
        } else {
            callback(result.Datas)
            message.error(result.Message)
        }
          
       },
        /*给部门添加行政区（可批量）**/
        *insertRegionByUser({payload,callback}, {  call, update, }) {
            const result = yield call(insertRegionByUser, { ...payload   });
            callback(result)
        },
    },


    reducers: {
    },
});
