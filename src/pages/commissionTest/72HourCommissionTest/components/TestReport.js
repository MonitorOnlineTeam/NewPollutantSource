/**
 * 功  能：检测报告
 * 创建人：jab
 * 创建时间：2022.09.02
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Tabs, Empty, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined,DownloadOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import Cookie from 'js-cookie';
import NumTips from '@/components/NumTips'
import styles from "../style.less"
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
import PageLoading from '@/components/PageLoading'
const namespace = 'hourCommissionTest'




const dvaPropsData = ({ loading, hourCommissionTest, commissionTest, }) => ({
  testReportLoading: loading.effects[`${namespace}/exportTestPeport`] || false,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    exportTestPeport: (payload,callback) => {
      dispatch({
        type: `${namespace}/exportTestPeport`,
        payload: payload,
        callback:callback,
      })
    },
  }
}


const Index = (props) => {


  const { pointId,testReportLoading,} = props; 

  useEffect(() => {
  }, [])

  const [reportType,setReportType] = useState(1)
  const [testReportLoading1,setTestPortLoading1 ] = useState(false)
  const [testReportLoading2,setTestPortLoading2 ] = useState(false)

  const testReportClick = (type) => {
    type == 1 ? setTestPortLoading1(true) : setTestPortLoading2(true)
    props.exportTestPeport({
      PointCode: pointId,
      ExportType:type,
    },()=>{
      type == 1 ? setTestPortLoading1(false) : setTestPortLoading2(false)
    })
    setReportType(type)
  }

  return (
    <div className={styles.testReportContentSty}>
    <Spin spinning={testReportLoading} tip={`生成${reportType==1?'WORD':'PDF' }检测报告中...`}  style={{height:'calc(100vh - 240px)'}}>
      <Button type="primary" icon={<DownloadOutlined/>}  loading={testReportLoading1} style={{ marginRight: 10 }} onClick={()=>{testReportClick(1)}}>生成WORD检测报告</Button>
      <Button type="primary" icon={<DownloadOutlined/>}  loading={testReportLoading2} style={{ marginRight: 10 }} onClick={()=>{testReportClick(2)}}>生成PDF检测报告</Button>
    </Spin>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);