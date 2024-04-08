import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'standardGasValidity',
  state: {
    largeRegionList: [],
  },
  effects: {
    // 标气有效期列表
    *GetStandardAirList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.StandardGasValidity.GetStandardAirList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 添加或编辑
    *UpdateOrAddStandardAir({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.StandardGasValidity.UpdateOrAddStandardAir,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 导出
    *ExportStandardAir({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.StandardGasValidity.ExportStandardAir,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 删除
    *DeleteStandardAir({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        `${API.CtAPI_WJQ.StandardGasValidity.DeleteStandardAir}?ID=${payload.ID}`,
        {},
      );
      if (result.IsSuccess) {
        callback && callback();
        message.success('删除成功！');
      }
    },
    // 下载导入模板
    *GetStandardAirTemplate({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.StandardGasValidity.GetStandardAirTemplate,
        payload,
      );
      if (result.IsSuccess) {
        message.success('下载完成！');
        downloadFile(result.Datas);
      }
    },
  },
});
