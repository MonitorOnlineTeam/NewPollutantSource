/**
 * 功  能：报警推送关联组件
 * 创建人：wjw
 * 修改人：-
 * 创建时间：2019.10.21
 */
import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    Icon,
    Card,
    Spin,
    Row,
    Col,
    Table,
    Modal,
    Checkbox,
    TreeSelect,
    message,
    Divider,
    Popconfirm,
    Tooltip,
    Transfer, Switch, Tag, Select, Pagination, Empty,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
const { Search } = Input;
const FormItem = Form.Item;

@connect(({ loading, user }) => ({

    loadingGetData: loading.effects['user/getAlarmPushAuthor'],
    loadingInsertData: loading.effects['user/insertAlarmPushAuthor'],
    alarmPushParam: user.alarmPushParam,
    alarmPushData: user.alarmPushData
}))

@Form.create()
class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentData: [],
            checkedYC: false,
            checkedCB: false,
            checkedYJ: false
        };
    }

    /** 初始化加载 */
    componentDidMount() {
        const { dispatch, alarmPushParam, FlagType, RoleIdOrDepId } = this.props;

        dispatch({
            type: 'user/updateState',
            payload: {
                alarmPushParam: {
                    ...alarmPushParam,
                    pageSize: 12,
                    pageIndex: 1,
                    searchContent: "",
                    flagType: FlagType,
                    authorId: RoleIdOrDepId
                }
            }
        });

        dispatch({
            type: 'user/getAlarmPushAuthor',
            payload: {}
        })
    }


    componentWillReceiveProps(nextProps) {

        if (this.props.alarmPushData != nextProps.alarmPushData) {
            this.setState({
                currentData: nextProps.alarmPushData
            }, () => {
                //this.getdata(this.state.type);
            });
        }
    }
    //单个卡片复选框切换
    onChangeDGINM = (e) => {
        //console.log("e=", e);
        let { currentData } = this.state;
        const target = e.target;

        currentData.map((item, index) => {
            if (item.DGIMN === target.DGIMN) {
                //debugger
                if (item.AlarmTypes) {
                    let array = item.AlarmTypes.split(',');
                    let ind = array.indexOf(target.AlarmTypes);
                    if (ind !== -1) {
                        !target.checked && array.splice(ind, 1);
                        item.AlarmTypes = array.toString();
                    } else {
                        target.checked && array.push(target.AlarmTypes);
                        item.AlarmTypes = array.toString();
                    }

                } else {
                    item.AlarmTypes = target.checked ? target.AlarmTypes : "";
                }
            }
            return item;
        })
        this.setState({ currentData: currentData });

        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false });
        //console.log('currentData=', currentData);
    }
    //保存数据
    saveData = () => {
        let { RoleIdOrDepId, FlagType } = this.props;
        let { currentData } = this.state;
        let data = [];
        currentData.map((item, index) => {

            data.push({
                RoleIdOrDepId: RoleIdOrDepId,
                FlagType: FlagType,
                DGIMN: item.DGIMN,
                AlarmType: item.AlarmTypes,
            });

        });
        //console.log("data=", data);

        this.props.dispatch({
            type: 'user/insertAlarmPushAuthor',
            payload: data
        });
        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false });
    }
    //分页
    onChangePagination = (pageIndex, pageSize) => {

        const { dispatch, alarmPushParam } = this.props;

        dispatch({
            type: 'user/updateState',
            payload: {
                alarmPushParam: {
                    ...alarmPushParam,
                    pageSize: pageSize,
                    pageIndex: pageIndex
                }
            }
        });

        dispatch({
            type: 'user/getAlarmPushAuthor',
            payload: {}
        })

        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false });
    }
    //显示条数
    onShowSizeChange = (pageIndex, pageSize) => {
        // debugger
        const { dispatch, alarmPushParam } = this.props;

        dispatch({
            type: 'user/updateState',
            payload: {
                alarmPushParam: {
                    ...alarmPushParam,
                    pageSize: pageSize,
                    pageIndex: pageIndex
                }
            }
        });
        dispatch({
            type: 'user/getAlarmPushAuthor',
            payload: {}
        });
        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false });
    }
    //搜索
    onSearch = (e) => {
        //debugger //searchContent
        const { dispatch, alarmPushParam } = this.props;

        //if (e !== alarmPushParam.searchContent) {
        dispatch({
            type: 'user/updateState',
            payload: {
                alarmPushParam: {
                    ...alarmPushParam,
                    pageSize: 12,
                    pageIndex: 1,
                    searchContent: e
                }
            }
        });
        dispatch({
            type: 'user/getAlarmPushAuthor',
            payload: {}
        })
        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false });
        // }
    }
    //重置
    onReset = () => {
        this.onSearch('');

        //this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false });
    }
    //快捷复选
    changeCheckboxGroup = (e) => {

        let { currentData } = this.state;
        const target = e.target;

        currentData.map((item, index) => {

            if (item.AlarmTypes) {
                let array = item.AlarmTypes.split(',');
                let ind = array.indexOf(target.AlarmTypes);
                if (ind !== -1) {
                    !target.checked && array.splice(ind, 1);
                    item.AlarmTypes = array.toString();
                } else {
                    target.checked && array.push(target.AlarmTypes);
                    item.AlarmTypes = array.toString();
                }

            } else {
                item.AlarmTypes = target.checked ? target.AlarmTypes : "";
            }
            return item;
        });

        if (target.AlarmTypes === '1') {
            this.setState({ checkedYC: target.checked });
        } else if (target.AlarmTypes === '2') {
            this.setState({ checkedCB: target.checked });
        } else if (target.AlarmTypes === '5') {
            this.setState({ checkedYJ: target.checked });
        }

        this.setState({ currentData: currentData });
    }
    render() {
        const { alarmPushData, alarmPushParam: { pageIndex, pageSize, total }, loadingGetData, loadingInsertData } = this.props;
        const { currentData, checkedYC, checkedCB, checkedYJ } = this.state;

        return (
            <div>
                <div>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Card >
                                <p>
                                    <Search
                                        placeholder="输入字符模糊搜索"
                                        onSearch={value => this.onSearch(value)}
                                        style={{ width: 300 }}
                                    />
                                    {/* <Button style={{ marginLeft: 10 }} type="primary">关联</Button> */}
                                    {/* <Checkbox.Group style={{ marginLeft: 10 }} options={['异常', '超标', '预警']} onChange={this.changeCheckboxGroup} /> */}

                                    <Checkbox style={{ marginLeft: 10 }}
                                        AlarmTypes={'1'}
                                        checked={checkedYC}
                                        onChange={this.changeCheckboxGroup}
                                    >异常</Checkbox>
                                    <Checkbox
                                        AlarmTypes={'2'}
                                        checked={checkedCB}
                                        onChange={this.changeCheckboxGroup}
                                    >超标</Checkbox>
                                    <Checkbox
                                        AlarmTypes={'5'}
                                        checked={checkedYJ}
                                        onChange={this.changeCheckboxGroup}
                                    >预警</Checkbox>

                                    <Button type="primary" onClick={this.onReset}>重置</Button>
                                </p>
                            </Card>
                        </Col>
                    </Row>

                </div>

                <div style={{ background: '#ECECEC', padding: 15, overflow: 'auto', overflowY: 'scorll', minHeight: 350, height: 480 }}>
                    <Row gutter={16}>
                        {
                            loadingGetData ? <Spin
                                style={{
                                    width: '100%',
                                    height: 'calc(100vh/2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                size="large"
                            /> : (alarmPushData != null && alarmPushData.length > 0) ? alarmPushData.map((item, index) => {
                                return <Col span={6}>
                                    <Card title={
                                        <span style={{ fontSize: 14 }}>{item.TargetName}</span>
                                    }
                                        style={{ marginBottom: 10 }} bordered={false} actions={[
                                            <>
                                                <Checkbox
                                                    DGIMN={item.DGIMN}
                                                    AlarmTypes={'1'}
                                                    checked={currentData.filter(m => m.DGIMN === item.DGIMN && (m.AlarmTypes && m.AlarmTypes.indexOf('1') > -1)).length > 0}
                                                    onChange={this.onChangeDGINM}
                                                >异常</Checkbox>
                                                <Checkbox
                                                    DGIMN={item.DGIMN}
                                                    AlarmTypes={'2'}
                                                    checked={currentData.filter(m => m.DGIMN === item.DGIMN && (m.AlarmTypes && m.AlarmTypes.indexOf('2') > -1)).length > 0}
                                                    onChange={this.onChangeDGINM}
                                                >超标</Checkbox>
                                                <Checkbox
                                                    DGIMN={item.DGIMN}
                                                    AlarmTypes={'5'}
                                                    checked={currentData.filter(m => m.DGIMN === item.DGIMN && (m.AlarmTypes && m.AlarmTypes.indexOf('5') > -1)).length > 0}
                                                    onChange={this.onChangeDGINM}
                                                >预警</Checkbox>

                                                {/* <Checkbox.Group options={['异常', '超标', '预警']} defaultValue={['异常']} onChange={this.onChangeDGINM} data-d={item.DGIMN} /> */}
                                            </>
                                        ]}>
                                        <div style={{ height: 50 }}>
                                            <p style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 3 }}>{`${item.PointName}`}</p>
                                            <p style={{ color: '#b9cdce' }}>{item.DGIMN}</p>
                                        </div>

                                        {/* <p style={{ color: '#b9cdce' }}>出口</p> */}
                                    </Card>
                                </Col>
                            }) : <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                    </Row>
                </div >
                <div style={{ textAlign: 'center', marginTop: 15 }}>
                    <Pagination
                        size="small"
                        total={50}
                        showSizeChanger
                        showQuickJumper
                        total={total}
                        pageSize={pageSize}
                        current={pageIndex}
                        onChange={this.onChangePagination}
                        onShowSizeChange={this.onShowSizeChange}
                        pageSizeOptions={['12', '16', '20', '24', '28']}
                    />
                </div>
                <Divider></Divider>
                <div style={{ textAlign: 'right' }}>
                    <Button type="default" style={{ marginRight: 5 }} onClick={this.props.cancelModal && this.props.cancelModal}>取消</Button>
                    <Button type="primary" onClick={this.saveData} loading={loadingInsertData}>保存</Button>
                </div>
            </div >);
    }
}
export default Index;
