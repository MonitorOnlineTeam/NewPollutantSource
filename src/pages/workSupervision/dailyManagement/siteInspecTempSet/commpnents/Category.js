
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Tag, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import NumTips from '@/components/NumTips'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'siteInspecTempSet'




const dvaPropsData = ({ loading, siteInspecTempSet, global, common }) => ({
  tableDatas: siteInspecTempSet.inspectorTypeItemList,
  tableTotal: siteInspecTempSet.inspectorTypeItemListTotal,
  tableLoading: loading.effects[`${namespace}/getInspectorTypeItemList`],
  saveLoading: loading.effects[`${namespace}/addOrEditInspectorTypeItem`],
  inspectorTypeloading: loading.effects[`${namespace}/getInspectorTypeCode`],
  clientHeight: global.clientHeight,
  MaxNum: siteInspecTempSet.MaxNum,
  inspectorTypeList: siteInspecTempSet.inspectorTypeList,
  assessmentMethodList: siteInspecTempSet.assessmentMethodList,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getInspectorTypeItemList: (payload) => { // 列表
      dispatch({
        type: `${namespace}/getInspectorTypeItemList`,
        payload: payload,
      })
    },
    addOrEditInspectorTypeItem: (payload, callback) => { // 添加 or 编辑
      dispatch({
        type: `${namespace}/addOrEditInspectorTypeItem`,
        payload: payload,
        callback: callback
      })
    },

    deleteInspectorType: (payload, callback) => { // 删除
      dispatch({
        type: `${namespace}/deleteInspectorType`,
        payload: payload,
        callback: callback
      })
    },
    changeInspectorTypeStatus: (payload, callback) => { // 更改状态
      dispatch({
        type: `${namespace}/changeInspectorTypeStatus`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [scoreDis, setScoreDis] = useState(false);
  const { tableDatas, tableTotal, tableLoading, clientHeight, saveLoading, MaxNum, inspectorTypeloading, inspectorTypeList, assessmentMethodList } = props;


  useEffect(() => {
    onFinish(pageIndex, pageSize);
  }, []);





  const [ID, setID] = useState()
  const [title, setTitle] = useState('添加')

  const columns = [
    {
      title: '序号',
      dataIndex: 'TypeNum',
      key: 'TypeNum',
      align: 'center',
    },
    {
      title: 'CEMS型号',
      dataIndex: 'PollutantTypeName',
      key: 'PollutantTypeName',
      align: 'center',
    },
    {
      title: '检查项目',
      dataIndex: 'InspectorTypeName',
      key: 'InspectorTypeName',
      align: 'center',
    },
    {
      title: '督查类别描述',
      dataIndex: 'InspectorTypeDescribe',
      key: 'InspectorTypeDescribe',
      align: 'center',
    },
    {
      title: '使用状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      width:100,
      render: (text, record) => {
        if (text == 1) {
          return <span onClick={() => { statusChange(record) }}><Tag style={{ cursor: 'pointer' }} color="blue">启用</Tag></span>;
        }
        if (text == 0) {
          return <span onClick={() => { statusChange(record) }}><Tag style={{ cursor: 'pointer' }} color="red">停用</Tag></span>;
        }
      },
    },
    {
      title: '排序',
      dataIndex: 'AssessmentMethodName',
      key: 'AssessmentMethodName',
      align: 'center',
      width:80,
    },
    {
      title: '操作',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      render: (text, record) => {
        return (
          <>
            <Tooltip title="编辑">
              <a onClick={() => {
                setTitle('编辑')
                edit(record)
              }}  >
                <EditOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="删除">
              <Popconfirm placement="top" title="确定要删除这条数据吗？" onConfirm={() => del(record)} okText="是" cancelText="否">
                <a> <DelIcon /> </a>
              </Popconfirm>
            </Tooltip>
          </>
        )
      }

    }
  ]


  const onFinish = async (pageIndexs, pageSizes) => {  //查询
    try {
      const values = await form.validateFields();
      props.getInspectorTypeItemList({
        ...values,
        pageIndex: pageIndexs,
        pageSize: pageSizes
      })


    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const del = (row) => {
    props.deleteInspectorType({ ID: row.ID }, () => {
      setPageIndex(1)
      onFinish(1, pageSize)
    })
  }
  const statusChange = (row) => {
    props.changeInspectorTypeStatus({ ID: row.ID, Status: row.Status }, () => { onFinish(pageIndex, pageSize) })
  }

  const edit = (row) => {
    form2.setFieldsValue({ ...row })
    row.AssessmentMethodName === '计分' ? setScoreDis(false) : setScoreDis(true)
    setVisible(true)
  }
  const add = () => {
    form2.resetFields()
    form2.setFieldsValue({
      TypeNum: MaxNum,
      InspectorType: inspectorTypeList[0] && inspectorTypeList[0].ChildID,
      AssessmentMethod: assessmentMethodList[1] && assessmentMethodList[1].ChildID,

    })
    setTitle('添加')
    setScoreDis(false)
    setVisible(true)
  }

  const save = async () => {
    try {
      const values = await form2.validateFields();
      props.addOrEditInspectorTypeItem({
        ...values,
      }, () => {
        setVisible(false)
        onFinish(pageIndex, pageSize)
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const [visible, setVisible] = useState(false)





  const assessMethod = form2.getFieldValue('AssessmentMethod')

  const assessMethodChange = (val) => {
    if (val == 490) {
      setScoreDis(false)
    } else {
      setScoreDis(true)
    }
  }

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)
  }
  return (
    <div>
      <Form
        form={form}
        name="advanced_search"
        onFinish={() => { onFinish(pageIndex, pageSize) }}
        initialValues={{
        }}
        layout='inline'
        style={{paddingBottom:8}}
      >
        <Form.Item label='系统型号' name='aaa'>
          <Input placeholder='请输入' allowClear/>
        </Form.Item>
        <Form.Item label='检查项目' name='aaa'>
          <Input placeholder='请输入' allowClear/>
        </Form.Item>
        <Form.Item label='使用状态' name='bbb' >
          <Select placeholder='请选择' allowClear  style={{width:100}}>
            <Option value={1}>启用</Option>
            <Option value={0}>停用</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={tableLoading} htmlType="submit">
            查询
          </Button>
          <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
            重置
          </Button>
          <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: 8 }} onClick={add}>
            添加
            </Button>
        </Form.Item>
      </Form>
      <SdlTable
        loading={tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        resizable
        pagination={{
          total: tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />
      <Modal
        title={title}
        visible={visible}
        onOk={save}
        okText='保存'
        destroyOnClose={true}
        onCancel={() => { setVisible(false); }}
        width='50%'
        confirmLoading={saveLoading}
        wrapClassName={styles.categoryModalSty}
      >
        <Form
          form={form2}
          name="advanced_search2"
          initialValues={{
            Status: 1,
          }}
        >
              <Form.Item label='CEMS型号' name='InspectorType' rules={[{ required: true, message: '请选择CEMS型号！' }]}>
                <Select placeholder='请选择' showSearch optionFilterProp="children"  loading={inspectorTypeloading} fieldNames={{label:'Name',value:'ChildID'}} options={inspectorTypeList} />
              </Form.Item>
            <Form.Item label="检查项目" name="bb" rules={[{ required: true, message: '请输入检查项目！' }]}>
              <Input placeholder='请输入'  />
            </Form.Item>
            <Form.Item label="使用状态" name="Status" rules={[{ required: true, message: '请选择使用状态！' }]}>
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>停用</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="排序" name="Fraction" rules={[{ required: true, message: '请输入排序！' }]}>
              <InputNumber placeholder='请输入' disabled={scoreDis} />
            </Form.Item>
          <Form.Item name="ID" hidden />
        </Form>
      </Modal>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);