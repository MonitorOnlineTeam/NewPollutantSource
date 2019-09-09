import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Col, Row, Tabs, Badge, Icon, Divider } from 'antd';
import styles from './ProcessFlowChart.less';
import OfflineData from '@/pages/dashboard/analysis/components/CommonData'
const { TabPane } = Tabs;
@connect(({ loading, dataquery, realtimeserver }) => ({
    pollutantlist: dataquery.pollutantlist,
    dataloading: loading.effects['dataquery/queryhistorydatalist'],
    option: dataquery.chartdata,
    selectpoint: dataquery.selectpoint,
    isloading: loading.effects['dataquery/querypollutantlist'],
    paramsInfo: realtimeserver.paramsInfo,
    dataInfo: realtimeserver.dataInfo,
    historyparams: dataquery.historyparams
}))
class CommonChart extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const { dispatch, DGIMN } = this.props;
        dispatch({
            type: 'dataquery/querypollutantlist',
            payload: {
                dgimn: DGIMN
            },
        });
    }

    getEchart = () => {
        const { option, dataloading } = this.props;
        if (option) {
            option.backgroundColor = '#fff';
            return <ReactEcharts
                showLoading={dataloading}
                theme="light"
                option={option}
                lazyUpdate
                notMerge
                id="rightLine"
                style={{ width: '98%', height: 'calc(100vh - 500px)',padding:20 }}
            />
        }
    }
    /**仪表盘的点击事件 */
    dashboardClick = (pollutantCode, pollutantName) => {
        // alert();
        debugger
        let { historyparams, dispatch } = this.props;
        historyparams.payloadpollutantCode = pollutantCode;
        historyparams.payloadpollutantName = pollutantName;
        dispatch({
            type: 'dataquery/updateState',
            payload: {
                historyparams: historyparams
            }
        })
        dispatch({
            type: 'dataquery/queryhistorydatalist',
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

    pollutantClick = (e) => {
        console.log(e);
        this.dashboardClick(this.props.pollutantlist[e].PollutantCode, this.props.pollutantlist[e].PollutantName);
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
                        res.push(<TabPane tab={
                            <Card size="small" className={styles.maincard} bordered={false} >
                                <p ><span style={{ color: '#00000073', fontSize: '16px' }}>{pollutantParam.pollutantName}</span><Icon style={{ float: 'right' }} type="exclamation-circle" /></p>
                                <p >浓度：<span className={styles.cardfonttype}>{pollutantParam.value}</span><Icon style={{ marginLeft: 5, color: '#3f8600' }} type="arrow-down" /></p>
                                {
                                    this.getPollutantParam(pollutantParam.pollutantParamInfo)
                                }
                                <p style={{ marginTop: 3 }} >单位：<span>{item.Unit}</span></p>
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
        const { pollutantlist, paramsInfo,dataloading, option} = this.props;
        return (
            <div style={{backgroundColor:'#ffffff'}}>
                <div className={styles.maintabs} style={{padding:10}}>
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
                {this.getEchart()}
            </div>
        );
    }
}

export default CommonChart;