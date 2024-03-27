import moment from 'moment';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';

export default Model.extend({
  namespace: 'disciplineCheck',
  state: {},
  effects: {
    // 获取纪律检查详情
    *GetDisciplineCheckList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.DisciplineCheck.GetDisciplineCheckList,
        payload,
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 获取纪律检查详情
    *GetRecordLogInfor({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        `${API.CtAPI_WJQ.DisciplineCheck.GetRecordLogInfor}?LogID=${payload.ID}`,
        {},
      );
      if (result.IsSuccess) {
        callback && callback(result);
      }
    },
    // 修改纪律检查
    *UpdateDisciplineCheckManage({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.DisciplineCheck.UpdateDisciplineCheckManage,
        payload,
      );
      if (result.IsSuccess) {
        message.success('修改成功！');
        callback && callback(result);
      }
    },
    // 导出
    *ExportDisciplineCheckList({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        API.CtAPI_WJQ.DisciplineCheck.ExportDisciplineCheckList,
        payload,
      );
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
    // 获取所属大区
    *getLargeRegion({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.CtCommonApi.GetLargeRegionList, payload);
      if (result.IsSuccess) {
        yield update({
          largeRegionList: result.Datas,
        });
      }
    },
    // 删除
    *DeleteDisciplineCheckManage({ payload, callback }, { call, put, update }) {
      const result = yield call(
        requestPost,
        `${API.CtAPI_WJQ.DisciplineCheck.DeleteDisciplineCheckManage}?LogID=${payload.ID}`,
        {},
      );
      if (result.IsSuccess) {
        callback && callback();
        message.success('删除成功！');
      }
    },
  },
});
