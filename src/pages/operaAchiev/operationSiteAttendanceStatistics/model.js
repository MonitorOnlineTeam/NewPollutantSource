import moment from 'moment';
import * as services from './service';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
  namespace: 'operationSiteAttendanceStatistics',
  state: {
    tableDatas: [],
    tableLoading: false,
    exportLoading: false,
    queryPar: {},
    regDetailDatas: [],
    regDetailTotal: 0,
    regDetaiLoading: false,
    regDetailExportLoading: false,
    regDetailQueryPar:{},
    cityDetailDatas: [],
    cityDetailTotal: 0,
    cityDetailLoading: false,
    cityDetailExportLoading: false,
    cityDetailQueryPar: {},
  },
  effects: {
    *GetSignInList({ payload, callback }, { call, put, update }) { //获取现场签到统计信息
        payload.pointType == 1 ?
          yield update({ tableLoading: true }) :
        payload.pointType == 2 ?
          yield update({ regDetaiLoading: true }) :
          yield update({ cityDetailLoading: true })
      const result = yield call(services.GetSignInList, payload);

      if (result.IsSuccess) {
        switch (payload.pointType) {
          case 1:
            yield update({
              tableDatas: result.Datas,
              queryPar: payload,
            })
            break;
          case 2:
            yield update({
              regDetailDatas: result.Datas,
              regDetailTotal: result.Total,
              regDetailQueryPar: payload,
            })
            break;
          case 3:
            yield update({
              cityDetailDatas: result.Datas,
              cityDetailTotal: result.Total,
              cityDetailQueryPar: payload,
            })
            break;
        }
      } else {
        message.error(result.Message)
      }
        payload.pointType == 1 ?
          yield update({ tableLoading: false }) :
        payload.pointType == 2 ?
          yield update({ regDetaiLoading: false }) :
          yield update({ cityDetailLoading: false })
    },
    
    *ExportSignInList({ payload, callback }, { call, put, update }) { //现场签到统计信息 导出
        payload.pointType == 1 ?
          yield update({ exportLoading: true }) :
        payload.pointType == 2 ?
          yield update({ regDetailExportLoading: true }) :
          yield update({ cityDetailExportLoading: true })
      const result = yield call(services.ExportSignInList, payload);
      if (result.IsSuccess) {
        message.success('下载成功');
        downloadFile(`${result.Datas}`);
      } else {
        message.warning(result.Message);
      }
      payload.pointType == 1 ?
        yield update({ exportLoading: false }) :
      payload.pointType == 2 ?
        yield update({ regDetailExportLoading: false }) :
        yield update({ cityDetailExportLoading: false })
    },

    *GetSignInType({ payload, callback }, { call, put, update }) { //获取现场签到统计信息

       const result = yield call(services.GetSignInType, payload);
        if (result.IsSuccess) {
          callback&&callback(result.Datas)
        } else {
         message.error(result.Message)
       }
    }

  }
})