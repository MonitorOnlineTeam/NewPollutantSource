/**
 * 功  能：报警推送关联组件
 * 创建人：wjw
 * 修改人：-
 * 创建时间：2019.10.21
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Input,
    Button,
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
    Transfer,
    Switch,
    Tag,
    Select,
    Pagination,
    Empty,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import SdlCascader from '../../pages/AutoFormManager/SdlCascader'

const { Search } = Input;
const FormItem = Form.Item;

@connect(({ loading, user, autoForm, report }) => ({
    loadingGetData: loading.effects['user/getAlarmPushAuthor'],
    loadingInsertData: loading.effects['user/insertAlarmPushAuthor'],
    loadingGetAlarmState: loading.effects['user/getAlarmState'],
    alarmPushParam: user.alarmPushParam,
    alarmPushData: user.alarmPushData,
    showAlarmState: user.showAlarmState,
    regionList: autoForm.regionList,
    enterpriseList: user.enterpriseList,
}))

@Form.create()
class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentData: [],
            checkedYC: false,
            checkedCB: false,
            checkedYJ: false,
            checkedCS: false,
            checkedXT: false
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
                    searchContent: '',
                    flagType: FlagType,
                    authorId: RoleIdOrDepId,
                    entCode: '',
                },
            },
        });

        dispatch({
            type: 'user/getAlarmPushAuthor',
            payload: {},
        })
        // 是否显示预警
        this.props.dispatch({
            type: 'user/getAlarmState',
            payload: {},
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.alarmPushData != nextProps.alarmPushData) {
            this.setState({
                currentData: nextProps.alarmPushData,
            }, () => {
                // this.getdata(this.state.type);
            });
        }
    }

    // 根据省市区获取企业
    getentbyrt = val => {
        if (val.length === 0) {
            const { dispatch, alarmPushParam } = this.props;
            dispatch({
                type: 'user/updateState',
                payload: {
                    alarmPushParam: {
                        ...alarmPushParam,
                        pageSize: 12,
                        pageIndex: 1,
                        entCode: '',
                    },
                },
            });
            dispatch({
                type: 'user/getAlarmPushAuthor',
                payload: {},
            })
            this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false, checkedCS: false, checkedXT: false });
        } else {
            this.props.dispatch({
                type: 'user/getEnterpriseList',
                payload: {
                    regionCode: val.toString(),
                    pollutantTypeCode: '',
                    callback: entcode => {
                        const { dispatch, alarmPushParam } = this.props;
                        dispatch({
                            type: 'user/updateState',
                            payload: {
                                alarmPushParam: {
                                    ...alarmPushParam,
                                    pageSize: 12,
                                    pageIndex: 1,
                                    entCode: entcode === '' ? '88888' : entcode,
                                },
                            },
                        });
                        dispatch({
                            type: 'user/getAlarmPushAuthor',
                            payload: {},
                        })
                        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false, checkedCS: false, checkedXT: false });
                    },
                },
            })
        }
    }

    // 单个卡片复选框切换
    onChangeDGINM = e => {
        // console.log("e=", e);
        const { currentData } = this.state;
        const { target } = e;

        currentData.map((item, index) => {
            if (item.DGIMN === target.DGIMN) {
                // debugger
                if (item.AlarmTypes) {
                    const array = item.AlarmTypes.split(',');
                    const ind = array.indexOf(target.AlarmTypes);
                    if (ind !== -1) {
                        !target.checked && array.splice(ind, 1);
                        item.AlarmTypes = array.toString();
                    } else {
                        target.checked && array.push(target.AlarmTypes);
                        item.AlarmTypes = array.toString();
                    }
                } else {
                    item.AlarmTypes = target.checked ? target.AlarmTypes : '';
                }
            }
            return item;
        })
        this.setState({ currentData });

        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false, checkedCS: false, checkedXT: false });
        // console.log('currentData=', currentData);
    }

    // 保存数据
    saveData = () => {
        const { RoleIdOrDepId, FlagType } = this.props;
        const { currentData } = this.state;
        const data = [];
        currentData.map((item, index) => {
            data.push({
                RoleIdOrDepId,
                FlagType,
                DGIMN: item.DGIMN,
                AlarmType: item.AlarmTypes,
            });
        });
        // console.log("data=", data);

        this.props.dispatch({
            type: 'user/insertAlarmPushAuthor',
            payload: data,
        });
        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false, checkedCS: false, checkedXT: false });
    }

    // 分页
    onChangePagination = (pageIndex, pageSize) => {
        const { dispatch, alarmPushParam } = this.props;

        dispatch({
            type: 'user/updateState',
            payload: {
                alarmPushParam: {
                    ...alarmPushParam,
                    pageSize,
                    pageIndex,
                },
            },
        });

        dispatch({
            type: 'user/getAlarmPushAuthor',
            payload: {},
        })

        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false, checkedCS: false, checkedXT: false });
    }

    // 显示条数
    onShowSizeChange = (pageIndex, pageSize) => {
        // debugger
        const { dispatch, alarmPushParam } = this.props;

        dispatch({
            type: 'user/updateState',
            payload: {
                alarmPushParam: {
                    ...alarmPushParam,
                    pageSize,
                    pageIndex,
                },
            },
        });
        dispatch({
            type: 'user/getAlarmPushAuthor',
            payload: {},
        });
        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false, checkedCS: false, checkedXT: false });
    }

    // 搜索
    onSearch = e => {
        // debugger //searchContent
        const { dispatch, alarmPushParam } = this.props;

        // if (e !== alarmPushParam.searchContent) {
        dispatch({
            type: 'user/updateState',
            payload: {
                alarmPushParam: {
                    ...alarmPushParam,
                    pageSize: 12,
                    pageIndex: 1,
                    searchContent: e,
                },
            },
        });
        dispatch({
            type: 'user/getAlarmPushAuthor',
            payload: {},
        })
        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false, checkedCS: false, checkedXT: false });
        // }
    }

    // 重置
    onReset = () => {
        this.onSearch('');

        // this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false });
    }

    // 快捷复选
    changeCheckboxGroup = e => {
        const { currentData } = this.state;
        const { target } = e;

        currentData.map((item, index) => {
            if (item.AlarmTypes) {
                const array = item.AlarmTypes.split(',');
                const isIncludes = array.includes(target.AlarmTypes);
                const ind = array.findIndex(i => i == target.AlarmTypes);
                if (isIncludes) {
                    !target.checked && array.splice(ind, 1);
                    item.AlarmTypes = array.toString();
                } else {
                    target.checked && array.push(target.AlarmTypes);
                    item.AlarmTypes = array.toString();
                }
            } else {
                item.AlarmTypes = target.checked ? target.AlarmTypes : '';
            }
            return item;
        });
        if (target.AlarmTypes === '0') {
            this.setState({ checkedYC: target.checked });
        } else if (target.AlarmTypes === '2') {
            this.setState({ checkedCB: target.checked });
        } else if (target.AlarmTypes === '12') {
            this.setState({ checkedYJ: target.checked });
        } else if (target.AlarmTypes === '13') {
            this.setState({ checkedCS: target.checked });
        } else if (target.AlarmTypes === '14') {
            this.setState({ checkedXT: target.checked });
        }
        this.setState({ currentData });
    }

    render() {
        const { alarmPushData, showAlarmState, alarmPushParam: { pageIndex, pageSize, total }, loadingGetData, loadingGetAlarmState, loadingInsertData } = this.props;
        const { currentData, checkedYC, checkedCB, checkedYJ, checkedCS, checkedXT } = this.state;

        return (
            <div>
                <div>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Card >
                                <Row gutter={10}>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={5}>
                                        <Search
                                            placeholder="输入字符模糊搜索"
                                            allowClear
                                            onSearch={value => this.onSearch(value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                                        <SdlCascader
                                            style={{ width: '100%' }}
                                            changeOnSelect
                                            placeholder="请选择行政区"
                                            data={this.props.regionList}
                                            allowClear
                                            onChange={val => {
                                                this.getentbyrt(val);
                                            }}
                                        />
                                        {/** <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.onReset}>重置</Button> */}
                                    </Col>
                                    <Col style={{ marginTop: 6 }} xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                                        <Checkbox
                                            AlarmTypes="0"
                                            checked={checkedYC}
                                            onChange={this.changeCheckboxGroup}
                                        >数据异常</Checkbox>
                                        <Checkbox
                                            AlarmTypes="2"
                                            checked={checkedCB}
                                            onChange={this.changeCheckboxGroup}
                                        >数据超标</Checkbox>
                                        {
                                            // showAlarmState && <Checkbox
                                            <Checkbox
                                                AlarmTypes="12"
                                                checked={checkedYJ}
                                                onChange={this.changeCheckboxGroup}
                                            >备案不符</Checkbox>
                                        }
                                        <Checkbox
                                            AlarmTypes="13"
                                            checked={checkedCS}
                                            onChange={this.changeCheckboxGroup}
                                        >质控核查报警</Checkbox>
                                        <Checkbox
                                            AlarmTypes="14"
                                            checked={checkedXT}
                                            onChange={this.changeCheckboxGroup}
                                        >系统报警</Checkbox>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                </div>

                <div style={{ background: '#ECECEC', padding: 15, overflow: 'auto', overflowY: 'scorll', minHeight: 350, height: 480 }}>
                    <Row gutter={16} style={{ justifyContent: (alarmPushData != null && alarmPushData.length > 0) ? null : 'center' }}>
                        {
                            (loadingGetData || loadingGetAlarmState) ? <Spin
                                style={{
                                    width: '100%',
                                    height: 'calc(100vh/2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                size="large"
                            /> : (alarmPushData != null && alarmPushData.length > 0) ? alarmPushData.map((item, index) => <Col span={6}>
                                <Card size="small" title={
                                    <span style={{ fontSize: 14 }}>{item.TargetName}</span>
                                }
                                    style={{ marginBottom: 10 }} bordered={false} actions={[
                                        <Row>
                                            <Col span={12}>
                                                <Checkbox
                                                    DGIMN={item.DGIMN}
                                                    AlarmTypes="0"
                                                    checked={currentData.filter(m => m.DGIMN === item.DGIMN && (m.AlarmTypes && m.AlarmTypes.indexOf('0') > -1)).length > 0}
                                                    onChange={this.onChangeDGINM}
                                                >数据异常</Checkbox>
                                            </Col>
                                            <Col span={12} style={{ textAlign: 'left' }}>
                                                <Checkbox
                                                    DGIMN={item.DGIMN}
                                                    AlarmTypes="2"
                                                    checked={currentData.filter(m => m.DGIMN === item.DGIMN && (m.AlarmTypes && m.AlarmTypes.split(",").includes('2'))).length > 0}
                                                    onChange={this.onChangeDGINM}
                                                >数据超标</Checkbox>
                                            </Col>
                                            <Col span={12}>
                                                {
                                                    // showAlarmState && <Checkbox
                                                    <Checkbox
                                                        DGIMN={item.DGIMN}
                                                        AlarmTypes="12"
                                                        checked={currentData.filter(m => m.DGIMN === item.DGIMN && (m.AlarmTypes && m.AlarmTypes.split(",").includes('12'))).length > 0}
                                                        onChange={this.onChangeDGINM}
                                                    >备案不符</Checkbox>
                                                }
                                            </Col>
                                            <Col span={12} style={{ textAlign: 'left' }}>
                                                {
                                                    <Checkbox
                                                        DGIMN={item.DGIMN}
                                                        AlarmTypes="13"
                                                        checked={currentData.filter(m => m.DGIMN === item.DGIMN && (m.AlarmTypes && m.AlarmTypes.indexOf('13') > -1)).length > 0}
                                                        onChange={this.onChangeDGINM}
                                                    >质控核查报警</Checkbox>
                                                }
                                            </Col>
                                            <Col span={12}>
                                                <Checkbox
                                                    DGIMN={item.DGIMN}
                                                    AlarmTypes="14"
                                                    checked={currentData.filter(m => m.DGIMN === item.DGIMN && (m.AlarmTypes && m.AlarmTypes.indexOf('14') > -1)).length > 0}
                                                    onChange={this.onChangeDGINM}
                                                >系统报警</Checkbox>
                                            </Col>

                                            {/* <Checkbox.Group options={['异常', '超标', '预警']} defaultValue={['异常']} onChange={this.onChangeDGINM} data-d={item.DGIMN} /> */}
                                        </Row>,
                                    ]}>
                                    <div style={{ height: 50 }}>
                                        <p style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 3 }}>{`${item.PointName}`}</p>
                                        <p style={{ color: '#b9cdce' }}>{item.DGIMN}</p>
                                    </div>

                                    {/* <p style={{ color: '#b9cdce' }}>出口</p> */}
                                </Card>
                            </Col>) : <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
