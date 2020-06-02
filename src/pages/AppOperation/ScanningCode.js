import { Card, WhiteSpace, DatePicker, Grid, Steps, WingBlank, Badge } from 'antd-mobile';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Icon,
} from 'antd';
const data = Array.from(new Array(5)).map((_val, i) => ({
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
    text: `name${i}`,
}));
const Step = Steps.Step;
@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetOperationLogList'],
    operationLogList: task.operationLogList,
    operationRzWhere: task.operationRzWhere,
}))

/*
页面：扫码查运维页面
*/
class ScanningCode extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidMount() {
        this.onChange();
    }

    onChange = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'task/updateState',
            payload: {
                operationRzWhere: {
                    ...this.props.operationRzWhere,
                    ...{
                        DGIMN: '0000001',
                    }
                },
            }
        });

        dispatch({
            type: 'task/GetOperationLogList',
            payload: {
            },
        });
    }

    render() {
        return (
            <div style={{ height: '100vh' }}>
                <Card full style={{ height: 160 }}>
                    <Card.Header
                        title={
                            <span>
                                <span>
                                    工单情况
                                </span>
                                <span style={{ marginLeft: 10 }}>
                                    <Icon style={{ fontSize: 15 }} type="exclamation-circle" theme="twoTone" />
                                </span>
                            </span>
                        }
                        extra={
                            <DatePicker
                                mode="date"
                                title="Select Date"
                                extra="Optional"
                                value={this.state.date}
                                onChange={date => this.setState({ date })}
                            >
                                <span style={{ fontSize: 15 }}>2020-03</span>
                            </DatePicker>
                        }
                    />
                    <Card.Body>
                        <Grid columnNum={5} data={data} hasLine={false} />
                    </Card.Body>
                    {/* <Card.Footer content="footer content" extra={<div>extra footer content</div>} /> */}
                </Card>
                <WhiteSpace />
                <Card full style={{ height: 'calc(100vh - 160px)', overflow: 'scroll', borderWidth: 0 }}>
                    <Card.Body>
                        <WingBlank size="lg">
                            <WhiteSpace />
                            <Steps size="small">
                                <Step
                                    icon={
                                        <div style={{ fontSize: 12, color: 'black', width: 60, textAlign: 'left', marginLeft: -6 }}>03-06</div>
                                    }
                                />
                                <Step title={
                                    <div style={{ fontSize: 15, marginLeft: 10 }}>
                                        <span>巡检巡检</span>
                                    </div>
                                }
                                    icon={
                                        <div style={{ width: 20 }}>
                                            <div style={{
                                                width: 12,
                                                height: 12,
                                                backgroundColor: '#1890FF',
                                                borderRadius: '50%',
                                                position: 'relative',
                                                margin: 'auto'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    width: 4,
                                                    height: 4,
                                                    backgroundColor: '#fff',
                                                    borderRadius: '50%',
                                                    top: 4,
                                                    left: 4,
                                                }}></div>
                                            </div>
                                        </div>
                                    }
                                    description={
                                        <div style={{ fontSize: 12, marginTop: 15, marginBottom: 15, marginLeft: 10 }}>
                                            <span>运维人：卢彩容</span>
                                            <span style={{ marginLeft: '4.5%' }}>执行时间：09:20</span>
                                            <span style={{ marginLeft: '4.5%' }}>更多</span>
                                        </div>
                                    } />
                                <Step title={
                                    <div style={{ fontSize: 15, marginLeft: 10 }}>
                                        <span>巡检巡检</span>
                                    </div>
                                }
                                    icon={
                                        <div style={{ width: 20 }}>
                                            <div style={{
                                                width: 12,
                                                height: 12,
                                                backgroundColor: '#1890FF',
                                                borderRadius: '50%',
                                                position: 'relative',
                                                margin: 'auto'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    width: 4,
                                                    height: 4,
                                                    backgroundColor: '#fff',
                                                    borderRadius: '50%',
                                                    top: 4,
                                                    left: 4,
                                                }}></div>
                                            </div>
                                        </div>
                                    }
                                    description={
                                        <div style={{ fontSize: 12, marginTop: 15, marginBottom: 15, marginLeft: 10 }}>
                                            <span>运维人：卢彩容</span>
                                            <span style={{ marginLeft: '4.5%' }}>执行时间：09:20</span>
                                            <span style={{ marginLeft: '4.5%' }}>更多</span>
                                        </div>
                                    } />
                                <Step title={
                                    <div style={{ fontSize: 15, marginLeft: 10 }}>
                                        <span>巡检巡检</span>
                                    </div>
                                }
                                    icon={
                                        <div style={{ width: 20 }}>
                                            <div style={{
                                                width: 12,
                                                height: 12,
                                                backgroundColor: '#1890FF',
                                                borderRadius: '50%',
                                                position: 'relative',
                                                margin: 'auto'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    width: 4,
                                                    height: 4,
                                                    backgroundColor: '#fff',
                                                    borderRadius: '50%',
                                                    top: 4,
                                                    left: 4,
                                                }}></div>
                                            </div>
                                        </div>
                                    }
                                    description={
                                        <div style={{ fontSize: 12, marginTop: 15, marginBottom: 15, marginLeft: 10 }}>
                                            <span>运维人：卢彩容</span>
                                            <span style={{ marginLeft: '4.5%' }}>执行时间：09:20</span>
                                            <span style={{ marginLeft: '4.5%' }}>更多</span>
                                        </div>
                                    } />
                                <WhiteSpace />

                                <Step
                                    icon={
                                        <div style={{ fontSize: 12, color: 'black', width: 60, textAlign: 'left', marginLeft: -6 }}>03-06</div>
                                    }
                                />
                                <Step title={
                                    <div style={{ fontSize: 15, marginLeft: 10 }}>
                                        <span>巡检</span>
                                    </div>
                                }
                                    icon={
                                        <div style={{ width: 20 }}>
                                            <div style={{
                                                width: 12,
                                                height: 12,
                                                backgroundColor: '#1890FF',
                                                borderRadius: '50%',
                                                position: 'relative',
                                                margin: 'auto'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    width: 4,
                                                    height: 4,
                                                    backgroundColor: '#fff',
                                                    borderRadius: '50%',
                                                    top: 4,
                                                    left: 4,
                                                }}></div>
                                            </div>
                                        </div>
                                    }
                                    description={
                                        <div style={{ fontSize: 12, marginTop: 15, marginBottom: 15, marginLeft: 10 }}>
                                            <span>运维人：卢彩容</span>
                                            <span style={{ marginLeft: '4.5%' }}>执行时间：09:20</span>
                                            <span style={{ marginLeft: '4.5%' }}>更多</span>
                                        </div>
                                    } />
                                <Step title={
                                    <div style={{ fontSize: 15, marginLeft: 10 }}>
                                        <span>巡检</span>
                                    </div>
                                }
                                    icon={
                                        <div style={{ width: 20 }}>
                                            <div style={{
                                                width: 12,
                                                height: 12,
                                                backgroundColor: '#1890FF',
                                                borderRadius: '50%',
                                                position: 'relative',
                                                margin: 'auto'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    width: 4,
                                                    height: 4,
                                                    backgroundColor: '#fff',
                                                    borderRadius: '50%',
                                                    top: 4,
                                                    left: 4,
                                                }}></div>
                                            </div>
                                        </div>
                                    }
                                    description={
                                        <div style={{ fontSize: 12, marginTop: 15, marginBottom: 15, marginLeft: 10 }}>
                                            <span>运维人：卢彩容</span>
                                            <span style={{ marginLeft: '4.5%' }}>执行时间：09:20</span>
                                            <span style={{ marginLeft: '4.5%' }}>更多</span>
                                        </div>
                                    } />
                            </Steps>

                        </WingBlank>
                    </Card.Body>

                </Card>

            </div>
        );
    }
}

export default ScanningCode;
