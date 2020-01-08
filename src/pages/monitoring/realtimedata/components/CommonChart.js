/*
 * @Author: lzp
 * @Date: 2019-09-05 10:57:14
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 14:22:19
 * @Description: 图表
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Col, Row, Tabs, Badge, Icon, Divider, Tooltip, Spin, Popover, Empty } from 'antd';
import { Xiangshang, Xiangxia } from '@/utils/icon';

import styles from './ProcessFlowChart.less';
const { TabPane } = Tabs;
@connect(({ loading, dataquery, realtimeserver }) => ({
    pollutantlist: realtimeserver.pollutantlist,
    dataloading: loading.effects['realtimeserver/queryhistorydatalist'],
    option: realtimeserver.chartdata,
    selectpoint: realtimeserver.selectpoint,
    isloading: loading.effects['realtimeserver/querypollutantlist'],
    paramsInfo: realtimeserver.paramsInfo,
    dataInfo: realtimeserver.dataInfo,
    historyparams: realtimeserver.historyparams
}))
class CommonChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramsInfo: [],
        }
    }

    componentDidMount() {
        const { dispatch, DGIMN } = this.props;
        dispatch({
            type: 'realtimeserver/querypollutantlist',
            payload: {
                dgimn: DGIMN
            },
        });
    }

    /** dgimn改變時候切換數據源 */
    componentWillReceiveProps = nextProps => {
        if (nextProps.paramsInfo) {
            // console.log('nextProps.paramsInfo=', nextProps.paramsInfo);
            // console.log('this.props.paramsInfo=', this.props.paramsInfo);
            if (nextProps.paramsInfo !== this.props.paramsInfo) {
                let paramsInfo = nextProps.paramsInfo;
                //console.log('paramsInfo=', paramsInfo);
                if (paramsInfo) {
                    paramsInfo.map(item => {
                        var params = this.props.paramsInfo.find(m => m.pollutantCode == item.pollutantCode)
                        var state = '0'
                        if (params != null) {
                            if (item.value > params.value) {
                                state = '1'  //向上箭头
                            } else if (item.value == params.value) {
                                state = '0' //无箭头
                            } else {
                                state = '2' //向下箭头
                            }
                        }
                        item.state = state;
                    })
                    this.setState({ paramsInfo })
                }

            }
        }
        //推送数据改变曲线图
        if (this.props.option !== nextProps.option) {
            if (this.echartsReact && nextProps.option) {
                //console.log("nextProps.option=", nextProps.option)
                this.echartsReact.getEchartsInstance().setOption(nextProps.option);
            }
        }
    }

    //加载曲线图
    getEchart = () => {
        const { option, dataloading } = this.props;
        if (option) {
            option.backgroundColor = '#fff';
            return <ReactEcharts
                ref={(reactEcharts) => { this.echartsReact = reactEcharts; }}
                theme="light"
                option={option}
                lazyUpdate
                notMerge
                id="rightLine"
                style={{ width: '98%', height: 'calc(100vh - 450px)', padding: 20 }}
            />
        } else {
            return <Empty style={{
                width: '100%',
            }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
    }
    /**仪表盘的点击事件 */
    dashboardClick = (pollutantCode, pollutantName, Unit) => {
        let { historyparams, dispatch } = this.props;

        historyparams.pollutantCodes = pollutantCode;
        historyparams.pollutantNames = pollutantName;
        historyparams.unit = Unit;
        dispatch({
            type: 'realtimeserver/updateState',
            payload: {
                historyparams: historyparams
            }
        })
        dispatch({
            type: 'realtimeserver/queryhistorydatalist',
            payload: {
            }
        })
    }

    /**污染物参数 */
    getPollutantParam = (pollutantParamlist) => {
        if (pollutantParamlist) {
            let res = [];
            pollutantParamlist.map(item => {
                res.push(<p className={styles.pshsj}>{item.statename}:{item.value}</p>)
            })
            return res;
        }
    }
    getDeials = (params) => {
        var res = []
        if (params) {
            params.map(item => {

                res.push(<p>{item.statename}:{item.value}</p>)
            })

        } else {
            res.push(<Empty style={{
                width: '100%',
                height: '100px',
            }} image={Empty.PRESENTED_IMAGE_SIMPLE} />)
        }
        return res;
    }

    //污染物选项卡改变事件
    pollutantClick = (e) => {
        this.dashboardClick(this.props.pollutantlist[e].PollutantCode, this.props.pollutantlist[e].PollutantName, this.props.pollutantlist[e].Unit);
    }

    /**仪表盘 */
    getLastestData = () => {
        const { pollutantlist, paramsInfo } = this.props;
        if (pollutantlist) {
            let res = [];
            pollutantlist.map((item, key) => {
                if (paramsInfo) {
                    var pollutantParam = paramsInfo.find(param => {
                        return param.pollutantCode == item.PollutantCode;
                    })
                    if (pollutantParam) {
                        //定义超标异常标识
                        var flag = 2;
                        if (pollutantParam.dataparam) {
                            flag = pollutantParam.dataparam.split('§')[0];
                        }
                        res.push(<TabPane tab={
                            <Card size="small" className={styles.maincard} bordered={false} >
                                <p ><span style={{ color: '#00000073' }}>{pollutantParam.pollutantName}</span><Popover placement="rightTop" title='详细参数' content={this.getDeials(pollutantParam.pollutantParamInfo)} trigger="hover"><Icon style={{ float: 'right', fontSize: '15px' }} type="exclamation-circle" /></Popover></p>
                                <p >浓度：<span style={{ color: flag === "0" ? "red" : flag === "1" ? "#ffbe00e3" : "" }} className={styles.cardfonttype}>{pollutantParam.value}</span>
                                    {
                                        pollutantParam.state ? pollutantParam.state === '1' ?
                                            <span><Xiangshang /></span> :
                                            pollutantParam.state === '2' ?
                                                <Xiangxia /> : "" : ""
                                    }
                                </p>
                                <p>单位：<span>{item.Unit}</span></p>
                                <p>标准值:{item.StandardValueStr}</p>
                            </Card>} key={key}>
                        </TabPane>)

                    }

                }

            })
            return res;
        }
        return (<TabPane tab={`Tab-${1}`} key={1}>
            Content of tab {1}
        </TabPane>)
    }
    render() {
        const { pollutantlist, dataloading, isloading, option, paramsInfo, dataInfo } = this.props;
        console.log("paramsInfo1111=", paramsInfo);
        return (
            <div style={{ backgroundColor: '#ffffff' }}>
                <div className={styles.maintabs} style={{ padding: 10 }}>
                    {/* <p>刷新时间：{paramsInfo && dataInfo && paramsInfo[0].MonitorTime ? paramsInfo[0].MonitorTime : dataInfo && dataInfo.time}</p> */}
                    <Tabs onChange={this.pollutantClick}>
                        {this.getLastestData()}
                    </Tabs>
                    {/* <OfflineData
                        activeKey={0}
                        loading={dataloading}
                        pollutantlist={pollutantlist}
                        paramsInfo={paramsInfo}
                        offlineChartData={option}
                        handleTabChange={this.pollutantClick}
                    /> */}
                </div>
                <div>{isloading ? <Spin style={{
                    width: '100%',
                    marginTop: 100
                }} size="large" /> : <div>{dataloading ? <Spin style={{
                    width: '100%',
                    marginTop: 100
                }} size="large" /> : this.getEchart()}</div>}</div>
            </div>
        );
    }
}

export default CommonChart;
