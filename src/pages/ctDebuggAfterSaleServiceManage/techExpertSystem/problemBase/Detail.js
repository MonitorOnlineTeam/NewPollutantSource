/**
 * 功  能：技术专家系统 问题库
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Radio, Popover, Spin, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownloadOutlined, UploadOutlined, ImportOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
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
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
const { Option } = Select;
import { API } from '@config/API';
import config from '@/config';
const namespace = 'problemBase'




const dvaPropsData = ({ loading, problemBase, global, }) => ({
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




  const { data } = props;


 





  return (
          <Form className='detailForm'>
            <Row>
              <Col span={12}>
                <Form.Item label='问题类别'>
                  {data?.QuestionTypeName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='问题名称'>
                  {data?.QuestionName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='问题描述'>
                  {data?.QuestionDesc}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='问题解答'>
                  {data?.QuestionReply}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='创建人'>
                  {data?.CreateUserName}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='创建时间'>
                  {data?.CreateDate}
                </Form.Item>
              </Col>
            </Row>
          </Form>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);