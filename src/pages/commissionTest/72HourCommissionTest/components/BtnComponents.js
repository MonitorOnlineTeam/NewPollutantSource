/**
 * 功  能：颗粒物参比
 * 创建人：jab
 * 创建时间：2022.08.11
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag,Upload , Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined ,UploadOutlined} from '@ant-design/icons';
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
import FormItem from 'antd/lib/form/FormItem';
const { TextArea } = Input;
const { Option } = Select;
import config from '@/config'
const namespace = 'hourCommissionTest'




const dvaPropsData = ({ loading, hourCommissionTest, commissionTest, }) => ({
  delVisible:hourCommissionTest.delVisible,
  pointStatus:hourCommissionTest.pointStatus,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {


  const isQuery = props&&props.match&&props.match.path === '/commissionTest/72HourCommissionTestQuery'


  useEffect(() => {
  }, []);



  const { pointStatus } = props;
  const [imortForm] = Form.useForm();

  const importContent = () => <Form form={imortForm} name="imprts_advanced_search">
    <Form.Item name='rowVal' label='行' style={props.isPm&&{marginTop:8}}>
      <InputNumber mix={1}  style={{ width: '100%' }} placeholder='从第几行读取' />
    </Form.Item>
     {!props.isPm&&<Form.Item name='colVal' label='列'>
      <InputNumber mix={1}  style={{width: '100%'  }} placeholder='读取到第几列' />
    </Form.Item>}
    <Form.Item>
      <Row>
        <Upload maxCount={1} {...props.uploadProps}  >
        <Button  style={{width:'206px',marginTop:15}} icon={<UploadOutlined />}>导入</Button>
        </Upload>
      </Row>
      <Button type="primary"  style={{width:'100%',marginTop:8}}  loading={props.importLoading}  onClick={()=>{props.importOK(imortForm.getFieldsValue())}} >确定</Button>
      <Row>
      </Row>
    </Form.Item>
  </Form>




  return ( <>{!isQuery&&<div style={{ paddingBottom: 16 }}>
      {props.isImport && <Popover
        placement="right"
        content={importContent()}
        trigger="click"
        visible={props.importVisible}
        imortForm = {imortForm} 
        overlayClassName={styles.popSty}
        onVisibleChange={(newVisible)=>{imortForm.resetFields(); props.importVisibleChange(newVisible)}}
      >  <Button type="primary" style={{ marginRight: 10 }} disabled={pointStatus==2}>导入</Button></Popover>}
      <Button type="primary" style={{ marginRight: 10 }}  loading={props.saveLoading1} onClick={()=>{props.submits(1)}} disabled={pointStatus==2}>暂存</Button>
      <Button type="primary" style={{ marginRight: 10 }}  loading={props.saveLoading2} onClick={()=>{props.submits(2)}} disabled={pointStatus==2}>提交</Button>
      
      <Popconfirm
      title="确定要清除吗？"
      placement="bottom"
      onConfirm={props.clears}
      disabled={pointStatus==2}
    >  
      <Button type="primary" style={{ marginRight: 10 }} disabled={pointStatus==2}>清除</Button>
      </Popconfirm>

      <Popconfirm
      title="确定要删除吗？"
      placement="bottom"
      onConfirm={props.del}
      okButtonProps={{ loading: props.delLoading }}
      disabled={pointStatus==2}
    >  <Button type="primary" disabled={pointStatus==2}>删除</Button></Popconfirm>
    </div>}</>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);