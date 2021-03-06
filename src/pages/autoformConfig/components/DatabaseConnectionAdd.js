/**
 * 功  能：AutoForm数据库连接-添加编辑
 * 创建人：靳雯娟
 * 创建时间：2020.11.11
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { DatePicker, message, Button, Modal, Select, Input, InputNumber, Divider, Form, Col, Row, Popconfirm } from 'antd';
import { routerRedux } from 'dva/router';
import Modal_ from '@/components/WCommon/Modal_';
import { wSurfaceWaterLevel, wQuality, imgaddress, SectionFunction, SectionAttribute, AutomaticstationType, DatabaseVersion } from '../../config'; //水质级别
import { element } from 'prop-types';
//import  styles from './WeekControlSetConent.less';


const { confirm } = Modal;
const FormItem = Form.Item;
const pageUrl = {
    AddingdatabaseConnection: 'databasedata/AddingdatabaseConnection',


};

@connect(({ loading }) => ({


}))

class DatabaseConnectionAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
        // this.windowResize = this.windowResize.bind(this);
    }

    componentDidMount() {
        // this.props.onRef(this)
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        // console.log(e);
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
    };
    //数据库版本
    DatabaseVersion = () => {
        let type = [];
        DatabaseVersion.map(v => {
            type.push(<Option key={v.key} value={v.key}> {v.value} </Option>);
        });
        return type;
    }
   //获得数据库版本名渲染页面
    getVersionName = (val) => {
        let currentValue = DatabaseVersion.filter(item => item.value === val);
        if (currentValue && currentValue.length > 0)
            return currentValue[0].key;
    }

    //获取添加编辑数据库版本
    getSqlVersion = (val) => {
        let currentValue = DatabaseVersion.filter(item => item.key === val);
        if (currentValue && currentValue.length > 0)
            return currentValue[0].value;
    }

    //更新查询条件
    updateState = (payload) => {
        this.props.dispatch({
            type: pageUrl.updateState,
            payload: payload,
        });
    }


    handleSubmit = (e) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            const that = this;
            if (!err) {
                let parameter = {
                    DB: {
                        DB_KEY: values.DB_KEY,
                        DB_NAME: values.DB_NAME,
                        DB_USERNAME: values.DB_USERNAME,
                        DB_VERSION: that.getSqlVersion(values.DB_VERSION),
                        DB_MARK: values.DB_MARK,
                        DB_IP: values.DB_IP,
                        DB_PWD: values.DB_PWD,
                    },
                    Type: this.props.type
                }

                // debugger;
                // console.log(parameter);

                that.props.dispatch({
                    type: pageUrl.AddingdatabaseConnection,
                    payload: {
                        parameter,
                        callback: (result) => {
                            if (result.requstresult === "1") {
                                message.success(result.reason);
                                that.props.reloadData(1);
                                that.handleOk();
                            }
                            else {
                                message.error(result.reason);
                                //that.props.reloadData(1);
                            }
                        }
                    },
                });
            }
        });
    };


    cancel = () => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 12 },
            },
            wrapperCol: {
                xs: { span: 12 },
                sm: { span: 12 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const addTitle = '添加数据库连接';
        const editTitle = '编辑数据库连接';
        const { DB_KEY, DB_NAME, DB_USERNAME, DB_VERSION, DB_MARK, DB_IP, DB_PWD } = this.props;  //这指的是form表单，和表格自己定义的测试数据不一样，这块是form表单定义的数据，在有数据后从接口知道各个字段的命名以及返回的数据，在这块需要把自己定义的字段名改成接口返回的字段名以及把"this.state 改成this.props
        const { type, record } = this.props;


        //console.log(this.props.record);
        //console.log(this.props.type);
        // console.log(DB_NAME);
        // console.log(DB_USERNAME);

        return (
            <>
                { type === 1 ? <a onClick={this.showModal}>编辑</a> : <Button type="primary" onClick={this.showModal}>
                    添加
                </Button>}
                <Modal_
                    // bodyStyle={{height:300}}
                    width={800}
                    centered={true}
                    title={type === 1 ? editTitle : addTitle}
                    className={type === 1 ? 'editTitle' : 'addTitle'}
                    classTitle={type === 1 ? 'editTitle' : 'addTitle'}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    isCardHeight={true}
                >

                    <Form >
                        <Row gutter={8}>
                            <Col span={8}>
                                <FormItem
                                    style={{ textAlign: "left" }}

                                    {...formItemLayout}

                                    label="数据库Code"
                                > {
                                        getFieldDecorator('DB_KEY', {
                                            initialValue: record && record.DB_KEY,
                                            rules: [{
                                                required: true,
                                                message: '请输入数据库Code!'
                                            }]

                                        })(<Input style={{ width: 200 }} placeholder="唯一识别码" />)
                                    }
                                </FormItem>

                            </Col>
                            <Col span={16}>
                                <FormItem
                                    {...formItemLayout}

                                    label="中文描述"
                                > {
                                        getFieldDecorator('DB_MARK', {
                                            initialValue: record && record.DB_MARK,
                                            rules: [{
                                                message: '请输入中文描述!'
                                            }]
                                        })(<Input
                                            style={{ width: 200 }}

                                        />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={8}>
                                <FormItem
                                    style={{ textAlign: "left" }}

                                    {...formItemLayout}

                                    label="数据库名"
                                > {
                                        getFieldDecorator('DB_NAME', {
                                            initialValue: record && record.DB_NAME,
                                            // initialValue: this.props.record.DB_NAME==="" || this.props.record.DB_NAME==undefined?"":this.props.record.DB_NAME,
                                            rules: [{

                                                message: '请输入数据库名!'
                                            }]

                                        })(<Input style={{ width: 200 }} />)
                                    }
                                </FormItem>

                            </Col>
                            <Col span={16}>
                                <FormItem
                                    {...formItemLayout}

                                    label="连接地址"
                                > {
                                        getFieldDecorator('DB_IP', {
                                            initialValue: record && record.DB_IP,
                                            rules: [{

                                                message: '请输入连接地址!'
                                            }]
                                        })(<Input
                                            style={{ width: 200 }}

                                        />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={8}>
                                <FormItem
                                    style={{ textAlign: "left" }}

                                    {...formItemLayout}

                                    label="登录名"
                                > {
                                        getFieldDecorator('DB_USERNAME', {
                                            initialValue: record && record.DB_USERNAME,
                                            rules: [{

                                                message: '请输入登录名!'
                                            }]

                                        })(<Input style={{ width: 200 }} />)
                                    }
                                </FormItem>

                            </Col>
                            <Col span={16}>
                                <FormItem
                                    {...formItemLayout}

                                    label="登录密码"
                                > {
                                        getFieldDecorator('DB_PWD', {
                                            initialValue: record && record.DB_PWD,
                                            rules: [{

                                                message: '请输入登录密码!'
                                            }]
                                        })(<Input
                                            style={{ width: 200 }}

                                        />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>

                            <Col span={8}>
                                <FormItem
                                    {...formItemLayout}

                                    label="数据库版本"
                                > {
                                        getFieldDecorator('DB_VERSION', {
                                            //initialValue: version === '' ?  undefined :version,
                                            // initialValue:this.getVersionName(),   //record&&record.DB_VERSION?record.DB_VERSION:0,
                                            initialValue: record && record.DB_VERSION ? this.getVersionName(record.DB_VERSION) : '0',
                                            rules: [{
                                                required: true,
                                                message: '请数据库版本类型!'
                                            }],
                                        })(
                                            <Select
                                                optionFilterProp="children"
                                                showSearch={true}
                                                style={{ width: 200 }}
                                                placeholder="请选择"
                                            >
                                                {this.DatabaseVersion()}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                            <Button type="primary" onClick={this.handleSubmit} >
                                保存
                            </Button>
                            <Divider type="vertical" />
                            <Button type="dashed"
                                onClick={
                                    () => this.cancel()
                                } >
                                取消
                            </Button>
                        </Divider>
                    </Form>
                </Modal_>
            </>
        );
    }
}
export default Form.create()(DatabaseConnectionAdd);
