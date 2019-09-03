
import Model from '@/utils/model';
import {
  GetMaintenanceReminder, AddOrUpdateMaintenanceReminder, DeleteMaintenanceReminder,
} from '../services/maintenancesApi';

export default Model.extend({
  namespace: 'maintenances',
  state: {
maintenancereminderdata: [],
  },
  effects: {
/** 获取运维周期 */
    * GetMaintenanceReminder({
      payload,
    }, {
      call,
      update,
    }) {
      const res = yield call(GetMaintenanceReminder, {
        ...payload,
      });
      if (res.IsSuccess && res.Datas.length > 0) {
        yield update({
          maintenancereminderdata: res.Datas[0],
        });
      } else {
        yield update({
          maintenancereminderdata: [],
        });
      }
      payload.callback(res.Datas[0]);
    },
    /** 添加或更新运维周期 */
    * AddOrUpdateMaintenanceReminder({
      payload,
    }, {
      call,
    }) {
      const res = yield call(AddOrUpdateMaintenanceReminder, {
        ...payload,
      });
      payload.callback(res);
    },
    /** */
    * DeleteMaintenanceReminder({
      payload,
    }, {
      call,
    }) {
      const res = yield call(DeleteMaintenanceReminder, {
        ...payload,
      });
      payload.callback(res);
    },
  },
})
