
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
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
import EntAtmoList from '@/components/EntAtmoList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import NumTips from '@/components/NumTips'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'supervisionList'




const dvaPropsData = ({ loading, supervisionList, global, common }) => ({
  tableDatas: supervisionList.faultFeedbackList,
  inspectorTypeloading: loading.effects[`${namespace}/getInspectorTypeCode`],
  inspectorTypeList: supervisionList.inspectorTypeList,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getFaultFeedbackList: (payload) => { // 列表
      dispatch({
        type: `${namespace}/getFaultFeedbackList`,
        payload: payload,
      })
    },
    updateFaultFeedbackIsSolve: (payload, callback) => { // 编辑
      dispatch({
        type: `${namespace}/updateFaultFeedbackIsSolve`,
        payload: payload,
        callback: callback
      })
    },
    getPointByEntCode: (payload) => { // 根据企业获取监测点
      dispatch({
        type: 'common/getPointByEntCode',
        payload: payload,
      })
    },
    exportFaultFeedback: (payload) => { // 导出
      dispatch({
        type: `${namespace}/exportFaultFeedback`,
        payload: payload,
      })
    },
    getFaultFeedbackEntPoint: (payload) => { // 企业列表
      dispatch({
        type: `${namespace}/getFaultFeedbackEntPoint`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const { tableDatas, tableLoading, clientHeight, type, tableTotal, inspectorTypeloading, inspectorTypeList } = props;


  useEffect(() => {
    onFinish(pageIndex, pageSize);
  }, []);






  const [ID, setID] = useState()
  const [title, setTitle] = useState('添加')

  const columns = [
    {
      title: '表单编号',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
    },
    {
      title: '点位类型',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
    },
    {
      title: '督查表名称',
      dataIndex: 'ParentName',
      key: 'ParentName',
      align: 'center',
    },
    {
      title: '生效日期',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
    },

    {
      title: '使用状态',
      dataIndex: 'IsSolve',
      key: 'IsSolve',
      align: 'center',
      render: (text, record, index) => {
        if (text == 1) {
          return '已解决'
        } else {
          return '待解决'
        }

      }
    },
    {
      title: '创建人',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
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
            <Tooltip title="详情">
              <a onClick={() => {
                router.push({ pathname: '/operations/supervisionList/detail', query: { detailData: JSON.stringify(record) } })
              }}>
                <ProfileOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="删除">
              <Popconfirm placement="left" title="确定要删除此排口吗？" onConfirm={() => del(record)} okText="是" cancelText="否">
                <a href="#" > <DelIcon /> </a>
              </Popconfirm>
            </Tooltip>
          </>
        )
      }

    }
  ]


  const [outOrInside, setOutOrInside] = useState(1)
  const onFinish = async (pageIndexs, pageSizes) => {  //查询
    try {
      const values = await form.validateFields();
      props.getFaultFeedbackList({
        ...values,
        pageIndex: pageIndexs,
        pageSize: pageSizes
      })


    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [count, setCount] = useState(666);
  const handleAdd = () => {
    setCount(count + 1)
    const newData = {
      DetectionLimit: "",
      EquipmentParametersCode: "",
      ID: count,
      editable: true,
    }
    // props.updateState(data:[...data, newData])
  }
  const del = (row) => {

  }

  const edit = () => {
    props.updateFaultFeedbackIsSolve({
      ID: ID,
      IsSolve: IsSolve
    }, () => {
      setVisible(false)
      onFinish(pageIndex, pageSize)
    })
  }
  const add = () => {
    setVisible(true)
  }

  const save = async () => {
    try {
      const values = await form2.getFieldValue();
      props.addOrEditInspectorTypeItem({
        ...values,
      }, () => {
        setVisible(false)
        onFinish()
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const [visible, setVisible] = useState(false)




  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };



  const columns2 = [
    {
      title: '序号',
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '督查类别',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
      editable: true,
    },
    {
      title: '督查内容',
      dataIndex: 'ParentName',
      key: 'ParentName',
      align: 'center',
    },
  ]

  const addCol = columns2.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'select',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: true,
      }),
    };
  });

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)
  }
  return (
    <div className={styles.telSty}>
      <Card
        title={
          <Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish(pageIndex, pageSize) }}
            initialValues={{
            }}
            layout='inline'
            className={styles.queryForm}
          >
            <Form.Item label='点位类别' name='PollutantType'>
              <Select placeholder='请选择' allowClear style={{ width: 150 }}>
                <Option value={2}>废气</Option>
                <Option value={1}>废水</Option>
              </Select>
            </Form.Item>
            {/* <Spin spinning={pointLoading} size='small' style={{ top: -8, left: 20 }}> */}
            <Form.Item label='督查表名称' name='DGIMN'>

              <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 150 }}>
                {/* {
                      pointList[0] && pointList.map(item => {
                        return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                      })
                    } */}
              </Select>
            </Form.Item>
            {/* </Spin> */}
            <Form.Item label='使用状态' name='Status' >
              <Select placeholder='请选择' allowClear style={{ width: 150 }}>
                <Option value={1}>启用</Option>
                <Option value={2}>停用</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" loading={tableLoading} htmlType="submit">
                查询
          </Button>
              <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
                重置
          </Button>
              <Button type="primary" style={{ marginRight: 8 }} onClick={add}>
                添加
            </Button>
              <Button type="primary" onClick={add}>
                复制添加
            </Button>
            </Form.Item>
          </Form>}>
        <SdlTable
          loading={tableLoading}
          bordered
          dataSource={tableDatas}
          columns={columns}
          scroll={{ y: clientHeight - 500 }}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          pagination={{
            total: tableTotal,
            pageSize: pageSize,
            current: pageIndex,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handleTableChange,
          }}
        />
        <div style={{ paddingTop: 10, color: '#f5222d' }}>废气督查类别：原则问题（否觉项，出现1项此点位得0分）、重点问题（每项4分，共60分）、一般问题（每项2分，共40分）</div>
        <div style={{ color: '#f5222d' }}>废水督查类别：原则问题（否觉项，出现1项此点位得0分）、重点问题（每项4分，共60分）、一般问题（每项2分，共40分）</div>
      </Card>
      <Modal
        title={title}
        visible={visible}
        onOk={save}
        okText='保存'
        destroyOnClose={true}
        onCancel={() => { setVisible(false); }}
        width='80%'
        confirmLoading={props.editLoading}
        wrapClassName={styles.telModalSty}
      >
        <Form
          form={form2}
          name="advanced_search2"
          initialValues={{
            PollutantType: 2,
          }}
          className={styles.addForm}
        >
          <Row>
            <Form.Item label="点位类型" name="PollutantType" >
              <Select placeholder='请选择' allowClear style={{ width: 150 }}>
                <Option value={2}>废气</Option>
                <Option value={1}>废水</Option>
              </Select>
            </Form.Item>
            {/* <Spin spinning={pointLoading} size='small' style={{ top: -8, left: 20 }}> */}
            <Form.Item label='督查表名称' name='DGIMN' style={{ margin:'0 8px'}}>

              <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 150 }}>
                {/* {
                      pointList[0] && pointList.map(item => {
                        return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                      })
                    } */}
              </Select>
            </Form.Item>
            {/* </Spin> */}
            <Form.Item label="生效日期" name="Score"  >
              <DatePicker style={{ width: 150 }} />
            </Form.Item>
          </Row>
          <Table
            loading={tableLoading}
            components={{
              body: {
                cell: ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
                  return <td {...restProps}>
                    {editing ? <Select placeholder={`请选择${title}`}>
                      {
                        inspectorTypeList[0] && inspectorTypeList.map(item => {
                          return <Option key={item.ChildID} value={item.ChildID} >{item.Name}</Option>
                        })
                      }
                    </Select>
                      :
                      children
                    }
                  </td>
                }
              },

            }}
            bordered
            dataSource={tableDatas}
            columns={addCol}
            rowClassName="editable-row"
            pagination={false}
          />
          <Button style={{ margin: '10px 0' }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleAdd()} >
            新增成员
       </Button>
        </Form>
      </Modal>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);