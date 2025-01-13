
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
import CheckPhoto from '@/components/CheckPhoto';
const { Option } = Select;

const namespace = 'operaCheckAttendanceQuery'




const dvaPropsData = ({ loading, operaCheckAttendanceQuery, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetSignInAndOffsiteSignList`],
  tableDatas: operaCheckAttendanceQuery.tableDatas,
  tableTotal: operaCheckAttendanceQuery.tableTotal,
  queryPar: operaCheckAttendanceQuery.queryPar,
  exportLoading: loading.effects[`${namespace}/ExportSignInAndOffsiteSign`],
  workTypeLoading: loading.effects[`${namespace}/GetAllWorkTypeList`],
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
    GetAllWorkTypeList: (payload,callback) => { //工作类型
      dispatch({
        type: `${namespace}/GetAllWorkTypeList`,
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
    props.GetAllWorkTypeList({},(res)=>{
      setWorkTypeList(res)
    })
  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      fixed:'left',
      render: (text, record, index) => (index + 1) + (pageIndex-1)*pageSize
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      ellipsis: true,
      fixed:'left',
    },
    {
      title: '工号',
      dataIndex: 'userAccount',
      key: 'userAccount',
      align: 'center',
      ellipsis: true,
      fixed:'left',
    },
    {
        title: '运维/成套',
        dataIndex: 'operationTypeName',
        key: 'operationTypeName',
        align: 'center',
        width:130,
        ellipsis: true,
      },
    {
      title: '工作类型',
      dataIndex: 'workTypeName',
      key: 'workTypeName',
      align: 'center',
      width:130,
      ellipsis: true,
    },
    {
      title: '省',
      dataIndex: 'province',
      key: 'province',
      align: 'center',
      ellipsis: true,
    },
    {
        title: '项目编号',
        dataIndex: 'projectCode',
        key: 'projectCode',
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
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '签到',
      align: 'center',
      children: [
        {
          title: '时间',
          dataIndex: 'signInTime',
          key: 'signInTime',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '结果',
          dataIndex: 'signInReslut',
          key: 'signInReslut',
          align: 'center',
          ellipsis: true,
          render:(text, record, index)=>{
            return text==='缺卡'? <span className='red'>{text}</span> : text
           }
        },
        {
          title: '经度',
          dataIndex: 'signInLongitude',
          key: 'signInLongitude',
          align: 'center',
          ellipsis: true,

        },
        {
          title: '纬度',
          dataIndex: 'signInLatitude',
          key: 'signInLatitude',
          align: 'center',
          ellipsis: true,

        },
        {
          title: '地点',
          dataIndex: 'signInPlaceName',
          key: 'signInPlaceName',
          align: 'center',
          ellipsis: true,

        },
        {
          title: '详细地址',
          dataIndex: 'signInAddress',
          key: 'signInAddress',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '签到照片',
          dataIndex: 'signInFile',
          key: 'signInFile',
          align: 'center',
          ellipsis: true,
          render:(text)=>{
            return <CheckPhoto fileList={text}/>
          }
        },
      ]
    },
    {
      title: '签退',
      align: 'center',
      children: [
        {
          title: '时间',
          dataIndex: 'signOutTime',
          key: 'signOutTime',
          align: 'center',
          ellipsis: true,
        },
        {
          title: '结果',
          dataIndex: 'signOutReslut',
          key: 'signOutReslut',
          align: 'center',
          ellipsis: true,
          render:(text, record, index)=>{
            return text==='缺卡'? <span className='red'>{text}</span> : text
           }
        },
        {
          title: '经度',
          dataIndex: 'signOutLongitude',
          key: 'signOutLongitude',
          align: 'center',
          ellipsis: true,

        },
        {
          title: '纬度',
          dataIndex: 'signOutLatitude',
          key: 'signOutLatitude',
          align: 'center',
          ellipsis: true,

        },
        // {
        //   title: '地点',
        //   dataIndex: 'signOutPlaceName',
        //   key: 'signOutPlaceName',
        //   align: 'center',
        //   ellipsis: true,

        // },
        // {
        //   title: '详细地址',
        //   dataIndex: 'signOutAddress',
        //   key: 'signOutAddress',
        //   align: 'center',
        //   ellipsis: true,
        // },
        {
          title: '签退照片',
          dataIndex: 'signOutFile',
          key: 'signOutFile',
          align: 'center',
          ellipsis: true,
          render:(text)=>{
            return <CheckPhoto fileList={text}/>
          }
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
        WorkTypeList: values.WorkTypeList || [],
        beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
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
          <Form.Item name="userId" label="姓名">
            <UserList />
          </Form.Item>
        </Col>
        <Col span={8}>
            <Form.Item name='operationType' label='运维/成套' style={{ padding: '0 16px' }}>
              <Select placeholder='请选择' allowClear>
               <Option value={1}>运维</Option>
               <Option value={2}>成套</Option>
              </Select>
            </Form.Item>
        </Col>
        <Col span={8}>
          <Spin spinning={workTypeLoading} size='small' className='formItemSpinSty'>
            <Form.Item name='WorkTypeList' label='工作类型' style={{ padding: '0 16px' }}>
              <Select mode='tags' placeholder='请选择' allowClear showSearch  optionFilterProp="children">
                {workTypeList.map(item => <Option value={item.ChildID}>{item.Name}</Option>)}
              </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={8}>
          <Form.Item name='regionName' label='省份' >
            <Input placeholder='请输入' allowClear/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='time' label='签到时间'   className='minWidth' style={{ padding: '0 16px' }}>
            <RangePicker_
              allowClear={false}
              showTime={false}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item style={{ padding: '0 16px' }}>
            <Button type="primary" htmlType="submit" loading={tableLoading} style={{ marginRight: 8 }}>
              查询
         </Button>
            <Button style={{ marginRight: 8 }} onClick={() => {form.resetFields();setPageIndex(1); setPageSize(20); onFinish(1, 20) }}>
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