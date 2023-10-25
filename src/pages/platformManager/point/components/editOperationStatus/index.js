/**
 * 功  能：修改点位运维状态
 * 创建人：jab
 * 创建时间：2023.10.18
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker,Radio,Spin, } from 'antd';
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
  tableLoading: loading.effects[`${namespace}/getOprationStatusList`],
  tableDatas: point.oprationStatusList,
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
    updatePointOprationStatus: (payload,callback) => { //修改点位运维状态
      dispatch({
        type: `${namespace}/updatePointOprationStatus`,
        payload: payload,
        callback:callback,
      })
    },
    getOprationStatusList : (payload,callback) => { //修改记录
      dispatch({
        type: `${namespace}/getOprationStatusList`,
        payload: payload,
        callback:callback,
      })
    },
    getAutoFormData : (payload,callback) => { //监测点列表
      dispatch({
        type: `autoForm/getAutoFormData`,
        payload: payload,
        callback:callback,
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();


  const { tableDatas, tableTotal, tableLoading, updatePointOprationStatusLoading,data,pointConfigId,pointDataWhere, } = props;
  
  const [pauseReasonList,setPauseReasonList] = useState([])
  const [pauseReasonLoading,setPauseReasonLoading] = useState(false)

  const [status,setStatus] = useState()
  const [statusFlag,setStatusFlag] = useState()

  useEffect(() => {
    // form.setFieldsValue({
    //   Status: data['dbo.T_Bas_CommonPoint.Col5']
    // })
    setStatus(data['dbo.T_Bas_CommonPoint.Col5']==='0'? '1' :'0')
    setStatusFlag(data['dbo.T_Bas_CommonPoint.Col5'])
    setPauseReasonLoading(true)
    props.getOprationStatusList({PointCode:data['dbo.T_Bas_CommonPoint.PointCode']},(data)=>{
      data?.ChildList&&setPauseReasonList(data.ChildList)
      setPauseReasonLoading(false)
    });
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
      dataIndex: 'StatusName',
      key: 'StatusName',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return text==='0'? '进行中' : '已暂停';
      }
    },
    {
      title: '暂停原因',
      dataIndex: 'PauseReason',
      key: 'PauseReason',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'Remark',
      key: 'Remark',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作人',
      dataIndex: 'CreateUser',
      key: 'CreateUser',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
  ];



  const onFinish =  (values) => {  //修改点位运维状态

    try {
      props.updatePointOprationStatus({
        ...values,
        PointCode:data['dbo.T_Bas_CommonPoint.PointCode']
      },()=>{
        setPageIndex(1)
        form.resetFields();
        setStatus(values.Status==='0'? '1' : '0')
        setStatusFlag(values.Status)
        props.getOprationStatusList({PointCode:data['dbo.T_Bas_CommonPoint.PointCode'],pageIndex:1,PageSize:pageSize},()=>{
          props.onCancel();
        })
        props.getAutoFormData({ //刷新监测点
          configId: pointConfigId,
          searchParams: pointDataWhere,
        })
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
    // props.getOprationStatusList({PointCode:data['dbo.T_Bas_CommonPoint.PointCode'],pageIndex:PageIndex,PageSize:PageSize,})
  }


  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={onFinish}
    >                
      <Form.Item name='Status' label='运维状态' rules={[{required: true, message: '请选择运维状态！'}]}>
        <Radio.Group onChange={(e)=>{setStatus(e.target.value)}}>
        {statusFlag==='0'?
           <Radio value={'1'}>已暂停</Radio>
           :
           <Fragment>
          <Radio value={'0'}>进行中</Radio>
          </Fragment>
          }
        </Radio.Group>
      </Form.Item>
       {status==='1'&&<Form.Item name='PauseReason' label='暂停原因' rules={[{required: true, message: '请选择暂停原因！'}]}>
        {pauseReasonLoading? <Spin size='small'/> : <Select allowClear placeholder="请选择" >
            {pauseReasonList.map(item=><Option value={item.ChildID}>{item.Name}</Option>)}
        </Select>}
      </Form.Item>}
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
          scroll={{y:'auto'}}
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