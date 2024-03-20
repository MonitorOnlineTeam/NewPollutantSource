/**
 * 功  能：CEMS型号清单
 * 创建人：jab
 * 创建时间：2022.07.18
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Popover, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
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
import { permissionButton } from '@/utils/utils';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'cemsModelList'




const dvaPropsData = ({ loading, cemsModelList, commissionTest, }) => ({
  tableDatas: cemsModelList.tableDatas,
  pointDatas: cemsModelList.pointDatas,
  tableLoading: cemsModelList.tableLoading,
  tableTotal: cemsModelList.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addSystemModel`],
  loadingEditConfirm: loading.effects[`${namespace}/editSystemModel`],
  manufacturerList: commissionTest.manufacturerList,
  maxNum: cemsModelList.maxNum,
  systemModelNameList: commissionTest.systemModelNameList,
  systemModelNameListLoading: loading.effects[`${namespace}/getSystemModelNameList`],
  monitorCategorySystemLoading: loading.effects[`${namespace}/getMonitorCategorySystemList`],
  monitorCategorySystemList: cemsModelList.monitorCategorySystemList,
  associatedSystemList: cemsModelList.associatedSystemList,
  associatedCategoryList: cemsModelList.associatedCategoryList,
  updateMonitorCategorySystemStatusLoading: loading.effects[`${namespace}/updateMonitorCategorySystemStatus`],
  addMonitorCategorySystemLoading: loading.effects[`${namespace}/addMonitorCategorySystem`],
  deleteMonitorCategorySystemLoading: loading.effects[`${namespace}/deleteMonitorCategorySystem`],

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getSystemModelList: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/getSystemModelList`,
        payload: payload,
        callback: callback
      })
    },
    addSystemModel: (payload, callback) => { // 添加
      dispatch({
        type: `${namespace}/addSystemModel`,
        payload: payload,
        callback: callback
      })

    },
    editSystemModel: (payload, callback) => { // 修改
      dispatch({
        type: `${namespace}/editSystemModel`,
        payload: payload,
        callback: callback
      })

    },
    delSystemModel: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/delSystemModel`,
        payload: payload,
        callback: callback
      })
    },
    getManufacturerList: (payload, callback) => { //厂商列表
      dispatch({
        type: `commissionTest/getManufacturerList`,
        payload: payload,
        callback: callback
      })
    },
    getSystemModelNameList: (payload, callback) => { //系统名称
      dispatch({
        type: `commissionTest/getSystemModelNameList`,
        payload: payload,
        callback: callback
      })
    },
    getMonitorCategorySystemList: (payload, callback) => { //获取关联关系
      dispatch({
        type: `${namespace}/getMonitorCategorySystemList`,
        payload: payload,
        callback: callback
      })
    },
    updateMonitorCategorySystemStatus: (payload, callback) => { //更新关联关系设备类别状态
      dispatch({
        type: `${namespace}/updateMonitorCategorySystemStatus`,
        payload: payload,
        callback: callback
      })
    },
    addMonitorCategorySystem: (payload, callback) => { //添加关联关系
      dispatch({
        type: `${namespace}/addMonitorCategorySystem`,
        payload: payload,
        callback: callback
      })
    },
    deleteMonitorCategorySystem: (payload, callback) => { //删除系统型号与系统类别关联
      dispatch({
        type: `${namespace}/deleteMonitorCategorySystem`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();



  const [fromVisible, setFromVisible] = useState(false)


  const [type, setType] = useState('add')

  const [equipmentModelVisible, setEquipmentModelVisible] = useState(false)
  const [popVisible, setPopVisible] = useState(false)


  const [equipmentModelStatisticsPermis, setEquipmentModelStatisticsPermis] = useState(false)


  const { tableDatas, tableTotal, tableLoading, monitoringTypeList, manufacturerList, loadingAddConfirm, loadingEditConfirm, exportLoading, maxNum, systemModelNameList, systemModelNameListLoading,
    monitorCategorySystemLoading, monitorCategorySystemList, associatedSystemList, associatedCategoryList, updateMonitorCategorySystemStatusLoading, addMonitorCategorySystemLoading, deleteMonitorCategorySystemLoading, } = props;

  useEffect(() => {
    onFinish();
    props.getManufacturerList({})
    props.getSystemModelNameList({})
    
    const buttonList = permissionButton(props.match.path)
    buttonList.map(item=>{
      switch (item){
        case 'equipmentModelStatisticsList': setEquipmentModelStatisticsPermis(true); break;
      }
    })
  }, []);

  const columns = [
    {
      title: '编号',
      dataIndex: 'Num',
      key: 'Num',
      align: 'center',
    },
    {
      title: '设备厂家',
      dataIndex: 'ManufactorName',
      key: 'ManufactorName',
      align: 'center',
    },
    {
      title: '系统名称',
      dataIndex: 'SystemName',
      key: 'SystemName',
      align: 'center',
    },
    {
      title: '系统型号',
      dataIndex: 'SystemModel',
      key: 'SystemModel',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      render: (text, record) => {
        if (text === 1) {
          return <span><Tag color="blue">启用</Tag></span>;
        }
        if (text === 2) {
          return <span><Tag color="red">停用</Tag></span>;
        }
      },
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      width: 180,
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

  const columns2 = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '编号',
      dataIndex: 'CategoryNum',
      key: 'CategoryNum',
      align: 'center',
      width: 80,
    },
    {
      title: '设备类型',
      dataIndex: 'CategoryName',
      key: 'CategoryName',
      align: 'center',
      width: 'auto',
    },
    {
      title: '设备类别状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      width: 'auto',
      render: (text, record) => {
        if(record.CategoryName!='其他'){
          if (text === 1) {
            return <Popconfirm title="确定要停用此设备类型吗？" style={{ paddingRight: 5 }} onConfirm={() => { setDeviceCategory(record) }} okText="是" cancelText="否">
              <Tag style={{cursor:'pointer'}} color="blue">启用</Tag>
            </Popconfirm>;
          }
          if (text === 2) {
            return <Popconfirm title="确定要启用此设备类型吗？" style={{ paddingRight: 5 }} onConfirm={() => { setDeviceCategory(record) }} okText="是" cancelText="否">
              <Tag style={{cursor:'pointer'}} color="red">停用</Tag>
            </Popconfirm>;
          }
        }

      },
    },
    {
      title: '系统型号编号',
      dataIndex: 'SystemNum',
      key: 'SystemNum',
      align: 'center',
      width: 'auto',
    },
    {
      title: '系统型号',
      dataIndex: 'SystemName',
      key: 'SystemName',
      align: 'center',
      width: 'auto',
    },
    {
      title: <span>操作</span>,
      align: 'center',
      width: 80,
      render: (text, record) => {
        return <Fragment>
          <Tooltip title="删除">
            <Popconfirm placement='topLeft' title="确定要删除此条信息吗？" style={{ paddingRight: 5 }} onConfirm={() => { delAssociation(record) }} okText="是" cancelText="否">
              <a>删除</a>
            </Popconfirm>
          </Tooltip>
        </Fragment>

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
    form2.setFieldsValue({ Num: maxNum })
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

      props.getSystemModelList({
        pageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : 1,
        pageSize: pageSize,
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
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    const values = await form.validateFields();
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    props.getSystemModelList({ ...values, PageIndex, PageSize })
  }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      initialValues={{
        // Status:1
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={onFinish}
    >
      <Row>
        <Form.Item label="设备厂家" name="ManufactorID" >
          <Select placeholder='请选择设备厂家' allowClear showSearch
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            style={{ width: 200 }}>
            {
              manufacturerList[0] && manufacturerList.map(item => {
                return <Option key={item.ID} value={item.ID}>{item.ManufactorName}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="系统名称" name="SystemName" style={{ margin: '0 16px' }}>
          {systemModelNameListLoading ? <Spin size='small' />
            :
            <Select placeholder='请选择系统名称' allowClear style={{ width: 200 }}>
              {
                systemModelNameList[0] && systemModelNameList.map(item => {
                  return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                })
              }
            </Select>
          }
        </Form.Item>

      </Row>
      <Row>
        <Form.Item label="型号" name="SystemModel" >
          <Input placeholder='请输入系统型号' style={{ width: 200 }} allowClear />
        </Form.Item>
        <Form.Item label="状态" name="Status" style={{ margin: '0 16px' }}  >
          <Select placeholder='请选择状态' allowClear style={{ width: 200 }}>
            <Option key={1} value={1}>启用</Option>
            <Option key={2} value={2}>停用</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType='submit' style={{ marginRight: 8 }} loading={tableLoading}>
            查询
     </Button>
          <Button onClick={() => { form.resetFields() }} style={{ marginRight: 8 }}>
            重置
     </Button>
          <Button onClick={() => { add() }} style={{ marginRight: 8 }}>
            添加
     </Button>
         {equipmentModelStatisticsPermis && <Button type="primary" style={{ marginRight: 8 }} onClick={() => { setEquipmentModelVisible(true); props.getMonitorCategorySystemList({}) }}>
            设备型号统计清单
     </Button>}
        </Form.Item>
      </Row>
    </Form>
  }



  //关联系统型号列表
  const [associatedSystemModelLoading, setAssociatedSystemModelLoading] = useState(false)
  const [associatedSystemModelList, setAssociatedSystemModelList] = useState([])
  useEffect(() => {
    if (popVisible && associatedSystemModelList?.length <= 0) {
      setAssociatedSystemModelLoading(true)
      setAssociatedSystemModelLoading(false)
    }
  }, [popVisible])

  const addAssociation = (values) => { //添加关联
    props.addMonitorCategorySystem({ ...values }, () => {
      form3.resetFields();
      props.getMonitorCategorySystemList({});
    })
  }
  const setDeviceCategory = (record) => { //停用或启用设备类别 更细状态
    props.updateMonitorCategorySystemStatus({ id: record.ID, status: record.Status==1? 2 : 1 }, () => {
      props.getMonitorCategorySystemList({})
    })
  }

  const delAssociation = (record) => {//删除关联
    props.deleteMonitorCategorySystem({ id: record.ID}, () => {
      props.getMonitorCategorySystemList({})
    })
  }


  return (
    <div className={styles.cemsModelListSty}>
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
            Status: 1,
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
              <Form.Item label="编号" name="Num" >
                <InputNumber placeholder='请输入编号' />
              </Form.Item>
              <NumTips />
            </Col>
            <Col span={12}>
              <Form.Item label="设备厂家" name="ManufactorID" rules={[{ required: true, message: '请选择设备厂家' }]} >
                <Select placeholder='请选择' allowClear showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

                >
                  {
                    manufacturerList[0] && manufacturerList.map(item => {
                      return <Option key={item.ID} value={item.ID}>{item.ManufactorName}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="系统名称" name="SystemName" rules={[{ required: true, message: '请选择系统名称' }]} >
                {systemModelNameListLoading ? <Spin size='small' />
                  :
                  <Select placeholder='请选择' allowClear>
                    {
                      systemModelNameList[0] && systemModelNameList.map(item => {
                        return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                      })
                    }
                  </Select>
                }
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="系统型号" name="SystemModel" rules={[{ required: true, }]}>
                <Input placeholder='请输入' allowClear />
              </Form.Item>
            </Col>
          </Row>

          <Row>

            <Col span={12}>
              <Form.Item label="状态" name="Status" rules={[{ required: true, message: '请选择状态' }]} >
                <Radio.Group>
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}>停用</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>


        </Form>
      </Modal>
      <Modal
        title={'设备型号统计清单关联关系'}
        visible={equipmentModelVisible}
        onCancel={() => { setEquipmentModelVisible(false); setPopVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName="spreadOverModal"
      >
        <Popover visible={popVisible} placement='rightTop' title={'添加'} trigger="click"
          overlayStyle={{ width: 400 }}
          overlayClassName={styles.popSty}
          content={
            <Form
              name="basic3"
              form={form3}
              onFinish={addAssociation}
            >
              <Form.Item label="编号" name="categoryNum" rules={[{ required: true, message: '请输入编号' }]} >
                <InputNumber placeholder='请输入' allowClear />
              </Form.Item>
              <Form.Item label="设备类别" name="categoryId" rules={[{ required: true, message: '请输入设备类别' }]} >
                {monitorCategorySystemLoading ? <Spin size='small' /> : <Select placeholder='请选择' allowClear showSearch optionFilterProp="children">
                  {
                    associatedCategoryList[0] && associatedCategoryList.map(item => {
                      return <Option key={item.ChildID} value={item.ChildID}>{item.Name}</Option>
                    })
                  }
                </Select>}
              </Form.Item>
              <Form.Item label="关联系统型号" name="systemId" rules={[{ required: true, message: '请选择关联系统型号' }]} >
                {monitorCategorySystemLoading ? <Spin size='small' /> : <Select placeholder='请选择' allowClear showSearch optionFilterProp="children">
                  {
                    associatedSystemList[0] && associatedSystemList.map(item => {
                      return <Option key={item.ID} value={item.ID}>{item.SystemModel}</Option>
                    })
                  }
                </Select>}
              </Form.Item>
              <Row align='end'>
                <Button onClick={() => { setPopVisible(false) }} style={{ marginRight: 8 }} >
                  取消
                </Button>
                <Button type="primary" htmlType='submit' loading={addMonitorCategorySystemLoading}>
                  保存
                  </Button>
              </Row>
            </Form>
          }>
          <Button type="primary" style={{ marginBottom: 12 }} onClick={() => { setPopVisible(true); form3.resetFields(); }}>
            添加
          </Button>
        </Popover>
        <SdlTable
          loading={monitorCategorySystemLoading || updateMonitorCategorySystemStatusLoading || deleteMonitorCategorySystemLoading}
          bordered
          dataSource={monitorCategorySystemList }
          columns={columns2}
          scroll={{ x: 900 }}
          pagination={false}
        />
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);