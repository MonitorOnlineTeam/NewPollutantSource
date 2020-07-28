/**
 * 功  能：排污税
 * 创建人：吴建伟
 * 创建时间：2019.10.12
 */
import React, { Component } from 'react';
import { RollbackOutlined } from '@ant-design/icons';
import { Card, Table, Progress, Row, Popover, Col, Badge, Input, Button, Statistic } from 'antd';
import moment from 'moment';
import styles from './style.less';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
const { Search } = Input;
const monthFormat = 'YYYY-MM';
const pageUrl = {
    updateState: 'effluentFee/updateState',
    getEffluentFeeTableColumns: 'effluentFee/getEffluentFeeTableColumns',
    getEffluentFeeForAllTarget: 'effluentFee/getEffluentFeeForAllTarget',
    getEffluentFeeForSingleTargetMonths: 'effluentFee/getEffluentFeeForSingleTargetMonths',
    getEffluentFeeForAllPoint: 'effluentFee/getEffluentFeeForAllPoint',

};
@connect(({
    loading,
    effluentFee
}) => ({
    loadingColumns: loading.effects[pageUrl.getEffluentFeeTableColumns],
    loadingTargetDatas: loading.effects[pageUrl.getEffluentFeeForAllTarget],
    loadingTargetMonthDatas: loading.effects[pageUrl.getEffluentFeeForSingleTargetMonths],
    loadingPointDatas: loading.effects[pageUrl.getEffluentFeeForAllPoint],
    target: effluentFee.target,
    point: effluentFee.point,
    begin: effluentFee.begin,
    end: effluentFee.end,
    tableColumnsData: effluentFee.tableColumnsData,
    pollutantColumns: effluentFee.pollutantColumns,
    entTableColumns: effluentFee.entTableColumns,
    entTableChildColumns: effluentFee.entTableChildColumns
}))
export default class effluentfeeIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            beginTime: moment(moment().format('YYYY-MM')),
            endTime: '',
            rangePickerValue: [],
            rangePickerMode: ['month', 'month'],
            dataFlag: 1,
            entName: '',
            targetId: ''
        };
    }
    componentWillMount() {
        this.getTableColumns();

        this.getTargetTableData();
    }
    updateState = (payload) => {
        this.props.dispatch({
            type: pageUrl.updateState,
            payload: payload,
        });
    }

    reloadTableData = () => {

    }

    getTableColumns = () => {
        this.props.dispatch({
            type: pageUrl.getEffluentFeeTableColumns,
            payload: {

            },
        });
    }

    getTargetTableData = (url) => {
        this.props.dispatch({
            type: url || pageUrl.getEffluentFeeForAllTarget,
            payload: {
            },
        });
    }
    handleTableChange = (pagination, filters, sorter) => {
        // if (sorter.order) {
        //     this.updateState({
        //         transmissionEffectiveRate: sorter.order,
        //         pageIndex: pagination.current,
        //         pageSize: pagination.pageSize
        //     });
        // } else {
        //     this.updateState({
        //         transmissionEffectiveRate: 'ascend',
        //         pageIndex: pagination.current,
        //         pageSize: pagination.pageSize
        //     });
        // }
        // this.getTableData(pagination.current);
        const { target } = this.props;
            this.updateState({
                target: {
                    ...target,
                    ...{
                        pageIndex: pagination.current,
                        pageSize: pagination.pageSize
                    }
                }
            });
        this.getTargetTableData();
    }


    handlePanelChange = (value, mode) => {
        const { target } = this.props;
        if (value && value[0]) {
            this.updateState({
                target: {
                    ...target,
                    ...{
                        pageIndex: 1,
                        pageSize: 20
                    }
                },
                begin: value[0].format("YYYY-MM-DD HH:mm:ss"),
                end: value[1].format("YYYY-MM-DD HH:mm:ss"),
            });
            // this.setState({
            //     //rangePickerValue: value,
            //     rangePickerMode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
            // });
            this.getTargetTableData();
        }
    };

    handleChange = value => {
        if (value.length > 0) {
            this.updateState({
                begin: value[0].format("YYYY-MM-DD HH:mm:ss"),
                end: value[1].format("YYYY-MM-DD HH:mm:ss"),
            });
            this.getTargetTableData();
        }

    };

    queryPointData = (record) => {

        const { dataFlag } = this.state;
        const { point, dispatch, begin, end } = this.props;
        this.setState({
            dataFlag: 2,
            entName: record.TargetName,
            targetId: record.TargetId
        });
        let beginDate = "";
        let endDate = "";
        //判断是否为日期格式如果为日期格式则证明是子月份
        if (isNaN(record.TargetName) && !isNaN(Date.parse(record.TargetName))) {
            beginDate = moment(record.TargetName).format('YYYY-MM-01 00:00:00');
            endDate = moment(record.TargetName).add(1, 'months').add(-1, 's').format('YYYY-MM-DD HH:mm:ss');
        }
        this.updateState({
            point: {
                ...point,
                ...{
                    searchContent: '',
                    pageIndex: 1,
                    pageSize: 20
                }
            },
            begin: beginDate ? beginDate : begin,
            end: endDate ? endDate : end,
        });

        dispatch({
            type: pageUrl.getEffluentFeeForAllPoint,
            payload: {
                targetId: record.TargetId
            },
        });
    }
    queryEntData = () => {

        this.setState({
            dataFlag: 1,
            entName: '',
            targetId: ''
        });
        const { target } = this.props;
        this.updateState({
            target: {
                ...target,
                ...{
                    searchContent: ''
                }
            }
        });
    }



    getEntColumns = (columnsType) => {
        const { tableColumnsData, pollutantColumns } = this.props;
        const { dataFlag } = this.state;
        let entColumns = [
            {
                title: (<span style={{ fontWeight: 'bold' }}>监控目标</span>),
                dataIndex: 'TargetName',
                key: 'TargetName',
                width: 300,
                align: 'left',
                render: (text, record) => {
                    return text;
                }
            }
        ];
        if (columnsType === 1) {
            entColumns = [
                {
                    title: (<span style={{ fontWeight: 'bold' }}>监控目标</span>),
                    dataIndex: 'TargetName',
                    key: 'TargetName',
                    width: 300,
                    align: 'left',
                    render: (text, record) => {
                        return text;
                    }
                }
            ];
        } else if (columnsType === 2) {
            entColumns = [
                {
                    title: (<span style={{ fontWeight: 'bold' }}>排口</span>),
                    dataIndex: 'PointName',
                    key: 'PointName',
                    width: 200,
                    align: 'left',
                    render: (text, record) => {
                        return text;
                    }
                }
            ];
        }

        entColumns = entColumns.concat(pollutantColumns);

        entColumns.push(
            {
                title: (<span style={{ fontWeight: 'bold' }}>排污税</span>),
                dataIndex: 'EffluentFeeValue',
                key: 'EffluentFeeValue',
                align: 'right',
                width: 200,
                render: (text, record) => {
                    // if (text) {
                    //     return <Statistic valueStyle={{ fontSize: 14 }} value={text} precision={2} prefix={'￥'} />
                    // }
                    if (text) {
                        return `￥${text}`
                    }
                    return text || '-';
                }
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>超低排放奖励</span>),
                dataIndex: 'UltralowEmissionIncentives',
                key: 'UltralowEmissionIncentives',
                align: 'right',
                width: 200,
                render: (text, record) => {
                    // if (text) {
                    //     return <Statistic valueStyle={{ fontSize: 14 }} value={text} precision={2} prefix={'￥'} />
                    // }
                    if (text) {
                        return `￥${text}`
                    }
                    return text || '-';
                }
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>应缴排污税</span>),
                dataIndex: 'PayableTax',
                key: 'PayableTax',
                align: 'right',
                width: 200,
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
        if (columnsType === 1) {
            entColumns.push(
                {
                    title: (<span style={{ fontWeight: 'bold' }}>操作</span>),
                    dataIndex: 'opts',
                    key: 'opts',
                    align: 'center',
                    width: 200,
                    render: (text, record) => {
                        if (dataFlag === 1) {
                            return (
                                <a onClick={() => { this.queryPointData(record) }}>查看详情</a>
                            );
                        } else {
                            return (
                                <a>{text}</a>
                            );
                        }
                    }
                }
            );
        }
        console.log(entColumns)

        return entColumns;
    }



    entOnSearch = (value) => {
        // console.log(value);
        const { dataFlag, targetId } = this.state;
        const { target, point, dispatch } = this.props;
        if (dataFlag === 1) {
            this.updateState({
                target: {
                    ...target,
                    ...{
                        searchContent: value,
                        pageIndex: 1,
                        pageSize: 20
                    }
                }
            });
            this.getTargetTableData();
        } else {
            this.updateState({
                point: {
                    ...point,
                    ...{
                        searchContent: value,
                        pageIndex: 1,
                        pageSize: 20
                    }
                }
            });
            dispatch({
                type: pageUrl.getEffluentFeeForAllPoint,
                payload: {
                    targetId: targetId
                },
            });
        }
    }

    onExpand = (expanded, record) => {

        const { dispatch } = this.props;

        if (expanded) {

            dispatch({
                type: pageUrl.getEffluentFeeForSingleTargetMonths,
                payload: {
                    targetId: record.TargetId
                },
            });


        }
    }

    render() {
        const { dataFlag, entName } = this.state;

        const { target, point, tableColumnsData, begin, end, entTableColumns } = this.props;

        const pointColumns =
            [
                {
                    title: (<span style={{ fontWeight: 'bold' }}>排口</span>),
                    dataIndex: 'PointName',
                    key: 'PointName',
                    width: 200,
                    align: 'left',
                    render: (text, record) => {
                        return text;
                    }
                },
                {
                    title: (<span style={{ fontWeight: 'bold' }}>SO2（t）</span>),
                    dataIndex: 'EmissionsValue_01',
                    key: 'EmissionsValue_01',
                    width: 200,
                    align: 'left',
                    render: (text, record) => {
                        return text;
                    }
                },
                {
                    title: (<span style={{ fontWeight: 'bold' }}>SO2排污税（元）</span>),
                    dataIndex: 'EffluentFeeValue_01',
                    key: 'EffluentFeeValue_01',
                    width: 200,
                    align: 'left',
                    render: (text, record) => {
                        return text;
                    }
                },
                {
                    title: (<span style={{ fontWeight: 'bold' }}>NOX（t）</span>),
                    dataIndex: 'EmissionsValue_02',
                    key: 'EmissionsValue_02',
                    width: 200,
                    align: 'left',
                    render: (text, record) => {
                        return text;
                    }
                },
                {
                    title: (<span style={{ fontWeight: 'bold' }}>NOX排污税（元）</span>),
                    dataIndex: 'EffluentFeeValue_02',
                    key: 'EffluentFeeValue_02',
                    width: 200,
                    align: 'left',
                    render: (text, record) => {
                        return text;
                    }
                },
                {
                    title: (<span style={{ fontWeight: 'bold' }}>合计环保税</span>),
                    dataIndex: 'EffluentFeeValue',
                    key: 'EffluentFeeValue',
                    width: 200,
                    align: 'left',
                    render: (text, record) => {
                        return text;
                    }
                }
            ];

        const pointData =
            [
                {
                    PointName: "一号脱硫出口",
                    EmissionsValue_01: 123123,
                    EffluentFeeValue_01: 123123,
                    EmissionsValue_02: 12312,
                    EffluentFeeValue_02: 123123,
                    EffluentFeeValue: 300
                },
                {
                    PointName: "一号脱硫出口1",
                    EmissionsValue_01: 123123,
                    EffluentFeeValue_01: 123123,
                    EmissionsValue_02: 12312,
                    EffluentFeeValue_02: 123123,
                    EffluentFeeValue: 300
                },
                {
                    PointName: "合计",
                    EmissionsValue_01: 123123,
                    EffluentFeeValue_01: 123123,
                    EmissionsValue_02: 12312,
                    EffluentFeeValue_02: 123123,
                    EffluentFeeValue: 300
                }
            ];


        let columns = [];
        let dataSource = [];
        let searchValue = '';
        let text = `${moment(begin).format('YYYY-MM')} ~ ${moment(end).format('YYYY-MM')} 排污税统计`;
        let cardTitle = text;



        if (dataFlag === 1) {
            columns = this.getEntColumns(1);
            dataSource = target.tableDatas;
            searchValue = target.searchContent;
        } else {
            columns = this.getEntColumns(2);
            dataSource = point.tableDatas;
            searchValue = point.searchContent;
            cardTitle = <span>
                {text}
                <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                        this.queryEntData();
                    }}
                    type="link"
                    size="small"
                >
                    <RollbackOutlined />
                    返回上级
