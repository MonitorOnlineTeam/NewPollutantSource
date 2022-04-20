/**
 * 功  能：运维督查管理
 * 创建人：jab
 * 创建时间：2022.04.20
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import EntAtmoList from '@/components/EntAtmoList'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'supervisionManager'




const dvaPropsData = ({ loading, supervisionManager, global }) => ({
  tableDatas: supervisionManager.tableDatas,
  tableLoading: supervisionManager.tableLoading,
  tableTotal: supervisionManager.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addStandardGas`],
  loadingEditConfirm: loading.effects[`${namespace}/editStandardGas`],
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
    getStandardGasList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getStandardGasList`,
        payload: payload,
      })
    },
    addStandardGas: (payload, callback) => { // 添加
      dispatch({
        type: `${namespace}/addStandardGas`,
        payload: payload,
        callback: callback
      })

    },
    editStandardGas: (payload, callback) => { // 修改
      dispatch({
        type: `${namespace}/editStandardGas`,
        payload: payload,
        callback: callback
      })

    },
    delStandardGas: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/delStandardGas`,
        payload: payload,
        callback: callback
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();



  const [fromVisible, setFromVisible] = useState(false)


  const [type, setType] = useState('add')





  const [manufacturerId, setManufacturerId] = useState(undefined)

  const { tableDatas, tableTotal, tableLoading, loadingAddConfirm, loadingEditConfirm, match: { path } } = props;

  useEffect(() => {
    onFinish()
  }, []);

  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '行政区',
      dataIndex: 'StandardGasCode',
      key: 'StandardGasCode',
      align: 'center',
    },
    {
      title: `企业名称`,
      dataIndex: 'StandardGasName',
      key: 'StandardGasName',
      align: 'center',
    },
    {
      title: '是否排口',
      dataIndex: 'Component',
      key: 'Component',
      align: 'center',
    },
    {
      title: '督查类别',
      dataIndex: 'Unit',
      key: 'Unit',
      align: 'center',
    },
    {
      title: '监测因子',
      dataIndex: 'Manufacturer',
      key: 'Manufacturer',
      align: 'center',
    },
    {
      title: '气态CEMS设备生产商',
      dataIndex: 'Manufacturer',
      key: 'Manufacturer',
      align: 'center',
    },
    {
      title: '气态CEMS设备规格型号',
      dataIndex: 'StandardGasCode',
      key: 'StandardGasCode',
      align: 'center',
    },
    {
      title: `颗粒物CEMS设备规格型号`,
      dataIndex: 'StandardGasName',
      key: 'StandardGasName',
      align: 'center',
    },
    {
      title: '设备备注',
      dataIndex: 'Component',
      key: 'Component',
      align: 'center',
    },
    {
      title: '督查人员',
      dataIndex: 'Unit',
      key: 'Unit',
      align: 'center',
    },
    {
      title: '督查日期',
      dataIndex: 'Manufacturer',
      key: 'Manufacturer',
      align: 'center',
    },
    {
      title: '运维人员',
      dataIndex: 'Unit',
      key: 'Unit',
      align: 'center',
    },
    {
      title: '原则问题数量',
      dataIndex: 'Manufacturer',
      key: 'Manufacturer',
      align: 'center',
    },
    {
      title: '重点问题数量',
      dataIndex: 'Manufacturer',
      key: 'Manufacturer',
      align: 'center',
    },
    {
      title: '一般问题数量',
      dataIndex: 'StandardGasCode',
      key: 'StandardGasCode',
      align: 'center',
    },
    {
      title: `原则问题`,
      dataIndex: 'StandardGasName',
      key: 'StandardGasName',
      align: 'center',
    },
    {
      title: '一般问题',
      dataIndex: 'Component',
      key: 'Component',
      align: 'center',
    },
    {
      title: '总分',
      dataIndex: 'Unit',
      key: 'Unit',
      align: 'center',
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      width: 180,
      render: (text, record) => {
        return <span>
          
          <Fragment><Tooltip title="编辑"> <a href="#" onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
          <Fragment><Tooltip title='详情'> <a href="#" onClick={() => { detail(record) }} ><DetailIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
          <Fragment> <Tooltip title="删除">
            <Popconfirm title="确定要删除此条信息吗？" style={{ paddingRight: 5 }} onConfirm={() => { del(record) }} okText="是" cancelText="否">
              <a href="#" ><DelIcon /></a>
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
      })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
 const detail = (record) =>{

}
  const del = async (record) => {
    const values = await form.validateFields();
    props.delStandardGas({ ID: record.ID }, () => {
      setPageIndex(1)
      props.getStandardGasList({
        ...values,
        PageIndex: 1,
        PageSize: pageSize
      })
    })
  };





  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();

  };

  const onFinish = async (pageIndexs, pageSizes) => {  //查询
    try {
      const values = await form.validateFields();

      props.getStandardGasList({
        ...values,
        ManufacturerId: manufacturerId,
        pageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : pageIndex,
        pageSize: pageSizes ? pageSizes : pageSize
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();//触发校验
       props.addStandardGas({
        ...values,
        ManufacturerId: manufacturerId
      }, () => {
        setFromVisible(false)
        onFinish()
      })
        

    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }

  const [pointList, setPointList] = useState([])
  const [pointLoading, setPointLoading] = useState(false)

  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if (!hangedValues.EntCode) { //清空时 不走请求
        form.setFieldsValue({ DGIMN: undefined })
        setPointList([])
        return;
      }
      setPointLoading(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        setPointList(res)
        setPointLoading(false)
      })
      form.setFieldsValue({ DGIMN: undefined })
    }
  }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      initialValues={{
        time:[moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day"),]
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
      <Row align='middle'>
        <Form.Item label='行政区' name='RegionCode' >
          <RegionList levelNum={3} style={{ width: 150 }}/>
        </Form.Item>
        <Form.Item label='企业' name='EntCode' style={{ marginLeft:8,marginRight:8 }}>
          <EntAtmoList pollutantType={2}  style={{ width: 350}}/>
        </Form.Item>
        <Spin spinning={pointLoading} size='small' style={{ top: -8, left: 20 }}>
          <Form.Item label='监测点名称' name='DGIMN' >

            <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 150 }}>
              {
                pointList[0] && pointList.map(item => {
                  return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                })
              }
            </Select>
          </Form.Item>
        </Spin>
      </Row>

      <Row>
        <Form.Item label="督查人员" name="IsUsed"  >
          <Select placeholder='请选择' allowClear style={{ width: 150 }}>

          </Select>
        </Form.Item>
        <Form.Item label="督查日期" name="time" style={{ marginLeft:8,marginRight:8 }}  >
            <RangePicker_
              style={{ width: 350}}
              allowClear={true}
              format="YYYY-MM-DD HH:mm:ss"
              showTime="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item label="运维人员" name="IsUsed" style={{ marginRight: 8 }}  >
          <Select placeholder='请选择' allowClear style={{ width: 150 }}>

          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType='submit' style={{ marginRight: 8 }}>
            查询
     </Button>
          <Button onClick={() => { form.resetFields() }} style={{ marginRight: 8 }} >
            重置
     </Button>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => { add() }} >
            添加
     </Button>
        </Form.Item>
      </Row>
    </Form>
  }

  const onAddEditValuesChange = (hangedValues, allValues) => { //添加修改时的监测类型请求
    // if(Object.keys(hangedValues).join() == 'PollutantType'){

    // }
  }
  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)
  }


  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)

  return (
    <div className={styles.supervisionManagerSty}>
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
        title={`${type === 'add' ? '添加' : '编辑'}`}
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
            IsUsed: 1,
          }}
          onValuesChange={onAddEditValuesChange}
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
              <Form.Item label="存货编号" name="StandardGasCode" rules={[{ required: true, message: '请输入设备名称' }]} >
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={"试剂名称"} name="StandardGasName" rules={[{ required: true, message: '请输入标准气体名称' }]} >
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
          </Row>


          <Row>
            <Col span={12}>
              <Form.Item label="规格型号" name="Component" rules={[{ required: true, message: '请输入规格型号' }]}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="单位" name="Unit" >
                <Input placeholder='请输入' allowClear />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="供应商" name="Manufacturer" rules={[{ required: true, message: '请输入供应商' }]} >
                <Input placeholder='请输入' allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="使用状态" name="IsUsed" >
                <Radio.Group>
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}>停用</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item hidden label="类型" name="Remark" >
            <Radio.Group style={{ width: 200 }}>
              <Radio value={1}>标准气体</Radio>
              <Radio value={2}>试剂信息</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);