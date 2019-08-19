/**
 * 功  能：收数据导入请求地址model
 * 创建人：dongxiaoyun
 * 创建时间：2019.08.9
 */
import Model from '@/utils/model';
import {
    uploadfiles, GetPollutantByPoint,
    GetManualSupplementList,
    getUploadTemplate,
    GetAllPollutantTypes,
    addGetPollutantByPoint,
    DeleteUploadFiles,
    UpdateManualSupplementData,
    getPollutantTypeList
} from './services';
import config from '@/config';
import {
    formatPollutantPopover,
} from '@/utils/utils';
import {
    message,
} from 'antd';
import * as services from '../../../services/autoformapi';
import moment from "moment";

export default Model.extend({
    namespace: 'manualupload',
    state: {
        requstresult: null,
        total: 0,
        selectdata: [],
        uploaddatalist: [],
        // pollutantTypesItem: null,
        addSelectPollutantData: [],
        // unit: null,
        DGIMN: null,
        pointName: null,
        //手工数据上传参数
        manualUploadParameters: {
            DGIMN: '',
            PollutantCode: '',
            BeginTime: moment().subtract(3, 'month').format('YYYY-MM-DD 00:00:00'),
            EndTime: moment().format('YYYY-MM-DD 23:59:59'),
            PageIndex: 1,
            PageSize: 10,
            PointName: '',
        }

    },
    effects: {
        //上传附件
        * uploadfiles({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(uploadfiles, payload);
            if(result.IsSuccess)
            {
                message.success("添加成功！");
            }
            else
            {
                message.error(result.Message);
            }

        },
        //根据排口获取污染物
        * GetPollutantByPoint({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(GetPollutantByPoint, payload);
            if (result.IsSuccess) {
                yield update({
                    selectdata: result.Datas,
                });
            }
        },
        //根据排口获取污染物添加页面
        * addGetPollutantByPoint({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(addGetPollutantByPoint, payload);
            if (result.IsSuccess) {
                yield update({
                    addSelectPollutantData: result.Datas,
                });
            }
        },
        //获取数据列表（右侧）
        * GetManualSupplementList({
            payload
        }, {
            call,
            put,
            update,
            select,
        }) {
            const { manualUploadParameters } = yield select(a => a.manualupload);
            const result = yield call(GetManualSupplementList, { ...manualUploadParameters });
            if (result.IsSuccess) {
                //根据MN号码获取所对应的污染物信息
                yield put({
                    type: 'GetPollutantByPoint',
                    payload: {
                        DGIMN: manualUploadParameters.DGIMN
                    }
                });
                yield update({
                    uploaddatalist: result.Datas,
                    total: result.Total,
                });
            }
        },
        //获取Excel模板
        * getUploadTemplate({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(getUploadTemplate, payload);
            if (result.IsSuccess) {
                payload.callback(result.Datas);
            }

        },

        //根据MN号码 污染物编号 时间删除数据
        * DeleteUploadFiles({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(DeleteUploadFiles, payload);
            if(result.IsSuccess)
            {
                message.success("操作成功！");
            }
            else
            {
                message.error(result.Message);
            }
        },

        //修改数据，值修改监测值
        * UpdateManualSupplementData({
            payload
        }, {
            call,
            update,
        }) {
            const result = yield call(UpdateManualSupplementData, payload);
            if(result.IsSuccess)
            {
                message.success("操作成功！");
                payload.callback()
            }
            else
            {
                message.error(result.Message);
            }
        },
    },
});
