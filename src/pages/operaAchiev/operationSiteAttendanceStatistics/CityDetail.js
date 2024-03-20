/**
 * 功  能：绩效排名 / 现场签到统计  市详情内容
 * 创建人：jab
 * 创建时间：2024.02.26
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Pagination, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Tabs, Spin, Empty } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import PageLoading from '@/components/PageLoading'
import ImageView from '@/components/ImageView';
import { getAttachmentDataSource } from '@/pages/AutoFormManager/utils';
import AttachmentView from '@/components/AttachmentView';
import { uploadPrefix } from '@/config'
import styles from "./style.less"
const { Option } = Select;
const { TabPane } = Tabs;

const namespace = 'operationSiteAttendanceStatistics'



const dvaPropsData = ({ loading, operationSiteAttendanceStatistics }) => ({
  tableLoading: operationSiteAttendanceStatistics.cityDetailLoading,
  tableDatas: operationSiteAttendanceStatistics.cityDetailDatas,
  tableTotal: operationSiteAttendanceStatistics.cityDetailTotal,
  cityDetailQueryPar: operationSiteAttendanceStatistics.cityDetailQueryPar,
  exportLoading: operationSiteAttendanceStatistics.cityDetailExportLoading,
  configInfo: global.configInfo,
  regDetailQueryPar: operationSiteAttendanceStatistics.regDetailQueryPar,
  regQueryPar: operationSiteAttendanceStatistics.queryPar,
})

const dvaDispatch = (dispatch) => {
  return {
    GetSignInList: (payload) => { //列表
      dispatch({
        type: `${namespace}/GetSignInList`,
        payload: payload,
      })
    },
    ExportSignInList: (payload) => { //导出
      dispatch({
        type: `${namespace}/ExportSignInList`,
        payload: payload,
      })
    },


  }
}
const Index = (props) => {


  const [form] = Form.useForm();


  const { regDetailQueryPar, detailCode, tableDatas, tableTotal, tableLoading, exportLoading, cityDetailQueryPar,type, regQueryPar,} = props;


  useEffect(() => {
    onFinish(pageIndex, pageSize);
  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => (index + 1) + (pageIndex - 1) * pageSize
    },
    {
      title: '监测类型',
      dataIndex: 'pollutantTypeName',
      key: 'pollutantTypeName',
      align: 'center',
      ellipsis: true,
      width:130,
    },
    {
      title: '工作类型',
      dataIndex: 'workTypeName',
      key: 'workTypeName',
      align: 'center',
      ellipsis: true,
      width:130,
    },
    {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维人员',
      dataIndex: 'operationUserName',
      key: 'operationUserName',
      align: 'center',
      ellipsis: true,
      width:120,
    },
    {
      title: '工号',
      dataIndex: 'userAccount',
      key: 'userAccount',
      align: 'center',
      ellipsis: true,
      width:120,
    },
    {
      title: '签到起始时间',
      dataIndex: 'signInTime',
      key: 'signInTime',
      align: 'center',
      ellipsis: true,
      width: 140,
    },
    {
      title: '起始时间签到结果',
      dataIndex: 'signInexceptType',
      key: 'signInexceptType',
      align: 'center',
      ellipsis: true,
      render:(text, record, index)=>{
       return text==='异常'? <span className='red'>{text}</span> : text
      }
    },
    {
      title: '签到结束时间',
      dataIndex: 'signOutTime',
      key: 'signOutTime',
      align: 'center',
      ellipsis: true,
      width:140,

    },
    {
      title: '结束时间签到结果',
      dataIndex: 'signOutexceptType',
      key: 'signOutexceptType',
      align: 'center',
      ellipsis: true,
      render:(text, record, index)=>{
        return text==='异常'? <span className='red'>{text}</span> : text
      }
    },
    {
      title: '现场工作时长(小时)',
      dataIndex: 'workTime',
      key: 'workTime',
      align: 'center',
      ellipsis: true,
      width: 140,
    },
    {
      title: '签到异常次数(缺卡次数)',
      dataIndex: 'exceptCount',
      key: 'exceptCount',
      align: 'center',
      ellipsis: true,
      width: 160,
    },
  ]
  const onFinish = async (pageIndex, pageSize, cityDetailQueryPar) => {  //查询

    try {
      const values = await form.validateFields();
      const par = type==='hour'? regQueryPar : regDetailQueryPar
      props.GetSignInList(cityDetailQueryPar ? { ...cityDetailQueryPar, pageIndex: pageIndex, pageSize: pageSize } : {
        ...values,
        pageIndex: pageIndex,
        pageSize: pageSize,
        ...par,
        regionCode:props.cityDetailCode,
        workType:props.workType,
        pointType:3
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }


  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { setPageIndex(1); onFinish(1, pageSize) }}
      layout='inline'
    >

      <Form.Item name='operationUser' label='运维人员'>
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item name='userAccount' label='工号'>
        <Input placeholder="请输入" allowClear />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={tableLoading}>
          查询
           </Button>
        <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}  >
          重置
           </Button>
        <Button icon={<ExportOutlined />} loading={exportLoading} style={{ marginRight: 8, }} onClick={() => { exports() }}>
          导出
           </Button>
      </Form.Item>
    </Form>
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize,cityDetailQueryPar)
  }


  const exports = async () => {
    props.ExportSignInList({
      ...cityDetailQueryPar,
      pageIndex: undefined,
      pageSize: undefined
    })
  };

  return (
    <div>
     <div style={{marginBottom:12}}>{searchComponents()}</div>
        <SdlTable
          resizable
          loading={tableLoading}
          bordered
          dataSource={tableDatas}
          columns={columns}
          pagination={{
            showSizeChanger:true,
            showQuickJumper:true,
            total: tableTotal,
            pageSize: pageSize,
            current: pageIndex,
            onChange: handleTableChange
          }}
        />

    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);