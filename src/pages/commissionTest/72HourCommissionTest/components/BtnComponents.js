/**
 * 功  能：颗粒物参比
 * 创建人：jab
 * 创建时间：2022.08.11
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
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
import styles from "../style.less"
import Cookie from 'js-cookie';
import NumTips from '@/components/NumTips'
import FormItem from 'antd/lib/form/FormItem';
const { TextArea } = Input;
const { Option } = Select;

const namespace = 'hourCommissionTest'




const dvaPropsData = ({ loading, hourCommissionTest, commissionTest, }) => ({

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




  useEffect(() => {

  }, []);


  const [imortForm] = Form.useForm();

  const ImportContent = () => <Form form={imortForm} name="imprts_advanced_search">
    <Form.Item name='rowVal'>
      <Row align='middle'>行：<InputNumber mix={1}  style={{ width: 'calc(100% - 28px)' }} placeholder='从第几行读取' /></Row>
    </Form.Item>
    <Form.Item name='colVal'>
      <Row align='middle'>列：<InputNumber mix={1}  style={{ width: 'calc(100% - 28px)' }} placeholder='从第几行读取' /></Row>
    </Form.Item>
    <Form.Item>
      <Row justify='end' ><Button type="primary" onClick={()=>props.importOk(imortForm.getFieldValue('rowVal'),imortForm.getFieldValue('colVal'))}>确定</Button></Row>
    </Form.Item>
  </Form>






  return (
    <div style={{ paddingBottom: 16 }}>
      {props.isImport && <Popover
        placement="right"
        content={<ImportContent />}
        trigger="click"
        visible={props.importVisible}
        onVisibleChange={props.importVisibleChange}
      > <Button type="primary" style={{ marginRight: 10 }}>导入</Button></Popover>}
      <Button type="primary" style={{ marginRight: 10 }} onClick={props.temporarySave}>暂存</Button>
      <Button type="primary" style={{ marginRight: 10 }} onClick={props.submits}>提交</Button>
      <Button type="primary" style={{ marginRight: 10 }} onClick={props.clears}>清除</Button>
      <Button type="primary" onClick={props.del}>删除</Button>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);