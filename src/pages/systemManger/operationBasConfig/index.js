/**
 * 功  能：系统管理 运维基础配置
 * 创建人：jab
 * 创建时间：2023.10.20
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, TreeSelect, Card, Tabs, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
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
import TitleComponents from '@/components/TitleComponents'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
const { TextArea } = Input;
const { Option } = Select;
import RangePicker_ from '@/components/RangePicker/NewRangePicker';


const namespace = 'operationBasConfig'




const dvaPropsData = ({ loading, operationBasConfig, global }) => ({
  getOperationSettingLoading: loading.effects[`global/getOperationSetting`],
  operationSettingInfo:global.operationSettingInfo,
  updOperationSettingLoading: loading.effects[`${namespace}/updOperationSetting`],
})
const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getOperationSetting: (payload,callback) => { //获取已设置信息
      dispatch({
        type: `${namespace}/getOperationSetting`,
        payload: payload,
        callback:callback
      })
    },
    updOperationSetting: (payload) => { //设置信息
      dispatch({
        type: `${namespace}/updOperationSetting`,
        payload: payload,
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();




  const { operationSettingInfo } = props;
  useEffect(() => {
   if(operationSettingInfo.ID){
    form.setFieldsValue({availability:operationSettingInfo.Availability})
   }
  }, [operationSettingInfo]);

 const submitOk = (values) =>{
  const id =  Cookie.get('currentUser') && JSON.parse(Cookie.get('currentUser')) && JSON.parse(Cookie.get('currentUser')).UserId;
  props.updOperationSetting({id:id, ...values})
 }
  return (
    <div className={styles.operationBasConfigSty}>
      <BreadcrumbWrapper>
      <Card>
      <Form
          name="operationBasConfigForm"
          form={form}
          onFinish={submitOk}
          initialValues={{
            availability:2
          }}
        >
        <Spin spinning={props.getOperationSettingLoading}>
        {/* <div>
          <TitleComponents text='自动派单即将提醒设置' key='1' style={{marginBottom:4}}/>
          <Form.Item label='提醒对象'>
          <Radio.Group name="radiogroup">
              <Radio value={1}>点位负责运维人</Radio>
              <Radio value={2}>运维小组</Radio>
            </Radio.Group>
              <Row style={{ color: '#f5222d', marginTop: 10,}}>
                 <span style={{ paddingRight: 12 }}>注：</span>
                  <ol type="1" style={{ listStyle: 'auto', paddingBottom: 8 }}>
                    <li>点位负责运维人：推送给点位的运维负责人</li>
                    <li>运维小组：工单放到工单池中</li>
                  </ol>
              </Row> 
               </Form.Item>
            </div> */}
            {/* <div>
          <TitleComponents text='标气、试剂到期提醒设置' key='2' style={{marginBottom:4}}/>
          </div> */}
          <div>
            <TitleComponents text='其他设置' key='1' style={{marginBottom:4}}/>
            {/* <Form.Item label='是否显示来源条件'>
            <Radio.Group  defaultValue={2}>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
            </Form.Item> */}
           <Form.Item label='设备完好率数据来源' name='availability'>
            <Radio.Group  defaultValue={2}>
              <Radio value={1}>抓取数据</Radio>
              <Radio value={2}>直传数据</Radio>
            </Radio.Group>
            </Form.Item>
            <Divider orientation="right" style={{borderTopColor:'#0000000f'}}>
              <Button type='primary' htmlType='submit' loading={props.updOperationSettingLoading}>保存</Button>
            </Divider>
           </div>
           </Spin>
          </Form>
        </Card>
      </BreadcrumbWrapper>


    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);