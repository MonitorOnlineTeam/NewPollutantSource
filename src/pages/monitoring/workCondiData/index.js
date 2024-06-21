/**
 * 功  能：工况数据查询
 * 创建人：jab
 * 创建时间：2024.06
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
import DefaultDevelopment from '@/components/DefaultDevelopment';
const { Option } = Select;
import { API } from '@config/API';
import config from '@/config';
const namespace = 'workCondiData'




const dvaPropsData = ({ loading, workCondiData, global, }) => ({
  configInfo: global.configInfo,
  tableLoading: loading.effects[`${namespace}/GetQuestionList`],
  exportLoading: loading.effects[`${namespace}/ExportQuestion`],
})


const Index = (props) => {




  useEffect(() => {


  }, []);








  return (
    <div className={`${styles.workCondiDataSty}`}>
      <BreadcrumbWrapper>
      <DefaultDevelopment  />
   
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);