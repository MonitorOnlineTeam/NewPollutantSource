import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Col, Row, Tabs,Badge } from 'antd';
import styles from './ProcessFlowChart.less';
const { TabPane } = Tabs;
@connect(({ loading, dataquery,realtimeserver }) => ({
    pollutantlist: dataquery.pollutantlist,
    dataloading: loading.effects['dataquery/queryhistorydatalist'],
    option: dataquery.chartdata,
    selectpoint: dataquery.selectpoint,
    isloading: loading.effects['dataquery/querypollutantlist'],
    paramsInfo: realtimeserver.paramsInfo,
    dataInfo:realtimeserver.dataInfo,
    historyparams:dataquery.historyparams
}))
class CommonChart extends Component {
    constructor(props)
    {
        super(props);
    }
    componentWillMount()
    {
        const {dispatch,DGIMN}=this.props;
        dispatch({
            type: 'dataquery/querypollutantlist',
            payload: {
                dgimn:DGIMN 
            },
        });
    }

    getEchart=()=>{
        const {option}=this.props;
        if(option)
        {
            option.backgroundColor='#fff';
            return  <ReactEcharts
                theme="light"
                option={option}
                lazyUpdate
                notMerge
                id="rightLine"
                style={{ width: '98%', height: 'calc(100vh - 500px)' }}
             />
        }
    }
    /**仪表盘的点击事件 */
    dashboardClick=(pollutantCode)=>{
        alert();
        let {historyparams,dispatch}=this.props;
        historyparams.payloadpollutantCode=pollutantCode;
        dispatch({
            type:'dataquery/updateState',
            payload:{
                historyparams:historyparams
            }
        })
        dispatch({
            type:'dataquery/queryhistorydatalist',
            payload:{
            }
        })
    }

    /**污染物参数 */
    getPollutantParam=(pollutantParamlist)=>{
         if(pollutantParamlist)
         {
             let res=[];
            pollutantParamlist.map(item=>{
                res.push(<p className={styles.pshsj}>{item.statename}:{item.value}</p>)
            })
            return res;
         }
    }

    pollutantClick=(e)=>{
        alert()
        console.log(e);
    }

    /**仪表盘 */
    getLastestData=()=>{
        const { pollutantlist,paramsInfo }=this.props;
        if(pollutantlist)
        {
            let res=[];

            pollutantlist.map((item,key)=>{
                if(paramsInfo)
                {
                   var pollutantParam = paramsInfo.find(param=>{
                         return param.pollutantCode==item.PollutantCode;
                    })
                    if(pollutantParam)
                    {
                        res.push(<TabPane tab={ 
                        <Card size="small" className={styles.maincard} title={<Badge  status="processing" text={pollutantParam.pollutantName}/>}>
                                <p className={styles.pshsj}>监测值:{pollutantParam.value}</p>
                                {
                                    this.getPollutantParam(pollutantParam.pollutantParamInfo)
                                }
                                </Card>} key={key}>
                            </TabPane>)
                        
                    }
                   
                }
                
            })
            return res;
        }
        return  (<TabPane tab={`Tab-${1}`} key={1}>
             Content of tab {1}
            </TabPane>)
    }
    render() {
    
        return (
            <div>
                <div className={styles.maintabs}>
                    <Tabs onChange={this.pollutantClick}>
                   {this.getLastestData()}
                   </Tabs>
                </div>
               {this.getEchart()}
            </div>
        );
    }
}

export default CommonChart;