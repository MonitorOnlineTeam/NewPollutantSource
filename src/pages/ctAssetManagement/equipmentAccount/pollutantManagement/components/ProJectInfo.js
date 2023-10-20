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




const dvaPropsData = ({ loading,ctPollutantManger, common, }) => ({
    projectLoading: loading.effects[`common/getCTProjectList`],
    projectModelList: common.ctProjectList,
    projectTotal: common.ctProjectTotal,
    queryPar: common.ctProjectQueryPar,
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getProjectInfoList : (payload, callback) => { //项目列表
            dispatch({
                type: `common/getCTProjectList`,
                payload: payload,
                callback: callback
            })
        },
    }
}




const Index = (props) => {

    const { projectPopVisible,projectLoading, projectModelList,projectTotal,queryPar } = props;

    const [form] = Form.useForm();


    useEffect(() => {
     if(projectPopVisible){
        form.resetFields();
        onFinish(pageIndex,pageSize)
        }
    }, [projectPopVisible]);
    const projectCol = [
        {
            title: '项目编号',
            dataIndex: 'ProjectCode',
            key: 'ProjectCode',
            align: 'center',
        },
        {
            title: '立项号',
            dataIndex: 'ItemCode',
            key: 'ItemCode',
            align: 'center',
        },
        {
            title: '项目名称',
            dataIndex: 'ProjectName',
            key: 'ProjectName',
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
        onFinish={() => {setPageIndex(1); onFinish(1,pageSize) }}
        initialValues={{
        }}

    >
        <Row>
            <Form.Item style={{ marginRight: 8, width:  'calc(100% - 98px)' }} name="ProjectInfoStr">
                <Input allowClear placeholder="请输入项目编号、立项号、项目名称" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType='submit' loading={projectLoading}>
                    查询
              </Button>
            </Form.Item>
        </Row>
        <SdlTable scroll={{ y: 'calc(100vh - 500px)' }}
            loading={projectLoading} bordered dataSource={projectModelList} columns={projectCol}
            pagination={false}
            // pagination={{
            //     total: projectTotal,
            //     pageSize: pageSize,
            //     current: pageIndex,
            //     showSizeChanger: true,
            //     showQuickJumper: true,
            //     onChange: handleTableChange,
            // }}
        />
    </Form>

    const onFinish = async (PageIndex, PageSize,queryPar) => { //项目信息 查询
        try {
            // const par = queryPar ?  queryPar : await form.validateFields()
            const par =  await form.validateFields()
            props.getProjectInfoList({
                ...par,
                pageIndex: 1,
                pageSize: 10,
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    const projectColChoice = (record) => {
        props.projectColChoice(record)
    }

    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const handleTableChange =  (PageIndex, PageSize) => { //分页
        setPageSize(PageSize)
        setPageIndex(PageIndex)
        onFinish(PageIndex, PageSize, queryPar)
    }


    return (
        <Modal visible={projectPopVisible} getContainer={false} onCancel={() => { props.onProjectCancel() }} destroyOnClose footer={null} closable={false} maskStyle={{ display: 'none' }} wrapClassName='noSpreadOverModal'>
            {projectPopContent}
        </Modal>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);