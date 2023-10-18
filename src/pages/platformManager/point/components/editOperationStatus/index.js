/**
 * 功  能：修改运维状态
 * 创建人：jab
 * 创建时间：2023.10.18
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker,Radio, } from 'antd';
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
import styles from "../../index.less"
import Cookie from 'js-cookie';
import TitleComponents from '@/components/TitleComponents'


const { Option } = Select;

const namespace = 'point'




const dvaPropsData = ({ loading, point, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetOprationStatusList`],
  tableDatas: point.GetOprationStatusList,
  tableTotal: point.oprationStatusListTotal,
  updatePointOprationStatusLoading: loading.effects[`${namespace}/updatePointOprationStatus`],
  configInfo: global.configInfo,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    updatePointOprationStatus: (payload,callback) => { //修改运维状态
      dispatch({
        type: `${namespace}/updatePointOprationStatus`,
        payload: payload,
        callback:callback,
      })
    },
    getOprationStatusList : (payload,callback) => { //修改记录
      dispatch({
        type: `${namespace}/getOprationStatusList `,
        payload: payload,
        callback:callback,
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();



  const { tableDatas, tableTotal, tableLoading, updatePointOprationStatusLoading,data, } = props;



  useEffect(() => {
    props.getOprationStatusList({});
  }, []);

  let columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '运维状态（修改后）',
      dataIndex: 'Num',
      key: 'Num',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '暂停原因',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'ItemCode',
      key: 'ItemCode',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '操作人',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '操作时间',
      dataIndex: 'AssistantName',
      key: 'AssistantName',
      align: 'center',
      ellipsis: true,
    },
  ];



  const onFinish =  (values) => {  //查询

    try {
      props.updatePointOprationStatus({
        ...values,
        PointCode:data['dbo.T_Bas_CommonPoint.PointCode']
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize)
  }


  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { onFinish(pageIndex, pageSize) }}
    >
      <Form.Item name='Status' label='运维状态'>
        <Radio.Group >
          <Radio value={'1'}>进行中</Radio>
          <Radio value={'2'}>已暂停</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name='PauseReason' label='暂停原因' >
        <Select allowClear placeholder="请选择" >
          <Option value="1">待发</Option>
          <Option value="2">已发</Option>
          <Option value="3">待办</Option>
          <Option value="4">已办</Option>
          <Option value="5">取消</Option>
          <Option value="6">回退</Option>
          <Option value="7">取回</Option>
          <Option value="8">竞争执行</Option>
          <Option value="15">终止</Option>
        </Select>
      </Form.Item>
      <Form.Item name='Remark' label='备注' >
        <Input.TextArea placeholder='请输入'/>
      </Form.Item>
      <Form.Item  style={{textAlign:'right'}}>
        <Button type="primary" htmlType="submit" loading={updatePointOprationStatusLoading}>
          确定
         </Button>

      </Form.Item>
    </Form>
  }
  return (
    <div className={styles.editOperationStatusSty}>
        {searchComponents()}
        <TitleComponents text='修改记录' />
        <SdlTable
          resizable
          loading={tableLoading}
          bordered
          scroll={{x:800, y:'auto'}}
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
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);