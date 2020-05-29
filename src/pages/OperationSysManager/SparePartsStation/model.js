/**
 * 功  能：备品备件model
 * 创建人：dongxiaoyun
 * 创建时间：2020-5-21
 */
import Model from '@/utils/model';
import {
    GetAllOperationUsers,
    getSparePartsStationList,
    saveSparePartsStationUser,
} from './services';
import config from '@/config';
import {
    message,
} from 'antd';
import * as services from '../../../services/autoformapi';
import moment from "moment";

export default Model.extend({
    namespace: 'SparePartsStation',
    state: {
        AllUser: [],
        SparePartsStationUser: [],
    },
    effects: {
        /*获取所有用户**/
        * GetAllOperationUsers({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(GetAllOperationUsers, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    AllUser: result.Datas
                });
            }
        },
        /*获取服务站关联信息**/
        * getSparePartsStationList({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getSparePartsStationList, {
                ...payload
            });
            if (result.IsSuccess) {
                yield update({
                    SparePartsStationUser: result.Datas
                });
            }
            payload.callback(result.Datas);
        },


        /*保存用户关联信息**/
        * saveSparePartsStationUser({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(saveSparePartsStationUser, {
                ...payload
            });
            if (result.IsSuccess) {
                message.success("保存成功")
            }
            else
            {
                message.error(result.message)
            }
            payload.callback();
        },

    },
});
