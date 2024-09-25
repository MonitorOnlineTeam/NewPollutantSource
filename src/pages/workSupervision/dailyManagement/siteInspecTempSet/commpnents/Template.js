
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Descriptions, Select, Tag, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, Space } from 'antd';
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
import cuid from 'cuid';
import classNames from 'classnames';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'siteInspecTempSet'




const dvaPropsData = ({ loading, siteInspecTempSet, global, common }) => ({
  tableDatas: siteInspecTempSet.inspectorTemplateList,
  tableTotal: siteInspecTempSet.inspectorTemplateListTotal,
  tableLoading: loading.effects[`${namespace}/getInspectorTemplateList`],
  inspectorTypeList: siteInspecTempSet.inspectorTypeList,//督查类别
  inspectorTypeDescloading: loading.effects[`${namespace}/getInspectorTypeList`],
  inspectorTypeDescList: siteInspecTempSet.inspectorTypeDescList,//类别描述
  saveloading: loading.effects[`${namespace}/addOrEditInspectorTemplate`],
  inspectorTemplateView: siteInspecTempSet.inspectorTemplateView,
  detailLoading: loading.effects[`${namespace}/getInspectorTemplateView`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getInspectorTemplateList: (payload) => { // 列表
      dispatch({
        type: `${namespace}/getInspectorTemplateList`,
        payload: payload,
      })
    },

    addOrEditInspectorTemplate: (payload, callback) => { // 添加 or 编辑
      dispatch({
        type: `${namespace}/addOrEditInspectorTemplate`,
        payload: payload,
        callback: callback
      })
    },
    deleteInspectorTemplate: (payload, callback) => { // 删除
      dispatch({
        type: `${namespace}/deleteInspectorTemplate`,
        payload: payload,
        callback: callback
      })
    },
    getInspectorTypeList: (payload, callback) => { // 类别描述
      dispatch({
        type: `${namespace}/getInspectorTypeList`,
        payload: payload,
        callback: callback
      })
    },
    changeInspectorTemplateStatus: (payload, callback) => { // 更改状态
      dispatch({
        type: `${namespace}/changeInspectorTemplateStatus`,
        payload: payload,
        callback: callback
      })
    },
    getInspectorTemplateView: (payload, callback) => { // 详细
      dispatch({
        type: `${namespace}/getInspectorTemplateView`,
        payload: payload,
        callback: callback,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const { tableDatas, tableLoading, clientHeight, type, tableTotal, detailLoading, inspectorTypeDescloading, saveloading, inspectorTypeList, inspectorTypeDescList, inspectorTemplateView } = props;


  useEffect(() => {
    onFinish(pageIndex, pageSize);

  }, []);






  const [ID, setID] = useState()
  const [title, setTitle] = useState('添加')

  const columns = [
    {
      title: '表单编号',
      dataIndex: 'InspectorNum',
      key: 'InspectorNum',
      align: 'center',
    },
    {
      title: 'CEMS型号',
      dataIndex: 'PollutantTypeName',
      key: 'PollutantTypeName',
      align: 'center',
    },
    {
      title: '检查表名称',
      dataIndex: 'InspectorName',
      key: 'InspectorName',
      align: 'center',
    },
    {
      title: '生效日期',
      dataIndex: 'EffectiveDate',
      key: 'EffectiveDate',
      align: 'center',
      render: (text, record) => {
        return text && moment(text).format("YYYY-MM-DD")
      },
    },

    {
      title: '使用状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
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
      title: '创建人',
      dataIndex: 'CreateUser',
      key: 'CreateUser',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
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
              <a onClick={() => { detail(record) }}>
                <ProfileOutlined style={{ fontSize: 16 }} />
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
  const statusChange = (row) => {
    props.changeInspectorTemplateStatus({ InspectorNum: row.InspectorNum, Status: row.Status }, () => { onFinish(pageIndex, pageSize) })
  }


  const onFinish = async (pageIndexs, pageSizes) => {  //查询
    try {
      const values = await form.validateFields();
      props.getInspectorTemplateList({
        ...values,
        pageIndex: pageIndexs,
        pageSize: pageSizes
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const del = (row) => {
    props.deleteInspectorTemplate({ ID: row.InspectorNum }, () => {
      setPageIndex(1)
      onFinish(1, pageSize)
    })
  }

  const [editInspectorNum, setEditInspectorNum] = useState()
  const [status, setStatus] = useState(0)

  const edit = (row) => {
    setVisible(true)
    setEditInspectorNum(row.InspectorNum)
    setStatus(row.Status)
    getInspectorTypeList(row.PollutantType, () => { //先获取描述内容列表
      props.getInspectorTemplateView({
        InspectorNum: row.InspectorNum,
      }, (data) => {
        if (data) {
          form2.setFieldsValue({
            PollutantType: data.PollutantTypeName == '废气' ? 2 : 1,
            InspectorName: data.InspectorName,
            EffectiveDate: data.EffectiveDate && moment(data.EffectiveDate),
          })
        }

        let echoData = []
        const inspectorTypeModelList = data.InspectorTypeModelList;
        if (inspectorTypeModelList && inspectorTypeModelList[0]) {
          const echoData = inspectorTypeModelList.map(item => {
            return {
              Sort: item.Sort,
              InspectorTypeId: item.InspectorTypeId,
              InspectorContent: item.InspectorContent,
              ID: cuid(),
              editable: true,
              type: 'edit',
            }

          })
          setData([...echoData])
          echoData.map(item => {
            form2.setFieldsValue({
              [`InspectorTypeId${item.ID}`]: item.InspectorTypeId,
              [`InspectorContent${item.ID}`]: item.InspectorContent,
            })
          })
        }
      })



    })

  }

  const detail = (row) => {
    setDetailVisible(true)
    props.getInspectorTemplateView({
      InspectorNum: row.InspectorNum,
    }, (data) => { })
  }

  const getInspectorTypeList = (type, callback) => {
    props.getInspectorTypeList({ PollutantType: type }, () => {
      form2.resetFields();
      form2.setFieldsValue({ PollutantType: type })
      callback && callback();
    })
  }
  const add = () => {
    setVisible(true)
    setTitle('添加')
    setData([])
    getInspectorTypeList(2)
  }


  const save = async () => {
    const values = await form2.validateFields();
    try {
      const inspectorTemplateList = data.map((item, index) => {
        return {
          Sort: index + 1,
          InspectorTypeId: values[`InspectorTypeId${item.ID}`],
          InspectorContent: values[`InspectorContent${item.ID}`],
        }
      })
      const par = {
        InspectorNum: title === '编辑' ? editInspectorNum : undefined,
        PollutantType: values.PollutantType,
        InspectorName: values.InspectorName,
        EffectiveDate: values.EffectiveDate ? moment(values.EffectiveDate).startOf('days').format("YYYY-MM-DD HH:mm:ss") : null,
        InspectorTemplateList: inspectorTemplateList,
        Status: status,
      }

      props.addOrEditInspectorTemplate({
        ...par,
      }, () => {
        setVisible(false)
        onFinish(pageIndex, pageSize)
      })
    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }
  const [visible, setVisible] = useState(false)










  const columns2 = [
    {
      title: '序号',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      width: 54,
    },
    {
      title: '检查项目',
      dataIndex: `${visible ? "InspectorTypeId" : 'InspectorTypeName'}`,
      align: 'center',
      editable: true,
      width: 400,
    },
    {
      title: '要求',
      dataIndex: 'InspectorContent',
      key: 'InspectorContent',
      align: 'center',
      editable: true,
      width: 'auto',
    },
    {
      title: '设定值',
      dataIndex: 'aa',
      key: 'aa',
      align: 'center',
      editable: true,
      width: 120,
    },
    {
      title: '显示值',
      dataIndex: 'bb',
      key: 'bb',
      align: 'center',
      editable: true,
      width: 120,
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return <span onClick={() => { cancel(record) }}> {/*编辑的删除 */}
          <a>删除</a>
        </span>
      }
    }
  ]
  const addCol = columns2.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.title === '检查项目' ? 'select' : col.title === '要求' ? 'textArea' : 'input',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: true,
        // editing:record.type=='add' || col.title ==='督查类别'? true : false,
      }),
    };
  });


  const cancel = (record) => {
    const newData = [...data];
    const index = newData.findIndex((item) => record.Sort === item.Sort);
    const item = newData[index];
    newData.splice(index, 1);
    setData(newData);
  };
  const [data, setData] = useState([])
  const handleAdd = () => {
    const newData = {
      Sort: data.length + 1,
      InspectorTypeId: "",
      InspectorTypeName: "",
      ID: cuid(),
      editable: true,
      type: 'add',
    }
    setData([...data, newData])
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)
  }

  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'PollutantType') {
      getInspectorTypeList(hangedValues.PollutantType)
    }
  }
  const [detailVisible, setDetailVisible] = useState(false)
  return (
    <div>
      <Form
        form={form}
        name="advanced_search"
        onFinish={() => { onFinish(pageIndex, pageSize) }}
        initialValues={{
        }}
        layout='inline'
        style={{ paddingBottom: 8 }}
      >
        <Form.Item label='系统型号' name='aaa'>
          <Input placeholder='请输入' allowClear />
        </Form.Item>
        <Form.Item label='检查项目' name='bbb'>
          <Input placeholder='请输入' allowClear />
        </Form.Item>
        <Form.Item label='使用状态' name='Status' >
          <Select placeholder='请选择' allowClear style={{ width: 100 }}>
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
        resizable
        loading={tableLoading}
        dataSource={[1]}
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
      <Modal
        title={title}
        visible={visible}
        onOk={save}
        okText='保存'
        destroyOnClose={true}
        onCancel={() => { setVisible(false); }}
        width='80%'
        confirmLoading={title === '添加' ? saveloading : saveloading || detailLoading}
        wrapClassName={`spreadOverModal isFooterSty ${styles.telModalSty}`}
        mask={false}
      >
        <Spin spinning={title === '添加' ? false : detailLoading}>
          <Form
            form={form2}
            name="advanced_search2"
            className={styles.addForm}
            onValuesChange={onValuesChange}

          >
            <Row>
              <Form.Item label="CEMS型号" name="PollutantType" >
                <Select placeholder='请选择' style={{ width: 150 }} showSearch optionFilterProp="children" loading={false} fieldNames={{ label: 'Name', value: 'ChildID' }} options={inspectorTypeList} />
              </Form.Item>
              <Form.Item label='检查表名称' name='InspectorName' rules={[{ required: true, message: '请输入督查表名称' }]} style={{ margin: '0 16px' }}>
                <Input placeholder='请输入' allowClear />
              </Form.Item>
              <Form.Item label="生效日期" name="EffectiveDate"  >
                <DatePicker />
              </Form.Item>
            </Row>
            <div className={'addEditTable'} >
              <SdlTable
                loading={tableLoading}
                className={`compactTableSty add`}
                rowClassName={false}
                scroll={{ x: 980, y: 'calc(100vh - 294px)' }}
                bordered
                dataSource={data}
                columns={addCol}
                pagination={false}
                components={{
                  body: {
                    cell: ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
                      const inputNode = title === '检查项目' ?
                        <Space>
                          <Form.Item name={`${dataIndex}aa`} rules={[{ required: true, message: `请选择污染物监测系统` }]} style={{ margin: 0 }} >
                            <Select placeholder={`请选择污染物监测系统`} allowClear showSearch optionFilterProp="children" loading={false} fieldNames={{ label: 'Name', value: 'ChildID' }} options={inspectorTypeList} />
                          </Form.Item>
                          <Form.Item name={`${dataIndex}bb`} rules={[{ required: true, message: `请输入监测点位` }]} style={{ margin: 0 }} >
                            <Input rows={1} placeholder={`请输入监测点位`} />
                          </Form.Item>
                        </Space>
                        :
                        title === '要求' ?
                          <TextArea rows={1} placeholder={`请输入`} allowClear />
                          :
                          <InputNumber rows={1} placeholder={`请输入`} allowClear />
                      return <td {...restProps}>
                        {editing ?
                          title === '检查项目' ?
                            inputNode
                            :
                            <Form.Item name={`${dataIndex}${record.ID}`} rules={[{ required: true, message: `请输入${title}` }]} style={{ margin: 0 }} >
                              {inputNode}
                            </Form.Item>
                          :
                          children
                        }
                      </td>
                    }
                  },

                }}
              />
            </div>
            <Button style={{ marginTop: 8 }} type="dashed" block icon={<PlusOutlined />} onClick={() => handleAdd()} >
              添加
       </Button>
          </Form>
        </Spin>
      </Modal>

      <Modal
        title={'详情'}
        visible={detailVisible}
        onOk={save}
        okText='保存'
        destroyOnClose={true}
        onCancel={() => { setDetailVisible(false); }}
        width='80%'
        footer={null}
        mask={false}
        wrapClassName={`spreadOverModal ${styles.detailModal}`}
      >
        <Spin spinning={false}>
          <Descriptions>
            <Descriptions.Item label="CEMS型号">Zhou Maomao</Descriptions.Item>
            <Descriptions.Item label="检查表名称">1810000000</Descriptions.Item>
            <Descriptions.Item label="生效日期">Hangzhou, Zhejiang</Descriptions.Item>
          </Descriptions>
          <SdlTable
            bordered
            resizable
            scroll={{ x: 980, y: 'calc(100vh - 294px)' }}
            dataSource={inspectorTemplateView.InspectorTypeModelList}
            columns={columns2.filter(item => item.title != '操作')}
            pagination={false}
          />
        </Spin >
      </Modal>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);