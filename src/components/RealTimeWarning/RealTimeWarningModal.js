/*
 * @Author: lzp
 * @Date: 2019-09-19 11:23:37
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-19 11:23:37
 * @Description: 
 */
import React, { Component } from 'react';
import { Row, Col, Card, List, Tabs, Divider, Modal, Table, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import styles from './RealTimeWarning.less';
import PollutantSelect from "@/components/PollutantSelect/index";

const pageUrl = {
    updateState: 'workbenchmodel/updateState',
    getRealTimeWarningDatas: 'workbenchmodel/getRealTimeWarningDatas',
    getPollutantList: 'dataquery/querypollutantlist',
    getDataOverWarningData: 'workbenchmodel/getDataOverWarningData',
};
const TabPane = Tabs.TabPane;
@connect(({
    loading,
    workbenchmodel,
    dataquery
}) => ({
    hourDataOverWarningList: workbenchmodel.hourDataOverWarningList,
    warningDetailsDatas: workbenchmodel.warningDetailsDatas,
    pollutantList: dataquery.pollutantlist,
    loadingRealTimeWarningDatas: loading.effects[pageUrl.getRealTimeWarningDatas],
    loadingPollutantList: loading.effects[pageUrl.getPollutantList],
    loadinghourDataOverWarningList: loading.effects[pageUrl.getDataOverWarningData]
}))
class RealTimeWarningModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal: true,
            clickThisPointName: '',
            SuggestValue: null,
        };
    }

    componentDidMount() {
        // this.props.onRef(this);
        const { dispatch, DGIMN, firsttime, lasttime, hourDataOverWarningList } = this.props;
        dispatch({
            type: pageUrl.getDataOverWarningData,
            payload: {
                DGIMN: DGIMN
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.DGIMN!==nextProps.DGIMN)
        {
            this.props.dispatch({
                type: pageUrl.getDataOverWarningData,
                payload: {
                    DGIMN: nextProps.DGIMN
                }
            })
        }
        if (this.props.hourDataOverWarningList !== nextProps.hourDataOverWarningList) {
            var items = nextProps.hourDataOverWarningList.tableDatas[0]
            if (items) {
                console.log('items=', items)
                var item = items.OverWarnings[0]
                this.showModal(items.PointName, items.DGIMNs, item.PollutantCode, item.PollutantName, item.SuggestValue)
            }
        }
    }

    /**
      * 更新model中的state
      */
    updateState = (payload) => {
        this.props.dispatch({
            type: pageUrl.updateState,
            payload: payload,
        });
    }

    /**
       * 智能监控_实时预警详情
       */
    getRealTimeWarningDatas = () => {
        this.props.dispatch({
            type: pageUrl.getRealTimeWarningDatas,
            payload: {},
        });
    }

    /**
     * 根据排口获取污染物
     */
    getPollutantList = (mn) => {
        this.props.dispatch({
            type: pageUrl.getPollutantList,
            payload: {
                dgimn: mn
            }
        });
    }

    /**
 * 智能监控_显示预警详情弹窗口
 */
    showModal = (name, mn, pollutantCode, pollutantName, SuggestValue) => {
        console.log('this.props1=', this.props)
        debugger
        this.getPollutantList(mn);
        this.updateState({
            SuggestValue: SuggestValue,
            warningDetailsDatas: {
                ...this.props.warningDetailsDatas,
                ...{
                    DGIMNs: mn,
                    selectedPollutantCode: pollutantCode,
                    selectedPollutantName: pollutantName
                }
            }
        });
        this.getRealTimeWarningDatas();
        this.setState({
            SuggestValue: SuggestValue,
            visibleModal: true,
            clickThisPointName: name,
        });
    }

    handleCancel = () => {
        this.setState({
            visibleModal: false,
        });
    }

    renderWarningDetailsCharts = () => {
        if (this.props.loadingRealTimeWarningDatas) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                size="large"
            />);
        }
        return this.getWarningChartOption();
    }

    /**
     * 智能监控_渲染预警详情图表数据
     */
    getWarningChartOption = () => {
        let { chartDatas, selectedPollutantCode, selectedPollutantName } = this.props.warningDetailsDatas;
        const { pollutantList } = this.props;
        let xAxis = [];
        let seriesData = [];

        chartDatas.map((item) => {
            xAxis.push(`${moment(item.MonitorTime).format('HH:mm:ss')}`);
            seriesData.push(item[selectedPollutantCode]);
        });
        let suugestValue = this.state.SuggestValue;
        //当前选中的污染物的信息
        const selectPllutantInfo = pollutantList.find((value, index, arr) => value.PollutantCode == selectedPollutantCode);
        let legenddata = [];
        let pollutantData = [];
        legenddata.push(selectedPollutantName);
        if (selectPllutantInfo && selectPllutantInfo.alarmType) {
            legenddata.push('标准值');
            switch (selectPllutantInfo.alarmType) {
                //上限报警
                case 1:
                    pollutantData = [
                        {
                            yAxis: selectPllutantInfo.upperValue,
                            symbol: 'none',
                            label: {
                                normal: {
                                    position: 'end',
                                    formatter: selectPllutantInfo.upperValue
                                }
                            }
                        }
                    ];
                    break;
                //下限报警
                case 2:
                    pollutantData = [
                        {
                            yAxis: selectPllutantInfo.lowerValue,
                            symbol: 'none',
                            label: {
                                normal: {
                                    position: 'end',
                                    formatter: selectPllutantInfo.lowerValue
                                }
                            }
                        }
                    ];
                    break;
                //区间报警
                case 3:
                    pollutantData = [
                        {
                            yAxis: selectPllutantInfo.upperValue,
                            symbol: 'none',
                            label: {
                                normal: {
                                    position: 'end',
                                    formatter: selectPllutantInfo.upperValue
                                }
                            }
                        },
                        {
                            yAxis: selectPllutantInfo.lowerValue,
                            symbol: 'none',
                            label: {
                                normal: {
                                    position: 'end',
                                    formatter: selectPllutantInfo.lowerValue
                                }
                            }
                        }
                    ];
                    break;
            }
        }

        let suggestData = null;


        if (suugestValue && suugestValue !== "-") {

            legenddata.push('建议浓度');
            suggestData = [
                {
                    yAxis: suugestValue,
                    symbol: 'none',
                    label: {
                        normal: {
                            position: 'end',
                            formatter: suugestValue
                        }
                    }
                }
            ];
        }
        let option = {
            color: ['#37b5e4', '#ff9d45', '#4fde48'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legenddata
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis,
                name: '监测时间'
            },
            yAxis: {
                type: 'value',
                // name: 'ug/m³',
                name: selectPllutantInfo ? selectPllutantInfo.unit : '',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            grid: {
                left: '5%',
                right: '8%'
            },
            series: [
                {
                    name: selectedPollutantName,
                    type: 'line',
                    data: seriesData,
                },
                {
                    name: '标准值',
                    type: 'line',
                    data: [],
                    markLine: {
                        data: pollutantData
                    }
                },
                {
                    name: '建议浓度',
                    type: 'line',
                    data: [],
                    markLine: {
                        data: suggestData,
                    }
                }
            ]
        };


        return <ReactEcharts
            loadingOption={this.props.loadingRealTimeWarningDatas}
            option={option}
            style={{ height: 'calc(100vh - 400px)', width: '100%' }}
            className="echarts-for-echarts"
            theme="my_theme"
        />;

    }

    //如果是数据列表则没有选择污染物，而是展示全部污染物
    getPollutantSelect = () => (this.props.loadingPollutantList && this.props.loadingRealTimeWarningDatas ? '' : <PollutantSelect
        optionDatas={this.props.pollutantList}
        defaultValue={this.props.warningDetailsDatas.selectedPollutantCode}
        style={{ width: 150, marginRight: 10 }}
        onChange={this.handlePollutantChange}
    />)

    // 污染物
    handlePollutantChange = (value, selectedOptions) => {
        this.updateState({
            warningDetailsDatas: {
                ...this.props.warningDetailsDatas,
                ...{
                    selectedPollutantCode: value,
                    selectedPollutantName: selectedOptions.props.children
                }
            }
        });
    };

    /**
     * 智能监控_渲染预警详情表格数据
     */
    renderWarningDetailsTable = () => {
        let { selectedPollutantCode, selectedPollutantName, chartDatas } = this.props.warningDetailsDatas;
        const { pollutantList } = this.props;
        const selectPllutantInfo = pollutantList.find((value, index, arr) => value.PollutantCode == selectedPollutantCode);
        console.log('selectPllutantInfo=', selectPllutantInfo)
        const suugestValue = this.state.SuggestValue;
        const columns = [
            {
                title: '监测时间',
                dataIndex: 'MonitorTime',
                width: '20%',
                key: 'MonitorTime',
                render: (text, record) => text && moment(text).format('HH:mm:ss'),
            },
            {
                title: '污染物',
                dataIndex: 'none',
                key: 'none',
                render: (text, record) => `${selectedPollutantName}`,
                width: '20%'
            },
            {
                key: selectedPollutantCode,
                title: '监测值',
                dataIndex: selectedPollutantCode,
                width: '20%',
                align: 'center'
            },
            {
                key: `${selectedPollutantCode}_StandardValue`,
                title: '标准值',
                dataIndex: `${selectedPollutantCode}_StandardValue`,
                width: '20%',
                align: 'center',
                render: (text, record) => selectPllutantInfo.standardValueStr,
            },
            {
                key: `${selectedPollutantCode}_SuggestValue`,
                title: '建议浓度',
                dataIndex: `${selectedPollutantCode}_SuggestValue`,
                width: '20%',
                align: 'center',
                render: (text, record) => suugestValue,
            }
        ];

        return <Table
            columns={columns}
            dataSource={chartDatas}
            rowKey="warntable"
            size="small"
            pagination={{ pageSize: 15 }}
            loading={this.props.loadingRealTimeWarningDatas}
            scroll={{ y: 'calc(100vh - 490px)' }}
            rowClassName={
                (record, index, indent) => {
                    if (index === 0) {
                        return;
                    }
                    if (index % 2 !== 0) {
                        return 'light';
                    }
                }
            }
        />;
    }

    render() {
        // if(this.props.loadingPollutantList){
        //     return (<Spin
        //         style={{ width: '100%',
        //             height: 'calc(100vh/2)',
        //             display: 'flex',
        //             alignItems: 'center',
        //             justifyContent: 'center' }}
        //         size="large"
        //     />);
        // }

        return (
            <div>
                {/* <Modal
                    title={
                        <Row>
                            <Col span={10}>{this.state.clickThisPointName+'1111'}</Col>
                        </Row>
                    }
                    visible={this.state.visibleModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width="70%"
                    footer={[]}
                > */}
                {this.props.loadinghourDataOverWarningList ? <Spin
                    style={{
                        width: '100%',
                        height: 'calc(100vh/2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    size="large"
                /> :
                    <Tabs
                        defaultActiveKey="1"
                        tabPosition="left"
                        style={{ height: 'calc(100vh - 400px)' }}
                        className={styles.warningDetailsModal}
                    >
                        <TabPane tab="图表分析" key="1">
                            <Row>
                                <Col span={3}>{this.getPollutantSelect()}</Col>
                            </Row>
                            <Row>
                                <Col>
                                    {
                                        this.renderWarningDetailsCharts()
                                    }
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="数据分析" key="2">
                            <Row>
                                <Col>
                                    {
                                        this.renderWarningDetailsTable()
                                    }
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                }

                {/* </Modal> */}
            </div>


        );
    }
}

export default RealTimeWarningModal;