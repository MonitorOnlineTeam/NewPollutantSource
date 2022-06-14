

/**
 * 功  能：污染源信息 设备
 * 创建人：jab
 * 创建时间：2022.04.02
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import NumTips from '@/components/NumTips'
import styles from "../style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'pollutantInfo'




const dvaPropsData = ({ loading, pollutantInfo, global }) => ({
    tableDatas: pollutantInfo.entListTableDatas,
    tableTotal: pollutantInfo.entListTableTotal,
    projectTableDatas: pollutantInfo.entListTableTotal,
    tableLoading: loading.effects[`${namespace}/getEntInfoList`],
    exportLoading: loading.effects[`${namespace}/exportEntInfoList`],
    clientHeight: global.clientHeight,
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getTableData: (payload) => { //列表
            dispatch({
                type: `${namespace}/getEntInfoList`,
                payload: payload,
            })
        },
        exportData: (payload, callback) => { // 导出
            dispatch({
                type: `${namespace}/exportEntInfoList`,
                payload: payload,
                callback: callback
            })

        },


    }
}
const Index = (props) => {



    const [form] = Form.useForm();


    const { tableDatas, tableTotal, tableLoading, exportLoading } = props;


    useEffect(() => {
        onFinish(pageIndex, pageSize)
    }, []);

    const columns = [
        {
            title: '序号',
            align: 'center',
            width: 50,
            render: (text, record, index) => {
                return  (index + 1) + (pageIndex-1)*pageSize;
            }
        },
        {
            title: '行政区',
            dataIndex: 'regionName',
            key: 'regionName',
            align: 'center',
        },

        {
            title: '企业名称',
            dataIndex: 'entName',
            key: 'entName',
            align: 'center',
        },
        {
            title: '企业简称',
            dataIndex: 'abbreviation',
            key: 'abbreviation',
            align: 'center',
        },
        {
            title: '企业地址',
            dataIndex: 'address',
            key: 'address',
            align: 'center',
        },
        {
            title: '经纬度',
            dataIndex: 'longitude',
            key: 'longitude',
            align: 'center',
            render: (text, record, index) => {
                return `${text},${record.latitude}`
            }
        },
        {
            title: '环保负责人',
            dataIndex: 'environmentPrincipal',
            key: 'environmentPrincipal',
            align: 'center',
        },
        {
            title: '办公电话',
            dataIndex: 'officePhone',
            key: 'officePhone',
            align: 'center',
        },
        {
            title: '移动电话',
            dataIndex: 'mobilePhone',
            key: 'mobilePhone',
            align: 'center',
        },
    ];





    const onFinish = async (pageIndexs, pageSizes) => {  //查询
        try {
            const values = await form.validateFields();
            setPageIndex(pageIndexs)
            props.getTableData({
                ...values,
                pageIndex: pageIndexs,
                pageSize: pageSizes
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }




    const handleTableChange = (PageIndex, PageSize) => {
        setPageIndex(PageIndex)
        setPageSize(PageSize)
        onFinish(PageIndex, PageSize)
    }

    const exports = async () => {
        const values = await form.validateFields();
        props.exportData({
            ...values,
            pageIndex: undefined,
            pageSize: undefined,
        })

    };

    const [pageSize, setPageSize] = useState(20)
    const [pageIndex, setPageIndex] = useState(1)

    const searchComponents = () => {
        return <><Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish(1, pageSize) }}
            initialValues={{
            }}
            layout='inline'
        >
            <Form.Item label='企业名称' name='EntName'>
                <Input allowClear placeholder='请输入' />
            </Form.Item>
            <Form.Item label='行政区' name='RegionCode' >
                <RegionList levelNum={2} />
            </Form.Item>
            <Form.Item>
                <Button loading={tableLoading} type="primary" loading={tableLoading} htmlType="submit">
                    查询
       </Button>
                <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
                    重置
        </Button>
                <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
                    导出
         </Button>
            </Form.Item>
        </Form>
            <div style={{ color: '#f5222d', paddingTop: 12, fontSize: 14 }}>
            下面列表只展示当前在运营的企业，运营到期的企业将不显示。
</div>
        </>
    }
    return (
        <div className={styles.pollutantInfoSty}>
            <Card title={searchComponents()}>
                <SdlTable
                    loading={tableLoading}
                    bordered
                    dataSource={tableDatas}
                    columns={columns}
                    pagination={{
                        total: tableTotal,
                        pageSize: pageSize,
                        current: pageIndex,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        onChange: handleTableChange,
                    }}
                />
            </Card>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);

