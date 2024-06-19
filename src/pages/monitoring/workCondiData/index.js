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
      <Card>
       <div style={{textAlign:'center',paddingTop:60}}> 
       <img src="/nodata1.png" style={{ width: '180px' }} />
       <p>敬请期待，正在开发</p>
       </div>
      </Card>
   
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);