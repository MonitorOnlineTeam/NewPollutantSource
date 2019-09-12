import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Col, Row, Tabs, Badge, Icon, Divider, Tooltip, Spin, Popover, Empty } from 'antd';
import styles from './ProcessFlowChart.less';
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
        this.state = {
            paramsInfo: []
        }
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

    /** dgimn改變時候切換數據源 */
    componentWillReceiveProps = nextProps => {
        // console.log('nextProps.paramsInfo=',nextProps.paramsInfo)
        // console.log('props.paramsInfo=',this.props.paramsInfo)
        if (nextProps.paramsInfo !== this.props.paramsInfo) {
            var paramsInfo = nextProps.paramsInfo
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


    getEchart = () => {
        debugger
        const { option, dataloading } = this.props;
        if (option) {
            option.backgroundColor = '#fff';
            return <ReactEcharts
                // showLoading={dataloading}
                theme="light"
                option={option}
                lazyUpdate
                notMerge
                id="rightLine"
                style={{ width: '98%', height: 'calc(100vh - 500px)', padding: 20 }}
            />
        } else {
            return <Empty style={{
                width: '100%',
                height: 'calc(100vh - 500px)',
                marginTop: 260
            }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
    }
    /**仪表盘的点击事件 */
    dashboardClick = (pollutantCode, pollutantName) => {
        // alert();
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

    getUpOrDown = (state) => {
        switch (state) {
            case '0':
                return ""
            case '1':
                return "arrow-up"
            case '2':
                return "arrow-down"
        }
    }
    getColor = (dataparam) => {
        var color = '#2eff02'
        if (dataparam != '') {
            var str = dataparam.split('§')
            if (str == 'IsOver') {
                color = '#ff0000'
            }//IsException
        }
        return color
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
    getDeials=(params)=>{
        var res=[]
        console.log('params111=',params)
        if(params)
        {
            params.map(item=>{
                
                res.push(<p>{item.statename}:{item.value}</p>)
            })
            
        }else
        {
            res.push(<Empty style={{
                width: '100%',
                height: '100px',
            }} image={Empty.PRESENTED_IMAGE_SIMPLE} />)
        }
        return res;
    }

    pollutantClick = (e) => {
        console.log(e);
        this.dashboardClick(this.props.pollutantlist[e].PollutantCode, this.props.pollutantlist[e].PollutantName);
    }

    /**仪表盘 */
    getLastestData = () => {
        const { pollutantlist,paramsInfo } = this.props;
        // let { paramsInfo } = this.state;
        if (pollutantlist) {
            let res = [];
            console.log('pollutantList1111=',pollutantlist)
            console.log('paramsInfo1111=',paramsInfo)
            //<Icon style={{ marginLeft: 5, color: this.getColor(pollutantParam.dataparam) }} type={this.getUpOrDown(pollutantParam.state)} />
            pollutantlist.map((item, key) => {
                if (paramsInfo) {
                    var pollutantParam = paramsInfo.find(param => {
                        return param.pollutantCode == item.PollutantCode;
                    })
                    if (pollutantParam) {
                        res.push(<TabPane tab={
                            <Card size="small" className={styles.maincard} bordered={false} >
                                <p ><span style={{ color: '#00000073' }}>{pollutantParam.pollutantName}</span><Popover placement="rightTop" title='详细参数' content={this.getDeials(pollutantParam.pollutantParamInfo)} trigger="hover"><Icon style={{ float: 'right', fontSize: '15px' }} type="exclamation-circle" /></Popover></p>
                                <p >浓度：<span className={styles.cardfonttype}>{pollutantParam.value}</span></p>
                                {/* {
                                    this.getPollutantParam(pollutantParam.pollutantParamInfo)
                                } */}
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
        const { pollutantlist, paramsInfo, dataloading, option } = this.props;
        console.log('paramsInfo==',paramsInfo)
        return (
            <div style={{ backgroundColor: '#ffffff' }}>
                <div className={styles.maintabs} style={{ padding: 10 }}>
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
                <div>{dataloading ? <Spin style={{
                    width: '100%',
                    height: 'calc(100vh - 260px)',
                    marginTop: 260
                }} size="large" /> : this.getEchart()}</div>
            </div>
        );
    }
}

export default CommonChart;
