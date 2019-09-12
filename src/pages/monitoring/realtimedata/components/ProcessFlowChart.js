import React, { Component } from 'react';
import styles from './ProcessFlowChart.less';
import { MapInteractionCSS } from 'react-map-interaction';
import WasteGasChart from './WasteGasChart';
import VocChart from './VocChart';
import HgChart from './HgChart';
import CommonChart from './CommonChart';

import { connect } from 'dva';
import {
    Spin,
    Card,
    Badge
} from 'antd';

@connect(({ realtimeserver, loading }) => ({
    isloading: loading.effects['realtimeserver/GetProcessFlowChartStatus'],
    stateInfo: realtimeserver.stateInfo,
    paramsInfo: realtimeserver.paramsInfo,
    paramstatusInfo: realtimeserver.paramstatusInfo,
    dataInfo: realtimeserver.dataInfo
}))
export default class ProcessFlowChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1,
            translation: { x: 0, y: 0 }
        };
    }

    // /** dgimn改變時候切換數據源 */
    // componentWillReceiveProps = nextProps => {
    //     if (nextProps.DGIMN !== this.props.DGIMN) {
    //         this.props.dispatch({
    //             type: 'realtimeserver/GetProcessFlowChartStatus',
    //             payload: {
    //                 dgimn: nextProps.DGIMN
    //             }
    //         });
    //     }
    // }


    //系统参数
    getsystemparam = (param, textname, unit) => {
        const { paramstatusInfo } = this.props;
        if (paramstatusInfo && paramstatusInfo.length) {
            const nameInfo = paramstatusInfo.find(value => {
                return value.statename.indexOf(param) > -1;
            })
            if(nameInfo)
            return   textname+":"+nameInfo.value+unit;
        }
        return textname + ":暂未上传";
    }
    //系统状态
    getsystemstate = (param) => {
        const { stateInfo } = this.props;
        if (stateInfo) {
            const nameInfo = stateInfo.find(value => {
                return value.name.indexOf(param) > -1;
            })
            if(nameInfo)
            {
                 if(nameInfo.statename=="正常")
                 {
                    return (<span className={styles.normalstatus}><Badge status="processing"  text="正常" /></span>)
                 }
                 else
                 {
                    return (<span className={styles.overstatus}><Badge status="processing"  text="故障" /></span>)
                 }
            }

        }
    }
    //图片上的点击事件
    positionClick = (param, status, data) => {
        const { imgClick, paramstatusInfo, stateInfo, paramsInfo } = this.props;
        console.log('this.props=',this.props)
        const paramlist = param ? param.split(",") : null;
        const statuslist = status ? status.split(",") : null;
        const datalist = data ? data.split(",") : null;
        let paramInfolist = [];
        let stateInfolist = [];
        let dataInfolist = [];
        debugger
        if (paramlist && paramstatusInfo) {
            paramlist.map(item => {
                const params = paramstatusInfo.find(value => {
                    return value.statecode == item;
                })
                if (params)
                    paramInfolist.push(params);
            })
        }
        if (statuslist && stateInfo) {
            statuslist.map(item => {
                const statuses = stateInfo.find(value => {
                    return value.code == item;
                })
                if (statuses)
                    stateInfolist.push(statuses);
            })
        }
        if (datalist && paramsInfo) {
            datalist.map(item => {
                const datas = paramsInfo.find(value => {
                    return value.pollutantCode == item;
                })
                if (datas)
                    dataInfolist.push(datas);
            })
        }

        if (paramInfolist.length > 0 || stateInfolist.length > 0 || dataInfolist.length > 0) {
            imgClick(paramInfolist, stateInfolist, dataInfolist);
        }
    }
    /**
     *获取工艺流程图类型
     *
     * @memberof ProcessFlowChart
     */
    getChartType = () => {
        const { dataInfo, DGIMN } = this.props;
        console.log('this.props112=',this.props)
        if (dataInfo && dataInfo.pollutantType == '2') {
            switch (dataInfo.equipmentType) {
                case "1":
                    return (<WasteGasChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
                        getsystemstate={this.getsystemstate} />)
                    break;
                case "2":
                    return (<VocChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
                        getsystemstate={this.getsystemstate} />)
                    break;
                case "3":
                    return (<HgChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
                        getsystemstate={this.getsystemstate} />)
                default:
                    return (<WasteGasChart positionClick={this.positionClick} getsystemparam={this.getsystemparam}
                        getsystemstate={this.getsystemstate} />)
            }
        }
        else if (DGIMN) {
            console.log('datainfo=', dataInfo)
            return <CommonChart DGIMN={DGIMN} />
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

    render() {
        const { scale, translation } = this.state;
        const { isloading,
            stateInfo, paramsInfo, paramstatusInfo, dataInfo } = this.props;
        return (
            <Card className='contentContainer' >
                {isloading ? <Spin style={{
                    width: '100%',
                    marginTop:100
                }} size="large" />
                    : this.getChartType()
                }
            </Card>
        );
    }
}
