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




const dvaPropsData = ({ loading, ctPollutantManger, commissionTest, }) => ({
    projectModelList: ctPollutantManger.projectModelList,
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getManufacturerList: (payload, callback) => { //厂家下拉列表
            dispatch({
                type: `commissionTest/getManufacturerList`,
                payload: payload,
                callback: callback
            })
        },
    }
}




const Index = (props) => {

    const { projectPopVisible, projectModelList, } = props;

    const [form] = Form.useForm();


    useEffect(() => {
        onFinish()
    }, []);
    const projectCol = [
        {
            title: '项目编号',
            dataIndex: 'ManufactorName',
            key: 'ManufactorName',
            align: 'center',
        },
        {
            title: '立项号',
            dataIndex: 'SystemName',
            key: 'SystemName',
            align: 'center',
        },
        {
            title: '项目名称',
            dataIndex: 'SystemModel',
            key: 'SystemModel',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            render: (text, record) => {
                return <Button type='primary' size='small' onClick={() => { projectColChoice(record) }}> 选择 </Button>
            }
        },

    ]
    const projectPopContent = <Form //项目号 弹框
        form={form}
        name="advanced_search3"
        onFinish={() => { onFinish() }}
        initialValues={{
        }}

    >
        <Row>
            <Form.Item style={{ marginRight: 8,width:'calc(100% - 73px)' }} name="ProjectName">
                <Input allowClear placeholder="请输入项目编号、立项号、项目编号" style={{width:'100%'}}/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType='submit'>
                    查询
              </Button>
            </Form.Item>
        </Row>
        <SdlTable scroll={{ y: 'calc(100vh - 500px)' }}
            loading={props.loadingChangeSystemModel} bordered dataSource={projectModelList} columns={projectCol}
            pagination={false}
        />
    </Form>

    const onFinish = async () => { //项目信息 查询
        try {
            const values = await form.validateFields();
            // props.testGetSystemModelList({
            //     SystemName: cemsVal,
            //     ...values,
            // })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    const projectColChoice = (record) => {
        props.projectColChoice(record)
    }

   


    return (
        <Modal visible={projectPopVisible} getContainer={false} onCancel={() => { props.onProjectCancel() }} destroyOnClose footer={null} closable={false} maskStyle={{ display: 'none' }} wrapClassName='noSpreadOverModal'>
            {projectPopContent}
        </Modal>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);