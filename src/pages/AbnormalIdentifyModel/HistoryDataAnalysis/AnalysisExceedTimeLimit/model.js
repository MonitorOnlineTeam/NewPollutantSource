import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({ 
  namespace: 'analysisExceedTimeLimit',
  state: {
  },
  effects: {
    // 列表
    // *GetCustomerVisitList({ payload, callback }, { call, put, update }) {
    //   const result = yield call(
    //     requestPost,
    //     API.CtAPI_WJQ.CustomerReturnVisit.GetCustomerVisitList,
    //     payload,
    //   );
    //   if (result.IsSuccess) {
    //     callback && callback(result);
    //   }
    // },
    // // 导出
    // *ExportCustomerVisitList({ payload, callback }, { call, put, update }) {
    //   const result = yield call(
    //     requestPost,
    //     API.CtAPI_WJQ.CustomerReturnVisit.ExportCustomerVisitList,
    //     payload,
    //   );
    //   if (result.IsSuccess) {
    //     message.success('导出成功！');
    //     downloadFile(result.Datas);
    //   }
    // },



  },
});
