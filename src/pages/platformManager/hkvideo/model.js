import Model from '@/utils/model';
import {
  hkvideourl,
  querypollutantlist,
  queryhistorydatalist,
  queryhistorydatalistbyrealtime,
  updateVideoInfos,
  addVideoInfo,
  deleteVideoInfo,
} from './services';
import config from '@/config';
import {
  formatPollutantPopover,
} from '@/utils/utils';
import {
  message,
} from 'antd';
import * as services from '../../../services/autoformapi';

export default Model.extend({
  namespace: 'hkvideo',
  state: {
   // 视频参数
   videoListParameters: {
     DGIMN: null,
     realtimevideofullurl: null,
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
    /** 海康云视频链接 */
    * hkvideourl({
      payload,
    }, {
      call,
      update,
      select,
    }) {
      const {
        videoListParameters,
      } = yield select(state => state.hkvideo);
      const body = {
        DGIMN: payload.DGIMN,
      }
      const result = yield call(hkvideourl, body);
      let temprealurl = 'nodata';
      if (result.IsSuccess && result.Datas.length > 0) {
        const obj = result.Datas[0];
        if (obj && obj.IP) {
          if (payload.type === 1) {
          temprealurl = `${config.realtimevideourl}?ip=${obj.IP}&port=${obj.Device_Port}&userName=${obj.User_Name}&userPwd=${obj.User_Pwd}&cameraNo=${obj.VedioCamera_No}`;
          } else {
          temprealurl = `${config.hisvideourl}?ip=${obj.IP}&port=${obj.Device_Port}&userName=${obj.User_Name}&userPwd=${obj.User_Pwd}&cameraNo=${obj.VedioCamera_No}`;
          }
        }
        yield update({
          videoListParameters: {
            ...videoListParameters,
            ...{
              requstresult: result.requstresult,
              list: result.Datas,
              realtimevideofullurl: temprealurl,
            },
          },
        });
      } else {
        yield update({
          videoListParameters: {
            ...videoListParameters,
            ...{
              requstresult: result.requstresult,
              list: [],
              realtimevideofullurl: temprealurl,
              hisvideofullurl: temphisurl,
            },
          },
        });
      }
    },

    /** 获取实时视频的污染物表头 */
    * querypollutantlist({
      payload,
    }, {
      call,
      update,
    }) {
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
    * queryhistorydatalist({
      payload,
    }, {
      call,
      update,
    }) {
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
    * querypollutantlisthis({
      payload,
    }, {
      call,
      update,
    }) {
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
    * queryhistorydatalisthis({
      payload,
    }, {
      call,
      update,
      select,
    }) {
      const res = yield call(queryhistorydatalistbyrealtime, {
        ...payload,
      });
      const {
        hisrealdataList,
      } = yield select(state => state.hkvideo);
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
    /** 更新视频参数 */
    * updateVideoInfos({ payload }, { call, put, update }) {
            const result = yield call(updateVideoInfos, { ...payload });
            yield update({
                requstresult: result.requstresult,
                reason: result.reason,
            });
        },
        /** 添加视频参数 */
        * addVideoInfos({ payload }, { call, put, update }) {
            const result = yield call(addVideoInfo, { ...payload });
            yield update({
                requstresult: result.requstresult,
                reason: result.reason,
            });
        },
        /** 删除视频参数 */
        * deleteVideoInfo({ payload }, { call, put, update }) {
            const result = yield call(deleteVideoInfo, { ...payload });
            yield update({
                requstresult: result.requstresult,
                editUser: result.data[0],
            });
            payload.callback(result.requstresult);
        },
  },
});
