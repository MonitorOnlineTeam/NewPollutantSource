/**
 * 功  能：项目管理
 * 创建人：贾安波
 * 创建时间：2021.08.18
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
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
import styles from "./style.less"
import Cookie from 'js-cookie';
import OperationCompanyList from '@/components/OperationCompanyList'
const { Option } = Select;

const namespace = 'projectManager'




const dvaPropsData = ({ loading, projectManager }) => ({
  tableDatas: projectManager.tableDatas,
  pointDatas: projectManager.pointDatas,
  pointDatasTotal: projectManager.pointDatasTotal,
  tableLoading: projectManager.tableLoading,
  tableTotal: projectManager.tableTotal,
  loadingConfirm: loading.effects[`${namespace}/addOrUpdateProjectInfo`],
  pointLoading: loading.effects[`${namespace}/getProjectPointList`],
  exportLoading: loading.effects[`${namespace}/exportProjectInfoList`],
  exportPointLoading: loading.effects[`${namespace}/exportProjectPointList`],

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getProjectInfoList: (payload) => { //项目管理列表
      dispatch({
        type: `${namespace}/getProjectInfoList`,
        payload: payload,
      })
    },
    addOrUpdateProjectInfo: (payload, callback) => { //修改 or 添加
      dispatch({
        type: `${namespace}/addOrUpdateProjectInfo`,
        payload: payload,
        callback: callback
      })

    },
    getParametersInfo: (payload) => { //下拉列表测量参数
      dispatch({
        type: `${namespace}/getParametersInfo`,
        payload: payload
      })
    },
    deleteProjectInfo: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/deleteProjectInfo`,
        payload: payload,
        callback: callback
      })
    },
    getProjectPointList: (payload) => { //运维监测点信息
      dispatch({
        type: `${namespace}/getProjectPointList`,
        payload: payload,
      })
    },
    exportProjectInfoList: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportProjectInfoList`,
        payload: payload,
      })
    },
    exportProjectPointList: (payload) => { //导出 运维信息监测点
      dispatch({
        type: `${namespace}/exportProjectPointList`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const [data, setData] = useState([]);

  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(513);
  const [DGIMN, setDGIMN] = useState('')
  const [expand, setExpand] = useState(false)
  const [fromVisible, setFromVisible] = useState(false)
  const [tableVisible, setTableVisible] = useState(false)

  const [type, setType] = useState('add')
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)


  const isEditing = (record) => record.key === editingKey;

  const { tableDatas, tableTotal, loadingConfirm, pointDatas, pointDatasTotal, tableLoading, pointLoading, exportLoading, exportPointLoading } = props;
  useEffect(() => {
    onFinish(pageIndex, pageSize);

  }, []);

  const columns = [
    {
      title: '合同名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
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
      title: '客户所在地',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '卖方公司名称',
      dataIndex: 'SellCompanyName',
      key: 'SellCompanyName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维合同起始日期',
      dataIndex: 'BeginTime',
      key: 'BeginTime',
      align: 'center',
      sorter: (a, b) => moment(a.BeginTime).valueOf() - moment(b.BeginTime).valueOf(),
      ellipsis: true,
    },
    {
      title: '运维合同结束日期',
      dataIndex: 'EndTime',
      key: 'EndTime',
      align: 'center',
      sorter: (a, b) => moment(a.EndTime).valueOf() - moment(b.EndTime).valueOf(),
      ellipsis: true,

    },
    {
      title: '运维套数',
      dataIndex: 'OperationCount',
      key: 'OperationCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '所属运维单位',
      dataIndex: 'operationCompanyName',
      key: 'operationCompanyName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) => moment(a.CreateTime).valueOf() - moment(b.CreateTime).valueOf(),
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'UpdUserName',
      key: 'UpdUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'UpdTime',
      key: 'UpdTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: 180,
      ellipsis: true,
      render: (text, record) => {
        return <span>
          <Fragment><Tooltip title="编辑"> <a onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>

          <Fragment> <Tooltip title="详情">
            <Link style={{ padding: '0 5px' }} to={{
              pathname: '/platformconfig/basicInfo/projectManager/detail',
              query: {
                data: JSON.stringify(record)
              },
            }}
            >
              <DetailIcon />
            </Link>
          </Tooltip><Divider type="vertical" /></Fragment>

          <Fragment> <Tooltip title="删除">
            <Popconfirm title="确定要删除此条信息吗？" style={{ paddingRight: 5 }} onConfirm={() => { del(record) }} okText="是" cancelText="否">
              <a><DelIcon /></a>
            </Popconfirm>
          </Tooltip>
            <Divider type="vertical" />
            <Fragment> <Tooltip title="运维监测点信息">  <a href="javasctipt:;" onClick={() => { operaInfo(record) }} ><PointIcon /></a></Tooltip></Fragment>

          </Fragment>
        </span>
      }
    },
  ];

  const pointColumns = [
    {
      title: '监控目标',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '实际运维开始日期',
      dataIndex: 'beginTime',
      key: 'beginTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '实际运维结束日期',
      dataIndex: 'endTime',
      key: 'endTime',
      align: 'center',
      ellipsis: true,
    },
  ]

  const edit = async (record) => {
    setFromVisible(true)
    setType('edit')
    form2.resetFields();
    try {
      form2.setFieldsValue({
        ...record,
        BeginTime: moment(record.BeginTime),
        EndTime: moment(record.EndTime),
        SignName: record.SingName,
        OperationCompany: record.operationCompanyID,
      })



    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const del = (record) => {
    if (!record.deleteFlag) {
      message.warning('没有操作权限，请联系管理员')
      return;
    }
    props.deleteProjectInfo({ ID: record.ID }, () => {
      setPageIndex(1);
      onFinish(1, pageSize);
    })
  };


  const [ID, setID] = useState();
  const [ProjectCode, setProjectCode] = useState();
  const [ProjectName, setProjectName] = useState();

  const operaInfo = (record) => {
    setTableVisible(true)
    setID(record.ID)
    setProjectCode(record.ProjectCode)
    setProjectName(record.ProjectName)
    setPageIndex2(1)
    setPageSize2(10)
    props.getProjectPointList({ ID: record.ID, ProjectCode: record.ProjectCode, PageIndex: 1, PageSize: 10, })
  };




  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();

  };
  const exports = async () => {
    const values = await form.validateFields();
    props.exportProjectInfoList({
      ...values,
      BegBeginTime: values.BegTime && moment(values.BegTime[0]).format('YYYY-MM-DD HH:mm:ss'),
      BegEndTime: values.BegTime && moment(values.BegTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      // EndBeginTime:values.EndTime&&moment(values.EndTime[0]).format('YYYY-MM-DD HH:mm:ss'),
      // EndEndTime:values.EndTime&&moment(values.EndTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      BegTime: undefined,
      // EndTime:undefined,

    })
  };

  const pointExports = () => { //监测点信息  导出
    props.exportProjectPointList({
      ID: ID, ProjectCode: ProjectCode
    })
  };
  const onFinish = async (PageIndex, PageSize) => {  //查询

    try {
      const values = await form.validateFields();

      props.getProjectInfoList({
        ...values,
        BegBeginTime: values.BegTime && moment(values.BegTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        BegEndTime: values.BegTime && moment(values.BegTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        // EndBeginTime:values.EndTime&&moment(values.EndTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        // EndEndTime:values.EndTime&&moment(values.EndTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        BegTime: undefined,
        // EndTime:undefined,
        Author: 1,
        PageIndex: PageIndex,
        PageSize: PageSize,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();//触发校验
      if(!values.deleteFlag && type === 'edit' ){
        message.warning('没有操作权限，请联系管理员')
        return;
      }
      props.addOrUpdateProjectInfo({
        ...values,
        BeginTime: values.BeginTime && moment(values.BeginTime).format('YYYY-MM-DD 00:00:00'),
        EndTime: values.EndTime && moment(values.EndTime).format('YYYY-MM-DD 23:59:59'),
        CreateUserID: type === 'add' ? JSON.parse(Cookie.get('currentUser')).UserId : values.CreateUserID,
      }, () => {
        setFromVisible(false)
        onFinish(pageIndex, pageSize)
      })


    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    const values = await form.validateFields();
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize)
  }


  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(10)

  const handleTableChange2 = async (PageIndex, PageSize) => { //分页 监测点
    const values = await form.validateFields();
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    props.getProjectPointList({ ID: ID, ProjectCode: ProjectCode, PageIndex: PageIndex, PageSize: PageSize, })
  }
  // const searchComponents = () =>{
  //    return  <Form
  //   form={form}
  //   name="advanced_search"
  //   className={styles['ant-advanced-search-form']}
  //   onFinish={()=>{onFinish(pageIndex,pageSize)}}
  // >  
  //        <Row align='middle'> 
  //        <Col span={8}>
  //         <Form.Item   name='ProjectName' label='合同名称'>
  //           <Input placeholder="请输入合同名称" allowClear/>
  //         </Form.Item>
  //       </Col>
  //       <Col span={8}>
  //         <Form.Item name='ProjectCode' label='项目编号' >
  //           <Input placeholder="请输入项目编号" allowClear/>
  //         </Form.Item>
  //       </Col>
  //       {expand&& <><Col span={8}>
  //         <Form.Item name='BegTime' label='运维合同起始日期' >
  //         <RangePicker style={{width:'100%'}}
  //           showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}
  //           />
  //         </Form.Item>
  //       </Col>  
  //       <Col span={8}>
  //         <Form.Item   name='EntName' label='卖方公司名称'>
  //           <Input placeholder="请输入卖方公司名称" />
  //         </Form.Item>
  //       </Col>
  //       <Col span={8}>
  //         <Form.Item name='RegionCode' label='客户所在地' >
  //          {/* <RegionList style={{ width: '100%' }} /> */}
  //          <Input  placeholder='请输入客户所在地'/>
  //         </Form.Item>
  //       </Col>
  //       <Col span={8}>
  //         <Form.Item name='EndTime' label='运维合同结束日期' format='YYYY-MM-DD 23:59:59'>
  //         <RangePicker style={{width:'100%'}} 
  //          showTime={{format:'YYYY-MM-DD HH:mm:ss',defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}/>
  //         </Form.Item>
  //       </Col></>}   
  //       <Col span={expand ? 24 : 8} style={{textAlign:expand ? 'right':'left'}}>
  //       <Form.Item>
  //       <Button type="primary" htmlType="submit">
  //           查询
  //         </Button>
  //         <Button style={{  margin: '0 8px',}} onClick={() => {  form.resetFields(); }}  >
  //           重置
  //         </Button>

  //     <a  onClick={() => {setExpand(!expand);  }} >
  //      {expand ? <>收起 <UpOutlined /></>  : <>展开 <DownOutlined /></>} 
  //     </a>
  //     </Form.Item>
  //     </Col>
  //     </Row>   
  //     <Row  align='middle'>
  //    <Button  icon={<PlusOutlined />} type="primary" onClick={()=>{ add()}} >
  //         添加
  //    </Button>
  //      <Button icon={<ExportOutlined />} loading={exportLoading} style={{  margin: '0 8px',}} onClick={()=>{ exports()} }>
  //           导出
  //         </Button> 
  //     </Row>   
  //    </Form>
  // }
  const startDisabledDate = (current) => {
    const time = form2.getFieldValue('EndTime')
    return time && current && current > moment(time).startOf('day');
  }
  const endDisabledDate = (current) => {
    const time = form2.getFieldValue('BeginTime')
    return time && current && current < moment(time).endOf('day');
  }

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { onFinish(pageIndex, pageSize) }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Form.Item name='ProjectName' label='合同名称'>
            <Input placeholder="请输入合同名称" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='ProjectCode' label='项目编号' >
            <Input placeholder="请输入项目编号" allowClear />
          </Form.Item>
        </Col>
        {expand && <>  <Col span={8}>
          <Form.Item name='BegTime' label='运维日期' >
            <RangePicker style={{ width: '100%' }}
              showTime={{ format: 'YYYY-MM-DD HH:mm:ss', defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')] }}
            />
          </Form.Item>
        </Col>
          <Col span={8}>
            <Form.Item name='EntName' label='卖方公司名称'>
              <Input placeholder="请输入卖方公司名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='RegionCode' label='客户所在地' >
              <Input placeholder='请输入客户所在地' allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='OperationCompany' label='所属运维单位' >
              <Input placeholder='请输入所属运维单位' allowClear />
            </Form.Item>
          </Col></>}
        <Col span={8} >
          <Form.Item style={{ marginLeft: 30 }}>
            <Button type="primary" htmlType="submit">
              查询
         </Button>
            <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}  >
              重置
         </Button>

            <a onClick={() => { setExpand(!expand); }} >
              {expand ? <>收起 <UpOutlined /></> : <>展开 <DownOutlined /></>}
            </a>
          </Form.Item>
        </Col>
      </Row>
      <Row align='middle'>
        <Button icon={<PlusOutlined />} type="primary" onClick={() => { add() }} >
          添加
    </Button>
        <Button icon={<ExportOutlined />} loading={exportLoading} style={{ margin: '0 8px', }} onClick={() => { exports() }}>
          导出
         </Button>
      </Row>
    </Form>
  }
  return (
    <div className={styles.projectManagerSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            scroll={{ y: expand ? 'calc(100vh - 470px)' : 'calc(100vh - 370px)' }}
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
      </BreadcrumbWrapper>

      <Modal
        title={type === 'edit' ? '编辑项目' : '添加项目'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={loadingConfirm}
        onCancel={() => { setFromVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
        centered
      >
        <Form
          name="basic"
          form={form2}
          initialValues={{
            //  CreateUserID:JSON.parse(Cookie.get('currentUser')).UserId
          }}
        >

          <Row>
            <Col span={12}>
              <Form.Item label="合同名称" name="ProjectName" rules={[{ required: true, message: '请输入合同名称!', },]} >
                <Input placeholder='请输入合同名称' allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="项目编号" name="ProjectCode" rules={[{ required: true, message: '请输入项目编号!', },]} >
                <Input placeholder='请输入项目编号' allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="客户所在地" name="RegionCode" rules={[{ required: true, message: '请输入客户所在地!', },]} >
                {/* <RegionList style={{ width: '100%' }} /> */}
                <Input placeholder='请输入客户所在地' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="卖方公司" name="SellCompanyName" rules={[{ required: true, message: '请输入卖方公司!', },]} >
                <Input placeholder='请输入卖方公司' />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="行业" name="IndustryCode" >
                <Input placeholder='请输入行业' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="签订人" name="SignName" rules={[{ required: true, message: '请输入签订人!', },]} >
                <Input placeholder='请输入签订人' />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="运维合同起始日期" name="BeginTime" rules={[{ required: true, message: '请输入运维合同起始日期!', },]} >
                <DatePicker disabledDate={startDisabledDate} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="运维合同结束日期" name="EndTime" rules={[{ required: true, message: '请输入运维合同结束日期!', },]} >
                <DatePicker disabledDate={endDisabledDate} />
              </Form.Item>
            </Col>
          </Row>


          <Row>
            <Col span={12}>
              <Form.Item label="运维套数" name="OperationCount" rules={[{ required: true, message: '请输入运维套数!', },]} >
                <InputNumber placeholder='请输入运维套数' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="运维月数" name="OperationMonth" rules={[{ required: true, message: '请输入运维月数!', },]} >
                <InputNumber placeholder='请输入运维月数' />
              </Form.Item>
            </Col>
          </Row>

          <Row align='middle'>
            {/* <Col span={12}>

      <Form.Item label="合同总金额(万)" name="Money"  >
        <Input placeholder='请输入合同总金额'/>
      </Form.Item>
      </Col> */}
            <Col span={12}>
              <Form.Item label="所属运维单位" name="OperationCompany" rules={[{ required: true, message: '请选择所属运维单位!', },]}>
                <OperationCompanyList getDefaultOpration={(defaultId) => { type === 'add' && form2.setFieldsValue({ OperationCompany: defaultId }) }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="备注" name="Remark"  >
                <Input placeholder='请输入备注' />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="ID" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="CreateUserID" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="deleteFlag" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`${ProjectName} - ${ProjectCode}`}
        visible={tableVisible}
        onCancel={() => { setTableVisible(false) }}
        footer={null}
        destroyOnClose
        width='90%'
      >
        <Button style={{ marginBottom: 10 }} icon={<ExportOutlined />} loading={exportPointLoading} onClick={() => { pointExports() }}>
          导出
          </Button>
        <SdlTable
          resizable
          loading={pointLoading}
          bordered
          dataSource={pointDatas}
          columns={pointColumns}
          pagination={{
            total: pointDatasTotal,
            pageSize: pageSize2,
            current: pageIndex2,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handleTableChange2,
          }}
        />
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);