/**
 * 功  能：海康威视视频管理
 * 创建人：wjw
 * 修改人：-
 * 创建时间：2019.10.21
 */
import Model from '@/utils/model';
import {
    hkvideourl,
    updateVideoInfos,
    addVideoInfo,
    deleteVideoInfo,
} from '@/components/VideoView/hk/services';

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
            if (result.IsSuccess && result.Datas.length > 0) {
                yield update({
                    videoListParameters: {
                        ...videoListParameters,
                        ...{
                            requstresult: result.requstresult,
                            list: result.Datas,
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
                        },
                    },
                });
            }
        },
        /** 更新视频参数 */
        * updateVideoInfos({ payload }, { call }) {
            const result = yield call(updateVideoInfos, { ...payload });
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
