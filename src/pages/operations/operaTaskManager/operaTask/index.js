/**
 * 功  能：运维任务管理
 * 创建人：贾安波
 * 创建时间：2021.11
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, Tabs, } from 'antd';
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
import NumTips from '@/components/NumTips'
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const namespace = 'operaTask'




const dvaPropsData = ({ loading, operaTask }) => ({
  tableDatas: operaTask.tableDatas,
  tableLoading: operaTask.tableLoading,
  tableTotal: operaTask.tableTotal2,
  tableDatas2: operaTask.tableDatas2,
  tableLoading2: operaTask.tableLoading2,
  tableTotal2: operaTask.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/exportSystemModelList`],
  loadingEditConfirm: loading.effects[`${namespace}/exportSystemModelList`],

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    bWWebService: (payload) => {
      dispatch({
        type: `${namespace}/bWWebService`,
        payload: payload,
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();








  const { tableDatas, tableTotal, tableLoading,tableDatas2, tableTotal2, tableLoading2, loadingAddConfirm , loadingEditConfirm,  } = props;
  useEffect(() => {
    onFinish(pageIndex);
    onFinish2(pageIndex2)
  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return taskType==='1'? (index + 1) + (pageIndex - 1) * pageSize : (index + 1) + (pageIndex2 - 1) * pageSize2;
      }
    },
    {
      title: '任务名称',
      dataIndex: 'RWMC',
      key: 'RWMC',
      align: 'left',
    },
    {
      title: '任务编号',
      dataIndex: 'RWBH',
      key: 'RWBH',
      align: 'left',
    },
    {
      title: '任务类型',
      dataIndex: 'RWMC',
      key: 'RWMC',
      align: 'center',
    },
    {
      title: '任务开始日期',
      dataIndex: 'RWRQKS',
      key: 'RWRQKS',
      align: 'center',
    },
    {
      title: '任务结束日期',
      dataIndex: 'RWRQJS',
      key: 'RWRQJS',
      align: 'center',
    },
    {
      title: <span>操作</span>,
      align: 'center',
      width: 190,
      fixed: 'right',
      render: (text, record) => {
        return <>
           <Fragment>
            <a  style={{paddingRight:8}}>上传报告</a> 
            </Fragment>
            <Fragment>
            <a  style={{paddingRight:8}} onClick={() => { edit(record) }} >任务编辑</a> 
            </Fragment>
            <Fragment>
            <Popconfirm title="您确定要完结此运维任务吗？" style={{ paddingRight: 5 }} onConfirm={() => { del(record) }} okText="是" cancelText="否">
              <a style={{paddingRight:8}}>任务完结</a>
            </Popconfirm>
            </Fragment>
            <Fragment>
            <a  style={{paddingRight:8}} onClick={() => { taskDetail(record) }} >任务详情</a> 
            </Fragment>
            <Fragment>
            <a>异常终止</a> 
            </Fragment>
        </>
      }
    },
  ];


  const edit = async (record) => {
    setFromVisible(true)
    setType('edit')
    form2.resetFields();
    try {
      form2.setFieldsValue({
        ...record,
        SystemName: record.ChildID,
        MonitoringType: record.MonitoringTypeID.toString()
      })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const del = async (record) => {
    const values = await form.validateFields();
    props.delSystemModel({ ID: record.ID }, () => {
      setPageIndex(1)
      props.getSystemModelList({
        pageIndex: 1,
        pageSize: pageSize,
        ...values,
      })
    })
  };



  const [type,setType] = useState('add')
  const [fromVisible,setFromVisible] = useState(false)

  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();
    form2.setFieldsValue({ SystemCode: maxNum })
    if (monitoringTypeList && monitoringTypeList[0]) { //监测类别默认值
      monitoringTypeList.map(item => {
        if (item.Code == 266) {
          form2.setFieldsValue({ MonitoringType: item.Code })
        }
      })
    }
  };
  const [taskDetailVisible,setTaskDetailVisible] = useState(false)
  const taskDetail =  (record) => { //任务详情
    setTaskDetailVisible(true)
    props.bWWebService({
      functionName: 'M_GetOperationTaskByID',
      paramList: {
        OPTID: record.ID,
      }
    })
  };

  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();//触发校验
      type === 'add' ? props.addSystemModel({
        ...values,
      }, () => {
        setFromVisible(false)
        onFinish(1)
      })
        :
        props.editSystemModel({
          ...values,
        }, () => {
          setFromVisible(false)
          onFinish(pageIndex)
        })

    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const onFinish = async (pageIndexs) => {  //查询

    try {
      const values = await form.validateFields();

      setPageIndex(pageIndexs); //除编辑  每次查询页码重置为第一页
      props.bWWebService({
        pageIndex: pageIndexs,
        pageSize: pageSize,
        functionName: 'M_GetALLOperationTask',
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onFinish2 = async (pageIndexs) => {  //查询

    try {
      const values = await form2.validateFields();
      setPageIndex2(pageIndexs); //除编辑  每次查询页码重置为第一页
      props.bWWebService({
        pageIndex: pageIndexs,
        pageSize: pageSize,
        functionName: 'M_GetOperationTaskDone',
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }





  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => { //分页 进行中的任务
    setPageIndex(PageIndex)
    setPageSize(PageSize)
  }
  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(20)
  const handleTableChange2 =(PageIndex, PageSize) => { //分页 已完结的任务
    setPageIndex2(PageIndex)
    setPageSize2(PageSize)
  }
  const searchComponents = () => {
    return <Form
      form={taskType==='1'?  form : form2}
      name="advanced_search"
      initialValues={{
        // Status:1
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={() => {taskType==='1'? onFinish(1) : onFinish2(1) }}
      layout='inline'
    >
      <Form.Item label="关键字" name="ManufacturerID" >
        <Input placeholder='请输入' />
      </Form.Item>
      <Form.Item label="任务状态" name="Status" style={{ margin: '0 16px' }} >
        <Select placeholder='请选择状态' allowClear style={{ width: 200 }}>
          <Option key={1} value={1}>启用</Option>
          <Option key={2} value={2}>停用</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={ taskType==='1'? tableLoading : tableLoading2} style={{ marginRight: 8 }}>
          查询
          </Button>
      </Form.Item>
    </Form>
  }
  const [ taskType,setTaskType ] = useState('1')
  return (
    <div className={styles.operaTaskSty}>
      <BreadcrumbWrapper>
      <Card title={searchComponents()}>
        <Tabs onChange={(key)=>{setTaskType(key)}}>
          <TabPane tab="进行中的任务" key='1'>
          <SdlTable
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
  
        </TabPane>
          <TabPane tab="已完结的任务" key='2'>
          <SdlTable
            loading={tableLoading2}
            bordered
            dataSource={tableDatas2}
            columns={columns}
            pagination={{
              total: tableTotal2,
              pageSize: pageSize2,
              current: pageIndex2,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange2,
            }}
          />
        </TabPane>
        </Tabs>
        </Card>
      </BreadcrumbWrapper>

      <Modal
        title={type === 'add' ? '添加' : '编辑'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={type === 'add' ? loadingAddConfirm : loadingEditConfirm}
        onCancel={() => { setFromVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
        centered
      >
        <Form
          name="basic"
          form={form2}
          initialValues={{
            Status: 1
          }}
        >
          <Row>
            <Col span={24}>
              <Form.Item name="ID" hidden>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="编号" name="SystemCode" >
                <InputNumber placeholder='请输入编号' />
              </Form.Item>
              <NumTips />
            </Col>
            <Col span={12}>
              <Form.Item label="设备厂家" name="ManufacturerID" rules={[{ required: true, message: '请选择设备厂家' }]} >
                <Select placeholder='请选择设备厂家' allowClear showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    <Option key={1} value={1}>{1}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="监测类别" name="MonitoringType" rules={[{ required: true, message: '请选择监测类别' }]} >
                <Select placeholder='请选择监测类别' allowClear disabled>
                <Option key={1} value={1}>{1}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="系统名称" name="SystemName" rules={[{ required: true, message: '请选择系统名称' }]} >
                  <Select placeholder='请选择系统名称' allowClear>
                  <Option key={1} value={1}>{1}</Option>
                  </Select> 
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="系统型号" name="SystemModel" rules={[{ required: true, message: '请输入系统型号' }]}>
                <Input placeholder='请输入系统型号' allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="Status" >
                <Radio.Group>
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}>停用</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>


        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);