/**
 * 功  能：gbs视频管理
 * 创建人：xpy
 * 修改人：-
 * 创建时间：2020-04-04
 */
import Model from '@/utils/model';
import {
    GetGBSPTZ, GetGBSPFL, PlaybackStart, PlaybackStop, PlaybackControl, StreamTouch, PlaybackTouch,
} from '../services/GBSVideo';

export default Model.extend({
    namespace: 'gbsvideo',
    state: {

    },
    effects: {
        /** 实时直播 - 直播流保活 */
        * StreamTouch({ payload }, { call }) {
            const result = yield call(StreamTouch, { ...payload });
            payload.callback(result);
        },
        /** 云台控制 */
        * GetGBSPTZ({ payload }, { call }) {
            const result = yield call(GetGBSPTZ, { ...payload });
            payload.callback(result);
        },
        /** 光圈控制 */
        * GetGBSPFL({ payload }, { call }) {
            const result = yield call(GetGBSPFL, { ...payload });
            payload.callback(result);
        },
        /** 开始回放 */
        * PlaybackStart({ payload }, { call }) {
            const result = yield call(PlaybackStart, { ...payload });
            payload.callback(result);
        },
        /** 停止回放 */
         * PlaybackStop({ payload }, { call }) {
            const result = yield call(PlaybackStop, { ...payload });
            payload.callback(result);
        },
        /** 回放控制 */
        * PlaybackControl({ payload }, { call }) {
            const result = yield call(PlaybackControl, { ...payload });
            payload.callback(result);
        },
        /** 录像回放 - 回放流保活 */
        * PlaybackTouch({ payload }, { call }) {
            const result = yield call(PlaybackTouch, { ...payload });
            payload.callback(result);
        },
    },
});
