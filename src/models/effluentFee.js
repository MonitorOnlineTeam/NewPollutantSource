/*
 * @Author: JianWei
 * @Date: 2019-10-14 16:42:23
 * @desc:排污税
 */
import { message } from 'antd';
import moment from 'moment';
import Model from '@/utils/model';
import * as services from '@/services/effluentFeeApi';
import { sdlMessage } from '@/utils/utils';

export default Model.extend({
    namespace: 'effluentFee',
    state: {
        begin: moment().add(-1, 'months').format('YYYY-MM-01 00:00:00'),
        end: moment(moment().format('YYYY-MM-01 00:00:00')).add(-1, 's').format('YYYY-MM-DD HH:mm:ss'),
        target: {
            searchContent: '',
            pageIndex: 1,
            pageSize: 20,
            tableDatas: [],
            total: 0,
            tableChildDatas: []
        },
        point: {
            searchContent: '',
            pageIndex: 1,
            pageSize: 20,
            tableDatas: [],
            total: 0,
        },
        pollutantColumns: [],
        tableColumnsData: [],
        entTableColumns: [],
        entTableChildColumns: []
    },
    effects: {
        //获取排污税表格列头（污染物）
        *getEffluentFeeTableColumns({ payload }, { call, put, update, select }) {
            const result = yield call(services.getEffluentFeeTableColumns);
            if (result.IsSuccess) {
                if (result.Datas && result.Datas.length > 0) {

                    let data = result.Datas;
                    let _pollutantColumns = [];
                    data.map((item) => {
                        _pollutantColumns.push(
                            {
                                title: (<span style={{ fontWeight: 'bold' }}>{item.PollutantName}(t)</span>),
                                dataIndex: `DischargeVolume_${item.PollutantCode}`,
                                key: `DischargeVolume_${item.PollutantCode}`,
                                // width: '30%',
                                align: 'right',
                                render: (text, record) => {
                                    if (text) {
                                        return `${(text / 1000).toFixed(6)}`
                                    }
                                    return text || '-';
                                }
                            },
                            {
                                title: (<span style={{ fontWeight: 'bold' }}>{item.PollutantName}排污税</span>),
                                dataIndex: `EffluentFeeValue_${item.PollutantCode}`,
                                key: `EffluentFeeValue_${item.PollutantCode}`,
                                align: 'right',
                                render: (text, record) => {
                                    // if (text) {
                                    //     return <Statistic valueStyle={{ fontSize: 14 }} value={text} precision={2} prefix={'￥'} />
                                    // }
                                    if (text) {
                                        return `￥${text}`
                                    }
                                    return text || '-';
                                }
                            }
                        );
                    });


                    yield update({
                        tableColumnsData: result.Datas,
                        pollutantColumns: _pollutantColumns
                    });

                } else {
                    yield update({
                        tableColumnsData: [],
                        pollutantColumns: []
                    });
                }
            } else {
                sdlMessage(result.Message, "error")
            }
        },
        //获取所有监控目标排污税列表
        *getEffluentFeeForAllTarget({ payload }, { call, put, update, select }) {
            const { begin, end, target } = yield select(state => state.effluentFee);
            let body = {
                begin: begin,
                end: end,
                pageIndex: target.pageIndex,
                pageSize: target.pageSize,
                searchContent: target.searchContent || '',
            };
            const result = yield call(services.getEffluentFeeForAllTarget, body);
            if (result.IsSuccess) {
                if (result.Datas && result.Datas.length > 0) {

                    let data = result.Datas;

                    data.map((item, index) => {
                        let pData = item.PollutantData;
                        pData.map((p) => {
                            item[`DischargeVolume_${p.PollutantCode}`] = p.DischargeVolume;
                            item[`EffluentFeeValue_${p.PollutantCode}`] = p.EffluentFeeValue;
                        })
                        item['key'] = index;
                        item['children'] = [];
                        item.ChildrenDate.map((chl, ind) => {
                            let m = {
                                ['key']: index + '_' + ind,
                                [`TargetName`]: moment(chl.DataDate).format('YYYY-MM'),
                                [`EffluentFeeValue`]: chl.EffluentFeeValue,
                                [`UltralowEmissionIncentives`]: chl.UltralowEmissionIncentives,
                                [`PayableTax`]: chl.PayableTax
                            }

                            chl.PollutantData.map((z) => {
                                m[`DischargeVolume_${z.PollutantCode}`] = z.DischargeVolume;
                                m[`EffluentFeeValue_${z.PollutantCode}`] = z.EffluentFeeValue;
                            })

                            item['children'].push(m);

                        })
                    })
                    console.log("data=", data);
                    yield update({
                        target: {
                            ...target,
                            ...{
                                total: result.Total,
                                tableDatas: data
                            }
                        }

                    });
                    const { target } = yield select(state => state.effluentFee);
                    console.log("target=", target)
                } else {
                    yield update({
                        target: {
                            ...target,
                            ...{
                                total: 0,
                                tableDatas: []
                            }
                        }

                    });
                }
            } else {
                sdlMessage(result.Message, "error")
            }
        },
        //获取单个监控目标每个月份排污税列表（某个时间段每个月份）
        *getEffluentFeeForSingleTargetMonths({ payload }, { call, put, update, select }) {
            const { begin, end, target } = yield select(state => state.effluentFee);
            let body = {
                begin: begin,
                end: end,
                targetId: payload.targetId,
            };
            const result = yield call(services.getEffluentFeeForSingleTargetMonths, body);
            if (result.IsSuccess) {
                if (result.Datas && result.Datas.length > 0) {

                    let data = result.Datas;

                    data.map((item) => {
                        let pData = item.PollutantData;
                        pData.map((p) => {
                            item[`DischargeVolume_${p.PollutantCode}`] = p.DischargeVolume;
                            item[`EffluentFeeValue_${p.PollutantCode}`] = p.EffluentFeeValue;
                        })
                    })

                    yield update({
                        target: {
                            ...target,
                            ...{
                                tableChildDatas: data
                            }
                        }

                    });

                } else {
                    yield update({
                        target: {
                            ...target,
                            ...{
                                tableChildDatas: []
                            }
                        }

                    });
                }
            } else {
                sdlMessage(result.Message, "error")
            }
        },

        *getEffluentFeeForAllPoint({ payload }, { call, put, update, select }) {
            const { begin, end, point } = yield select(state => state.effluentFee);
            let body = {
                begin: begin,
                end: end,
                pageIndex: point.pageIndex,
                pageSize: point.pageSize,
                searchContent: point.searchContent,
                targetId: payload.targetId,
            };
            const result = yield call(services.getEffluentFeeForAllPoint, body);
            if (result.IsSuccess) {
                if (result.Datas && result.Datas.length > 0) {
                    let data = result.Datas;
                    data.map((item, index) => {
                        let pData = item.PollutantData;
                        pData.map((p) => {
                            item[`DischargeVolume_${p.PollutantCode}`] = p.DischargeVolume;
                            item[`EffluentFeeValue_${p.PollutantCode}`] = p.EffluentFeeValue;
                        })
                        item['key'] = index;

                    })
                    yield update({
                        point: {
                            ...point,
                            ...{
                                total: result.Total,
                                tableDatas: data,
                            }
                        }

                    });

                } else {
                    yield update({
                        point: {
                            ...point,
                            ...{
                                total: 0,
                                tableDatas: [],
                            }
                        }

                    });
                }
            } else {
                sdlMessage(result.Message, "error")
            }
        },

    },
    reducers: {
        // 保存搜索框数据
        saveConfigIdList(state, action) {
            return {
                ...state,
                configIdList: {
                    ...state.configIdList,
                    ...action.payload,
                },
            };
        },
    },
});
