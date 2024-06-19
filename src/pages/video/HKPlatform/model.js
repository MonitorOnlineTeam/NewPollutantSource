import moment from 'moment';
import * as services from './service';
import Model from '@/utils/model';
import { message } from 'antd';
import { post } from '@/utils/request';
import { API } from '@config/API'

export default Model.extend({
  namespace: 'test',
  state: {
    tableDataSource: [],
    addExceptionModalVisible: false,
    exceptionReportedData: {
      ExceptionType: "",
      PollutantCodes: "",
    },
  },
  effects: {
    // 查询
    *getPreviewURLs({ payload }, { call, update }) {
      const result = yield call(_post, API.VideoApi.GetPreviewURLs, payload, {
        headers: {
          "X-Ca-Key": '23924182'
        }
      });
      if (result.IsSuccess)
        yield update({
        })
    },
    // 查询
    *GetAllCameras({ payload }, { call, update }) {
      const result = yield call(_post, API.VideoApi.GetAllCameras, payload);
      if (result.IsSuccess)
        yield update({
        })
    },
  }
})

async function _post(url, params, options) {
  return post(url, params, options)
    .then(res => {
      if (res.IsSuccess) {
        return res;
      } else {
        message.error(e.Message)
        return false;
      }
    })
    .catch((error) => {
      console["error"](error);
      return error;
    });
}