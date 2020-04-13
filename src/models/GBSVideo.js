/**
 * 功  能：gbs视频管理
 * 创建人：xpy
 * 修改人：-
 * 创建时间：2020-04-04
 */
import Model from '@/utils/model';
import {
    GetGBSPTZ, GetGBSPFL,
} from '../services/GBSVideo';

export default Model.extend({
    namespace: 'gbsvideo',
    state: {

    },
    effects: {
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
    },
});
