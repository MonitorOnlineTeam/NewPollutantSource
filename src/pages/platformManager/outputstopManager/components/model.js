import Model from '@/utils/model';
import {
  addoutputstop,
} from './services';

export default Model.extend({
    namespace: 'outputstop',
    state: {
    },
    effects: {
          /** 添加停产 */
          * addoutputstop({ payload }, { call }) {
              const result = yield call(addoutputstop, { ...payload, FormData: JSON.stringify(payload.FormData) });
              payload.callback(result.Datas);
          },
          /** 添加视频参数 */
          * addVideoInfos({ payload }, { call }) {
              const result = yield call(addVideoInfo, { ...payload });
              payload.callback(result.Datas);
          },
          /** 删除视频参数 */
          * deleteVideoInfo({ payload }, { call }) {
              const result = yield call(deleteVideoInfo, { ...payload });
              payload.callback(result.Datas);
          },
    },
  });
