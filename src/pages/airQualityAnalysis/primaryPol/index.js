/*
 * @Author: lzp
 * @Date: 2022-01-18 10:44:55
 * @Last Modified by: lzp
 * @Last Modified time: 2022-01-18 16:10:56
 * @Description: 月份首要污染物分析
 */
import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Checkbox, Row, Col, Radio, Select, DatePicker, Empty, message } from 'antd'
// import styles from './index.less'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from "dva";
import ReactEcharts from 'echarts-for-react';
import NavigationTree from '@/components/NavigationTree'
import moment from 'moment'
import SdlTable from '@/components/SdlTable';
import PageLoading from '@/components/PageLoading'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { getDirLevel } from "@/utils/utils"
import { airLevel, AQIPopover, IAQIPopover } from '@/pages/monitoring/overView/tools'
import { func } from 'prop-types';

const { RangePicker } = DatePicker;

@connect(({ loading, airQualityAnalysis }) => ({
    PrimaryData: airQualityAnalysis.PrimaryData,
    //   exportLoading: loading.effects["dataAnalyze/export"],
    loading: loading.effects["airQualityAnalysis/GetAirAQIMonth"],
}))
class primaryPol extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            defalutPollutantType: props.match.params.type,
            time: [moment().add(-12, "month"), moment()],
            dataType: "month",
            DGIMN: '',
            format: "YYYY-MM-01 00:00:00",
            columns: [
                {
                    title: "监测点",
                    dataIndex: "PointName",
                    fixed: 'left',
                },
                {
                    title: "时间",
                    dataIndex: "MonitorTime",
                    fixed: 'left',
                    render: (text, record) => {
                        return this.state.dataType === "Hour" ? moment(text).format(this.state.format) + "时" : moment(text).format(this.state.format)
                    }
                },
            ],
        };
    }

    componentDidMount() {
        console.log(1122)
        this.getChartAndTableData();
    }



    // 获取图表及表格数据
    getChartAndTableData = () => {
        let format = "YYYY-MM-01 00:00:00"
        this.props.dispatch({
            type: "airQualityAnalysis/GetAirPrimaryPolMonth",
            payload: {
                DGIMN: this.state.DGIMN,
                BeginTime: moment(this.state.time[0]).format(format),
                EndTime: moment(this.state.time[1]).format(format),
            }
        })
    }

    TimeChange = (value) => {

    }



    cardTitle = () => {
        const { defaultPollutant, loading } = this.props; //, exportLoading
        const { time, dataType, format } = this.state;
        // const format = dataType === "Hour" ? "YYYY-MM-DD HH" : "YYYY-MM-DD"
        return (
            <>
                {/* <RangePicker_ style={{ width: '25%', minWidth: '200px', marginRight: '10px' }} dateValue={time} onRef={this.onRef1} dataType='month' callback={(dates, dataType) => {
                    this.setState({
                        time: dates,
                        dataType: dataType
                    })
                }} /> */}
                <RangePicker picker="month" defaultValue={time} onChange={(dates, dateStrings) => {
                    this.setState({
                        time: dates
                    })
                }} />
                <Button type="primary" loading={loading} style={{ marginRight: 10 }} onClick={this.getChartAndTableData}>查询</Button>
                {/* <Button type="primary" loading={exportLoading} style={{ marginRight: 10 }} onClick={this.exportReport}>导出</Button> */}
            </>
        )
    }


    // 图表Option
    getOptions = () => {
        const { PrimaryData } = this.props;
        const { format, dataType } = this.state;
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['SO₂', 'NO₂', 'PM₁₀', 'PM₂.₅', 'CO', 'O₃']
            },
            xAxis: [
                {
                    type: 'category',
                    data: PrimaryData['xData'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '月份首要污染物天数(天)',
                    interval: 10,
                    axisLabel: {
                        formatter: '{value} '
                    }
                }
            ],
            series: [

                {
                    name: 'SO₂',
                    type: 'bar',
                    stack: 'Ad',
                    barWidth : 60,//柱图宽度
                    label: {
                        normal:{
                            show:true,
                            formatter:function(params){
                                if(params.value>0)
                                {
                                    return params.value;
                                }else
                                {
                                    return '';
                                }
                            }
                        }
                      },
                    emphasis: {
                        focus: 'series'
                    },
                    
                    data: PrimaryData['SO2']
                },
                {
                    name: 'NO₂',
                    type: 'bar',
                    stack: 'Ad',
                    label: {
                        normal:{
                            show:true,
                            formatter:function(params){
                                if(params.value>0)
                                {
                                    return params.value;
                                }else
                                {
                                    return '';
                                }
                            }
                        }
                      },
                    emphasis: {
                        focus: 'series'
                    },
                    
                    data: PrimaryData['NO2']
                },
                {
                    name: 'PM₁₀',
                    type: 'bar',
                    stack: 'Ad',
                    label: {
                        normal:{
                            show:true,
                            formatter:function(params){
                                if(params.value>0)
                                {
                                    return params.value;
                                }else
                                {
                                    return '';
                                }
                            }
                        }
                      },
                    emphasis: {
                        focus: 'series'
                    },
                   
                    data: PrimaryData['PM10']
                },
                {
                    name: 'PM₂.₅',
                    type: 'bar',
                    stack: 'Ad',
                    label: {
                        normal:{
                            show:true,
                            formatter:function(params){
                                if(params.value>0)
                                {
                                    return params.value;
                                }else
                                {
                                    return '';
                                }
                            }
                        }
                      },
                    emphasis: {
                        focus: 'series'
                    },
                    
                    data: PrimaryData['PM2.5']
                },
                {
                    name: 'CO',
                    type: 'bar',
                    stack: 'Ad',
                    label: {
                        normal:{
                            show:true,
                            formatter:function(params){
                                if(params.value>0)
                                {
                                    return params.value;
                                }else
                                {
                                    return '';
                                }
                            }
                        }
                      },
                    emphasis: {
                        focus: 'series'
                    },
                   
                    data: PrimaryData['CO']
                },
                {
                    name: 'O₃',
                    type: 'bar',
                    stack: 'Ad',
                    label: {
                        normal:{
                            show:true,
                            formatter:function(params){
                                if(params.value>0)
                                {
                                    return params.value;
                                }else
                                {
                                    return '';
                                }
                            }
                        }
                      },
                    emphasis: {
                        focus: 'series'
                    },
                   
                    data: PrimaryData['O3']
                }
            ]
        };
        return option
    }

    pageContent = () => {
        const { showType, columns } = this.state;
        const { PrimaryData } = this.props;
        //<SdlTable columns={columns} dataSource={tableList} pagination={false} />
        return <>{
            PrimaryData != null ? (
                <ReactEcharts
                    option={this.getOptions()}
                    lazyUpdate={true}
                    style={{ height: 'calc(100vh - 250px)', width: '100%' }}
                    className="echarts-for-echarts"
                    theme="my_theme"
                />
            ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
        </>
    }

    onRef1 = (ref) => {
        this.children = ref;
    }

    render() {
        const { defalutPollutantType } = this.state;
        const { PrimaryData } = this.props;
        return (
            <>
                <NavigationTree
                    // QCAUse="1"
                    checkpPol={defalutPollutantType}
                    polShow
                    // choice
                    domId="#primaryPol"
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
                                this.getChartAndTableData()
                            })
                        }
                    }}
                />
                <div id="primaryPol">
                    <BreadcrumbWrapper>
                        <Card
                            title={this.cardTitle()}
                            //   extra={

                            //   }
                            className="contentContainer"
                        >
                            {this.pageContent()}
                        </Card>
                    </BreadcrumbWrapper>
                </div>
            </>
        );
    }
}

export default primaryPol;

