/*
 * @Author: lzp
 * @Date: 2019-08-14 09:09:17
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 14:23:02
 * @Description: 实时数据
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import NavigationTree from '../../../components/NavigationTree';
import DataQuery from '../dataquery/components/DataQuery';
import { Layout, Card, Col, Badge, Button, Avatar, Spin } from 'antd';
import styles from '@/pages/monitoring/realtimedata/components/ProcessFlowChart.less';
import { connect } from 'dva';
import { MapInteractionCSS } from 'react-map-interaction';
import WasteGasChart from '@/pages/monitoring/realtimedata/components//WasteGasChart';
import VocChart from '@/pages/monitoring/realtimedata/components//VocChart';
import HgChart from '@/pages/monitoring/realtimedata/components//HgChart';
import CommonChart from '@/pages/monitoring/realtimedata/components//CommonChart';

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
    paramdivInfo: realtimeserver.paramdivInfo,
    DGIMN: realtimeserver.DGIMN,
}))
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            paramInfo: [],
            collapsed: true,
            showSider: false,
            contentstyle: styles.hiddentrigger,
            scale: 1,
            translation: { x: 0, y: 0 },
            pointName: '',
            entName: '',
        };
    }

    componentWillReceiveProps = nextProps => {
        const { stateInfo, paramsInfo, paramstatusInfo, DGIMN } = this.props;
        const { param, status, data, dgimn } = this.state;
        // 推送要渲染点击事件，当MN号不同时不渲染并把右侧布局清空，这个只是针对MN号相同时推送相关问题
        if (dgimn === DGIMN) {
            if (nextProps.stateInfo !== stateInfo || nextProps.paramsInfo !== paramsInfo || nextProps.paramstatusInfo !== paramstatusInfo) {
                this.positionClick(param, status, data)
            }
        }
    }

    changeDgimn = value => {
        const { dispatch } = this.props;
        this.setState({
            dgimn: value[0].key,
            showSider: false,
            paramInfo: [],
            collapsed: true,
            pointName: value[0].pointName,
            entName: value[0].entName,
        })
        // 同時更新此Model中的DGIMN
        dispatch({
            type: 'realtimeserver/updateState',
            payload: {
                DGIMN: value[0].key,
            },
        });
        // 同時更新此Model中的DGIMN
        dispatch({
            type: 'realtimeserver/GetProcessFlowChartStatus',
            payload: {
                dgimn: value[0].key,
            },
        });
    }
    // /** dgimn改變時候切換數據源 */
    // componentWillReceiveProps = nextProps => {
    //     if (nextProps.DGIMN !== this.props.DGIMN) {
    //         this.setState({
    //             showSider: false
    //         })
    //         this.props.dispatch({
    //             type: 'realtimeserver/GetProcessFlowChartStatus',
    //             payload: {
    //                 dgimn: nextProps.DGIMN
    //             }
    //         });
    //     }
    // }

    // 参数表盘
    getparamInfo = () => {
        const { paramsInfo } = this.props;
        const res = [];

        if (paramsInfo) {
            paramsInfo.map((item, key) => {
                if (item.value) {
                    if (item.dataparam) {
                        // 有异常或者超标数据
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
                        } else {
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
                    } else {
                        // 正常渲染
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
                } else {
                    // 离线
                    res.push(
                        <Col span={3} xl={3}>
                            <div onClick={() => this.paramClick(item, 0)} style={{ background: 'url(/instrumentunline.png) no-repeat' }} className={styles.divcard}>
                                <div>
                                    <span>{item.pollutantName}</span>
                                    <p>-</p>
                                </div>
                            </div>
                        </Col>,
                    )
                }
            })
            return res;
        }
        return null;
    }

    // 系统参数
    getsystemparam = (param, textname, unit) => {
        const { paramstatusInfo } = this.props;
        if (paramstatusInfo && paramstatusInfo.length) {
            const nameInfo = paramstatusInfo.find(value => value.statename.indexOf(param) > -1)
            if (nameInfo) { return `${textname}:${nameInfo.value}${unit}`; }
        }
        return `${textname}:暂未上传`;
    }

    // 系统状态
    getsystemstate = param => {
        const { stateInfo } = this.props;
        if (stateInfo) {
            const nameInfo = stateInfo.find(value => value.name.indexOf(param) > -1)
            if (nameInfo) {
                if (nameInfo.statename == '正常') {
                    return (<span className={styles.normalstatus}><Badge status="processing" text="正常" /></span>)
                }
                return (<span className={styles.overstatus}><Badge status="processing" text="故障" /></span>)
            }
        }
    }

    // 图片上的点击事件
    positionClick = (param, status, data) => {
        // 推送过来要调用参数，再此存储参数值
        this.setState({
            param,
            status,
            data,
        })
        const { paramstatusInfo, stateInfo, paramsInfo } = this.props;
        const paramlist = param ? param.split(',') : null;
        const statuslist = status ? status.split(',') : null;
        const datalist = data ? data.split(',') : null;
        const paramInfolist = [];
        const stateInfolist = [];
        const dataInfolist = [];
        if (paramlist && paramstatusInfo) {
            paramlist.map(item => {
                const params = paramstatusInfo.find(value => value.statecode == item)
                if (params) { paramInfolist.push(params); }
            })
        }
        if (statuslist && stateInfo) {
            statuslist.map(item => {
                const statuses = stateInfo.find(value => value.code == item)
                if (statuses) { stateInfolist.push(statuses); }
            })
        }
        if (datalist && paramsInfo) {
            datalist.map(item => {
                const datas = paramsInfo.find(value => value.pollutantCode == item)
                if (datas) { dataInfolist.push(datas); }
            })
        }

        if (paramInfolist.length > 0 || stateInfolist.length > 0 || dataInfolist.length > 0) {
            this.imgClick(paramInfolist, stateInfolist, dataInfolist);
        }
    }

    /**
     *获取工艺流程图类型
     *
     * @memberof ProcessFlowChart
     */
    getChartType = () => {
        const { dataInfo, DGIMN } = this.props;
        const { dgimn, pointName, entName } = this.state;

        if (dataInfo && dataInfo.pollutantType == '2') {
            switch (dataInfo.equipmentType) {
                case '1':
                    return (<WasteGasChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
                        getsystemstate={this.getsystemstate} pointName={pointName} entName={entName}/>)
                    break;
                case '2':
                    return (<VocChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
                        getsystemstate={this.getsystemstate}  pointName={pointName} entName={entName}/>)
                    break;
                case '3':
                    return (<HgChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
                        getsystemstate={this.getsystemstate}  pointName={pointName} entName={entName}/>)
                case '5':
                    return <CommonChart DGIMN={dgimn} pointName={pointName} entName={entName}/>
                default:
                    return <CommonChart DGIMN={dgimn} pointName={pointName} entName={entName} />
                // return (<WasteGasChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
                //     getsystemstate={this.getsystemstate} />)
            }
        } else if (dgimn) {
            console.log('datainfo=', dataInfo)
            return <CommonChart DGIMN={dgimn} pointName={pointName} entName={entName} />
        }
        // else
        // {
        //     return null;
        // }
        // if (dataInfo && dataInfo.equipmentType) {
        //     dataInfo.equipmentType = '3';
        //     switch (dataInfo.equipmentType) {
        //         case "1":
        //             return (<WasteGasChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
        //                 getsystemstate={this.getsystemstate} />)
        //             break;
        //         case "2":
        //             return (<VocChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
        //                 getsystemstate={this.getsystemstate} />)
        //             break;
        //         case "3":
        //             return (<HgChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
        //                 getsystemstate={this.getsystemstate} />)
        //     }
        // }
        // else
        //     return (<WasteGasChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
        //         getsystemstate={this.getsystemstate} />)
    }

    // 图片点击事件
    imgClick = (paramInfolist, stateInfolist, dataInfolist) => {
        const res = [];
        if (stateInfolist && stateInfolist.length > 0) {
            stateInfolist.map(item => {
                let statusstyle = styles.exceptionstatus;
                if (item.statename == '正常') {
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
                    </Avatar>{item.pollutantName}:{item.value ? item.value : '-'}</div>)
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
            showSider: true,
            contentstyle: styles.content,
        })
    }


    // 点击事件
    paramClick = (item, status) => {
        const res = [];
        let statusstyle = styles.unlinestatus;
        if (status === 1) {
            statusstyle = styles.normalstatus;
        } else if (status === 2) {
            statusstyle = styles.overstatus;
        } else if (status === 3) {
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
            contentstyle: styles.content,
        })
    }

    onCollapse = (collapsed, type) => {
        let contentstyle = styles.content;
        if (collapsed) {
            contentstyle = styles.contentcollapse;
        }
        this.setState({
            collapsed,
            contentstyle,
        })
    }

    render() {
        const pointcode = this.state.dgimn; // 任务ID
        const { scale, translation } = this.state;
        const { isloading,
            stateInfo, paramsInfo, paramstatusInfo, dataInfo } = this.props;
        {
            // console.log(' this.props=',  this.props)
            // console.log(' this.state=',this.state)
        }
        return (
            <div id="realtimedata">
                <BreadcrumbWrapper>
                    <div style={{ overflowX: 'hidden' }}>
                        <Layout className={this.state.contentstyle} hasSider>
                            <Content><Card className="contentContainer" >
                                {isloading ? <Spin style={{
                                    width: '100%',
                                    marginTop: 100,
                                }} size="large" />
                                    : this.getChartType()
                                }
                            </Card></Content>
                            {
                                this.state.showSider && <Sider width={250} collapsedWidth={10} theme="light"
                                    collapsed={this.state.collapsed}
                                    onCollapse={this.onCollapse}
                                    collapsible
                                    reverseArrow>
                                    <div className={styles.rightParams}>
                                        {this.state.paramInfo}
                                    </div>
                                </Sider>
                            }

                        </Layout>
                    </div>

                </BreadcrumbWrapper>
                <NavigationTree domId="#realtimedata" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.changeDgimn(value)
                    }
                }} />
            </div>
        );
    }
}
export default Index;
