/**
 * 功  能：运维任务管理
 * 创建人：贾安波
 * 创建时间：2021.11
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
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

const namespace = 'operaTask'




const dvaPropsData = ({ loading, operaTask }) => ({
  tableDatas: operaTask.tableDatas,
  pointDatas: operaTask.pointDatas,
  tableLoading: operaTask.tableLoading,
  tableTotal: operaTask.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addSystemModel`],
  loadingEditConfirm: loading.effects[`${namespace}/editSystemModel`],
  monitoringTypeList: operaTask.monitoringTypeList,
  manufacturerList: operaTask.manufacturerList,
  // exportLoading: loading.effects[`${namespace}/exportProjectInfoList`],
  maxNum: operaTask.maxNum,
  systemModelNameList: operaTask.systemModelNameList,
  systemModelNameListLoading: loading.effects[`${namespace}/getSystemModelNameList`],
  exportLoading: loading.effects[`${namespace}/exportSystemModelList`],
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

  const [data, setData] = useState([]);

  const [editingKey, setEditingKey] = useState('');
  const [count, setCount] = useState(513);
  const [DGIMN, setDGIMN] = useState('')
  const [expand, setExpand] = useState(false)
  const [fromVisible, setFromVisible] = useState(false)
  const [tableVisible, setTableVisible] = useState(false)

  const [type, setType] = useState('add')
  // const [pageSize,setPageSize] = useState(20)
  // const [pageIndex,setPageIndex] = useState(1)



  const { tableDatas, tableTotal, tableLoading, monitoringTypeList, manufacturerList, loadingAddConfirm, loadingEditConfirm, exportLoading, maxNum, systemModelNameList, systemModelNameListLoading } = props;
  useEffect(() => {
    onFinish();

  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return  (index + 1) + (pageIndex-1)*pageSize;
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
      width: 180,
      fixed: 'right',
      render: (text, record) => {
        return <span>
          <Fragment><Tooltip title="编辑"> <a onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
          <Fragment> <Tooltip title="删除">
            <Popconfirm title="确定要删除此条信息吗？" style={{ paddingRight: 5 }} onConfirm={() => { del(record) }} okText="是" cancelText="否">
              <a><DelIcon /></a>
            </Popconfirm>
          </Tooltip>
          </Fragment>
        </span>
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



  const onFinish = async (pageIndexs) => {  //查询

    try {
      const values = await form.validateFields();

      pageIndexs && typeof pageIndexs === "number" ? setPageIndex(pageIndexs) : setPageIndex(1); //除编辑  每次查询页码重置为第一页

      props.bWWebService({
        pageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : 1,
        pageSize: pageSize,
        functionName:'M_GetALLOperationTask',
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();//触发校验
      type === 'add' ? props.addSystemModel({
        ...values,
      }, () => {
        setFromVisible(false)
        onFinish()
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

  const exports = () => { //导出
    const values = form.getFieldsValue();
    props.exportSystemModelList({
      ...values,
    })
  }

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
  }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      initialValues={{
        // Status:1
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={()=>{onFinish()}}
      layout='inline'
    >
     <Form.Item label="关键字" name="ManufacturerID" >
          <Input placeholder='请输入'/>
        </Form.Item>
        <Form.Item label="任务状态" name="Status" style={{ margin: '0 16px' }} >
          <Select placeholder='请选择状态' allowClear style={{ width: 200 }}>
            <Option key={1} value={1}>启用</Option>
            <Option key={2} value={2}>停用</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType='submit' loading={tableLoading} style={{ marginRight: 8 }}>
            查询
          </Button>
        </Form.Item>
    </Form>
  }

  return (
    <div className={styles.operaTaskSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
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
                  {
                    manufacturerList[0] && manufacturerList.map(item => {
                      return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="监测类别" name="MonitoringType" rules={[{ required: true, message: '请选择监测类别' }]} >
                <Select placeholder='请选择监测类别' allowClear disabled>
                  {
                    monitoringTypeList[0] && monitoringTypeList.map(item => {
                      return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="系统名称" name="SystemName" rules={[{ required: true, message: '请选择系统名称' }]} >
                {systemModelNameListLoading ? <Spin size='small' />
                  :
                  <Select placeholder='请选择系统名称' allowClear>
                    {
                      systemModelNameList[0] && systemModelNameList.map(item => {
                        return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                      })
                    }
                  </Select>
                }
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