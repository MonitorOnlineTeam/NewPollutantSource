/**
 * 功  能：企业监测点查询
 * 创建人：胡孟弟
 * 创建时间：2020.10.12
 */
import Model from '@/utils/model';
import { GetAttentionDegreeList, GetEntSummary,GetPointSummary ,GetEntByRegion,GetEntOrPointDetail,ExportEntSummary,ExportPointSummary,ExportEntOrPointDetail} from '../services/enterpriseMonitoringInquiryApi'
import moment from 'moment';
import { message } from 'antd';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
    namespace: 'enterpriseMonitoringModel',
    state: {
        attentionSummaryList: [],
        pointSummaryList:[],
        attention:[],
        RegionCode: '',
        AttentionCode: '',
        PollutantType: '',
        PageSize:20,
        PageIndex:1,
        total:0,
        EntOrPointDetail:[],
        priseList:[],
        cityRegionCode:'',
        cityRegionCodes:'',
    },
    subscriptions: {},
    effects: { 
        //关注度
        *GetAttentionDegreeList({ payload }, { call, put, update, select }) {
            const result = yield call(GetAttentionDegreeList, null, null)
            if (result.IsSuccess) {
                yield update({
                    attention: result.Datas
                })
            }
        },
        //行政区信息
        *GetEntSummary({ payload }, { call, put, update, select }) {

            const body = {
                AttentionCode: payload.AttentionCode,
                RegionCode: payload.RegionCode,
                PollutantType: payload.PollutantType,
                OperationPersonnel:payload.operationpersonnel,
                ...payload
                //PageSize: payload.PageSize,
                //PageIndex: payload.PageIndex
            }
            const result = yield call(GetEntSummary,body,null)
            if(result.IsSuccess)
            {
                
                let entCount = 0;
                let pointCount= 0;
                let entWasteGasCount= 0;
                let wasteGasCount= 0;
                let entWasteWaterCount= 0;
                let wasteWaterCount= 0;
                let dataEntCount= 0;
                let dataPointCount= 0;
                let dataEntWasteGasCount= 0;
                let dataWasteGasCount= 0;
                let dataEntWasteWaterCount= 0;
                let dataWasteWaterCount= 0;
                let nodataEntCount= 0;
                let nodataPointCount= 0;
                let nodataEntWasteGasCount= 0;
                let nodataWasteGasCount= 0;
                let nodataEntWasteWaterCount= 0;
                let nodataWasteWaterCount= 0;

                let resultList = []
                result.Datas.map(item=>{
                    resultList.push(item)
                    entCount += item.entCount;
                    pointCount += item.pointCount;
                    entWasteGasCount += item.entWasteGasCount;
                    wasteGasCount += item.wasteGasCount;
                    entWasteWaterCount += item.entWasteWaterCount;
                    wasteWaterCount += item.wasteWaterCount;
                    dataEntCount += item.dataEntCount;
                    dataPointCount += item.dataPointCount;
                    dataEntWasteGasCount += item.dataEntWasteGasCount;
                    dataWasteGasCount += item.dataWasteGasCount;
                    dataEntWasteWaterCount += item.dataEntWasteWaterCount;
                    dataWasteWaterCount += item.dataWasteWaterCount;
                    nodataEntCount += item.nodataEntCount;
                    nodataPointCount += item.nodataPointCount;
                    nodataEntWasteGasCount += item.nodataEntWasteGasCount;
                    nodataWasteGasCount += item.nodataWasteGasCount;
                    nodataEntWasteWaterCount += item.nodataEntWasteWaterCount;
                    nodataWasteWaterCount += item.nodataWasteWaterCount;
                })
               
                const obj = {
                    reginName:'全部合计',
                    regionCode:'0',
                    entCount: entCount,
                    pointCount: pointCount,
                    entWasteGasCount :entWasteGasCount,
                    wasteGasCount: wasteGasCount,
                    entWasteWaterCount: entWasteWaterCount,
                    wasteWaterCount: wasteWaterCount,
                    dataEntCount: dataEntCount,
                    dataPointCount :dataPointCount,
                    dataEntWasteGasCount :dataEntWasteGasCount,
                    dataWasteGasCount: dataWasteGasCount,
                    dataEntWasteWaterCount: dataEntWasteWaterCount,
                    dataWasteWaterCount: dataWasteWaterCount,
                    nodataEntCount :nodataEntCount,
                    nodataPointCount: nodataPointCount,
                    nodataEntWasteGasCount :nodataEntWasteGasCount,
                    nodataWasteGasCount :nodataWasteGasCount,
                    nodataEntWasteWaterCount:nodataEntWasteWaterCount,
                    nodataWasteWaterCount: nodataWasteWaterCount,
                }
                result.Datas.length>0? resultList.push(obj) : null
                yield update({
                    attentionSummaryList:resultList,
                    //total:result.Total,
                    //PageIndex: payload.PageIndex || 1,
                })
            }
            else
            {
                yield update({
                    attentionSummaryList:[],
                    //total:0,
                    //PageIndex: payload.PageIndex || 1,
                })
            }
        },
        //行政区详细信息
        *GetPointSummary({ payload }, { call, put, update, select }) {

            const body = {
                EntCode: payload.EntCode,
                RegionCode:payload.RegionCode,
                PageSize: payload.PageSize,
                PageIndex: payload.PageIndex,
                EntType:payload.EntType,
                OperationPersonnel:payload.operationpersonnel,
            }
            const result = yield call(GetPointSummary,body,null)
            if(result.IsSuccess)
            {
                yield update({
                    pointSummaryList:result.Datas,
                    total:result.Total,
                    PageIndex: payload.PageIndex || 1,
                    PageSize:payload.PageSize
                })
            }
            else
            {
                yield update({
                    pointSummaryList:[],
                    total:0,
                    PageIndex: payload.PageIndex || 1,
                    PageSize:payload.PageSize
                })
            }
        },
        //企业数 和 监测点数
        *GetEntOrPointDetail({ payload }, { call, put, update, select }){
            const body = {
                AttentionCode: payload.AttentionCode,
                RegionCode: payload.RegionCode,
                HasData:payload.HasData,
                EntCode:payload.EntCode,
                EntType:payload.EntType,
                PollutantType:payload.PollutantType,
                OperationPersonnel:payload.operationpersonnel,
            }
            const result = yield call(GetEntOrPointDetail,body,null)
            if(result.IsSuccess)
            {
                yield update({
                    EntOrPointDetail:result.Datas,
                })
            }
            else
            {
                yield update({
                    EntOrPointDetail:[],
                })
            }

        },
        //导出行政区信息
        *ExportEntSummary({ payload }, { call, put, update, select }) {

            const body = {
                AttentionCode: payload.AttentionCode,
                RegionCode: payload.RegionCode,
                PollutantType: payload.PollutantType,
                OperationPersonnel:payload.operationpersonnel,
                ...payload
            }
            const result = yield call(ExportEntSummary,body,null)
            if(result.IsSuccess)
            {
                downloadFile(`/wwwroot${result.Datas}`)
            }
        },
        //导出行政区详细信息
        *ExportPointSummary({ payload }, { call, put, update, select }) {

            const body = {
                EntCode: payload.EntCode,
                RegionCode:payload.RegionCode,
                EntType:payload.EntType
            }
            const result = yield call(ExportPointSummary,body,null)
            if(result.IsSuccess)
            {
                downloadFile(`/wwwroot${result.Datas}`)
            }
        },
        //导出企业数 和 监测点数
        *ExportEntOrPointDetail({ payload }, { call, put, update, select }){
            const body = {
                RegionCode: payload.RegionCode,
                HasData:payload.HasData,
                EntCode:payload.EntCode,
                EntType:payload.EntType,
                PollutantType:payload.PollutantType,
                OperationPersonnel:payload.operationpersonnel,
            }
            const result = yield call(ExportEntOrPointDetail,body,null)
            if(result.IsSuccess)
            {
                downloadFile(`/wwwroot${result.Datas}`)
            }

        },
        *getEntByRegion({ payload }, { call, put, update, select }) {
            const body ={
                RegionCode:payload.RegionCode
            }
            //获取企业列表
            const response = yield call(GetEntByRegion, body);
      
            if (response.IsSuccess) {
              yield update({
                priseList: response.Datas,
              });
            }
          },
    },

});
