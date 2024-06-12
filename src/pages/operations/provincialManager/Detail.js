/**
 * 功  能：核查整改详情
 * 创建人：jab
 * 创建时间：2022.11.24
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm,Upload, Form, Tabs, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { getAttachmentArrDataSource } from '@/utils/utils';
import styles from "./style.less"
import Cookie from 'js-cookie';
import AttachmentView from '@/components/AttachmentView'
import cuid from 'cuid';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;


const namespace = 'provincialManager'




const dvaPropsData = ({ loading, provincialManager, global, common }) => ({
  detailLoading: loading.effects[`${namespace}/GetProvinceManagerByID`],
  tableDetailDatas: provincialManager.tableDetailDatas,

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetProvinceManagerByID: (payload, callback) => { //详情
      dispatch({
        type: `${namespace}/GetProvinceManagerByID`,
        payload: payload,
        callback: callback
      })
    },
  }
}




const Index = (props) => {


  const { detailLoading, ID, tableDetailDatas, } = props;

  useEffect(() => {
    props.GetProvinceManagerByID({ ID: ID })
  }, []);
  

  return (
      <Spin spinning={detailLoading}>
        <Form
          name="basics"
        >
          <div>
            <Row style={{padding:'0 20%'}}>
              <Col span={12}>
                <Form.Item label="省区经理" >
                  {tableDetailDatas && tableDetailDatas.UserName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='行政区'>
                  {tableDetailDatas && tableDetailDatas.ReagionName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='创建人' >
                  {tableDetailDatas && tableDetailDatas.CreateUserName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='创建时间' >
                  {tableDetailDatas && tableDetailDatas.CreateTime}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="更新人"   >
                  {tableDetailDatas && tableDetailDatas.UpdateUserName}
                </Form.Item>
              </Col >
              <Col span={12}>
                <Form.Item label="更新时间" >
                  {tableDetailDatas && tableDetailDatas.UpdateTime}
                </Form.Item>
              </Col >
            </Row>
          </div>

        </Form>
      </Spin>
    

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);