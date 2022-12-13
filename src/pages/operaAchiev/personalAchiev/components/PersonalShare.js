/**
 * 功  能：个人绩效查询  个人分摊套数
 * 创建人：jab
 * 创建时间：2022.05.17
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, ProfileOutlined, CodeSandboxCircleFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import RegionList from '@/components/RegionList'
import { DelIcon, DetailIcon, EditIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import styles from "../../style.less";
import moment from 'moment';
const { RangePicker } = DatePicker;
const { Option } = Select;

const namespace = 'operaAchiev'




const dvaPropsData = ({ loading, operaAchiev, autoForm }) => ({
    tableTotal: operaAchiev.individualApportionmentTotal,
    tableDatas: operaAchiev.individualApportionmentList,
    tableLoading: loading.effects[`${namespace}/getIndividualApportionmentList`],
    exportLoading: loading.effects[`${namespace}/exportIndividualApportionment`],
})

const dvaDispatch = (dispatch) => {
    return {
        getIndividualApportionmentList: (payload) => { //列表
            dispatch({
                type: `${namespace}/getIndividualApportionmentList`,
                payload: payload,
            })
        },
        exportIndividualApportionment: (payload) => { //导出
            dispatch({
                type: `${namespace}/exportIndividualApportionment`,
                payload: payload
            })
        },

    }
}

const Index = (props) => {



    const [form] = Form.useForm();



    const { tableTotal, tableDatas, tableLoading, exportLoading, detailPar } = props;


    useEffect(() => {
        props.getIndividualApportionmentList({ ...detailPar, pageIndex: pageIndex, pageSize: pageSize, })

    }, []);



    const columns = [
        {
            title: '序号',
            align: 'center',
            width: 50,
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '行政区',
            dataIndex: 'RegionName',
            key: 'RegionName',
            align: 'center',
        },
        {
            title: '企业名称',
            dataIndex: 'EntName',
            key: 'EntName',
            align: 'center',
        },
        {
            title: '监测点名称',
            dataIndex: 'PointName',
            key: 'PointName',
            align: 'center',

        },
        {
            title: '污染源类型',
            dataIndex: 'PollutantTypeName',
            key: 'PollutantTypeName',
            align: 'center',
            width: 120,
        },
        {
            title: '员工编号',
            dataIndex: 'UserAccount',
            key: 'UserAccount',
            align: 'center',
        },
        {
            title: '个人分摊套数',
            dataIndex: 'UserCoefficient',
            key: 'UserCoefficient',
            align: 'center',
            sorter: (a, b) => a.UserCoefficient - b.UserCoefficient

        },
    ];










    const exports = async () => {
        props.exportIndividualApportionment({ ...detailPar })
    };



    const [pageSize, setPageSize] = useState(20)
    const [pageIndex, setPageIndex] = useState(1)
    const handleTableChange = (PageIndex, PageSize) => { //详情分页
        setPageIndex(PageIndex)
        setPageSize(PageSize)
        props.getIndividualApportionmentList({ ...detailPar, pageIndex: PageIndex, pageSize: PageSize, })

    }


    const searchComponents = () =>{
        return <Form
        form={form}
        name="advanced_search"
        layout='inline'
      >
    
          <Form.Item>
            <Button icon={<ExportOutlined />}   loading={exportLoading}  onClick={()=>{ exports()} }>
                导出
             </Button> 
          </Form.Item>
      </Form>
    }

    return (
        <div className={styles.operaAchievSty}>
            <Card title={searchComponents()}>
                <SdlTable
                    loading={tableLoading}
                    bordered
                    dataSource={tableDatas}
                    columns={columns}
                    scroll={{ y: 'calc(100vh - 460px)'}}
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