import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlTable from '@/components/SdlTable';
import { Card, Row, Select, Col, DatePicker, Button, Input, Alert, Modal, message, Radio } from "antd"
import moment from 'moment'
import { connect } from "dva";
import { Form } from '@ant-design/compatible';
import { ExportOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import NavigationTree from '@/components/NavigationTree'
import ReturnName from '../AutoFormManager/ReturnName';

const { RangePicker } = DatePicker;


@Form.create({})
@connect(({ loading, polRose }) => ({
    PollutantList: polRose.PollutantList,
    RoleData: polRose.RoleData,
    loading: loading.effects["polRose/GetRoleData"],
}))
class polRose extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            defalutPollutantType: props.match.params.type,
            time: [moment().subtract(1, 'years'), moment().subtract(1, 'days')],
            showType: "chart",
            DGIMN: '',
            pollutantValue: '',
        };
        this.CONST = {
            columns: [
                {
                    title: '时间',
                    dataIndex: 'MonitorTime',
                    key: 'MonitorTime',

                },
                {
                    title: '数值',
                    dataIndex: 'Value',
                    key: 'Value',
                },
            ]
        }
    }

    componentDidMount() {
        // this.getPageData();
    }

    // 图表Option
    getOptions = () => {
        const { RoleData } = this.props;
        const { format, dataType } = this.state;
        const legendName = RoleData["legendName"];
        let series = [];
        let numData = [];
        numData = RoleData["data"];
        numData && numData.map((value, i) => {
            series.push({
                barCategoryGap: 0,
                type: 'bar',
                zlevel: 1,
                data: value,
                coordinateSystem: 'polar',
                name: legendName[i],
                stack: 'a',
                itemStyle: {
                    borderColor: 'black',
                    borderWidth: 1
                }
            })
        });
        var option = {
            tooltip: {
                trigger: 'item',
                textStyle: {
                    fontSize: 16,
                    color: '#fff',
                    fontFamily: 'Microsoft YaHei'
                }
            },
            color: RoleData["colorList"],
            angleAxis: {
                zlevel: 2,
                type: 'category',
                data: [
                    { value: '北' },
                    { value: '' },
                    { value: '' },
                    { value: '东北偏北' },
                    { value: '' },
                    { value: '' },
                    { value: '东北' },
                    { value: '' },
                    { value: '' },
                    { value: '东北偏东' },
                    { value: '' },
                    { value: '' },
                    { value: '东' },
                    { value: '' },
                    { value: '' },
                    { value: '东南偏东' },
                    { value: '' },
                    { value: '' },
                    { value: '东南' },
                    { value: '' },
                    { value: '' },
                    { value: '东南偏南' },
                    { value: '' },
                    { value: '' },
                    { value: '南' },
                    { value: '' },
                    { value: '' },
                    { value: '西南偏南' },
                    { value: '' },
                    { value: '' },
                    { value: '西南' },
                    { value: '' },
                    { value: '' },
                    { value: '西南偏西' },
                    { value: '' },
                    { value: '' },
                    { value: '西' },
                    { value: '' },
                    { value: '' },
                    { value: '西北偏西' },
                    { value: '' },
                    { value: '' },
                    { value: '西北' },
                    { value: '' },
                    { value: '' },
                    { value: '西北偏北' },
                    { value: '' },
                    { value: '' }
                ],

                boundaryGap: false, //标签和数据点都会在两个刻度之间的带(band)中间
                axisTick: {
                    show: false //是否显示坐标轴刻度
                },
                show: true,
                splitLine: {
                    show: true,
                    lineStyle: {
                        // color:"black"
                    }
                },
                axisLabel: {
                    show: true,
                    interval: 2 //坐标轴刻度标签的显示间隔，在类目轴中有效
                }
            },
            radiusAxis: {
                min: 0,
                max: RoleData["max"] + 1,
                zlevel: 3,
                axisTick: {
                    show: false //是否显示坐标轴刻度
                },
                axisLine: {
                    show: true //是否显示坐标轴轴线
                }
            },
            polar: {},
            series: series,
            legend: {
                show: true,
                data: legendName,
                width: 500 //根据宽度调整换行
            }
        };
        return option;
    }

    getPageData = () => {
        if (!this.state.pollutantValue || !this.state.pollutantValue.length) {
            message.error('请选择污染物');
            return;
        }
        this.props.dispatch({
            type: "polRose/GetRoleData",
            payload: {
                BeginTime: this.state.time[0].format('YYYY-MM-DD 00:00:00'),
                EndTime: this.state.time[1].format('YYYY-MM-DD 23:59:59'),
                DGIMN: this.state.DGIMN,
                Type: this.state.pollutantValue
            }
        })
    }
    // 获取污染物
    getPollutantList = () => {
        this.props.dispatch({
            type: 'polRose/GetPollutantAQI',
            payload: {
            },
            callback: (res) => {
                this.setState({
                    pollutantValue: res[0].PollutantCode

                }, () => {
                    this.getPageData()
                })

            }
        })
    }

    cardTitle = () => {
        const { pollutantValue, pollutantNames } = this.state;
        const { PollutantList } = this.props;
        console.log(PollutantList)
        return <Select

            style={{ width: 200, marginRight: '10px' }}
            value={pollutantValue}
            placeholder="请选择因子"
            onChange={(value) => {
                this.setState({
                    pollutantValue: value
                })
            }}
        >
            {
                PollutantList && PollutantList.map((item, index) => {
                    return <Option key={item.PollutantCode}>{item.PollutantName}</Option>
                })
            }
        </Select>
    }


    render() {
        const { time, showType, defalutPollutantType, pollutantValue, pollutantNames } = this.state;
        const { loading, pollutantList, RoleData } = this.props;
        const { columns } = this.CONST;
        return (
            <>
                <NavigationTree
                    // QCAUse="1"
                    checkpPol={defalutPollutantType}
                    polShow
                    // choice
                    domId="#monthAQI"
                    onItemClick={value => {
                        if (value.length && value[0].IsEnt === false) {
                            let DGIMNs = value.find(item => {
                                if (item.IsEnt === false) {
                                    return item.key
                                }
                            })
                            this.setState({
                                DGIMN: DGIMNs.key,
                                PollutantType: DGIMNs.Type
                            }, () => {
                                this.getPollutantList();
                            })
                        }
                    }}
                />
                <div id="monthAQI">
                    <BreadcrumbWrapper>
                        <Card
                        //title={this.cardTitle()}
                        >
                            <Form layout="inline" style={{ marginBottom: 20 }}>
                                <Form.Item label="统计时间">
                                    <RangePicker defaultValue={time} onChange={(dates, str) => {
                                        this.setState({
                                            time: dates
                                        })
                                    }} />
                                </Form.Item>
                                <Form.Item label="因子">
                                    {
                                        this.cardTitle()
                                    }
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
                                </Form.Item>
                            </Form>
                            <Row>
                                <Col flex="auto">
                                    <ReactEcharts
                                        option={this.getOptions()}
                                        lazyUpdate={true}
                                        style={{ height: 'calc(100vh - 250px)', width: '100%' }}
                                        className="echarts-for-echarts"
                                        theme="my_theme"
                                    />
                                </Col>
                                <Col flex="400px">
                                    {
                                        RoleData["tableData"] && <SdlTable
                                            loading={loading}
                                            rowKey={(record, index) => index}
                                            columns={columns}
                                            // pagination={false}
                                            dataSource={RoleData["tableData"]}
                                        />
                                    }
                                </Col>
                            </Row>
                        </Card>
                    </BreadcrumbWrapper>
                </div>
            </>
        );
    }
}

export default polRose;