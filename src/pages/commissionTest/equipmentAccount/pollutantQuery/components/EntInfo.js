

/**
 * 功  能：调试检测 - 污染源查询 企业信息
 * 创建人：jab
 * 创建时间：2022.07.20
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

const namespace = 'pollutantQuery'




const dvaPropsData = ({ loading, pollutantQuery, global }) => ({
    tableDatas: pollutantQuery.TestEntTableDatas,
    tableTotal: pollutantQuery.TestEntTableTotal,
    projectTableDatas: pollutantQuery.TestEntTableTotal,
    tableLoading: loading.effects[`${namespace}/getTestEntList`],
    exportLoading: loading.effects[`${namespace}/exportTestEntList`],
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
                type: `${namespace}/getTestEntList`,
                payload: payload,
            })
        },
        exportData: (payload, callback) => { // 导出
            dispatch({
                type: `${namespace}/exportTestEntList`,
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
            ellipsis:true,
            render: (text, record, index) => {
                return  (index + 1) + (pageIndex-1)*pageSize;
            }
        },
        {
            title: '行政区',
            dataIndex: 'regionName',
            key: 'regionName',
            align: 'center',
            ellipsis:true,
        },

        {
            title: '企业名称',
            dataIndex: 'entName',
            key: 'entName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '行业',
            dataIndex: 'industryTypeName',
            key: 'industryTypeName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '企业地址',
            dataIndex: 'entAdress',
            key: 'entAdress',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '环保负责人',
            dataIndex: 'director',
            key: 'director',
            align: 'center',
            ellipsis:true,
        },

        {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align: 'center',
            ellipsis:true,
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

    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)

    const searchComponents = () => {
        return <><Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish(1, pageSize) }}
            initialValues={{
            }}
            layout='inline'
        >
            <Form.Item label='企业名称' name='entName'>
                <Input allowClear placeholder='请输入' />
            </Form.Item>
            <Form.Item label='行政区' name='regionCode' >
                <RegionList test levelNum={3} style={{width:165}}/>
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
        </>
    }
    return (
        <div className={styles.pollutantQuerySty}>
            <Card title={searchComponents()}>
                <SdlTable
                    resizable
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

