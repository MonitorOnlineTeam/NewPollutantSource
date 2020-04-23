/**
 * 功  能：污染物月度排放量分析
 * 创建人：吴建伟
 * 创建时间：2019.09.25
 */
import React, { Component } from 'react';
import {
    Card,
    Table,
    Row,
    Col,
    Button,
    Icon,
    Select,
    Modal,
    Divider
} from 'antd';
import moment from 'moment';
import styles from './index.less';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import Link from 'umi/link';
import SdlTable from '@/components/SdlTable';

import DatePickerTool from '@/components/RangePicker/DatePickerTool';

// import { debug } from 'util';
// const { MonthPicker } = DatePicker;
const Option = Select.Option;
// const monthFormat = 'YYYY';
const pageUrl = {
    updateState: 'emissions/updateState',
    getEntChartData: 'emissions/getEntChartData',
    getPointChartData: 'emissions/getPointChartData',
    getPointsData: 'emissions/getPointsData',
    getEntsData: 'emissions/getEntsData',
    getPointDaysData: 'emissions/getPointDaysData',
};

const dateChildren = [];
const dateYear = moment().get('year');
for (let i = dateYear; i > dateYear - 10; --i) {
    dateChildren.push(<Option key={i}>{i}</Option>);
}

@connect(({
    loading,
    emissions
}) => ({
    loadingEntsTable: loading.effects[pageUrl.getEntsData],
    loadingPointsTable: loading.effects[pageUrl.getPointsData],
    loadingChart: loading.effects[pageUrl.getChartData],
    loadingDays: loading.effects[pageUrl.getPointDaysData],

    pointTableDatas: emissions.pointTableDatas,
    pointDaysDatas: emissions.pointDaysDatas,
    xAxisData: emissions.xAxisData,
    seriesData: emissions.seriesData,

    entxAxisData: emissions.entxAxisData,
    entseriesData: emissions.entseriesData,

    pollutantCodes: emissions.pollutantCodes,
    selectedDate: emissions.selectedDate,
    clickDate: emissions.clickDate,
    enttableDatas: emissions.enttableDatas,
    currFlag: emissions.currFlag,
    entName: emissions.entName,
    beginTime: emissions.beginTime
}))
export default class EntPollutantEmissions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            beginTime: moment(moment().format('YYYY')),
            endTime: '',
            pointName: '-',
            modalVisible: false,
        };
    }
    componentWillMount() {
        this.reloadData(true);
    }
    getChartData = (url) => {
        this.props.dispatch({
            type: !url ? pageUrl.getEntChartData : url,
            payload: {
            },
        });
    }

    updateState = (payload) => {
        this.props.dispatch({
            type: pageUrl.updateState,
            payload: payload,
        });
    }

    getTableData = (url) => {
        this.props.dispatch({
            type: !url ? pageUrl.getEntsData : url,
            payload: {

            },
        });
    }

    getPointDaysTableData = (pageIndex) => {
        this.props.dispatch({
            type: pageUrl.getPointDaysData,
            payload: {
                pageIndex: pageIndex,
            },
        });
    }
    handleModalOk = (e) => {
        this.setState({
            modalVisible: false,
        });
    }

    handleModalCancel = (e) => {
        // console.log(e);
        this.setState({
            modalVisible: false,
        });
    }

    showModal = (params) => {
        this.setState({
            modalVisible: true,
            pointName: params.PointName
        });
        this.updateState({
            queryDGIMNs: params.DGIMNs,
            queryDate: this.props.queryDate,
            pointDaysDatas: []

        });
        this.getPointDaysTableData(1);
    }

    handleTableChange = (pagination, filters, sorter) => {
        // if (sorter.order) {
        //     this.updateState({
        //         emissionsSort: sorter.order,
        //         pageIndex: pagination.current,
        //         pageSize: pagination.pageSize
        //     });
        // } else {
        //     this.updateState({
        //         emissionsSort: '',
        //         pageIndex: pagination.current,
        //         pageSize: pagination.pageSize
        //     });
        // }
        // this.getEntsTableData(pagination.current);
    }
    handleChangeDate = (value, beginTime, endTime) => {
        let Year = moment(value).get('year');
        let Month = moment(value).get('month') + 1;
        //    let beginTime = moment(`${value}-01-01 00:00:00`);
        if (Month < 10) {
            Month = '0' + Month
        }
        // 本年份
        if (moment().get('year') === Year) {
            this.updateState({
                beginTime: beginTime,
                endTime: endTime,
                selectedDate: `${Year}-${Month}-01 00:00:00`,
                clickDate: `${Year}-${Month}-01 00:00:00`,
                enttableDatas: []
            });
        } else {
            this.updateState({
                beginTime: beginTime,
                endTime: endTime,
                selectedDate: `${Year}-01-01 00:00:00`,// beginTime.format('YYYY-01-01 HH:mm:ss'),
                clickDate: `${Year}-01-01 00:00:00`,
                enttableDatas: []
            });
        }
        this.reloadData(true);

    }
    handleChangePollutant = (value) => {
        this.updateState({
            pollutantCodes: [`${value}`]
        });
        this.reloadData(true);

    }

    getOption = () => {
        let { currFlag, xAxisData, seriesData, entxAxisData, entseriesData, entName } = this.props;

        let xData = [];
        let sData = [];
        if (currFlag === 1) {
            xData = entxAxisData;
            sData = entseriesData;
        } else {
            xData = xAxisData;
            sData = seriesData;
        }

        let option = {
            // title: {
            //     text: `${currFlag === 1 ? '' : entName}`
            // },
            color: ['rgb(91,176,255)'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: (params) => {
                    var tar = params[0];
                    return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value + ' t';
                }
            },
            legend: {
                orient: 'vertical',
                x: 'right',      //可设定图例在左、右、居中
                y: 'top',     //可设定图例在上、下、居中
                padding: [15, 30, 0, 0],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]

            },
            // legend: {
            //     data: ['排放总量']
            // },
            grid: {
                x: 50,
                y: 30,
                x2: 1,
                y2: 35
            },
            xAxis: [
                {
                    type: 'category',
                    data: xData,// ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '单位：(t)'
                }
            ],
            series: [
                {
                    name: '排放总量',
                    type: 'bar',
                    barWidth: '30%',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: sData, // [800, 1000, 1100, 1200, 1300, 550, 820, 830, 1000, 1050, 1000, 900]
                }
            ]
        };
        return option;
    }
    onChartClick = (opt) => {
        let { selectedDate } = this.props;
        console.log(selectedDate);
        var dateindex = opt.dataIndex;
        if (dateindex < 9) {
            dateindex = '0' + (dateindex + 1);
        } else {
            ++dateindex;
        }
        let clickDate = moment(selectedDate).format(`YYYY-${(dateindex)}-01 00:00:00`);

        this.updateState({
            clickDate: clickDate
        });

        this.reloadData(false);


    }

    queryPointData = (record) => {
        console.log("record=", record);

        this.updateState({
            enterpriseCodes: [`${record.EnterpriseCode}`],
            currFlag: 2,
            entName: record.EnterpriseName,
            clickDate: moment().format('YYYY-MM-01 00:00:00')
        });
        this.getChartData(pageUrl.getPointChartData);
        this.getTableData(pageUrl.getPointsData);

    }

    queryEntData = () => {

        this.updateState({
            enterpriseCodes: [],
            currFlag: 1,
            entName: '',
            clickDate: moment().format('YYYY-MM-01 00:00:00')
        });
        this.getChartData();
        this.getTableData();
    }

    reloadData = (isChart) => {
        let { currFlag } = this.props;
        if (currFlag === 1) {
            isChart && this.getChartData();
            this.getTableData();
        } else {
            isChart && this.getChartData(pageUrl.getPointChartData);
            this.getTableData(pageUrl.getPointsData);
        }
    }

    render() {

        let { currFlag, pointTableDatas, enttableDatas, loadingEntsTable, loadingPointsTable, entName, pointDaysDatas, loadingDays, beginTime } = this.props;

        let cardTitle = `${moment(beginTime).get('year')}年排放量统计`;

        if (currFlag === 2) {
            cardTitle = <span>
                {moment(beginTime).get('year')}年排放量统计
                <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                        this.queryEntData();
                    }}
                    type="link"
                    size="small"
                >
                    <Icon type="rollback" />
                    所有企业
