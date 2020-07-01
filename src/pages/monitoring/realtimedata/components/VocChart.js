/*
 * @Author: lzp
 * @Date: 2019-09-05 10:57:14
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 14:22:52
 * @Description: VOC工艺流程图
 */
import React, { Component } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';
import styles from './ProcessFlowChart.less';
import { Card, Descriptions, Popover, Badge, Avatar } from 'antd';
class VocChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1,
            translation: { x: 0, y: 0 }
        };
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
    render() {
        const { scale, translation } = this.state;
        const { stateInfo } = this.props;
        return (
            <div>
                <div className={styles.stateClass}>{this.getSystemStates()}</div>
                <Descriptions className={styles.CardDataClass} bordered column={4}>
                    {/* 颗粒物、温度、压力、流速、VOC、非甲烷总烃 */}
                    {this.pollutantMonitingData('01,s03,s08,s02,m005,a24088')}
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
                        <div className={styles.imgBg2} >
                            <Popover content={this.SystemParameters('i13010,i13011,i13012')} title="系统采样探头">
                                <div style={{
                                    position: 'relative', left: '127px',
                                    top: '522px', fontWeight: '700', fontSize: '10px', width: 15, height: 15, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13033')} title="系统采样管线">
                                <div style={{
                                    position: 'relative', left: '270px',
                                    top: '504px', fontWeight: '700', fontSize: '10px', width: 190, height: 25, zIndex: 1
                                }}
                                    className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13014')} title="采样泵">
                                <div style={{
                                    position: 'relative', left: '870px',
                                    top: '468px', fontWeight: '700', fontSize: '10px', width: 108, height: 52, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i33002')} title="冷凝器">
                                <div
                                    style={{
                                        position: 'relative', left: '992px',
                                        top: '241px', fontWeight: '700', fontSize: '10px', width: 142, height: 51, zIndex: 1
                                    }}
                                    className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13018')} title="电磁阀">
                                <div style={{
                                    position: 'relative', left: '1237px',
                                    top: '374px', fontWeight: '700', fontSize: '10px', width: 35, height: 35, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13017')} title="钢瓶">
                                <div
                                    style={{
                                        position: 'relative', left: '495px',
                                        top: '578px', fontWeight: '700', fontSize: '10px', width: 45, height: 66, zIndex: 1
                                    }}
                                    className={`${styles.divClick} ${styles.caiyangbeng1}`}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13016')} title="蠕动泵">
                                <div style={{
                                    position: 'relative', left: '804px',
                                    top: '273px', fontWeight: '700', fontSize: '10px', width: 35, height: 35, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13013')} title="过滤器">
                                <div style={{
                                    position: 'relative', left: '665px',
                                    top: '229px', fontWeight: '700', fontSize: '10px', width: 109, height: 52, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13013')} title="过滤器">
                                <div style={{
                                    position: 'relative', left: '1024px',
                                    top: '177px', fontWeight: '700', fontSize: '10px', width: 109, height: 52, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i13015')} title="制冷温度预设">
                                <div style={{
                                    position: 'relative', left: '1363px',
                                    top: '372px', fontWeight: '700', fontSize: '10px', width: 65, height: 65, zIndex: 1, borderRadius: '50%'
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('i33101,i23001')} title="现场条件">
                                <div style={{
                                    position: 'relative', left: '713px',
                                    top: '-241px', fontWeight: '700', fontSize: '10px', width: 118, height: 100, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>


                            <Popover content={this.SystemParameters('', 's03')} title="温度">
                                <div style={{
                                    position: 'relative', left: '160px',
                                    top: '-239px', fontWeight: '700', fontSize: '10px', width: 55, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', 's08')} title="压力">
                                <div style={{
                                    position: 'relative', left: '216px',
                                    top: '-294px', fontWeight: '700', fontSize: '10px', width: 55, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', 's02')} title="流速">
                                <div style={{
                                    position: 'relative', left: '272px',
                                    top: '-349px', fontWeight: '700', fontSize: '10px', width: 55, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', '01')} title="颗粒物">
                                <div style={{
                                    position: 'relative', left: '160px',
                                    top: '-325px', fontWeight: '700', fontSize: '10px', width: 170, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', 'm005')} title="VOC">
                                <div style={{
                                    position: 'relative', left: '1304px',
                                    top: '-261px', fontWeight: '700', fontSize: '10px', width: 70, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                            <Popover content={this.SystemParameters('', 'a24088')} title="非甲烷总烃">
                                <div style={{
                                    position: 'relative', left: '1374px',
                                    top: '-316px', fontWeight: '700', fontSize: '10px', width: 96, height: 55, zIndex: 1
                                }} className={styles.divClick}></div>
                            </Popover>
                        </div>
                    </MapInteractionCSS>
                </div>
            </div >
        );
    }
}

export default VocChart;