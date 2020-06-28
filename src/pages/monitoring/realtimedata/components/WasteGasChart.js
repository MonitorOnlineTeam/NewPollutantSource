/*
 * @Author: lzp
 * @Date: 2019-09-05 10:57:14
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 14:22:52
 * @Description: 水气工艺流程图
 */
import React, { Component } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import styles from './ProcessFlowChart.less';
import { Card, Descriptions, Popover, Badge, Avatar } from 'antd';
const pollutantCodes = ['01', '02', '03', 's03', 's08', 's05', 's02', 's01'];
class WasteGasChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1,
            translation: { x: 0, y: 0 }
        };
    }

    // //系统参数
    // getsystemparam = (param, textname, unit) => {
    //     return this.props.getsystemparam(param, textname, unit);
    // }
    // //系统状态
    // getsystemstate = (param) => {
    //     return this.props.getsystemstate(param);
    // }
    // componentWillReceiveProps = nextProps => {
    //     const { DGIMN, dispatch } = this.props;
    //     let nextPropsDGIMN = nextProps.DGIMN;
    //     if (nextPropsDGIMN) {
    //         if (nextPropsDGIMN !== DGIMN) {

    //         }
    //     }
    // }

    // //图片点击事件
    // positionClick = (param, status, data) => {
    //     this.props.positionClick(param, status, data);
    // }

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
    //系统参数
    SystemParameters = (code, data) => {
        return <div>
            {
                this.positionClick(code, data)
            }
        </div>
    }
    // 渲染气泡内容
    positionClick = (param, data) => {
        const { paramstatusInfo, paramsInfo } = this.props;
        const paramlist = param ? param.split(',') : null;
        // const statuslist = status ? status.split(',') : null;
        const datalist = data ? data.split(',') : null;
        const paramInfolist = [];
        // const stateInfolist = [];
        const dataInfolist = [];
        if (paramlist && paramstatusInfo) {
            paramlist.map(item => {
                const params = paramstatusInfo.find(value => value.statecode == item)
                if (params) { paramInfolist.push(params); }
            })
        }
        // if (statuslist && stateInfo) {
        //     statuslist.map(item => {
        //         const statuses = stateInfo.find(value => value.code == item)
        //         if (statuses) { stateInfolist.push(statuses); }
        //     })
        // }
        if (datalist && paramsInfo) {
            datalist.map(item => {
                const datas = paramsInfo.find(value => value.pollutantCode == item)
                if (datas) { dataInfolist.push(datas); }
            })
        }

        if (paramInfolist.length > 0 || dataInfolist.length > 0) {
            const res = [];
            // //系统状态
            // if (stateInfolist && stateInfolist.length > 0) {
            //     stateInfolist.map(item => {
            //         let statusstyle = styles.exceptionstatus;
            //         if (item.statename == '正常') {
            //             statusstyle = styles.normalstatus
            //         }
            //         res.push(<div className={statusstyle}>
            //             <Badge status="processing" text={`${item.name}:${item.statename}`} />
            //         </div>)
            //     })
            // }
            //系统参数
            if (paramInfolist && paramInfolist.length > 0) {
                paramInfolist.map(item => {
                    let unit = !item.unit ? "" : item.unit === "/" ? "" : item.unit;
                    res.push(<div className={styles.datalist}> <Badge color="#3B91FF" status="success" text={`${item.statename} : ${item.value}${unit}`} /></div>)
                })
            }
            //数据
            if (dataInfolist && dataInfolist.length > 0) {
                dataInfolist.map((item, key) => {
                    // res.push(<div className={styles.dataInfo}><Avatar size="small"
                    //     style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{key + 1}
                    // </Avatar>{item.pollutantName}:{item.value ? item.value : '-'}</div>)
                    if (item.pollutantParamInfo && item.pollutantParamInfo.length > 0) {
                        item.pollutantParamInfo.map(param => {
                            res.push(<div className={styles.datalist} style={{ marginLeft: 20 }}>
                                <Badge color="#3B91FF" status="success" text={`${param.statename}: ${param.value}`} /> </div>)
                        })
                    }
                })
            }
            return res ? res : <div>暂无数据</div>;
        }
        else {
            return <div style={{ margin: 'auto', textAlign: 'center' }}>暂无数据</div>;
        }
    }
    //监控数据
    pollutantMonitingData = (pList) => {
        const { paramsInfo } = this.props;
        const datalist = pList ? pList.split(',') : null;
        const dataInfolist = [];
        if (datalist && paramsInfo) {
            datalist.map(item => {
                const datas = paramsInfo.find(value => value.pollutantCode == item)
                if (datas) { dataInfolist.push(datas); }
            })
        }
        const res = [];
        if (dataInfolist && dataInfolist.length > 0) {
            debugger
            dataInfolist.map((item, key) => {
                let value = item.value ? item.value + item.Unit : item.value
                res.push(
                    <Descriptions.Item className={styles.gridStyle} label={item.pollutantName}>{value}</Descriptions.Item>
                )
            })
        }
        return res;
    }

    //获取系统状态
    getSystemStates = () => {
        const { stateInfo } = this.props;
        let rtn = [];
        if (stateInfo && stateInfo.length > 0) {
            // rtn.push(
            //     <span>{stateInfo[0].name + "："}</span>
            // )
            // if (stateInfo[0].state === '1') {
            //     rtn.push(
            //         <span style={{ color: 'red' }}>{stateInfo[0].statename}</span>
            //     )
            // }
            // else {
            //     rtn.push(
            //         <span>{stateInfo[0].statename}</span>
            //     )
            // }
            // return rtn;
            if (stateInfo[0].state === '1') {
                rtn.push(
                    <Badge status="error" text={stateInfo[0].statename} />
                )
            }
            else {
                rtn.push(
                    <Badge status="processing" text={stateInfo[0].statename} />
                )
            }
        }
        return rtn;
    }
    render() {
        const { scale, translation } = this.state;
        const { stateInfo } = this.props;
        debugger
        return (
            <div>
                <div className={styles.stateClass}>{this.getSystemStates()}</div>
                <Descriptions className={styles.CardDataClass} bordered column={4}>
                    {this.pollutantMonitingData('01,02,03,s03,s08,s05,s02,s01')}
                </Descriptions>
                <div className={styles.mapClass}>
                    <MapInteractionCSS
                        scale={scale}
                        translation={translation}
                        onChange={({ scale, translation }) => this.setState({ scale, translation })}
                        defaultScale={1}
                        defaultTranslation={{ x: 0, y: 0 }}
                        minScale={0.05}
                        maxScale={5}
                        showControls={true}

                    >
                        <div className={styles.imgBg1} >
                            <Popover content={this.SystemParameters('i13010,i13011,i13012')} title="系统采样探头">
                                <div style={{
                                    position: 'relative', left: '127px',
                                    top: '523px', fontWeight: '700', fontSize: '10px', width: 15, height: 15, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13033')} title="系统采样管线">
                                <div style={{
                                    position: 'relative', left: '270px',
                                    top: '505px', fontWeight: '700', fontSize: '10px', width: 190, height: 25, zIndex: 1
                                }}
                                    className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13017')} title="钢瓶">
                                <div style={{
                                    position: 'relative', left: '1233px',
                                    top: '715px', fontWeight: '700', fontSize: '10px', width: 45, height: 66, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i33002')} title="冷凝器">
                                <div
                                    style={{
                                        position: 'relative', left: '759px',
                                        top: '404px', fontWeight: '700', fontSize: '10px', width: 109, height: 50, zIndex: 1
                                    }}
                                    className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i33002')} title="冷凝器">
                                <div
                                    style={{
                                        position: 'relative', left: '1025px',
                                        top: '354px', fontWeight: '700', fontSize: '10px', width: 109, height: 50, zIndex: 1
                                    }}
                                    className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13018')} title="电磁阀">
                                <div style={{
                                    position: 'relative', left: '1237px',
                                    top: '312px', fontWeight: '700', fontSize: '10px', width: 35, height: 35, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13014')} title="采样泵">
                                <div
                                    style={{
                                        position: 'relative', left: '495px',
                                        top: '515px', fontWeight: '700', fontSize: '10px', width: 45, height: 66, zIndex: 1
                                    }}
                                    className={`${styles.divClick} ${styles.caiyangbeng1}`}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13016')} title="蠕动泵">
                                <div style={{
                                    position: 'relative', left: '928px',
                                    top: '210px', fontWeight: '700', fontSize: '10px', width: 35, height: 35, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13013')} title="过滤器">
                                <div style={{
                                    position: 'relative', left: '539px',
                                    top: '175px', fontWeight: '700', fontSize: '10px', width: 35, height: 35, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13015')} title="制冷温度预设">
                                <div style={{
                                    position: 'relative', left: '913px',
                                    top: '378px', fontWeight: '700', fontSize: '10px', width: 65, height: 65, zIndex: 1, borderRadius: '50%'
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i33101,i23001')} title="现场条件">
                                <div style={{
                                    position: 'relative', left: '713px',
                                    top: '-233px', fontWeight: '700', fontSize: '10px', width: 118, height: 100, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>


                            <Popover content={this.SystemParameters('', 's03')} title="温度">
                                <div style={{
                                    position: 'relative', left: '160px',
                                    top: '-233px', fontWeight: '700', fontSize: '10px', width: 55, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', 's08')} title="压力">
                                <div style={{
                                    position: 'relative', left: '216px',
                                    top: '-287px', fontWeight: '700', fontSize: '10px', width: 55, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', 's02')} title="流速">
                                <div style={{
                                    position: 'relative', left: '272px',
                                    top: '-342px', fontWeight: '700', fontSize: '10px', width: 55, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>

                            <Popover content={this.SystemParameters('', '02')} title="二氧化硫">
                                <div style={{
                                    position: 'relative', left: '1304px',
                                    top: '-197px', fontWeight: '700', fontSize: '10px', width: 55, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', '03')} title="氮氧化物">
                                <div style={{
                                    position: 'relative', left: '1359px',
                                    top: '-251px', fontWeight: '700', fontSize: '10px', width: 55, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', 's01')} title="氧含量">
                                <div style={{
                                    position: 'relative', left: '1414px',
                                    top: '-307px', fontWeight: '700', fontSize: '10px', width: 55, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', '01')} title="颗粒物">
                                <div style={{
                                    position: 'relative', left: '160px',
                                    top: '-482px', fontWeight: '700', fontSize: '10px', width: 170, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', 's05')} title="湿度">
                                <div style={{
                                    position: 'relative', left: '619px',
                                    top: '-419px', fontWeight: '700', fontSize: '10px', width: 55, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                        </div>
                    </MapInteractionCSS>
                </div>
            </div >
        );
    }
}

export default WasteGasChart;