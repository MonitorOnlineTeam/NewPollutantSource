/**
 * 功  能：系统管理 数据来源统计
 * 创建人：jab
 * 创建时间：2024.07.15
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Space,Tag, Typography, TreeSelect, Card, Tabs, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'

import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import RangePicker_ from '@/components/RangePicker/NewRangePicker';


const namespace = 'dataSourceStatistic'




const dvaPropsData = ({ loading, dataSourceStatistic, usertree }) => ({
  tableDatas: dataSourceStatistic.tableDatas,
  tableTotal: dataSourceStatistic.tableTotal,
  tableLoading: loading.effects[`${namespace}/GetPGZXPointStatusList`],
  exportLoading: loading.effects[`${namespace}/ExportPGZXPointStatusList`],

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetPGZXPointStatusList: (payload) => { //列表
      dispatch({
        type: `${namespace}/GetPGZXPointStatusList`,
        payload: payload,
      })
    },
    ExportPGZXPointStatusList: (payload, callback) => { //导出
      dispatch({
        type: `${namespace}/ExportPGZXPointStatusList`,
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
    props.GetPGZXPointStatusList({
      pageIndex: pageIndex,
      pageSize: pageSize,
    })
  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '省份',
      dataIndex: 'ProviceName',
      key: 'ProviceName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '城市',
      dataIndex: 'CityName',
      key: 'CityName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '企业',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'MN',
      dataIndex: 'DGIMN',
      key: 'DGIMN',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点类型',
      dataIndex: 'PollutantType',
      key: 'PollutantType',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '排口类型',
      dataIndex: 'OutputTypeName',
      key: 'OutputTypeName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '数据来源类型',
      dataIndex: 'StateStatus',
      key: 'StateStatus',
      align: 'center',
      ellipsis: true,
      render:(text)=>{
       return <span style={{color:text=='直传'?'blue':text=='非直传'? 'green' : 'red' }}>{text}</span>
      }
    },
  ];
  
  const handleChange = (value) =>{
    props.GetPGZXPointStatusList({
      StateStatus:value,
      pageIndex: pageIndex,
      pageSize: pageSize,
    })
  }

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      layout='inline'
      // initialValues={{
      //   StateStatus: '1'
      // }}
    >
      <Form.Item name="StateStatus"  >
        <Select
          style={{width:180}}
          onChange={handleChange}
          placeholder='请选择数据来源类型'
          allowClear
          options={[
            {
              value: '1',
              label: '直传',
            },
            {
              value: '2',
              label: '非直传',
            },
            {
              value: '3',
              label: '无数据',
            },
          ]}
        />
      </Form.Item>
      <Form.Item>
        <Button type='primary' loading={exportLoading} onClick={exportData}><ExportOutlined />导出</Button>
      </Form.Item>
    </Form>
  }

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    const values = form.getFieldsValue();
    props.GetPGZXPointStatusList({
      ...values,
      pageIndex: pageIndex,
      pageSize: pageSize,
    })
  }

  const exportData = () => {
    const values = form.getFieldsValue();
    props.ExportPGZXPointStatusList({
      ...values,
    })
  }





  return (
    <div className={'queryCriterTitleSty'}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            resizable
            autowidth
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
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);