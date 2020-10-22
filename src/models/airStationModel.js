/**
 * 功  能：空气站查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.14
 */
import Model from '@/utils/model';
import {GetPointSummary,ExportPointSummary } from '../services/airStationApi'
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';
export default Model.extend({
    namespace: 'airStationModel',
    state: {
        PageSize:10,
        PageIndex:1,
        total:0,
        airStationList:[]
    },
    subscriptions: {},
    effects: {
        //行政区信息
        *GetPointSummary({ payload }, { call, put, update, select }) {

            const body = {
                RegionCode: payload.RegionCode,
                PageSize: payload.PageSize,
                PageIndex: payload.PageIndex,
                EntType:payload.EntType
            }

            const result = yield call(GetPointSummary,body,null)
            if(result.IsSuccess)
            {
                yield update({
                    airStationList:result.Datas,
                    total:result.Total,
                    PageIndex: payload.PageIndex || 1,
                })
            }
            else
            {
                yield update({
                    airStationList:[],
                    total:0,
                    PageIndex: payload.PageIndex || 1,
                })
            }
        },
        //导出行政区详细信息
        *ExportPointSummary({ payload }, { call, put, update, select }) {

            const body = {
                EntCode: payload.EntCode,
                RegionCode:payload.RegionCode,
                EntType:payload.EntType
            }
            console.log(body)
            const result = yield call(ExportPointSummary,body,null)
            if(result.IsSuccess)
            {
                downloadFile(`/upload${result.Datas}`)
            }
        },
    },

});
