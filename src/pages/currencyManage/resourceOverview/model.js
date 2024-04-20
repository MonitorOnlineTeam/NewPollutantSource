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
    disposableRateList: {},
    disposableDate: [],
  },
  effects: {
    // 左侧数据
    *GetResourceOverviewLeft({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.ResourceOverviewApi.GetResourceOverviewLeft, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 右侧数据
    *GetResourceOverviewRight({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.ResourceOverviewApi.GetResourceOverviewRight, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      }
    },
    // 地图数据
    *GetResourceOverviewMap({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.ResourceOverviewApi.GetResourceOverviewMap, payload);
      if (result.IsSuccess) {
        const data = result.Datas;

        data.RegionStandbyMachineList = data.RegionStandbyMachineList.map(item=>({
          position:{
            ...item,
            // latitude:item.Latitude,
            // longitude:item.Longitude,
            latitude:item.Longitude,
            longitude:item.Latitude,
         }
       }))
        // RegionPortableInstrumentList
        // RegionOfficeLocationList
        // RegionStorehouseList

        callback && callback(data);
      }
    },

    // 基础数据 - 导出
    *ExportDisposableServiceInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost,API.ReportsViewsApi.ExportDisposableServiceInfo, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
