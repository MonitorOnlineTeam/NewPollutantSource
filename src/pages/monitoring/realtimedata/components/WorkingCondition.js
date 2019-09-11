import React, { Component } from 'react';
import { Layout, Card, Col, Badge, Button, Avatar } from 'antd';
import ProcessFlowChart from './ProcessFlowChart';
import styles from './ProcessFlowChart.less';
import { connect } from 'dva';
const { Header, Footer, Sider, Content } = Layout;

@connect(({ realtimeserver, loading }) => ({
    isloading: loading.effects['realtimeserver/GetProcessFlowChartStatus'],
    pointInfo: realtimeserver.selectpoint,
    operationInfo: realtimeserver.operationInfo,
    stateInfo: realtimeserver.stateInfo,
    paramsInfo: realtimeserver.paramsInfo,
    dataInfo: realtimeserver.dataInfo,
    paramstatusInfo: realtimeserver.paramstatusInfo,
    stateNameInfo: realtimeserver.stateNameInfo,
    paramNameInfo: realtimeserver.paramNameInfo,
    paramdivInfo: realtimeserver.paramdivInfo
}))
export default class WorkingCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramInfo: [],
            collapsed: true,
            showSider:false,
            contentstyle: styles.hiddentrigger
        }
    }

    /** dgimn改變時候切換數據源 */
    componentWillReceiveProps = nextProps => {
        if (nextProps.DGIMN !== this.props.DGIMN) {
            this.setState({
                showSider:false
            })
            this.props.dispatch({
                type: 'realtimeserver/GetProcessFlowChartStatus',
                payload: {
                    dgimn: nextProps.DGIMN
                }
            });
        }
    }

    //参数表盘
    getparamInfo = () => {
        const { paramsInfo } = this.props;
        let res = [];

        if (paramsInfo) {
            paramsInfo.map((item, key) => {

                if (item.value) {
                    if (item.dataparam) {
                        //有异常或者超标数据
                        const bsparam = item.dataparam.split('-');
                        if (bsparam == 0) {
                            res.push(
                                <Col span={3} xl={3}>
                                    <div onClick={() => this.paramClick(item, 2)} style={{ background: 'url(/instrumentover.png) no-repeat' }} className={styles.divcard}>
                                        <div>
                                            <span>{item.pollutantName}</span>
                                            <p>{item.value}</p>
                                        </div>
                                    </div>
                                </Col>)
                        }
                        else {
                            res.push(
                                <Col span={3} xl={3}>
                                    <div onClick={() => this.paramClick(item, 3)} style={{ background: 'url(/instrumentexception.png) no-repeat' }} className={styles.divcard}>
                                        <div>
                                            <span>{item.pollutantName}</span>
                                            <p>{item.value}</p>
                                        </div>
                                    </div>
                                </Col>)
                        }
                    }
                    else {
                        //正常渲染
                        res.push(
                            <Col span={3} xl={3}>
                                <div onClick={() => this.paramClick(item, 1)} style={{ background: 'url(/instrumentnormal.png) no-repeat' }} className={styles.divcard}>
                                    <div>
                                        <span>{item.pollutantName}</span>
                                        <p>{item.value}</p>
                                    </div>
                                </div>
                            </Col>)
                    }
                }
                else {
                    //离线
                    res.push(
                        <Col span={3} xl={3}>
                            <div onClick={() => this.paramClick(item, 0)} style={{ background: 'url(/instrumentunline.png) no-repeat' }} className={styles.divcard}>
                                <div>
                                    <span>{item.pollutantName}</span>
                                    <p>-</p>
                                </div>
                            </div>
                        </Col>
                    )
                }

            })
            return res;
        }
        return null;
    }

    //图片点击事件
    imgClick = (paramInfolist, stateInfolist, dataInfolist) => {
        let res = [];

        if (stateInfolist && stateInfolist.length > 0) {

            stateInfolist.map(item => {
                let statusstyle = styles.exceptionstatus;
                if (item.statename == "正常") {
                    statusstyle = styles.normalstatus
                }
                res.push(<div className={statusstyle}>
                    <Badge status="processing" text={`${item.name}:${item.statename}`} />
                </div>)
            })
        }
        if (paramInfolist && paramInfolist.length > 0) {
            paramInfolist.map(item => {
                res.push(<div className={styles.datalist}> <Badge color="#3B91FF" status="success" text={`${item.statename}:${item.value}`} /></div>)
            })
        }
        if (dataInfolist && dataInfolist.length > 0) {
            dataInfolist.map((item, key) => {
                if (item.pollutantName) {
                    res.push(<div className={styles.dataInfo}><Avatar size="small"
                        style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{key + 1}
                    </Avatar>{item.pollutantName}:{item.value ? item.value : "-"}</div>)
                    if (item.pollutantParamInfo && item.pollutantParamInfo.length > 0) {
                        item.pollutantParamInfo.map(param => {
                            res.push(<div className={styles.datalist} style={{ marginLeft: 20 }}>
                                <Badge color="#3B91FF" status="success" text={`${param.statename}:${param.value}`} /> </div>)
                        })
                    }
                }
            })
        }
        this.setState({
            paramInfo: res,
            collapsed: false,
            showSider:true,
            contentstyle: styles.content
        })
    }


    //点击事件
    paramClick = (item, status) => {
        let res = [];
        let statusstyle = styles.unlinestatus;
        if (status === 1) {
            statusstyle = styles.normalstatus;
        }
        else if (status === 2) {
            statusstyle = styles.overstatus;
        }
        else if (status === 3) {
            statusstyle = styles.exceptionstatus;
        }
        if (item && item.pollutantParamInfo) {
            res.push(<div className={styles.detailtitle}>{item.pollutantName}分析仪</div>)
            item.pollutantParamInfo.map(info => {
                res.push(<div className={statusstyle}>
                    <Badge status="processing" text={`${info.statename}:${info.value}`} />
                </div>)
            })
        }
        this.setState({
            paramInfo: res,
            collapsed: false,
            contentstyle: styles.content
        })
    }
    onCollapse = (collapsed, type) => {
        let contentstyle = styles.content;
        if (collapsed) {
            contentstyle = styles.contentcollapse;
        }
        this.setState({
            collapsed: collapsed,
            contentstyle: contentstyle
        })
    }


    render() {
        const { match } = this.props;
        const pointcode = this.props.DGIMN; // 任务ID
        return (
            <div style={{ overflowX: 'hidden' }}>
                <Layout className={this.state.contentstyle} hasSider={true}>
                    <Content><ProcessFlowChart imgClick={(paramInfolist, stateInfolist, dataInfolist) =>
                        this.imgClick(paramInfolist, stateInfolist, dataInfolist)} DGIMN={pointcode} /></Content>
                        {
                            this.state.showSider && <Sider width={250} collapsedWidth={10} theme="light"
                            collapsed={this.state.collapsed}
                            onCollapse={this.onCollapse}
                            collapsible={true}
                            reverseArrow={true}>
                            <div className={styles.rightParams}>
                                {this.state.paramInfo}
                            </div>
                        </Sider>
                        }
                    
                </Layout>
            </div>

        );
    }
}
