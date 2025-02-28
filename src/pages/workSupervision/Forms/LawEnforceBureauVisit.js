/*
 * @Author: outman0611
 * @Date: 2024-11-26 14:30:21
 * @LastEditors: outman0611
 * @LastEditTime: 2024-12-16 15:15:25
 * @Description: 管理部门拜访任务单
 */

import React, { useState, useEffect } from 'react';
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
} from 'antd';
import styles from './styles.less';
import HandleCustomer from './HandleCustomer';
import Cookie from 'js-cookie';
import moment from 'moment';
import LargeRegionList from '@/components/largeRegionList';
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import { checkRules } from '@/utils/validator';

const { TextArea } = Input;

const dvaPropsData = ({ loading, wordSupervision }) => ({
    TYPE: wordSupervision.TYPE, // 1: 成套 “”：运维
    visitEnvironmentalParameterLoading: loading.effects['wordSupervision/GetVisitEnvironmentalParameter'],
    submitLoading: loading.effects['wordSupervision/AddOrEditVisitEnvironmental'],
    largeRegionListLoading: loading.effects[`ctCommon/GetLargeRegionList`],

});


const LawEnforceBureauVisit = props => {
    const {
        customerList,
        submitLoading,
        onCancel,
        editData,
        onSubmitCallback,
        TYPE,
        taskInfo,
        visitEnvironmentalParameterLoading
    } = props;
    const [form] = Form.useForm();

    const [customID, setCustomID] = useState();
    const [provinceList, setProvinceList] = useState([]);
    const [purposeVisitValue, setPurposeVisitValue] = useState(); //拜访目的

    useEffect(() => {
        getVisitEnvironmentalParameter(); //下拉列表数据
        return () => {
            form.resetFields()
        }

    }, []);


    const [achievingResultsList,setAchievingResultsList] = useState([])
    // 获取 参数
    const getVisitEnvironmentalParameter = () => {
        props.dispatch({
            type: 'wordSupervision/GetVisitEnvironmentalParameter',
            payload: { },
            callback:(res)=>{
                setAchievingResultsList(res?.Datas || [])
                setPurposeVisitValue(editData?.VisitPurpose)
            }
        });
    };



    const onOK = async () => {
        const values = await form.validateFields();
        let body = {
            ...values,
            VisitData: values.VisitData? moment(values.VisitData).format('YYYY-MM-DD HH:mm:ss') : undefined,
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


    return (
        <>
            <h2 className={styles.formTitle}>管理部门拜访记录表</h2>
            <div className={styles.formContent}>
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    initialValues={{
                        ...editData,
                        RegionalArea: taskInfo?.largeCode? Number(taskInfo.largeCode) : editData.RegionalArea? Number(editData.RegionalArea) :  undefined,
                        Province:editData.Province? editData.Province.split(',') : [],
                        VisitData:editData.VisitData? moment(editData.VisitData) : undefined,
                    }}
                    onFinish={onOK}
                    autoComplete="off"
                >
                    <Row style={{ width: '100%' }}>
                        <Col span={12}>

                              <LargeRegionList
                                 label='大区'
                                 name='RegionalArea'
                                 rules={[
                                        {
                                            required: true,
                                            message: '请输入大区！',
                                        },
                                    ]}
                               />

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="省份/地市"
                                name='Province'
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择省份/地市！',
                                    },
                                ]}
                            >
                                <SdlCascader noFilter  selectType='2,否' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="拜访日期"
                                name="VisitData"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择拜访日期！',
                                    },
                                ]}
                            >
                                <DatePicker
                                    disabledDate={current => {
                                        return current && current > moment().endOf('day');
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="管理部门名称"
                                name="ManagementDepName"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入管理部门名称！',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入管理部门名称" allowClear/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="会谈人姓名"
                                name="CustomerName"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入会谈人姓名！',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入会谈人姓名" allowClear/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="职位"
                                name="CustomerPosition"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入职位！',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入职位" allowClear/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="手机"
                                name="CustomerPhone"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入手机！',
                                    },
                                    { ...checkRules.mobile },
                                ]}
                            >
                                <Input placeholder="请输入手机" allowClear/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="VisitPurpose" label="拜访目的"  rules={[{required: true, message: '请选择拜访目的！' }]}>
                                <Select placeholder="请选择拜访目的" loading={visitEnvironmentalParameterLoading}
                                   options={achievingResultsList?.EvaluateList}
                                   fieldNames={{ label: 'Name', value: 'ChildID'}}
                                   showSearch
                                   allowClear
                                   optionFilterProp="Name"
                                   onChange={(value)=>{
                                   setPurposeVisitValue(value)
                                   form.setFieldValue('Evaluate',undefined);
                                   value==723 && form.setFieldValue('OtherPurpose',undefined);
                                 }}
                                />
                            </Form.Item>
                        </Col>
                        {purposeVisitValue==723 && <Col span={12}>
                            <Form.Item name="OtherPurpose" label="其他拜访目的" rules={[{required: true, message: '请输入其他拜访目的！' }]}>
                            <Input placeholder="请输入其他拜访目的" allowClear/>
                            </Form.Item>
                        </Col>}
                        {purposeVisitValue!=723 && <Col span={12}>
                            <Form.Item name="Evaluate" label="取得效果" rules={[{required: true, message: '请选择取得效果！' }]}>
                                <Select
                                    placeholder="请选择取得效果" loading={visitEnvironmentalParameterLoading}
                                    fieldNames={{ label: 'Name', value: 'ChildID'}}
                                    showSearch
                                    allowClear
                                    optionFilterProp="Name"
                                    options={achievingResultsList?.EvaluateList?.filter(item=>item.ChildID==purposeVisitValue)?.[0]?.ChildList || []}
                                />
                            </Form.Item>
                        </Col>}
                        <Col span={12}>
                            <Form.Item name="SpecificResults" label="具体成果" rules={[{required: true, message: '请输入具体成果！' }]}>
                            <Input placeholder="请输入具体成果" allowClear/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="拜访部门人员建议"
                                name="Suggestion"
                                rules={[{required: true, message: '请输入拜访部门人员建议！' }]}
                            >
                                <TextArea placeholder="请输入拜访部门人员建议" rows={1}  allowClear/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="当地是否有运维"
                                name="IsOperations"
                                rules={[{required: true, message: '请选择当地是否有运维！' }]}
                            >
                                <Radio.Group>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>





                        <Col span={12}>
                            <Form.Item name="VisitType" label="拜访分类" rules={[{required: true, message: '请选择拜访分类！' }]}>
                                <Select
                                    placeholder="请选择拜访分类" allowClear loading={visitEnvironmentalParameterLoading}
                                    fieldNames={{ label: 'Name', value: 'ChildID'}}
                                    options={achievingResultsList?.VisitTypeList}
                                />
                            </Form.Item>
                        </Col>




                    </Row>

                    <Col span={24}>
                        <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 19 }} label="备注" name="Remark">
                            <TextArea rows={3} placeholder="请输入备注" allowClear/>
                        </Form.Item>
                    </Col>
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

export default connect(dvaPropsData)(LawEnforceBureauVisit);
