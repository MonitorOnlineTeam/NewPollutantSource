/**
 * 功  能：手工数据上传自动model
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
    message,
} from 'antd';
import * as services from '../../../services/autoformapi';
import moment from "moment";
import { formatPollutantPopover, getDirLevel } from '@/utils/utils';

export default Model.extend({
    namespace: 'manualuploadauto',
    state: {
        requstresult: null,
        total: 0,
        selectdata: [],
        uploaddatalist: [],
        addSelectPollutantData: [],
        DGIMN: null,
        pointName: null,
        //手工数据上传参数
        manualUploadautoParameters: {
            DGIMNs: '',
            PollutantCode: '',
            BeginTime: moment().subtract(3, 'month').format('YYYY-MM-DD 00:00:00'),
            EndTime: moment().format('YYYY-MM-DD 23:59:59'),
            pageIndex: 1,
            pageSize: 24,
            PointName: '',
            isAsc: true,
            dataType: 'HourData',
            flag: true,
        },
        columns: [],
        columnsSelect: [],
        pageCount:["24","48","72","96"],
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
            if (result.IsSuccess) {
                message.success("添加成功！");
            }
            else {
                message.error(result.Message);
            }

        },
        //根据排口获取污染物
        * GetPollutantByPoint({
            payload
        }, {
            call,
            update,
            select,
        }) {
                const result = yield call(GetPollutantByPoint, payload);
                if (result.IsSuccess) {
                    let columns = [];
                    columns = [{
                        title: '监测时间',
                        dataIndex: 'MonitorTime',
                        align: 'left',
                        width: 150,
                        key: 'MonitorTime',
                        // sorter: (a, b) => Date.parse(a.MonitorTime) - Date.parse(b.MonitorTime),
                    }];
                    let pollutantcols = [];
                    let width = 100;
                    if (result.Datas.length > 6)
                        width = (window.screen.availWidth - 200 - 120) / result.Datas.length;
                    if (width < 200) {
                        width = 200;
                    }
                    result.Datas.map((item) => {
                        let pName = item.Unit ? item.PollutantName + "(" + item.Unit + ")" : item.PollutantName;
                        pollutantcols = pollutantcols.concat({
                            title: pName,
                            dataIndex: item.PollutantCode,
                            key: item.PollutantCode,
                            align: 'center',
                            width,
                            render: (value, record, index) => {
                                let text = value;
                                if (item.PollutantName === "风向") {
                                    text = getDirLevel(text)
                                }
                                return formatPollutantPopover(text, record[`${item.PollutantCode}_params`])
                            }
                        });
                    })
                    columns = columns.concat(pollutantcols);
                    yield update({
                        selectdata: result.Datas,
                        columns,
                        columnsSelect: columns,
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
            const { manualUploadautoParameters } = yield select(a => a.manualuploadauto);
            const result = yield call(GetManualSupplementList, { ...manualUploadautoParameters });
            if (result.IsSuccess) {
                if (manualUploadautoParameters.flag) {
                    //根据MN号码获取所对应的污染物信息
                    yield put({
                        type: 'GetPollutantByPoint',
                        payload: {
                            DGIMN: manualUploadautoParameters.DGIMNs
                        }
                    });
                }
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
            if (result.IsSuccess) {
                message.success("操作成功！");
            }
            else {
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
            if (result.IsSuccess) {
                message.success("操作成功！");
                payload.callback()
            }
            else {
                message.error(result.Message);
            }
        },
    },
});
