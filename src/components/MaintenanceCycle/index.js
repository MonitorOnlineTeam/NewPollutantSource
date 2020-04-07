/**
 * 功  能：运维计划周期提醒管理
 * 创建人：wjw
 * 修改人：-
 * 创建时间：2019.10.21
 */
import React, { Component } from 'react';
import {
    Form,
    DatePicker,
    Row,
    Col,
    message,
    Tabs,
    InputNumber,
    Divider,
    Button,
    Spin,
    Card,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ loading, maintenances }) => ({
    ...loading,
    Isloading: loading.effects['maintenances/GetMaintenanceReminder'],
    Addloading: loading.effects['maintenances/AddOrUpdateMaintenanceReminder'],
    Maintenancereminderdata: maintenances.maintenancereminderdata,
}))

@Form.create()
class MaintenanceCycle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: '233',
            ID: '',
            DGIMN: this.props.DGIMN,
        };
    }

    /** 初始化加载 */
    componentDidMount() {
        const { type } = this.state;
        this.getdata(type);
    }

    /** 切换Tabs标签 */
    onChange = key => {
        this.setState({
            type: key,
        }, () => {
            this.getdata(key);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.DGIMN != nextProps.DGIMN) {
            this.setState({
                DGIMN: nextProps.DGIMN,
            }, () => {
                this.getdata(this.state.type);
            });
        }
    }

    /** 删除 */
    delete = () => {
        const { ID, type } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'maintenances/DeleteMaintenanceReminder',
            payload: {
                ID,
                callback: model => {
                    if (model.Datas) {
                        message.success('删除成功').then(() => {
                            this.getdata(type);
                        });
                    }
                },
            },
        });
    }

    /** 添加获取更新数据 */
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            const { ID, type } = this.state;
            const { dispatch, PointCode, DGIMN } = this.props;
            if (!err) {
                if (ID === '') {
                    dispatch({
                        type: 'maintenances/AddOrUpdateMaintenanceReminder',
                        payload: {
                            ID: '',
                            RemindType: parseInt(type),
                            PointCode: DGIMN,
                            RemindCycle: values.RemindCycle,
                            LastRemindDate: values.LastRemindDate.format('YYYY-MM-DD'),
                            callback: model => {
                                if (model.Datas) {
                                    message.success('添加成功').then(() => {
                                        this.getdata(type);
                                    });
                                }
                            },
                        },
                    });
                } else {
                    dispatch({
                        type: 'maintenances/AddOrUpdateMaintenanceReminder',
                        payload: {
                            ID,
                            RemindType: parseInt(type),
                            PointCode: DGIMN,
                            RemindCycle: values.RemindCycle,
                            LastRemindDate: values.LastRemindDate.format('YYYY-MM-DD'),
                            callback: model => {
                                if (model.Datas) {
                                    message.success('修改成功');
                                }
                            },
                        },
                    });
                }
            }
        });
    }

    /** 加载数据 */
    getdata = type => {
        const { dispatch, PointCode } = this.props;
        const { DGIMN } = this.state;
        if (DGIMN) {
            dispatch({
                type: 'maintenances/GetMaintenanceReminder',
                payload: {
                    PointCode: DGIMN,
                    Type: type,
                    callback: Maintenancereminderdata => {
                        if (Maintenancereminderdata !== undefined) {
                            this.setState({
                                ID: Maintenancereminderdata.ID,
                            });
                        } else {
                            this.setState({
                                ID: '',
                            });
                        }
                    },
                },
            });
        }
    }

    /** 组装form */
    getfromData = () => {
        const { Maintenancereminderdata, DGIMN } = this.props;

        const {
            ID,
            RemindCycle,
            LastRemindDate,
        } = Maintenancereminderdata === null ? {} : Maintenancereminderdata;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 12 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        if (this.props.Isloading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(50vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                size="large"
            />);
        }
        return (

            <Form onSubmit={this.handleSubmit} key={DGIMN}>
                <Row gutter={24}>
                    <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12} >
                        <FormItem
                            {...formItemLayout}
                            label={this.state.type == '233' ? '巡检周期(天)' : this.state.type == '235' ? '校准周期(天)' : '校验周期(天)'}
                        >
                            {getFieldDecorator('RemindCycle', {
                                rules: [{
                                    required: true,
                                    pattern: /^[1-9]\d*$/,
                                    message: '请输入整数',
                                }],
                                initialValue: RemindCycle,
                            })(
                                <InputNumber min={0.1} />,
                            )}
                        </FormItem>
                    </Col>
                    <Col xs={2} sm={6} md={12} lg={12} xl={12} xxl={12}>
                        <FormItem
                            {...formItemLayout}
                            label={this.state.type == '233' ? '最新一次巡检日期' : this.state.type == '235' ? '最新一次校准日期' : '最新一次校验日期'}
                        >
                            {getFieldDecorator('LastRemindDate', {
                                rules: [{
                                    required: true,
                                    message: '请输入最新一次日期',
                                }],
                                initialValue: LastRemindDate ? moment(LastRemindDate) : null,
                            })(
                                <DatePicker format="YYYY-MM-DD" />,
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                loading={this.props.Addloading}
                            >
                                保存
                                </Button>
                            <Divider type="vertical" style={{ display: ID ? 'inline' : 'none' }} />
                            <Button
                                type="dashed"
                                style={{ display: ID ? 'inline' : 'none' }}
                                onClick={() => {
                                    this.delete();
                                }}
                            >
                                删除
                                </Button>
                        </Col>
                    </Divider>
                </Row>
            </Form>
        )
    }

    render() {
        return (
            <div>
                <Card>
                    <Tabs defaultActiveKey="233" onChange={this.onChange}>
                        <TabPane tab="日常巡检提醒" key="233">
                            {this.state.type === '233' ? this.getfromData() : ''}
                        </TabPane>
                        {/* <TabPane tab="系统保养周期提醒" key="234">
                            {this.state.type === '234' ? this.getfromData() : ''}
                        </TabPane> */}
                        <TabPane tab="校准周期提醒" key="235">
                            {this.state.type === '235' ? this.getfromData() : ''}
                        </TabPane>
                        <TabPane tab="校验周期提醒" key="236">
                            {this.state.type === '236' ? this.getfromData() : ''}
                        </TabPane>
                    </Tabs>
                </Card>
            </div>);
    }
}
export default MaintenanceCycle;
