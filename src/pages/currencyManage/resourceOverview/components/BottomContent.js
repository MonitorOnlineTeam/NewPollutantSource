/**
 * 功能：底部
 * 创建人：jab
 * 创建时间：2024.04.12
 */
import React, { useState,useEffect,Fragment, useRef,useMemo  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Popover,Radio    } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'
import moment from 'moment'
import { Item } from 'gg-editor';

const { Option } = Select;

const namespace = 'resourceOverview'




const dvaPropsData =  ({ loading,resourceOverview }) => ({

})

const Index = (props) => {





  const  {  } = props; 

  useEffect(() => {

  },[]);






  return (
      <div>
      </div>  

  );
};
export default connect(dvaPropsData)(Index);