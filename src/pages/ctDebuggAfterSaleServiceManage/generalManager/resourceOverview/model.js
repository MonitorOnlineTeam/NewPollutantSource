import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'resourceOverview',
  state: {
    leftData: {},
    rightData: {},
  },
  effects: {
    // 左侧数据
    *GetResourceOverviewLeft({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.GeneralManagerApi.GetResourceOverviewLeft, payload);
      if (result.IsSuccess) {
        yield update({
          leftData: result.Datas,
        });
        callback && callback(result.Datas);
      }
    },
    // 右侧数据
    *GetResourceOverviewRight({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.GeneralManagerApi.GetResourceOverviewRight, payload);
      if (result.IsSuccess) {
        yield update({
          rightData: result.Datas,
        });
        callback && callback(result.Datas);
      }
    },
    // 地图数据
    *GetResourceOverviewMap({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.GeneralManagerApi.GetResourceOverviewMap, payload);
      if (result.IsSuccess) {
        const data = result.Datas;
        data.RegionOfficeLocationList = data?.RegionOfficeLocationList?.map(item => ({
          position: { ...item.position, ...item, position: undefined }
        }))?.filter(item => item?.position?.OfficeLocationNum != 0 || item?.position?.OfficeAndUserNum != 0)
        data.RegionStorehouseList = data?.RegionStorehouseList?.map(item => ({
          position: { ...item.position, ...item, position: undefined }
        }))
        callback && callback(data);
      }
    },
    // 车辆统计按行业分类
    *GetCarStatistics({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.GeneralManagerApi.GetCarStatistics, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 车辆统计按行业分类 导出
    *ExportCarStatistics({ payload, callback }, { call, select, update }) {
      const result = yield call(requestPost, API.GeneralManagerApi.ExportCarStatistics, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
