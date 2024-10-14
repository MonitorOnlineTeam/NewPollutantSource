/*
 * @Author: outman0611
 * @Date: 2024-10-11 14:38:13
 * @LastEditors: outman0611
 * @LastEditTime: 2024-10-14 10:17:09
 * @Description: 通用管理 问题检索中心
 */
import React, { useState, useEffect,useRef, Fragment } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Spin,
  Form,
  Typography,
  Card,
  Button,
  Select,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from './style.less';
const { Option } = Select;
const { Search } = Input;
const namespace = 'generalManager';

const dvaPropsData = ({ loading, generalManager, global }) => ({
  configInfo: global.configInfo,
  tableDatas: generalManager.provinceTableDatas,
  tableTotal: generalManager.provinceTableTotal,
  queryPar: generalManager.provinceQueryPar,
  tableLoading: loading.effects[`${namespace}/GetProvinceList`],
  exportLoading: loading.effects[`${namespace}/ExportProvinceList`],
  managerSelectLoading: loading.effects[`${namespace}/GetManagerSelect`],
});



const Index = props => {


  const inputRef = useRef(null);
  
  useEffect(()=>{
    // props.defaultFocus && inputRef.current.focus({
    //   cursor: 'start',
    // });
  })

  const intervalNum = 16
  return (
          <Search
            {...props}
            ref = {inputRef}
            bordered={false}
            allowClear
            size="large" // + ${intervalNum*2}px)
            enterButton={<div style={{display:'inline-flex',justifyContent:'center',alignItems:'center'}}><img style={{paddingRight:4}} src={'/generalManager/cz.png'} /> <span style={{paddingLeft:4}}>检索</span></div>}
            className={`${styles.searchSty} ${props.className}`}
            style={{ marginBottom: intervalNum, width:`calc(20.83333333% * 3)`,...props.style }}
            />
  );
};
export default connect(dvaPropsData)(Index);
