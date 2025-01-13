
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
  tableLoading: loading.effects[`${namespace}/GetOnsiteInspectionInfoList`],
  saveloading: loading.effects[`${namespace}/AddOrUpdateOnsiteInspectionInfo`],
  inspectorTemplateView: siteInspecTempSet.inspectorTemplateView,
  detailLoading: loading.effects[`${namespace}/GetOnsiteInspectionInfoDetail`],
  getMonitorCategorySystemListLoading: loading.effects[`${namespace}/GetMonitorCategorySystemList`],
  cemsModelNameList: siteInspecTempSet.cemsModelNameList,
  getOnsiteInspectionTypeListLoading: loading.effects[`${namespace}/GetOnsiteInspectionTypeList`],
  inspectorTypeItemList: siteInspecTempSet.inspectorTypeItemList,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetOnsiteInspectionInfoList: (payload) => { // 列表
      dispatch({
        type: `${namespace}/GetOnsiteInspectionInfoList`,
        payload: payload,
      })
    },

    AddOrUpdateOnsiteInspectionInfo: (payload, callback) => { // 添加 or 编辑
      dispatch({
        type: `${namespace}/AddOrUpdateOnsiteInspectionInfo`,
        payload: payload,
        callback: callback
      })
    },
    DeleteOnsiteInspectionInfo: (payload, callback) => { // 删除
      dispatch({
        type: `${namespace}/DeleteOnsiteInspectionInfo`,
        payload: payload,
        callback: callback
      })
    },
    ChangeOnsiteInspectionInfoStatus: (payload, callback) => { // 更改状态
      dispatch({
        type: `${namespace}/ChangeOnsiteInspectionInfoStatus`,
        payload: payload,
        callback: callback
      })
    },
    GetOnsiteInspectionInfoDetail: (payload, callback) => { // 详细
      dispatch({
        type: `${namespace}/GetOnsiteInspectionInfoDetail`,
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
  const { tableDatas, tableLoading, clientHeight, type, tableTotal, detailLoading, inspectorTypeDescloading, saveloading, inspectorTypeList, inspectorTypeDescList, inspectorTemplateView,getOnsiteInspectionTypeListLoading,getMonitorCategorySystemListLoading,cemsModelNameList, inspectorTypeItemList} = props;


  useEffect(() => {
    onFinish(pageIndex, pageSize);

  }, []);






  const [ID, setID] = useState()
  const [title, setTitle] = useState('添加')

  const columns = [
    {
      title: '表单编号',
      dataIndex: 'Num',
      key: 'Num',
      align: 'center',
    },
    {
      title: 'CEMS型号',
      dataIndex: 'CemsName',
      key: 'CemsName',
      align: 'center',
    },
    {
      title: '检查表名称',
      dataIndex: 'InspectionName',
      key: 'InspectionName',
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
      dataIndex: 'UseStatus',
      key: 'UseStatus',
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
    props.ChangeOnsiteInspectionInfoStatus({ Num: row.Num }, () => { onFinish(pageIndex, pageSize) })
  }


  const onFinish = async (pageIndexs, pageSizes) => {  //查询
    try {
      const values = await form.validateFields();
      props.GetOnsiteInspectionInfoList({
        ...values,
        // pageIndex: pageIndexs,
        // pageSize: pageSizes
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const del = (row) => {
    props.DeleteOnsiteInspectionInfo({ Num: row.Num }, () => {
      // setPageIndex(1)
      onFinish(1, pageSize)
    })
  }

  const edit = (row) => {
      setVisible(true)
      setTitle('编辑')
      props.GetOnsiteInspectionInfoDetail({
        Num: row.Num,
      }, (data) => {
        if (data) {
          form2.setFieldsValue({
            ...data,
            Num:row.Num,
            EffectiveDate: data.EffectiveDate && moment(data.EffectiveDate),
          })
        }

        let echoData = []
        const inspectorTypeModelList = data.InspectorTypeModelList;
        if (inspectorTypeModelList && inspectorTypeModelList[0]) {
          const echoData = inspectorTypeModelList.map(item => {
            return {
              ...item,
              ID: cuid(),
              editable: true,
              type: 'edit',
            }

          })
          setData([...echoData])
          echoData.map(item => {
            form2.setFieldsValue({
              [`MainId${item.ID}`]: item.MainId,
              [`InspectionProject${item.ID}`]: item.InspectionProject,
              [`Require${item.ID}`]: item.Require,
              [`SetValue${item.ID}`]: item.SetValue,
              [`DisplayValue${item.ID}`]: item.DisplayValue,
            })
          })
        }
      })

  }

  const detail = (row) => {
    setDetailVisible(true)
    setDetailTitle()
    props.GetOnsiteInspectionInfoDetail({
      Num: row.Num,
    }, (data) => { })
  }

  const add = () => {
    setVisible(true)
    setTitle('添加')
  }


  const save = async () => {
    const values = await form2.validateFields();
    try {
      const inspectorTemplateList = data.map((item, index) => {
        return {
          Sort: index + 1,
          MainId: values[`MainId${item.ID}`],
          InspectionProject: values[`InspectionProject${item.ID}`],
          Require: values[`Require${item.ID}`],
          SetValue: values[`SetValue${item.ID}`],
          DisplayValue: values[`DisplayValue${item.ID}`],
        }
      })
      const par = {
        Num:values.Num,
        CemsModel: values.CemsModel,
        InspectionName: values.InspectionName,
        EffectiveDate: values.EffectiveDate ? moment(values.EffectiveDate).startOf('days').format("YYYY-MM-DD HH:mm:ss") : null,
        ChildList: inspectorTemplateList,
      }
      props.AddOrUpdateOnsiteInspectionInfo({
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
      dataIndex: 'MainId',
      align: 'center',
      editable: true,
      width: 400,
    },
    {
      title: '要求',
      dataIndex: 'Require',
      key: 'Require',
      align: 'center',
      editable: true,
      width: 'auto',
    },
    {
      title: '设定值',
      dataIndex: 'SetValue',
      key: 'SetValue',
      align: 'center',
      editable: true,
      width: 120,
    },
    {
      title: '显示值',
      dataIndex: 'DisplayValue',
      key: 'DisplayValue',
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

  const columns3= [
    {
      title: '序号',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      width: 54,
    },
    {
      title: '检查项目',
      dataIndex: 'Inspection',
      align: 'center',
      width: 300,
      colSpan: 2,
      render: (value, record) => {
        let obj = {
          children: <div>{value}</div>,
          props: { rowSpan: record.Count },
        };
        return obj;
      }
    },
    {
      title: '监测点位',
      dataIndex: 'InspectionProject',
      align: 'InspectionProject',
      align: 'center',
      colSpan: 0,
    },
    {
      title: '要求',
      dataIndex: 'Require',
      key: 'Require',
      align: 'center',
      width: 'auto',
    },
    {
      title: '设定值',
      dataIndex: 'SetValue',
      key: 'SetValue',
      align: 'center',
      width: 120,
    },
    {
      title: '显示值',
      dataIndex: 'DisplayValue',
      key: 'DisplayValue',
      align: 'center',
      width: 120,
    },
  ]
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
  }
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailTitle, setDetailTitle] = useState('')

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
        <Form.Item label='系统型号' name='CemsModel'>
          <Input placeholder='请输入' allowClear />
        </Form.Item>
        <Form.Item label='检查项目' name='InspectionProject'>
          <Input placeholder='请输入' allowClear />
        </Form.Item>
        <Form.Item label='使用状态' name='UseStatus' >
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
        dataSource={tableDatas}
        columns={columns}
        pagination={false}
        // pagination={{
        //   total: tableTotal,
        //   pageSize: pageSize,
        //   current: pageIndex,
        //   showSizeChanger: true,
        //   showQuickJumper: true,
        //   onChange: handleTableChange,
        // }}
      />
      <Modal
        title={title}
        visible={visible}
        onOk={save}
        okText='保存'
        destroyOnClose={true}
        onCancel={() => { setVisible(false);setData([]);form2.resetFields() }}
        width='80%'
        confirmLoading={title === '添加' ? saveloading : saveloading || detailLoading}
        wrapClassName={`spreadOverModal isFooterSty ${styles.telModalSty}`}
        mask={false}
      >
        <Spin spinning={title === '添加' ? false : detailLoading}>
          <Form
            form={form2}
            name="advanced_search2"
            onValuesChange={onValuesChange}
            layout='inline'
          >
              <Form.Item label='CEMS型号' name='CemsModel' rules={[{ required: true, message: '请选择CEMS型号！' }]}>
                <Select style={{width:200}} placeholder='请选择' showSearch optionFilterProp="Name"  loading={getMonitorCategorySystemListLoading} fieldNames={{label:'Name',value:'ChildID'}} options={cemsModelNameList} />
              </Form.Item>
              <Form.Item label='检查表名称' name='InspectionName' rules={[{ required: true, message: '请输入检查表名称' }]}>
                <Input placeholder='请输入' allowClear />
              </Form.Item>
              <Form.Item label="生效日期" name="EffectiveDate"  rules={[{ required: true, message: '请选择生效日期' }]}>
                <DatePicker allowClear/>
              </Form.Item>
              <Form.Item name='Num' hidden />
            <div className={'addEditTable'} style={{marginTop:12}}>
              <SdlTable
                loading={tableLoading}
                className={`compactTableSty add`}
                rowClassName={false}
                scroll={{ x: 980, y: 'calc(100vh - 296px)' }}
                bordered
                dataSource={data}
                columns={addCol}
                pagination={false}
                components={{
                  body: {
                    cell: ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
                      const inputNode = title === '检查项目' ?
                        <Space>
                          <Form.Item name={`MainId${record.ID}`} rules={[{ required: true, message: `请选择检查项目` }]} style={{ margin: 0 }} >
                            <Select style={{width:180}} placeholder={`请选择检查项目`} allowClear showSearch optionFilterProp="InspectionProject" loading={getOnsiteInspectionTypeListLoading} fieldNames={{ label: 'InspectionProject', value: 'ID' }} options={inspectorTypeItemList.filter(item=>item.UseStatus==1)} />
                          </Form.Item>
                          <Form.Item name={`InspectionProject${record.ID}`} rules={[{ required: true, message: `请输入监测点位` }]} style={{ margin: 0 }} >
                            <Input  placeholder={`请输入监测点位`} />
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
              <Row justify='center' style={{paddingBottom:8}}><span style={{fontSize:18}}>{inspectorTemplateView?.InspectionName}</span></Row>
          <SdlTable
            bordered
            resizable
            rowClassName={null}
            scroll={{ x: 980, y: 'calc(100vh - 208px)' }}
            dataSource={inspectorTemplateView?.InspectorTypeModelList}
            columns={columns3}
            pagination={false}
          />
        </Spin >
      </Modal>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);