</Button>
            </span>
        }

        const columns = [
            {
                title: (<span style={{ fontWeight: 'bold' }}>{currFlag === 1 ? '企业' : '排口'}名称</span>),
                dataIndex: `${currFlag === 1 ? "EnterpriseName" : "PointName"}`,
                key: `${currFlag === 1 ? "EnterpriseName" : "PointName"}`,
                width: '66.66%',
                align: 'left',
                render: (text, record) => {

                    if (currFlag === 1) {
                        return (
                            <a onClick={() => { this.queryPointData(record) }}>{text}</a>
                        );
                    } else {
                        return (
                            <a onClick={() => { this.showModal(record) }}>{text}</a>
                        );
                    }
                }
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>排放量(t)</span>),//mg/m³
                dataIndex: 'Emissions',
                key: 'Emissions',
                align: 'left',
                width: '33.33%',

                sorter: true,
                render: (text, record) => {
                    return text;
                }
            }
        ];

        const columnsDays = [
            {
                title: (<span style={{ fontWeight: 'bold' }}>企业名称</span>),
                dataIndex: 'EnterpriseName',
                key: 'EnterpriseName',
                align: 'left',
                // width: '20%',
                render: (text, record) => {
                    return entName;
                }
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>排口名称</span>),
                dataIndex: 'PointName',
                key: 'PointName',
                align: 'left',
                // width: '20%',
                render: (text, record) => {
                    return text;
                }
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>时间</span>),
                dataIndex: 'DataDate',
                key: 'DataDate',
                align: 'left',
                width: 100,
                show: true,
                render: (text, record) => {
                    return text;
                }
            },
            {
                title: (<span style={{ fontWeight: 'bold' }}>排放量(t)</span>),
                dataIndex: 'Emissions',
                key: 'Emissions',
                align: 'left',
                width: 150,
                // width: '300px',
                sorter: true,
                render: (text, record) => {
                    return text;
                }
            }
        ];


        return (

            <BreadcrumbWrapper title="月度排放量统计">
                <div className={styles.cardTitle}
                // style={{
                //     height: 'calc(100vh - 248px)'
                // }}
                >
                    <Card title={
                        cardTitle
                    } extra={
                        <div>
                            <span style={{ color: '#b3b3b3' }}>污染物
                                    <Select
                                    size="default"
                                    defaultValue={this.props.pollutantCodes[0]}
                                    onChange={this.handleChangePollutant}
                                    style={{ width: 200, marginLeft: 10, marginRight: 20 }}
                                >
                                    <Option key="01">实测烟尘</Option>
                                    <Option key="02">实测二氧化硫</Option>
                                    <Option key="03">实测氮氧化物</Option>
                                </Select>
                            </span>
                            <span style={{ color: '#b3b3b3' }}>时间

                                <DatePickerTool allowClear={false} picker="year" defaultValue={moment()} style={{ width: 200, marginLeft: 10 }} callback={this.handleChangeDate} />
                                {/* <Select
                                    size="default"
                                    defaultValue={dateYear}
                                    onChange={this.handleChangeDate}
                                    style={{ width: 200, marginLeft: 10 }}
                                >
                                    {dateChildren}
                                </Select> */}
                            </span>
                        </div>
                    }>

                        <ReactEcharts
                            option={this.getOption()}
                            lazyUpdate={true}
                            style={{
                                width: '100%',
                                height: 'calc(100vh - 520px)',
                                maxHeight: 280

                            }}
                            className="echarts-for-echarts"
                            onChartReady={this.onChartReadyCallback}
                            onEvents={{ 'click': this.onChartClick }}
                            theme="my_theme" />


                        {/* <Row style={styles.cardTitle.cardBg}> */}
                        <SdlTable title={() => `${entName}${moment(this.props.clickDate).format('YYYY-MM')}月排放量${currFlag === 1 ? '企业' : '排口'}统计`} style={{}}
                            rowKey={(record, index) => `complete${index}`}
                            loading={currFlag === 1 ? loadingEntsTable : loadingPointsTable}
                            columns={columns}
                            dataSource={currFlag === 1 ? enttableDatas : pointTableDatas}
                            scroll={{ y: 'calc(100vh - 500px)' }}
                        />
                        {/* </Row> */}

                        <Modal
                            title={`${moment(this.props.clickDate).format('YYYY-MM')}月排放量详情`}
                            width="50%"
                            visible={this.state.modalVisible}
                            onOk={this.handleModalOk}
                            onCancel={this.handleModalCancel}
                            destroyOnClose={true}
                        >
                            <SdlTable style={{ marginTop: 16 }}
                                rowKey={(record, index) => `complete${index}`}
                                loading={this.props.loadingDays}
                                columns={columnsDays}
                                dataSource={pointDaysDatas}
                            //scroll={{ y: 'calc(100vh - 400px)' }}

                            />
                        </Modal>
                    </Card>
                </div>
            </BreadcrumbWrapper>
        );
    }
}
