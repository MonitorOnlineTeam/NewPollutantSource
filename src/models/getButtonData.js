/**
 * 功  能：AutoForm数据源配置-其他配置
 * 创建人：李静
 * 创建时间：2020.11.16
 */
import {message } from 'antd';
import { GetButtonsByConfigID,GetTableExtend,SaveCfgButtons,SaveTableExtend} from '../services/ButtonDataApi';
import Model from '@/utils/model';

export default Model.extend({
    namespace: 'getButtonData',
    state: {
        buttonDatas: [],
        formDatas: [],
        styleDatas: [],
        ConfigID: '',
        PageFlag: '',
    },

    effects: {
        //获取数据库链接配置信息
        * GetButtonsByConfigID({ payload }, { call, update, select, put, take }) {
            // const { ConfigID } = yield select(state => state.getButtonData);
            let body = {
                ConfigID: payload.ConfigID
            };
            const result = yield call(GetButtonsByConfigID, body);
            if (result.IsSuccess && result.Datas) {
                yield update({
                    buttonDatas: result.Datas,
                });
            } else {
                yield update({
                    buttonDatas: [],
                });
            }
        },
        //获取页面样式和脚本配置
        * GetTableExtend({ payload }, { call, update, select, put, take }) {
            const { ConfigID, PageFlag } = yield select(state => state.getButtonData);
            let cID;
            if (payload.ConfigID == 'null') {
                cID = '';
            }
            else {
                cID = payload.ConfigID ? payload.ConfigID : ConfigID
            }
            let body = {
                ConfigID: cID,
                PageFlag: payload.PageFlag ? payload.PageFlag : PageFlag
            };
            const result = yield call(GetTableExtend, body);
            if (result.IsSuccess && result.Datas) {
                yield update({
                    formDatas: result.Datas,
                });
            } else {
                yield update({
                    formDatas: [],
                });
            }
        },
        * GetTableStyle({ payload }, { call, update, select, put, take }) {
            // const {ConfigID} = yield select(state => state.getButtonData);            
            let body = {
                ConfigID: payload.ConfigID,
                PageFlag: payload.PageFlag
            };
            const result = yield call(GetTableExtend, body);
            if (result.IsSuccess && result.Datas) {
                yield update({
                    styleDatas: result.Datas,
                });
            } else {
                yield update({
                    styleDatas: [],
                });
            }
        },
        // 列表按钮配置添加 
        * SaveCfgButtons({ payload }, { call, update, select, put, take }) {
            let body = {
                "ConfigId": payload.ConfigId,
                "ButtonList": payload.ButtonList
            }
            const result = yield call(SaveCfgButtons, body);
            if (result.IsSuccess) {
                message.success(result.Message)
            } else {
                message.error(result.Message)
            }
        },

        // 添加
        * SaveTableExtend({payload}, {call, update,select,put,take}){
            let body = {
                "GUID": payload.GUID,
                "DT_CONFIG_ID": payload.DT_CONFIG_ID,
                "DT_CUSTOMJS":payload.DT_CUSTOMJS,
                "DT_CUSTOMCSS": payload.DT_CUSTOMCSS,
                "DT_PAGEFLAG": payload.DT_PAGEFLAG
            }
            const result = yield call(SaveTableExtend, body);
            
            if (result.IsSuccess) {
                message.success(result.Message)
            }else{
                message.error(result.Message)
            }
        },
        
    }
});
