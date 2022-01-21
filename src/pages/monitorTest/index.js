import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '@/components/SdlTable';
import { Card, Row, Select, Col, DatePicker, Button, Input, Alert, Modal, message, Radio } from "antd"
import moment from 'moment'
import { connect } from "dva";
import { Form } from '@ant-design/compatible';
import { ExportOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';


const { RangePicker } = DatePicker;


@Form.create({})
@connect(({ loading, monitorTest }) => ({
    excellentDaysReportData: monitorTest.excellentDaysReportData,
    chartData: monitorTest.chartData,
    loading: loading.effects["monitorTest/GetMonitorTest"],
    exportLoading: loading.effects["monitorTest/ExportMonitorTest"]
}))
class monitorTest extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            time: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            showType: "data",
            columns: [
                {
                    title: '大气站',
                    dataIndex: 'DGIMN',
                    key: 'DGIMN',
                    width: 240,
                },
                {
                    title: '时间',
                    dataIndex: 'Time',
                    key: 'Time',
                    width: 230,
                },
                {
                    title: '优',
                    width: 80,
                    dataIndex: '优',
                    key: '优',
                },
                {
                    title: '良',
                    width: 80,
                    dataIndex: '良',
                    key: '良',
                },
                {
                    title: '轻度污染',
                    width: 80,
                    dataIndex: '轻度污染',
                    key: '轻度污染',
                },
                {
                    title: '中度污染',
                    width: 80,
                    dataIndex: '中度污染',
                    key: '中度污染',
                },
                {
                    title: '重度污染',
                    width: 80,
                    dataIndex: '重度污染',
                    key: '重度污染',
                },
                {
                    title: '严重污染',
                    dataIndex: '严重污染',
                    key: '严重污染',
                    width: 80,
                },
                {
                    title: '监测天数',
                    dataIndex: 'AllDays',
                    key: 'AllDays',
                    width: 80,
                },
                {
                    title: '有效天数',
                    dataIndex: 'EffectiveDays',
                    key: 'EffectiveDays',
                    width: 80,
                },
                {
                    title: '达标天数',
                    dataIndex: 'ExcellentDays',
                    key: 'ExcellentDays',
                    width: 80,
                },
                {
                    title: '达标率（%）',
                    dataIndex: 'ExcellentRate',
                    key: 'ExcellentRate',
                    width: 80,
                },
            ]
        };
    }

    componentDidMount() {
        this.getPageData();
    }

    // 图表Option
    getOptions = () => {
        const { chartData } = this.props;
        const { format, dataType } = this.state;
        var option = {
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            title: {
                text: '空气质量达标率'
            },
            xAxis: {
                type: 'category',
                data: chartData["xData"]
            },
            yAxis: {
                type: 'value',
                name: '达标率(%)',
                interval: 10,
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            series: [
                {
                    data: chartData["rate"],
                    type: 'bar',
                    barWidth: 60,//柱图宽度
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    label: {
                        show: true,
                        formatter: function (params) {
                            return params.value + ' %';
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#67c23a",
                        },
                    },
                }
            ]
        };
        return option;
    }

    getPageData = () => {
        this.props.dispatch({
            type: "monitorTest/GetMonitorTest",
            payload: {
                BeginTime: this.state.time[0].format('YYYY-MM-DD 00:00:00'),
                EndTime: this.state.time[1].format('YYYY-MM-DD 23:59:59'),
            }
        })
    }

    exportReport = () => {
        this.props.dispatch({
            type: "monitor/ExportMonitorTest",
            payload: {
                BeginTime: this.state.time[0].format('YYYY-MM-DD 00:00:00'),
                EndTime: this.state.time[1].format('YYYY-MM-DD 23:59:59'),
            }
        })
    }

    render() {
        const { time, columns, showType } = this.state;
        const { loading, excellentDaysReportData, exportLoading } = this.props;
        return (
            <BreadcrumbWrapper>
                <Card>
                    <Form layout="inline" style={{ marginBottom: 20 }}>
                        <Form.Item label="统计时间">
                            <RangePicker defaultValue={time} onChange={(dates, str) => {
                                this.setState({
                                    time: dates
                                })
                            }} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                style={{ margin: '0 10px' }}
                                loading={loading}
                                onClick={() => {
                                    this.getPageData();
                                }}
                            >
                                生成统计
                            </Button>
                            {/* <Button loading={exportLoading} onClick={this.exportReport}>
                                <ExportOutlined />导出
                            </Button> */}
                        </Form.Item>
                        <Form.Item>
                            <Radio.Group defaultValue="data" buttonStyle="solid" onChange={(e) => { this.setState({ showType: e.target.value }) }}>
                                <Radio.Button value="chart">图表</Radio.Button>
                                <Radio.Button value="data">数据</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                    <>{showType === "chart" ?
                        <ReactEcharts
                            option={this.getOptions()}
                            lazyUpdate={true}
                            style={{ height: 'calc(100vh - 250px)', width: '100%' }}
                            className="echarts-for-echarts"
                            theme="my_theme"
                        /> : <SdlTable loading={loading} columns={columns} dataSource={excellentDaysReportData} />}</>
                </Card>
            </BreadcrumbWrapper>
        );
    }
}

export default monitorTest;