/*
 * @Author: outman0611
 * @Date: 2024-11-26 14:30:21
 * @LastEditors: outman0611
 * @LastEditTime: 2024-12-24 16:00:51
 * @Description: 现场质量检查任务单
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'dva';
import {
    Alert,
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    InputNumber,
    Divider,
    Row,
    Col,
    Space,
    Table,
    Rate,
    Radio,
    Spin,
} from 'antd';
import styles from './styles.less';
import HandleCustomer from './HandleCustomer';
import Cookie from 'js-cookie';
import moment from 'moment';
import debounce from 'lodash/debounce';
import LargeRegionList from '@/components/largeRegionList';
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import { cookieName, } from '@/config';
import { API } from '@config/API';


const { TextArea } = Input;

const dvaPropsData = ({ loading, wordSupervision, common }) => ({
    TYPE: wordSupervision.TYPE, // 1: 成套 “”：运维
    getAlluserLoading: loading.effects[`common/getAlluser`],
    allUser: common.allUser,
});


const SiteQualityInspection = props => {
    const {
        customerList,
        submitLoading,
        onCancel,
        editData,
        onSubmitCallback,
        TYPE,
        taskInfo,
        visitEnvironmentalParameterLoading,
        isEdit
    } = props;
    const [form] = Form.useForm();

    const [projectInfoList, setProjectInfoList] = useState([]);
    let timeout;

    useEffect(() => {
        props.dispatch({
            type: `common/getAlluser`,
            payload: {}
        });
        return () => {
            form.resetFields()
        }

    }, []);
    const rowSpanFun = (value, record) => {
        let obj = {
            children: <div>{value}</div>,
            props: { rowSpan: record.Count },
        };
        return obj;
    }
    const getColumns = () => {
        return [
            {
                title: '检查项目',
                dataIndex: 'aa',
                key: 'aa',
                width: 100,
                align: 'center',
                colSpan: 2,
                render: (text, record) => {

                    let obj = {
                        children: <div>{text}</div>,
                        props: { rowSpan: record.Count },
                    };
                    return obj;
                },
            },
            {
                title: '监测点位',
                dataIndex: 'bb',
                key: 'bb',
                align: 'center',
                width: 100,
                colSpan: 0,
            },
            {
                title: '要求',
                dataIndex: 'cc',
                key: 'cc',
                width: 200,
                align: 'center',
            },
            {
                title: '设定值',
                dataIndex: 'type',
                key: 'type',
                width: 100,
                align: 'center',
                render: (text, record) => {
                    return <Form.Item
                        name={record.dataIndex}
                        style={{ marginBottom: 0 }}
                        wrapperCol={{ span: 24 }}
                    >
                    <InputNumber placeholder='请输入' allowClear/>
                    </Form.Item>
                },
            },
            {
                title: '显示值',
                dataIndex: 'type',
                key: 'type',
                width: 100,
                align: 'center',
                render: (text, record) => {
                    return <Form.Item
                        name={record.dataIndex}
                        style={{ marginBottom: 0 }}
                        wrapperCol={{ span: 24 }}
                    >
                          <InputNumber placeholder='请输入' allowClear/>
                    </Form.Item>
                },
            },
            {
                title: '是否符合',
                dataIndex: 'address',
                key: 'address',
                width: 200,
                align: 'center',
                render: (text, record) => {
                    return (<Form.Item
                        name={record.dataIndex}
                        style={{ marginBottom: 0 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: '不能为空！',
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={1}>√</Radio>
                            <Radio value={2}>×</Radio>
                            <Radio value={3}>/</Radio>
                        </Radio.Group>
                    </Form.Item>
                    );
                },
            },
        ]
    }





    const onOK = async () => {
        const values = await form.validateFields();
        let body = {
            ...values,
            VisitData: values.VisitData ? moment(values.VisitData).format('YYYY-MM-DD HH:mm:ss') : undefined,
            Province: values.Province?.toString(),
            id: editData.ID,
            dailyTaskID: taskInfo.ID || editData.DailyTaskID,
        };
        props.dispatch({
            type: 'wordSupervision/AddOrEditVisitEnvironmental',
            payload: body,
            callback: () => {
                onSubmitCallback();
                onCancel();
            },
        });
    };

    const userCookie = Cookie.get('currentUser');
    if (userCookie) {
        form.setFieldsValue({ ReturnUser: JSON.parse(userCookie).UserName });
    }
    function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
        const [fetching, setFetching] = useState(false);
        const [options, setOptions] = useState([]);
        const fetchRef = useRef(0);
        const debounceFetcher = useMemo(() => {
            const loadOptions = (value) => {
                fetchRef.current += 1;
                const fetchId = fetchRef.current;
                setOptions([]);
                setFetching(true);
                fetchOptions(value).then((newOptions) => {
                    if (fetchId !== fetchRef.current) {
                        return;
                    }
                    setOptions(newOptions);
                    setFetching(false);
                });
            };
            return debounce(loadOptions, debounceTimeout);
        }, [fetchOptions, debounceTimeout]);
        return (
            <Select
                labelInValue
                filterOption={false}
                onSearch={debounceFetcher}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                {...props}
                options={options}
            />
        );
    }
    async function fetchProjectList(value) {
        if (value) {
            return fetch(API.CtAssetManagementApi.GetCTProjectList, {
                method: 'POST',
                body: JSON.stringify({ projectCode: value }),
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: null,
                    Authorization: 'Bearer ' + Cookie.get(cookieName)
                }
            }).then(response => response?.json()).then(body => {
                return body?.Datas?.map((item) => ({
                    label: item.ProjectCode,
                    value: item.ProjectCode,
                }))
            }).catch(error => {
                console.error('Error:', error);
            })
        }
    }
    return (
        <>
            <h2 className={styles.formTitle}>气态污染物CEMS安装自查表（冷干法）</h2>
            <div className={styles.formContent}>
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    initialValues={{
                        ...editData,
                        RegionalArea: taskInfo?.largeCode ? Number(taskInfo.largeCode) : editData.RegionalArea ? Number(editData.RegionalArea) : undefined,
                        Province: editData.Province ? editData.Province.split(',') : [],
                        VisitData: editData.VisitData ? moment(editData.VisitData) : undefined,
                    }}
                    onFinish={onOK}
                    autoComplete="off"
                >
                    <Row style={{ width: '100%' }}>
                        <Col span={12}>
                            <Form.Item label="订货单位" name='aa' rules={[{ required: isEdit, }]}>
                                <Input placeholder='请输入' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="用户姓名" name='bb' rules={[{ required: isEdit, }]}>
                                <Input placeholder='请输入' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="项目编号" name='ProjectCode' rules={[{ required: isEdit, }]}>
                                <DebounceSelect placeholder="请选择"
                                    showSearch
                                    allowClear
                                    defaultActiveFirstOption={false}
                                    fetchOptions={fetchProjectList}
                                    onChange={(value) => {
                                        const name = projectInfoList.filter(item => item.ProjectCode == value)?.[0]?.ProjectName
                                        form.setFieldValue('ProjectName', name);

                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="用户电话" name="CustomerPhone" rules={[
                                {
                                    required: isEdit,
                                },
                                {
                                    pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                                    message: '请输入正确的手机号！'
                                },
                            ]}
                            >
                                <Input placeholder="请输入手机号" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="项目名称" name='ProjectName' rules={[{ required: isEdit, }]}>
                                <Input placeholder='请输入' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="用户地址" name='bb' rules={[{ required: isEdit, }]}>
                                <Input placeholder='请输入' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="产品名称" name='bb' rules={[{ required: isEdit, }]}>
                                <Input placeholder='请输入' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="服务人员姓名" name='bb' rules={[{ required: isEdit, }]}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="请输入"
                                    optionFilterProp="User_Name"
                                    fieldNames={{ label: 'User_Name', value: 'User_ID' }}
                                    loading={props.getAlluserLoading}
                                    options={props.allUser}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="系统型号" name='bb' rules={[{ required: isEdit, }]}>
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="请输入"
                                    optionFilterProp="User_Name"
                                    fieldNames={{ label: 'User_Name', value: 'User_ID' }}
                                    loading={props.getAlluserLoading}
                                    options={props.allUser}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="服务人员电话" name="CustomerPhone" rules={[
                                {
                                    required: isEdit,
                                },
                                {
                                    pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                                    message: '请输入正确的用户电话！'
                                },
                            ]}
                            >
                                <Input placeholder="请输入手机" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="分析仪型号" name='bb' rules={[{ required: isEdit, }]}>
                                <Input placeholder='请输入' allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="安装日期" name="VisitData" rules={[{ required: isEdit, },]}>
                                <DatePicker disabledDate={current => { return current && current > moment().endOf('day'); }} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="核查日期" name="ffff" rules={[{ required: isEdit, },]}>
                                <DatePicker disabledDate={current => { return current && current > moment().endOf('day'); }} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify='center'>
                    <Col span={20}>
                    <Table
                        size="small"
                        bordered
                        dataSource={[1]}
                        columns={[{
                            title: '检查内容、要求及结果',
                            colSpan: 4,
                            width: 100,
                            align: 'center',
                            render: (text, record) => {
                                return <span>用户单位</span>;
                            },
                        },
                        {
                            colSpan: 0,
                            width: 300,
                            render: (text, record) => {
                                return <Form.Item name='ProjectCode' rules={[{ required: isEdit, }]}  wrapperCol={{ span: 24 }} style={{ marginBottom: 0 }}>
                                    <DebounceSelect placeholder="请选择"
                                        showSearch
                                        allowClear
                                        style={{width:'100%'}}
                                        defaultActiveFirstOption={false}
                                        fetchOptions={fetchProjectList}
                                        onChange={(value) => {
                                            const name = projectInfoList.filter(item => item.ProjectCode == value)?.[0]?.ProjectName
                                            form.setFieldValue('ProjectName', name);

                                        }}
                                    />
                                </Form.Item>
                                ;
                            },
                        },
                        {
                            colSpan: 0,
                            dataIndex: 'c',
                            width: 100,
                            align: 'center',
                            render: (text, record) => {
                                return <span>监测点位</span>;
                            },
                        },
                        {
                            colSpan: 0,
                            width: 300,
                            render: (text, record) => {
                                return <Form.Item name='bb' rules={[{ required: isEdit, }]}   wrapperCol={{ span: 24 }} style={{ marginBottom: 0 }}>
                                    <Select
                                        showSearch
                                        allowClear
                                        style={{width:'100%'}}
                                        placeholder="请输入"
                                        optionFilterProp="User_Name"
                                        fieldNames={{ label: 'User_Name', value: 'User_ID' }}
                                        loading={props.getAlluserLoading}
                                        options={props.allUser}
                                    />
                                </Form.Item>;
                            },
                        },
                        ]}
                        pagination={false}
                    />
                    <Table
                        size="small"
                        bordered
                        dataSource={[{
                            aa: 1,
                            bb: 2,
                            cc: 3,
                            Count: 2,
                        }, {
                            aa: 1,
                            bb: 2,
                            cc: 3,
                            Count: 0,
                        }]}
                        className={styles.siteQualityInspeTable}
                        columns={getColumns()}
                        pagination={false}
                    />
                    <Table
                        size="small"
                        bordered
                        showHeader={false}
                        className={styles.siteQualityInspeTable}
                        dataSource={[{ name: '其他情况说明' }, { name: '备注' }]}
                        columns={[{
                            width: 100,
                            dataIndex: 'name',
                            align: 'center',
                            render: (text, record) => {
                                return text;
                            },
                        },
                        {
                            width: 700,
                            render: (text, record, index) => {
                                if (index == 0) {
                                    return <Form.Item
                                        wrapperCol={{ span: 24 }}
                                        name="ProblemsAndAdvice"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <TextArea allowClear style={{width:'100%'}} rows={3} placeholder="请输入" />
                                    </Form.Item>
                                } else {
                                    return <div>
                                        <div>1、“设定值”和“显示值”列，如该项目存在具体的设定值和显示值，请在该处填写实际数值；若无则填写“/”； </div>
                                        <div>2、“是否符合”列，符合清打“√”；不符合请打“×”，不适用请打“/” </div>
                                        </div>
                                }
                            },
                        },

                        ]}
                        pagination={false}
                    />
                    </Col>
                    </Row>
                    <Divider orientation="right" style={{ color: '#d9d9d9' }}>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={submitLoading}>
                                提交
              </Button>
                            <Button onClick={onCancel}>取消</Button>
                        </Space>
                    </Divider>
                </Form>
            </div>
        </>
    );
};

export default connect(dvaPropsData)(SiteQualityInspection);
