import Model from '@/utils/model';

import {
  getysyList,
  querypollutantlist,
  queryhistorydatalist,
  queryhistorydatalistbyrealtime,
  AddCameraMonitor,
  IsTrueSerialNumber,
  DeleteCamera,
  getvideolist,
} from './services';
import config from '@/config';
import { formatPollutantPopover } from '@/utils/utils';
import { message } from 'antd';
import * as services from '../../../../services/autoformapi';

export default Model.extend({
  namespace: 'video',
  state: {
    videoList: [],
    ysyvideoListParameters: {
      DGIMN: null,
      realtimevideofullurl: null,
      hisvideofullurl: null,
      requstresult: null,
      list: [],
      visible: false,
      pointName: '',
    },
    hisrealdataList: {
      hisrealdata: [],
      total: 0,
      pageIndex: 1,
      pageSize: 15,
    },
    columns: [],
    realdata: [],
    hiscolumns: [],
  },
  effects: {
    /** 萤石云视频链接 */
    *ysyvideourl({ payload }, { call, update, select }) {
      const { ysyvideoListParameters } = yield select(state => state.video);
      const body = {
        VedioCameraID: payload.VedioCameraID,
      };
      const result = yield call(getysyList, body);
      let temprealurl = 'nodata';
      if (result.IsSuccess) {
        const obj = result.Datas[0];
        if (obj) {
          if (payload.type === 1) {
            temprealurl = `${config.ysyvideourl}?AppKey=${obj.AppKey}&Secret=${obj.Secret}&SerialNumber=${obj.SerialNumber}&type=1`;
          } else {
            temprealurl = `${config.ysyvideourl}?AppKey=${obj.AppKey}&Secret=${obj.Secret}&SerialNumber=${obj.SerialNumber}&type=2`;
          }
        }
        yield update({
          ysyvideoListParameters: {
            ...ysyvideoListParameters,
            ...{
              requstresult: result.requstresult,
              list: result.data,
              realtimevideofullurl: temprealurl,
            },
          },
        });
      } else {
        message.error(result.Message)
        yield update({
          ysyvideoListParameters: {
            ...ysyvideoListParameters,
            ...{
              list: [],
              realtimevideofullurl: '',
            },
          },
        });
      }
    },

    /** 获取摄像头列表 */
    *getvideolist({ payload }, { call, update }) {
      const body = {
        DGIMN: payload.dgimn,
      };
      const res = yield call(getvideolist, body);
      if (res.IsSuccess && res.Datas.length > 0) {
         yield update({
        videoList: res.Datas,
      });
    } else {
         yield update({
           videoList: [],
         });
      }
      payload.callback(res.Datas);
    },
    /** 获取实时视频的污染物表头 */
    *querypollutantlist({ payload }, { call, update }) {
      const body = {
        DGIMNs: payload.dgimn,
      };
      const res = yield call(querypollutantlist, body);
      let pollutants = [];
      // pollutants.push({ title: "监测时间", dataIndex: "MonitorTime", key: "MonitorTime", align: 'center', width: '200px' });
      if (res.length > 0) {
        res.map((item, key) => {
          pollutants = pollutants.concat({
            title: `${item.PollutantName}(${item.Unit})`,
            dataIndex: item.PollutantCode,
            key: item.PollutantCode,
            align: 'center',
            render: (value, record, index) =>
              formatPollutantPopover(value, record[`${item.PollutantCode}_params`]),
          });
        });
      }
      if (pollutants.length === 1) {
        pollutants = [];
      }
      yield update({
        columns: pollutants,
      });
    },
    /** 获取实时视频的数据 */
    *queryhistorydatalist({ payload }, { call, update }) {
      const res = yield call(queryhistorydatalist, {
        ...payload,
      });
      const realdata = [];
      if (res.Datas.length > 0) {
        realdata.push({
          key: '1',
          ...res.Datas[0],
        });
      }
      yield update({
        realdata,
      });
    },
    /** 获取历史视频的污染物 */
    *querypollutantlisthis({ payload }, { call, update }) {
      const body = {
        DGIMNs: payload.dgimn,
      };
      const res = yield call(querypollutantlist, body);
      let pollutants = [];
      pollutants.push({
        title: '监测时间',
        dataIndex: 'MonitorTime',
        key: 'MonitorTime',
        align: 'left',
        width: '160px',
        fixed: 'left',
      });
      if (res.length > 0) {
        res.map((item, key) => {
          pollutants = pollutants.concat({
            title: `${item.PollutantName}(${item.Unit})`,
            dataIndex: item.PollutantCode,
            key: item.PollutantCode,
            align: 'left',
            width: '160px',
            render: (value, record, index) =>
              formatPollutantPopover(value, record[`${item.PollutantCode}_params`]),
          });
        });
      }
      if (pollutants.length === 1) {
        pollutants = [];
      }
      yield update({
        hiscolumns: pollutants,
      });
    },
    /** 获取历史视频数据 */
    *queryhistorydatalisthis({ payload }, { call, update, select }) {
      const res = yield call(queryhistorydatalistbyrealtime, {
        ...payload,
      });
      const { hisrealdataList } = yield select(state => state.video);
      const realdata = [];
      if (res.data.length > 0) {
        const datas = res.data;
        for (let i = 0; i < datas.length; i++) {
          const element = datas[i];
          realdata.push({
            key: i.toString(),
            ...element,
          });
        }
      }
      yield update({
        hisrealdataList: {
          ...hisrealdataList,
          ...{
            hisrealdata: realdata,
            total: res.total,
            pageIndex: payload.pageIndex,
            pageSize: payload.pageSize,
          },
        },
      });
    },
    /** 添加摄像头 */
    *AddDevice({ payload }, { call, put }) {
      const result = yield call(services.postAutoFromDataAdd, {
        ...payload,
        FormData: JSON.stringify(payload.FormData),
      });
      if (result.IsSuccess) {
        yield put({
          type: 'AddCameraMonitor',
          payload: {
            PointCode: payload.PointCode,
            VedioCameraID: result.Datas,
          },
        });
      } else {
        message.error(result.Message);
      }
      payload.callback(result);
    },
    /** 添加摄像头与排口关系表 */
    *AddCameraMonitor({ payload }, { call, put }) {
      const result = yield call(AddCameraMonitor, {
        ...payload,
      });
      const pointDataWhere = [
        {
          Key: '[dbo]__[T_Bas_CameraMonitor]__BusinessCode',
          Value: payload.PointCode,
          Where: '$=',
        },
        {
          Key: '[dbo]__[T_Bas_CameraMonitor]__MonitorType',
          Value: 1,
          Where: '$=',
        },
      ];

      if (result.IsSuccess) {
        message.success('添加成功！');
        yield put({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: 'CameraMonitor',
            searchParams: pointDataWhere,
          },
        });
      }
    },
    /** 判断序列号是否有效 */
    *IsTrueSerialNumber({ payload }, { call }) {
      const result = yield call(IsTrueSerialNumber, {
        ...payload,
      });
      payload.callback(result);
    },
    /** 删除摄像头 */
    * DeleteCamera({ payload }, { call, put }) {
        const result = yield call(DeleteCamera, { ...payload });
        const pointDataWhere = [
        {
          Key: '[dbo]__[T_Bas_CameraMonitor]__BusinessCode',
          Value: payload.PointCode,
          Where: '$=',
        },
         {
           Key: '[dbo]__[T_Bas_CameraMonitor]__MonitorType',
           Value: 1,
           Where: '$=',
         },
      ];
        if (result.Datas) {
          message.success('删除成功！');
          yield put({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: 'CameraMonitor',
            searchParams: pointDataWhere,
          },
        });
        }
      },
  },
});
