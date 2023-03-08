/*
 * @Author: JiaQi
 * @Date: 2023-02-08 11:34:48
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-03-01 15:32:34
 * @Description: 二氧化碳工艺流程图
 */

import React, { Component } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import styles from './ProcessFlowChart.less';
import { Card, Descriptions, Popover, Tabs, Modal, Spin, Table, Empty } from 'antd';
import { load_data } from '../_util'
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable';
import FLowMapModal from './FlowMapModal'

const { TabPane } = Tabs;
const columns = [
    {
        title: '孔位 1- m/s',
        dataIndex: 'flow1',
        key: 'flow1',
        align: 'center'
    },
    {
        title: '孔位 2- m/s',
        dataIndex: 'flow2',
        key: 'flow2',
        align: 'center'
    },
    {
        title: '孔位 3- m/s',
        dataIndex: 'flow3',
        key: 'flow3',
        align: 'center'
    },
    {
        title: '孔位 4- m/s',
        dataIndex: 'flow4',
        key: 'flow4',
        align: 'center'
    },
];

@connect(({ realtimeserver, loading }) => ({
    paramsInfo: realtimeserver.paramsInfo,
    CEMSOpen: realtimeserver.CEMSOpen,
    QCStatus: realtimeserver.QCStatus,

    CO2Rate: realtimeserver.CO2Rate,
    CO2SampleGasValue: realtimeserver.CO2SampleGasValue,
    O2SampleGasValue: realtimeserver.O2SampleGasValue,
    currentPointData: realtimeserver.currentPointData
}))
class CO2Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalLoading: false,
            scale: 1,
            translation: { x: 0, y: 0 }
        };
    }

    componentDidMount() {
        this.getPointData();
    }

    componentDidUpdate(prevProps, prevState) {
        // 状态改变后，清空数据
        if (prevProps.QCStatus == 1 && this.props.QCStatus !== prevProps.QCStatus) {
            console.log("状态改变后，清空数据")
            this.props.dispatch({
                type: "realtimeserver/updateState",
                payload: {
                    CEMSOpen: undefined,// CEMS阀门状态
                    // CEMSStatus: undefined,
                    valveStatus: {}, // 阀门状态


                    // valveStatus: {}, // 阀门状态
                    // CEMSOpen: undefined,// CEMS阀门状态
                    // CEMSStatus: undefined, // CEMS通信状态
                    // QCStatus: '0', // 质控仪状态
                }
            })
        }

        if (this.props.DGIMN !== prevProps.DGIMN) {
            this.getPointData();
        }
    }



    //系统参数
    SystemParameters = (code, data) => {
        return this.props.getsystemparamNew(code, data);
    }

    //监控数据
    pollutantMonitingData = (pList) => {
        return this.props.pollutantMonitingDataNew(pList)
    }

    //获取系统状态
    getSystemStates = () => {
        return this.props.getSystemStatesNew()
    }

    showModal = () => {
        // onClick={() => {
        this.setState({
            visible: true,
            modalLoading: true,
        }, () => {
            setTimeout(() => {
                // this.renderCanvas()
            }, 500)
        })
    }

    // 获取排口信息
    getPointData = () => {
        // debugger
        this.props.dispatch({
            type: 'realtimeserver/GetMonitorPointList',
            payload: {
                dgimn: this.props.DGIMN,
            },
            callback: (res) => {

            }
        })
    }


    render() {
        const { translation, modalLoading, visible } = this.state;
        const { stateInfo, getParamsValue, paramsInfo, DGIMN, currentPointData, CEMSOpen, QCStatus, valveStatus, CO2Rate, CO2SampleGasValue, O2SampleGasValue, wrapperStyle, vertical, scale } = this.props;

        let isFlowsData = paramsInfo.filter(item => item.pollutantCode.indexOf('_') > -1);

        return (
            <div className={styles.mapClass} style={wrapperStyle}>
                <MapInteractionCSS
                    style={{ position: 'relative', background: 'red' }}
                    // scale={scale}
                    // translation={translation}
                    // onChange={({ scale, translation }) => this.setState({ scale, translation })}
                    defaultScale={scale ? scale : 1}
                // defaultTranslation={{ x: 0, y: 0 }}
                // minScale={0.05}
                // maxScale={5}
                // showControjsls={true}
                >

                    {/* transform: translateX(-40%) translateY(0%) rotate(90deg);
                    position: relative;
                    top: 50%;
                    left: 50%; */}
                    {/* <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translateX(-50%) translateY(-50%)' }}> */}
                    <div className={`${styles.imgBg} ${vertical ? styles.vertical : ''}`} >
                        {
                            // 状态: 空闲、维护，并且不运转时显示
                            ((QCStatus == 0 || QCStatus == 2) && CEMSOpen != 0 && CEMSOpen != 1) &&
                            // false &&
                            <>
                                <div className={`${styles.line} ${styles.line1}`}></div>
                                <img src="/realtimeData/valveOpen.jpg" className={styles.valve} />
                                <img src="/realtimeData/valveOpen.jpg" className={styles.valve} style={{ left: 899 }} />
                                {/* <div className={`${styles.line}`} style={{ backgroundImage: 'url(/realtimeData/line/QC1.png)' }}></div>
                                    <div className={`${styles.line}`} style={{ backgroundImage: 'url(/realtimeData/line/XT2.png)' }}></div> */}
                            </>
                        }
                        {
                            // 气瓶1全程
                            CEMSOpen == 0 && valveStatus.first &&
                            <>
                                <img src="/realtimeData/valveOpen.jpg" className={styles.valve} />
                                <img src="/realtimeData/valveOpen.jpg" className={styles.valve} style={{ left: 899 }} />
                                <div className={`${styles.line} ${styles['QC1']}`}></div>
                            </>
                        }
                        {
                            // 气瓶1系统
                            CEMSOpen == 1 && valveStatus.first &&
                            <>
                                <img src="/realtimeData/valveOpen.jpg" className={styles.valve} style={{ left: 899 }} />
                                <img src="/realtimeData/valveOpen2.jpg" className={styles.valve2} />
                                <div className={`${styles.line} ${styles['XT1']}`}></div>
                            </>
                        }
                        {
                            // 气瓶2系统
                            CEMSOpen == 1 && (valveStatus.second || valveStatus.purge) &&
                            <>
                                <img src="/realtimeData/valveOpen.jpg" className={styles.valve} style={{ left: 899 }} />
                                <img src="/realtimeData/valveOpen2.jpg" className={styles.valve2} />
                                <div className={`${styles.line} ${styles['XT2']}`}></div>
                            </>
                        }
                        {
                            // 气瓶2全程
                            CEMSOpen == 0 && (valveStatus.second || valveStatus.purge) &&
                            <>
                                <img src="/realtimeData/valveOpen.jpg" className={styles.valve} />
                                <img src="/realtimeData/valveOpen.jpg" className={styles.valve} style={{ left: 899 }} />
                                <div className={`${styles.line} ${styles['QC2']}`}></div>
                            </>
                        }

                        {/* <Popover content={this.SystemParameters('i13010,i13011,i13012')} title="系统采样探头"> */}
                        {/* <Popover content={this.SystemParameters('i33003')} title="系统采样探头"> */}
                        <div style={{
                            position: 'absolute', left: '244px',
                            top: '506px', fontWeight: '700', width: 80, lineHeight: '36px', zIndex: 1, textAlign: 'center'
                        }} className={styles.divClick}>{getParamsValue('i33003')}</div>
                        {/* </Popover> */}
                        {/* <Popover content={this.SystemParameters('i33001')} title="系统采样管线"> */}
                        <div style={{
                            position: 'absolute', left: 377,
                            top: '486px', fontWeight: '700', width: 114, height: 22, zIndex: 1, textAlign: 'right'
                        }}
                            className={styles.divClick}>{getParamsValue('i33001')}</div>
                        {/* </Popover> */}

                        {/* <Popover content={this.SystemParameters('i33002')} title="冷凝器"> */}
                        <div
                            style={{
                                position: 'absolute', left: 755,
                                top: 480, fontWeight: '700', fontSize: '10px', width: 96, height: 50, zIndex: 1, textAlign: 'center'
                            }}
                            className={styles.divClick}>{getParamsValue('i33002')}</div>
                        {/* </Popover> */}
                        {/* <Popover content={this.SystemParameters('i33002')} title="冷凝器"> */}
                        <div
                            style={{
                                position: 'absolute', left: 987,
                                top: 480, fontWeight: '700', fontSize: '10px', width: 96, height: 50, zIndex: 1, textAlign: 'center'
                            }}
                            className={styles.divClick}>{getParamsValue('i33002')}</div>
                        {/* </Popover> */}
                        <div style={{
                            position: 'absolute', left: 704,
                            top: 0, fontWeight: '700', fontSize: 30, width: 218, height: 110, zIndex: 1
                        }} className={styles.divClick}>系统流程</div>

                        <div style={{
                            position: 'absolute', left: 704,
                            top: 222, fontWeight: '500', fontSize: 24, width: 218, zIndex: 1, color: '#fff', padding: '0 20px'
                        }} className={styles.divClick}>
                            CO₂排放速率：
                            <p style={{ paddingLeft: 20 }}>{CO2Rate} kg/h</p>
                        </div>
                        <div style={{
                            position: 'absolute', left: 234,
                            top: 358, fontWeight: '700', fontSize: 14, width: 90, height: 30, zIndex: 1, textAlign: 'left'
                        }} className={styles.divClick}>{getParamsValue('', 'a01012')}</div>
                        <div style={{
                            position: 'absolute', left: 306,
                            top: 358, fontWeight: '700', fontSize: 14, width: 90, height: 30, zIndex: 1, textAlign: 'center'
                        }} className={styles.divClick}>{getParamsValue('', 'a01013')}</div>
                        {/* <Popover content={this.SystemParameters('', 'a01011')} title="流速"> */}
                        <div style={{
                            position: 'absolute', left: 414,
                            top: 358, fontWeight: '700', fontSize: 14, width: 74, height: 30, zIndex: 1, textAlign: 'center'
                        }}
                            onTouchStart={() => {
                                this.showModal()
                            }}
                            onClick={() => { this.showModal() }}
                            className={styles.divClick}
                        >
                            {getParamsValue('', 'a01011')}
                        </div>
                        {/* </Popover> */}
                        {/* <Popover content={this.SystemParameters('', 'a05001')} title="二氧化碳"> */}
                        <div style={{
                            position: 'absolute', left: 1255,
                            top: 496, fontWeight: '700', fontSize: '16px', width: 150, lineHeight: '36px', zIndex: 1, color: '#fff', textAlign: 'center'
                        }} className={styles.divClick}>
                            <span style={{ fontSize: 20 }}>CO₂：</span>
                            {getParamsValue('', 'a05001')}
                        </div>
                        {/* </Popover> */}
                        {/* <Popover content={this.SystemParameters('', 'a19001')} title="氧气"> */}
                        <div style={{
                            position: 'absolute', left: 1255,
                            top: 533, fontWeight: '700', fontSize: '16px', width: 150, lineHeight: '36px', zIndex: 1, color: '#fff', textAlign: 'center'
                        }} className={styles.divClick}>
                            <span style={{ fontSize: 20 }}>O₂：</span>
                            {getParamsValue('', 'a19001')}
                        </div>
                        {/* </Popover> */}
                        <div style={{
                            position: 'absolute', left: 934,
                            top: 670, fontWeight: '500',
                            fontSize: '16px', width: 200, height: '100px',
                            zIndex: 1, color: '#fff', background: '#70a4f2', padding: 10,
                            display: 'flex', justifyContent: 'space-around', flexDirection: 'column', borderRadius: 10
                        }} className={styles.divClick}>
                            <span>CO₂ 标气浓度：{QCStatus == 1 ? CO2SampleGasValue : '-'} {QCStatus == 1 ? (CO2SampleGasValue !== '暂无' ? '%' : '') : ''}</span>
                            <span>O₂ 标气浓度：{QCStatus == 1 ? O2SampleGasValue : '-'} {QCStatus == 1 ? (CO2SampleGasValue !== '暂无' ? '%' : '') : ''}</span>
                        </div>
                        <div style={{
                            position: 'absolute', left: 42,
                            top: 104, fontWeight: '700', fontSize: '10px', width: 125, height: 750, zIndex: 1
                        }} className={styles.divClick}

                        ></div>
                    </div>
                    {/* </div> */}
                </MapInteractionCSS>
                {
                    (visible && currentPointData.FlowMeterType == 2) && <FLowMapModal visible={visible} DGIMN={DGIMN} onCancel={() => {
                        this.setState({ visible: false })
                    }} />
                }
            </div>
        );
    }
}

export default CO2Chart;
