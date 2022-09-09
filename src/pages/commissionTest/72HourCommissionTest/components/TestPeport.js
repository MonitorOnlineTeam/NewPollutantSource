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
  testReportLoading: loading.effects[`${namespace}/get72TestRecordType`],

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    get72TestRecordType: (payload) => {
      dispatch({
        type: `${namespace}/get72TestRecordType`,
        payload: payload,
      })
    },
  }
}


const Index = (props) => {

  useEffect(() => {
  }, [])




  const [pointId, setPointId] = useState()
  const testReportClick = () => {
    props.get72TestRecordType({
      PointCode: key,
      PollutantCode: 502,
      RecordDate: "",
      Flag: ""
    })
  }

  const { testReportLoading } = props;
  return (
    <div className={styles.totalContentSty}>

      <Button type="primary" icon={<DownloadOutlined/>}  loading={testReportLoading} style={{ marginRight: 10 }} onClick={testReportClick}>生成检测报告</Button>

    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);