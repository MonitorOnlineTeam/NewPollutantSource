import React, { Component } from 'react';
import { Table, Radio, Card, TimePicker, Icon, Button, Spin, Popover, Badge, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PdPopconfirm from './PdPopconfirm';
import UrgentDispatch from './UrgentDispatch';

@connect(({ urgentdispatch, loading }) => ({
    operationUserInfo: urgentdispatch.operationUserInfo,
    existTask: urgentdispatch.existTask,
    loading: loading.effects['urgentdispatch/queryoperationInfo'],
    paloading: loading.effects['urgentdispatch/addtaskinfo'],
    superviseloading: loading.effects['urgentdispatch/queryurge'],
}))
class PdButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pdvisible: false
        };
    }


    componentDidMount() {
        const { DGIMN } = this.props;
        this.reloadData(DGIMN);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.DGIMN && this.props.DGIMN != nextProps.DGIMN) {
            this.reloadData(nextProps.DGIMN);
        }
    }
    //请求数据
    reloadData = (DGIMN) => {
        const { dispatch } = this.props;
        //获取监测点信息查询此排口目前存不存在未完成任务
        dispatch({
            type: 'urgentdispatch/queryoperationInfo',
            payload: {
                dgimn: DGIMN
            }
        });
    }
    //督办
    urge = () => {
        let { operationUserInfo, dispatch, DGIMN } = this.props;
        if (operationUserInfo) {
            dispatch({
                type: 'urgentdispatch/queryurge',
                payload: {
                    personId: operationUserInfo.operationUserID,
                    DGIMN: DGIMN
                }
            });
        }
    }

    //跳转到添加运维人员界面
    addoperationInfo = () => {
        const { DGIMN, dgimn, dispatch, viewtype, pollutantTypeCode } = this.props;

        if (!DGIMN) {
            DGIMN = dgimn;
        }
        dispatch(routerRedux.push(`/sysmanage/pointdetail/${DGIMN}/${pollutantTypeCode}/${viewtype}`));
    }

    //派单窗口关闭
    onCancel = () => {
        this.setState({
            pdvisible: false,
        });
    }

    pdshow = (id) => {
        if (id) {
            this.setState({
                pdvisible: true,
            });
        }
    }

    //判断是派单还是督办按钮
    getbutton = () => {
        let { operationUserInfo, existTask, superviseloading, paloading } = this.props;
        if (operationUserInfo) {
            //如果有任务是督办
            if (existTask) {
                return (
                    <PdPopconfirm operationUserID={operationUserInfo.operationUserID} addoperationInfo={() => this.addoperationInfo()} >
                        <Button
                            onClick={() => {
                                this.urge();
                            }}
                            style={{ width: 100, border: 'none', backgroundColor: 'rgb(74,210,187)' }}
                            type="primary"
                        >督办
                            </Button>
                    </PdPopconfirm>
                )
            }
            //没有任务是派单
            else {
                return (
                    <PdPopconfirm operationUserID={operationUserInfo.operationUserID} addoperationInfo={() => this.addoperationInfo()} >
                        <Button
                            onClick={() => this.pdshow(operationUserInfo.operationUserID)}
                            style={{ width: 100, border: 'none', backgroundColor: 'rgb(74,210,187)' }}
                            type="primary"
                        >派单
                              </Button>
                    </PdPopconfirm>
                )
            }
        }
    }

    render() {
        //如果没有值的话，会从后台加载数据
        const { operationUserInfo, viewType, paloading, pointName, DGIMN } = this.props;
        if (paloading) {
            return (<Spin
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            />);
        }

        return (<span>
            {this.getbutton()}
            {/* 派单窗口 */}
            <UrgentDispatch
                onCancel={this.onCancel}
                visible={this.state.pdvisible}
                operationUserID={operationUserInfo ? operationUserInfo.operationUserID : null}
                DGIMN={DGIMN}
                pointName={operationUserInfo ? operationUserInfo.pointName : null}
                operationUserName={operationUserInfo ? operationUserInfo.operationUserName : null}
                operationtel={operationUserInfo ? operationUserInfo.operationtel : null}
                reloadData={() => this.reloadData()}
            />
        </span>);
    }
}

export default PdButton;