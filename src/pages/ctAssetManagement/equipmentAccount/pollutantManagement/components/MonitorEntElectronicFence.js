/**
 * 功  能：系统信息
 * 创建人：jab
 * 创建时间：2023.09.05
 */
import React, { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tabs, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Popover, Tag, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import cuid from 'cuid';
const { TabPane } = Tabs;
const { Option } = Select;
const namespace = 'ctPollutantManger'




const dvaPropsData = ({ loading, ctPollutantManger, common, }) => ({
    addUpdataLoading: loading.effects[`${namespace}/addOrUpdateMonitorEntElectronicFence`],
    getDataLoading: loading.effects[`${namespace}/getMonitorEntElectronicFence`] || false,
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        addOrUpdateMonitorEntElectronicFence: (payload, callback) => { //添加修改
            dispatch({
                type: `${namespace}/addOrUpdateMonitorEntElectronicFence`,
                payload: payload,
                callback: callback
            })
        },
        getMonitorEntElectronicFence: (payload, callback) => { //获取
            dispatch({
                type: `${namespace}/getMonitorEntElectronicFence`,
                payload: payload,
                callback: callback
            })
        },
    }
}




const Index = (props) => {

    const { visible, title, entId } = props;

    const [form] = Form.useForm();

    const getData = () =>{
        
    }
    useEffect(() => {
        if (visible) {
            form.resetFields()
            form.setFieldsValue({ entId: entId })
            props.getMonitorEntElectronicFence({ entId: entId, }, (data) => {
                data&&form.setFieldsValue({
                    ...data,
                    id: data?.ID,
                    range: data?.Range,
                })
            })
        }
    }, [visible]);

    const monitorEntElectronicFenceOk = async () => {
        try {
            const value = await form.validateFields()
            props.addOrUpdateMonitorEntElectronicFence({
                ...value,
            }, () => {
                props.onCancel();
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }


    return (
        <Modal width={900} title={title} visible={visible} onOk={monitorEntElectronicFenceOk} onCancel={() => { props.onCancel() }} confirmLoading={props.addUpdataLoading || props.getDataLoading} destroyOnClose>
            <Spin spinning={props.getDataLoading} size='small'>
                <Form
                    name="basic"
                    form={form}
                >
                    <Form.Item label="电子围栏半径（KM）" name="range" rules={[{ required: true, message: '请输入电子围栏半径!', },]} >
                        <InputNumber  min={0.00001}  placeholder='请输入' allowClear style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="entId" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    {form.getFieldValue('id')&&<Form.Item>
                        <Row  justify='space-between'>
                            <Col style={{paddingLeft:12}}>创建人：{form.getFieldValue('CreateUserName')}</Col>
                            <Col style={{paddingLeft:12}}>创建时间：{form.getFieldValue('CreateTime')}</Col>
                            <Col style={{paddingLeft:12}}>更新人：{form.getFieldValue('UpdateUserName')}</Col>
                            <Col style={{paddingLeft:12}}>更新时间：{form.getFieldValue('UpdateTime')}</Col>
                        </Row>
                    </Form.Item>}
                </Form>
            </Spin>
        </Modal>

    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);