/**
 * 功  能：备品备件model
 * 创建人：dongxiaoyun
 * 创建时间：2020-5-21
 */
import Model from '@/utils/model';
import {
    GetSparepartManageList,
    GetSparePartsStation,
    UpdateSpareParts,
    DeleteSpareParts,
    getUploadTemplate,
    GetStorehouse
} from './services';
import config from '@/config';
import {
    message,
} from 'antd';
import * as services from '../../../services/autoformapi';
import moment from "moment";
import { formatPollutantPopover, getDirLevel } from '@/utils/utils';

export default Model.extend({
    namespace: 'SparepartManage',
    state: {
        total: 0,
        sparepartManageDatalist: [],
        //备品备件参数
        sparepartManageParameters: {
            pageIndex: 1,
            pageSize: 20,
            PartCode: '',
            PartName: '',
            Code: '',
            SparePartsStationCode: '',
            EquipmentType: '',
            IsUsed: '',
        },
        pageCount: ["20", "40", "60", "80"],
        sparePartsStationList: [],
        storehouseList:[]
    },
    effects: {
        //获取数据列表
        * GetSparepartManageList({
            payload
        }, {
            call,
            put,
            update,
            select,
        }) {
            const { sparepartManageParameters } = yield select(a => a.SparepartManage);
            const result = yield call(GetSparepartManageList, { ...sparepartManageParameters });
            if (result.IsSuccess) {
                yield update({
                    sparepartManageDatalist: result.Datas,
                    total: result.Total,
                });
            }
        },


        //获取服务站列表
        * GetSparePartsStation({
            payload
        }, {
            call,
            put,
            update,
            select,
        }) {
            const result = yield call(GetSparePartsStation, {});
            if (result.IsSuccess) {
                yield update({
                    sparePartsStationList: result.Datas,
                });
            }
        },

        //获取Excel模板
        * getUploadTemplate({
            payload
        }, {
            call,
            put,
            update,
            select,
        }) {
            const { sparepartManageParameters } = yield select(a => a.SparepartManage);   
            const result = yield call(getUploadTemplate, { ...sparepartManageParameters });
            if (result.IsSuccess) {
                payload.callback(result.Datas);
            }
        },

        //删除数据
        * DeleteSpareParts({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(DeleteSpareParts, payload);
            payload.callback(result.IsSuccess);
        },

        //修改数据
        * UpdateSpareParts({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateSpareParts, payload);
            if (result.IsSuccess) {
                message.success("操作成功！");
                payload.callback()
            }
            else {
                message.error(result.Message);
            }
        },
        //修改数据
        * GetStorehouse({  payload }, {call, update, }) {
            const result = yield call(GetStorehouse, payload);
            if (result.IsSuccess) {
                yield update({
                    storehouseList: result.Datas,
                });
            }else {
                message.error(result.Message);
            }
        },
        
    },
});
