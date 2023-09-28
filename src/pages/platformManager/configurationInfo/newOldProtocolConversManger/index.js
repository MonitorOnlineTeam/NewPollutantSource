/**
 * 功  能：新老协议转换管理
 * 创建人：jab
 * 创建时间：2023.09.28
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty, } from 'antd';
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
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "./style.less"
import Cookie from 'js-cookie';
import SdlMap from '@/pages/AutoFormManager/SdlMap'
// import Detail from './Detail'
import TreeTransfer from '@/components/TreeTransfer'
import EntAtmoList from '@/components/EntAtmoList'

import { permissionButton } from '@/utils/utils';
const { Option } = Select;

const namespace = 'newOldProtocolConvers'

const dvaPropsData = ({ loading, newOldProtocolConvers, global, common }) => ({
  tableDatas: newOldProtocolConvers.tableDatas,
  delLoading: loading.effects[`${namespace}/deleteAgreementTransfer`],
  addAgreementTransferLoading: loading.effects[`${namespace}/addAgreementTransfer`] || false,
  entAndPointLoading: loading.effects[`common/getEntAndPointList`] || false,
  clientHeight: global.clientHeight,
  entLoading: common.entLoading,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `common/updateState`,
        payload: payload,
      })
    },
    getAgreementTransferList: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/getAgreementTransferList`,
        payload: payload,
        callback: callback
      })
    },
    addAgreementTransfer: (payload, callback) => { //添加
      dispatch({
        type: `${namespace}/addAgreementTransfer`,
        payload: payload,
        callback: callback
      })
    },
    deleteAgreementTransfer: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/deleteAgreementTransfer`,
        payload: payload,
        callback: callback
      })
    },
    getPointByEntCode: (payload, callback) => { // 根据企业获取监测点
      dispatch({
        type: `common/getPointByEntCode`,
        payload: payload,
        callback: callback
      })
    },
    getEntAndPoint: (payload, callback) => { //企业监测点
      dispatch({
        type: `common/getEntAndPointList`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();




  const { tableDatas, entAndPointLoading,delLoading, addAgreementTransferLoading, } = props;




  useEffect(() => {
    onFinish();
  }, []);

  let columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '行政区',
      dataIndex: 'EntName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点编号（MN）',
      dataIndex: 'DGIMN',
      key: 'DGIMN',
      align: 'center',
      ellipsis: true,
    },
    
    {
      title: '创建人',
      dataIndex: 'CreateUserName',
      key: 'CreateUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
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
          <Popconfirm title="确认删除吗?" onConfirm={() => {del(record.ID); }}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </span>
      }
    },
  ];




  const [tableLoading,setTableLoading] = useState(false)
  const onFinish = async () => {  //查询
    setTableLoading(true)
    try {
      const values = await form.validateFields();
      props.getAgreementTransferList({
        ...values,
      },()=>{
        setTableLoading(false)
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  
  const [selectDataLoading,setSelectDataLoading] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState([])
  const getSelectDatatFun = () => {
    setSelectDataLoading(true)
    props.getAgreementTransferList({}, (res) => {
      if(res.IsSuccess){
      const keys = res?.Datas && res.Datas.map(item => item.DGIMN)
      setCheckedKeys(keys)
      }
      setSelectDataLoading(false)
    })
  }


  const [addTitle, setAddTitle] = useState()
  const [addVisible, setAddVisible] = useState(false)

  //添加
  const add = () => {
    setAddVisible(true)
    setAddTitle()
    props.getEntAndPoint({Status: [0, 1, 2, 3], RegionCode: '', Name: '', },(res)=>{
      setEntAndPoint(res)
    })
    getSelectDatatFun()
  }


  const [entAndPoint, setEntAndPoint] = useState([])
  const [regionCode, setRegionCode] = useState('')
  const [entPointName, setEntPointName] = useState('')
  const handlePointQuery = () => {
    props.getEntAndPoint({ Status: [0, 1, 2, 3], RegionCode: regionCode, Name: entPointName, },(res)=>{
      console.log(res)
      setEntAndPoint(res)
    })
    getSelectDatatFun()
  }
  // 提交
  const handlePointOK = (checkedKeys, state, callback) => {
    props.addAgreementTransfer({ DGIMNS: checkedKeys, state: state }, () => { callback() })
  }


  //删除
  const del = (id) => {
   props.deleteAgreementTransfer({ ID: id }, () => { onFinish() })
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
        res?.[0]&&res?.[0]&&form.setFieldsValue({ DGIMN: res[0].DGIMN })
      })
    }
  }

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { onFinish() }}
      onValuesChange={onValuesChange}
      layout='inline'
    >
      <Spin spinning={props.entLoading} size='small' style={{ top: -3, left: 39 }}>
        <Form.Item label='企业' name='EntCode'>
          <EntAtmoList style={{ width: 300 }} />
        </Form.Item>
      </Spin>
      <Spin spinning={pointLoading} size='small' style={{ top: -3, left: 44 }}>
        <Form.Item label='监测点名称' name='DGIMN' >

          <Select placeholder='请选择' showSearch allowClear optionFilterProp="children" style={{ width: 180 }}>
            {
              pointList[0] && pointList.map(item => {
                return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Spin>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={tableLoading}>
          查询
         </Button>
        <Button onClick={() => { form.resetFields(); }} style={{ margin: '0 8px' }}  >
          重置
         </Button>
        <Button onClick={() => { add() }} >
          添加
            </Button>
      </Form.Item>
    </Form>
  }
  return (
    <div className={styles.newOldProtocolConversSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading || delLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={false}
          />
        </Card>
      </BreadcrumbWrapper>

      <Modal
        title={addTitle}
        visible={addVisible}
        destroyOnClose={true}
        onCancel={() => { setAddVisible(false);onFinish() }}
        width={1100}
        footer={null}
        bodyStyle={{
          overflowY: 'auto',
          maxHeight: props.clientHeight - 240,
        }}

      >
        {

          <div>
            <Row style={{ background: '#fff', paddingBottom: 10, zIndex: 1 }}>
              <RegionList style={{ width: 200 }} placeholder='请选择行政区' changeRegion={(value) => { setRegionCode(value) }} />
              <Input.Group compact style={{ width: 290, marginLeft: 16, display: 'inline-block' }}>
                <Input style={{ width: 200 }} allowClear placeholder='请输入企业名称' onBlur={(e) => setEntPointName(e.target.value)} />
                <Button type="primary" loading={entAndPointLoading} onClick={handlePointQuery}>查询</Button>
              </Input.Group>
            </Row>

            <Spin spinning={entAndPointLoading || addAgreementTransferLoading || selectDataLoading }>
              {entAndPoint?.length > 0 && !entAndPointLoading  && !selectDataLoading ?
                <TreeTransfer
                  key="key"
                  titles={['未设置新老转换协议', '新转老协议点位']}
                  treeData={entAndPoint}
                  checkedKeys={checkedKeys}
                  targetKeysChange={(key, type, callback) => {
                    setCheckedKeys(key)
                    handlePointOK(key, type == 1 ? 1 : 2, callback)
                  }
                  }
                />
                :
                <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
            </Spin>
          </div>
        }
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);