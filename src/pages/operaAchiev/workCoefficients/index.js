

/**
 * 功  能：污染源信息 工单类型系数  工单类型系数清单
 * 创建人：jab
 * 创建时间：2022.05.18
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Card, Space, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, FilterFilled, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import NumTips from '@/components/NumTips'
import styles from "../style.less"
import style from "./style.less"

import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import tableList from '@/pages/list/table-list';
import EntType from '@/components/EntType'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'operaAchiev'



const dvaPropsData = ({ loading, operaAchiev, global, common, }) => ({
  tableDatas: operaAchiev.recordCoefficientList,
  tableTotal: operaAchiev.recordCoefficientTotal,
  tableLoading: loading.effects[`${namespace}/getRecordCoefficientList`],
  loadingAddorEditConfirm: loading.effects[`${namespace}/addOrEditRecordCoefficient`],
  recordTypesByPollutantTypeLoading: loading.effects[`${namespace}/getRecordTypesByPollutantType`] || false,
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
    getTableData: (payload) => { //列表
      dispatch({
        type: `${namespace}/getRecordCoefficientList`,
        payload: payload,
      })
    },
    addOrEditRecordCoefficient: (payload,callback) => { //添加或编辑
      dispatch({
        type: `${namespace}/addOrEditRecordCoefficient`,
        payload: payload,
        callback:callback
      })
    },
    getRecordTypesByPollutantType: (payload,callback) => { //获取工单类型
      dispatch({
        type: `${namespace}/getRecordTypesByPollutantType`,
        payload: payload,
        callback:callback
      })
    },
    deleteRecordCoefficient: (payload,callback) => { //删除工单系数
      dispatch({
        type: `${namespace}/deleteRecordCoefficient`,
        payload: payload,
        callback:callback
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();



  const { tableDatas, tableTotal, tableLoading, } = props;

  const isList = props.match && props.match.path === '/operaAchiev/workCoefficientList' ? true : false;

  useEffect(() => {
    onFinish()
  }, []);
  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 60,
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '污染源类型',
      dataIndex: 'PollutantTypeName',
      key: 'PollutantTypeName',
      align: 'center',
      width: 180,
    },
    {
      title: `工单类型`,
      dataIndex: 'RecordTypeName',
      key: 'RecordTypeName',
      align: 'center',
      width: 180,
    },
    {
      title: '系数',
      dataIndex: 'Coefficient',
      key: 'Coefficient',
      align: 'center',
      width: 180,
    },

  ];
  isList && columns.push({
    title: <span>操作</span>,
    dataIndex: 'x',
    key: 'x',
    align: 'center',
    width: 180,
    render: (text, record) => {
      return <span>
        <Fragment><Tooltip title="编辑"> <a  onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
        <Fragment> <Tooltip title="删除">
          <Popconfirm title="确定要删除此条信息吗？" style={{ paddingRight: 5 }} onConfirm={() => { del(record) }} okText="是" cancelText="否">
            <a  ><DelIcon /></a>
          </Popconfirm>
        </Tooltip>
        </Fragment>
      </span>
    }
  })




  const onFinish = () => {  //查询
    props.getTableData({})

  }
  const [fromVisible, setFromVisible] = useState(false)

  const [type, setType] = useState('add')

  const add = () => {
    setFromVisible(true)
    setType('add')
    form.resetFields();

  };

  const edit =  (record) => {
    setFromVisible(true)
    setType('edit')
    form.resetFields();
    props.getRecordTypesByPollutantType({ pollutantType: record.PollutantType }, (res) => {
        setRecordTypesByPollutantTypeList(res)
        form.setFieldsValue({
          ...record,
        })
    })
  };


  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form.validateFields();//触发校验
       props.addOrEditRecordCoefficient({
        ...values,
      }, () => {
        setFromVisible(false)
        onFinish()
      })

    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }


  const del = async (record) => {
    const values = await form.validateFields();
    props.deleteRecordCoefficient({ ID: record.ID }, () => {
       onFinish();
    })
  };



  const searchComponents = () => {
    return <Form
      name="advanced_search"
    >

      <Form.Item>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => { add() }} >
          添加
     </Button>
      </Form.Item>
    </Form>
  }

  const [recordTypesByPollutantTypeList,setRecordTypesByPollutantTypeList] = useState([])
  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'PollutantType') {
      props.getRecordTypesByPollutantType({ pollutantType: hangedValues.PollutantType }, (res) => {
        setRecordTypesByPollutantTypeList(res)
        form.setFieldsValue({RecordType:undefined})
      })
    }
  }

  return (
    <div className={styles.operaAchievSty}>
      <BreadcrumbWrapper hideBreadcrumb={!isList}>
      <Card title={isList ? searchComponents() : null}>
        <SdlTable
          loading={tableLoading}
          bordered
          dataSource={tableDatas}
          columns={columns}
          pagination={false}
        />
      </Card>
      </BreadcrumbWrapper>
      <Modal
        title={type === 'add' ? '添加' : '编辑'}
        visible={fromVisible}
        onOk={onModalOk}
        confirmLoading={props.loadingAddorEditConfirm}
        onCancel={() => { setFromVisible(false) }}
        className={style.fromModal}
        destroyOnClose
        centered
      >
        <Form
          name="basic"
          form={form}
          onValuesChange={onValuesChange}
        >

            <Form.Item label="污染物类型" name="PollutantType" rules={[{ required: true, message: '请选择污染物类型' }]} >
              <EntType style={{width:'100%'}} allowClear={false}/>
              </Form.Item>
              <Spin spinning={props.recordTypesByPollutantTypeLoading} size='small' style={{top:-8, left:20 }}>
               <Form.Item label='工单类型' name='RecordType' rules={[{ required: true, message: '请选择工单类型' }]}  >

              <Select placeholder='请选择'   showSearch optionFilterProp="children" >
               {
                 recordTypesByPollutantTypeList.map(item => {
                  return <Option key={item.ID} value={item.ID} >{item.Name}</Option>
                })
              } 
              </Select>
             </Form.Item>
            </Spin>
              <Form.Item label="工单系数" name="Coefficient" rules={[{ required: true, message: '请输入监测点系数' }]}>
                <InputNumber placeholder='请输入'  />
              </Form.Item>
              <Form.Item  name="ID" hidden>
                <Input />
              </Form.Item> 
        </Form>
      </Modal>
   
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);

