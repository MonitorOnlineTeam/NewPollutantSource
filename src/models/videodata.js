import Model from '@/utils/model';

import {
  getysyList,
  getvideolist,
  hkvideourl, getqcaysyList,
} from '../services/videodata';
import {
  querypollutantlist,
} from '../services/baseapi';
import {
  queryhistorydatalist,
} from '../services/monitordata';
import config from '@/config';
import { formatPollutantPopover } from '@/utils/utils';
import { message } from 'antd';

export default Model.extend({
  namespace: 'videodata',
  state: {
    videoList: [],
    hkvideoListParameters: [],
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
    qcaurl: '',
  },
  effects: {
    /** 萤石云视频链接 */
    *ysyvideourl({ payload }, { call, update, select }) {
      const { ysyvideoListParameters } = yield select(state => state.videodata);
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

    /** 质控仪萤石云视频链接 */
    *qcaysyvideourl({ payload }, { call, update, select }) {
      const body = {
        VedioCameraID: payload.VedioCameraID,
      };
      const result = yield call(getqcaysyList, body);
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
          qcaurl: temprealurl,
        });
      } else {
        message.error(result.Message)
        yield update({
          qcaurl: temprealurl,
        });
      }
    },

    /** 萤石云获取摄像头列表 */
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
      const res = yield call(queryhistorydatalist, {
        ...payload,
      });
      const { hisrealdataList } = yield select(state => state.videodata);
      const realdata = [];
      if (res.Datas.length > 0) {
        const datas = res.Datas;
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
    /** 海康云视频链接 */
    * hkvideourl({
      payload,
    }, {
      call,
      update,
    }) {
      const body = {
        DGIMN: payload.DGIMN,
      }
      const result = yield call(hkvideourl, body);
      if (result.IsSuccess && result.Datas.length > 0) {
        yield update({
          hkvideoListParameters: result.Datas,
        });
      } else {
        yield update({
          hkvideoListParameters: [],
        });
      }
    },
  },
});