</Button>
            </span>
        }



        return (
            <BreadcrumbWrapper title="排污税统计">
                <div className="contentContainer">
                    <Card
                        bordered={false}
                        title={cardTitle}
                        extra={
                            <>
                                <Search
                                    placeholder="输入关键字进行筛选"
                                    onSearch={this.entOnSearch}
                                    style={{ width: 300, marginRight: 10 }}
                                />
                                <span style={{ color: '#b3b3b3' }}>
                                    时间选择：
                                <RangePicker_
                                        allowClear={false}
                                        style={{ width: 200 }}
                                        placeholder={['开始时间', '结束时间']}
                                        dataType="month"
                                        dateValue={[moment(begin), moment(end)]}
                                        mode={this.state.rangePickerMode}
                                        callback={this.handlePanelChange}
                                    />
                                </span>

                            </>
                        }
                    >

                        <Row>
                            {

                                <SdlTable
                                    rowKey={(record, index) => `complete${index}`}
                                    loading={this.props.loadingTargetDatas || this.props.loadingPointDatas}
                                    columns={columns}
                                    onChange={this.handleTableChange}
                                    dataSource={dataSource}
                                    // expandedRowRender={dataFlag === 1 ? expandedRowRender : false}
                                    onExpand={this.onExpand}
                                    //   scroll={{ y: 'calc(100vh - 450px)' }}
                                    title={() => entName}
                                    // scroll={{ y: 550 }}
                                    // pagination={{
                                    //     showSizeChanger: true,
                                    //     showQuickJumper: true,
                                    //     sorter: true,
                                    //     'total': this.props.total,
                                    //     'pageSize': this.props.pageSize || 20,
                                    //     'current': this.props.pageIndex || 1,
                                    //     pageSizeOptions: ['10', '20', '30', '40', '50']
                                    // }}
                                />
                            }

                        </Row>
                    </Card>
                </div>
            </BreadcrumbWrapper>
        );
    }
}
