/*
 * @Author: JiaQi 
 * @Date: 2023-02-08 11:34:48 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-02-23 16:57:22
 * @Description: 二氧化碳工艺流程图
 */

import React, { Component } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import styles from './ProcessFlowChart.less';
import { Card, Descriptions, Popover, Tabs, Modal, Spin, Table, Empty } from 'antd';
import { load_data } from '../_util'
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable';

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

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.props.paramsInfo) !== JSON.stringify(prevProps.paramsInfo) && this.state.visible === true) {
            this.renderCanvas(false);
        }

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


    GetRandomNum = (Min, Max) => {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    // 渲染canvas
    renderCanvas = (isShowModal) => {
        // this.setState({
        // }, () => {
        const { paramsInfo } = this.props;
        let flows = paramsInfo.filter(item => item.pollutantCode.indexOf('_') > -1);
        console.log('flows', flows)
        //生成数据
        let points = []

        let max_x = 4
        let x_grid_len = 1103
        let max_y = 6
        let y_grid_len = 1044
        let count = 0;
        if (flows.length) {
            for (var i = 0; i < max_x; i++) {
                for (var j = 0; j < max_y; j++) {
                    console.log('i', i)
                    console.log('j', j)
                    points.push({
                        "x": i * x_grid_len + x_grid_len / 2,
                        "y": j * y_grid_len + y_grid_len / 2,
                        // "value": flows[i + 1 * 6 - j].value
                        "value": flows[i * 6 + j].value
                    });
                }
            }
            console.log('points', points);
            load_data(points, () => {
                setTimeout(() => {
                    this.setState({
                        modalLoading: false
                    })
                }, 0)
            });
        } else {
            setTimeout(() => {
                this.setState({
                    modalLoading: false
                })
            }, 0)
        }
    }


    renderFlows = (data) => {
        const { paramstatusInfo, paramsInfo } = this.props;
        //流速
        let flows = paramsInfo.filter(item => item.pollutantCode.indexOf('_') > -1);
        debugger
        let max_x = 6
        let max_y = 8
        let dataSource = [];
        if (flows.length) {
            dataSource = [
                {},
                {},
                {},
                {},
                {},
                {},
            ];
            for (var i = 1; i < max_x - 1; i++) {
                for (var j = 1; j < max_y - 1; j++) {
                    let value = flows.find(item => item.pollutantName === `流速${i}-${j}`).value;
                    dataSource[j - 1]['flow' + i] = value
                }
            }
        }

        return <Table bordered pagination={false} dataSource={dataSource} columns={columns} />;
    }

    showModal = () => {
        // onClick={() => {
        this.setState({
            visible: true,
            modalLoading: true,
        }, () => {
            setTimeout(() => {
                this.renderCanvas()
            }, 500)
        })
    }


    render() {
        const { translation, modalLoading } = this.state;
        const { stateInfo, getParamsValue, paramsInfo, CEMSOpen, QCStatus, valveStatus, CO2Rate, CO2SampleGasValue, O2SampleGasValue, wrapperStyle, vertical, scale } = this.props;
        console.log('props', this.props)

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
                <Modal
                    title="查看烟道流场分布图及流速详情"
                    width={'636px'}
                    visible={this.state.visible}
                    bodyStyle={{ padding: '0 20px 10px', height: 784, width: 636, overflow: 'auto' }}
                    footer={false}
                    wrapClassName={styles.myModal}
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                >
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="烟道流场分布图" key="1">
                            <Spin spinning={modalLoading}>
                                <div style={{
                                    margin: '30px 60px', position: 'relative', width: 550,
                                    height: 690
                                }}>
                                    {
                                        isFlowsData.length ? <>
                                            <canvas id="canvas_chart"></canvas>
                                            <canvas id="canvas_x"></canvas>
                                            <canvas id="canvas_y"></canvas>
                                            <canvas id="canvas_lengend" className={styles.canvas_lengend}></canvas>
                                            <div style={{ position: 'absolute', top: -28, left: -45, color: '#666666', fontWeight: 'bold', fontSize: 16 }}>z（m）</div>
                                            <div style={{ position: 'absolute', bottom: 8, left: 428, color: '#666666', fontWeight: 'bold', fontSize: 16 }}>x（m）</div>
                                            <div style={{ position: 'absolute', top: -30, left: 210, color: '#666666', fontWeight: 'bold', fontSize: 18 }}>
                                                流速（m/s）
                                            </div>
                                        </> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    }

                                </div>
                            </Spin>
                        </TabPane>
                        <TabPane tab="流速数据" key="2">
                            {this.renderFlows()}
                        </TabPane>
                    </Tabs>

                </Modal>
            </div>
        );
    }
}

export default CO2Chart;
