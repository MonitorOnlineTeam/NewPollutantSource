/**
 * 功  能：绩效排名 / 签到考勤查询
 * 创建人：jab
 * 创建时间：2024.04.01
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Spin,Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
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
import styles from "./style.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import UserList from '@/components/UserList'
import MultipleHeadResizeTable from '@/components/MultipleHeadResizeTable';

const { Option } = Select;

const namespace = 'operaCheckAttendanceQuery'




const dvaPropsData = ({ loading, operaCheckAttendanceQuery, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetSignInAndOffsiteSignList`],
  tableDatas: operaCheckAttendanceQuery.tableDatas,
  tableTotal: operaCheckAttendanceQuery.tableTotal,
  queryPar: operaCheckAttendanceQuery.queryPar,
  exportLoading: loading.effects[`${namespace}/ExportSignInAndOffsiteSign`],
  workTypeLoading: loading.effects[`${namespace}/GetOffWorkType`],
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
    GetSignInAndOffsiteSignList: (payload) => { //列表
      dispatch({
        type: `${namespace}/GetSignInAndOffsiteSignList`,
        payload: payload,
      })
    },
    ExportSignInAndOffsiteSign: (payload) => { //导出
      dispatch({
        type: `${namespace}/ExportSignInAndOffsiteSign`,
        payload: payload,
      })
    },
    GetOffWorkType: (payload,callback) => { //工作类型
      dispatch({
        type: `${namespace}/GetOffWorkType`,
        payload: payload,
        callback:callback,
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();



  const { clientHeight,workTypeLoading, tableDatas, tableTotal, tableLoading, exportLoading, queryPar, } = props;


  const [workTypeList,setWorkTypeList] = useState([])
  useEffect(() => {
    onFinish(pageIndex,pageSize);
    props.GetOffWorkType({},(res)=>{
      res?.[0]&&setWorkTypeList(res)
    })
  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      fixed:'left',
      render: (text, record, index) => index + 1
    },
    {
      title: '姓名',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
      ellipsis: true,
      fixed:'left',
    },
    {
      title: '工号',
      dataIndex: 'UserAccount',
      key: 'UserAccount',
      align: 'center',
      ellipsis: true,
      fixed:'left',
    },
    {
      title: '工作类型',
      dataIndex: 'WorkTypeName',
      key: 'WorkTypeName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '签到',
      align: 'center',
      children: [
        {
          title: '时间',
          dataIndex: 'STime',
          key: 'STime',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '结果',
          dataIndex: 'OResult',
          key: 'OResult',
          align: 'center',
          ellipsis: true,
          render:(text, record, index)=>{
            return text==='缺卡'? <span className='red'>{text}</span> : text
           }
        },
        {
          title: '经度',
          dataIndex: 'OLongitude',
          key: 'OLongitude',
          align: 'center',
          ellipsis: true,

        },
        {
          title: '纬度',
          dataIndex: 'SLatitude',
          key: 'SLatitude',
          align: 'center',
          ellipsis: true,

        },
        {
          title: '地点',
          dataIndex: 'SLocation',
          key: 'SLocation',
          align: 'center',
          ellipsis: true,

        },
        {
          title: '详细地址',
          dataIndex: 'OAddress',
          key: 'OAddress',
          align: 'center',
          ellipsis: true,
        },
      ]
    },
    {
      title: '签退',
      align: 'center',
      children: [
        {
          title: '时间',
          dataIndex: 'OTime',
          key: 'OTime',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '结果',
          dataIndex: 'OResult',
          key: 'OResult',
          align: 'center',
          ellipsis: true,
          render:(text, record, index)=>{
            return text==='缺卡'? <span className='red'>{text}</span> : text
           }
        },
        {
          title: '经度',
          dataIndex: 'OLongitude',
          key: 'OLongitude',
          align: 'center',
          ellipsis: true,

        },
        {
          title: '纬度',
          dataIndex: 'OLatitude',
          key: 'OLatitude',
          align: 'center',
          ellipsis: true,

        },
        {
          title: '地点',
          dataIndex: 'OLocation',
          key: 'OLocation',
          align: 'center',
          ellipsis: true,

        },
        {
          title: '详细地址',
          dataIndex: 'OAddress',
          key: 'OAddress',
          align: 'center',
          ellipsis: true,
        },
      ]
    },
    {
      title: '备注',
      dataIndex: 'Remark',
      key: 'Remark',
      align: 'center',
      ellipsis: true,
    },
  ]

  const exports = async () => {
    props.ExportSignInAndOffsiteSign({
      ...queryPar,
      pageIndex:undefined,
      pageSize:undefined,
    })
  };


  const onFinish = async (pageIndex, pageSize) => {  //查询

    try {
      const values = await form.validateFields();
      props.GetSignInAndOffsiteSignList({
        ...values,
        bTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        eTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        pageIndex: pageIndex,
        pageSize: pageSize,
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
    onFinish(PageIndex, PageSize, props.queryPar)
  }

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }}
      initialValues={{
        time: [moment().startOf('month'), moment()]
      }}
    >
      <Row>
        <Col span={8}>
          <Form.Item name="userName" label="姓名" className='minWidth'>
            <UserList />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Spin spinning={workTypeLoading} size='small' className='formItemSpinSty'>
            <Form.Item name='workType' label='工作类型' style={{ padding: '0 16px' }}>
              <Select placeholder='请选择' allowClear>
                {workTypeList.map(item => <Option value={item.ChildID}>{item.Name}</Option>)}
              </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={8}>
          <Form.Item name='regionCode' label='省份' >
            <RegionList levelNum={1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='time' label='签到时间' >
            <RangePicker_
              allowClear={false}
              showTime={false}
              format="YYYY-MM-DD"
              style={{ minWidth: 260, width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item style={{ padding: '0 16px' }}>
            <Button type="primary" htmlType="submit" loading={tableLoading} style={{ marginRight: 8 }}>
              查询
         </Button>
            <Button style={{ marginRight: 8 }} onClick={() => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }}>
              重置
         </Button>
            <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
              导出
         </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  return (
    <div className={styles.operaCheckAttendanceQuerySty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <MultipleHeadResizeTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            scroll={{ y: clientHeight - 376 }}
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