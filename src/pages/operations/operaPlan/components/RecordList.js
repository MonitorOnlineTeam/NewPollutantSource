/**
 * 功  能：预测性维护 运维计划  生成计划列表
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "../styles.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import CheckPhoto from '@/components/CheckPhoto';
import { permissionButton } from '@/utils/utils';
import PlanCalendar from '../components/PlanCalendar'

const { Option } = Select;

const namespace = 'operaPlan'




const dvaPropsData = ({ loading, operaPlan, global, }) => ({
    tableLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    tableDatas: operaPlan.formulateTableDatas2,
    tableTotal: operaPlan.formulateTableTotal2,
    exportLoading: loading.effects[`${namespace}/GetAuditPhoto`],
    queryPar: operaPlan.formulateQueryPar2,
    configInfo: global.configInfo,
})

const Index = (props) => {


    const { type,tableDatas, tableTotal, tableLoading } = props;

    useEffect(() => {
        initData(pageIndex, pageSize);

    }, []);

    const initData = (pageIndex,pageSize) =>{
        props.dispatch({
            type: `${namespace}/GetQuestionList`,
            payload: {
               pageIndex:pageIndex,
               pageSize:pageSize
            },

        });
    }
    

    const columns = [
        {
            title: '序号',
            align: 'center',
            ellipsis: true,
            render: (text, record, index) => {
                return (index + 1) + (pageIndex - 1) * pageSize;
            }
        },
        {
            title: '状态',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
        },
        {
            title: '备注',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
        },
        {
            title: '附件',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
            render: (text) => {
                return <CheckPhoto fileList={text} />
            }
        },
        {
            title: '操作人',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
        },
        {
            title: '操作时间',
            dataIndex: 'projectName',
            key: 'projectName',
            ellipsis: true,
        },
    ];

    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const handleTableChange = (PageIndex, PageSize) => { //分页
        setPageSize(PageSize)
        setPageIndex(PageIndex)
        initData(PageIndex, PageSize)
    }



    return (
        <div>
            <SdlTable
                resizable
                loading={tableLoading}
                bordered
                dataSource={tableDatas}
                columns={columns}
                align='center'
                pagination={{
                    total: tableTotal,
                    pageSize: pageSize,
                    current: pageIndex,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: handleTableChange,
                }}
            />
        </div>
    );
};
export default connect(dvaPropsData)(Index);