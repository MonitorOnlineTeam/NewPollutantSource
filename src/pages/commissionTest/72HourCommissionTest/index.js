/**
 * 功  能：72小时调试检测
 * 创建人：jab
 * 创建时间：2022.07.18
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Tabs, Empty, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
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
import styles from "./style.less"
import Cookie from 'js-cookie';
import NumTips from '@/components/NumTips'
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
import PageLoading from '@/components/PageLoading'
import EntTree from './components/EntTree'
import ParticleDrift from './components/ParticleDrift'
import ParticleMatterRefer from './components/ParticleMatterRefer'
import CemsOxygenZero from './components/CemsOxygenZero'
import CemsResponseTime from './components/CemsResponseTime'
import ReferenceOxygenZero from './components/ReferenceOxygenZero'
import Speed from './components/Speed'
import Temperature from './components/Temperature'
import Humidity from './components/Humidity'
import TestPeport from './components/TestPeport'
const namespace = 'hourCommissionTest'




const dvaPropsData = ({ loading, hourCommissionTest, commissionTest, }) => ({
  testRecordType: hourCommissionTest.testRecordType,
  tabLoading: loading.effects[`${namespace}/get72TestRecordType`],

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

  const [drawerVisible, setDrawerVisible] = useState(true)


  const [pointId, setPointId] = useState()
  const selectedPoint = (key) => {
    setPointId(key)
    props.get72TestRecordType({
      PointCode: key,
      PollutantCode: 502,
      RecordDate: "",
      Flag: ""
    })
  }
  const tabContet = (key) => {
    switch (key) {
      case "1":
        return <ParticleDrift pointId={pointId} /> //颗粒物CEMS零点和量程漂移检测
      case "2":
        return <ParticleMatterRefer pointId={pointId} /> //参比方法校准颗粒物CEMS
      case "3":
        return <CemsOxygenZero pointId={pointId} /> //气态污染物CEMS（含氧量）零点和量程漂移检测
      case "4":
        return <CemsResponseTime pointId={pointId} /> // 气态污染物CEMS示值误差和系统响应时间检测
      case "5":
        return <ReferenceOxygenZero pointId={pointId} /> //参比方法评估气态污染物CEMS（含氧量）准确度
      case "6":
        return <Speed pointId={pointId} /> //速度场系数检测
      case "7":
       return <Temperature pointId={pointId} /> //温度CMS准确度检测
      case "8":
        return <Humidity pointId={pointId} /> //湿度CMS准确度检测
      case "9":
          return <TestPeport pointId={pointId} /> //检测报告
      default:
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
  }
  const { tabLoading, testRecordType, } = props;
  return (
    <div className={styles.hourCommissionTestSty} style={{ marginLeft: drawerVisible ? 320 : 0 }}>
      <EntTree selectedPoint={selectedPoint} arrowClick={() => { setDrawerVisible(!drawerVisible) }} drawerVisible={drawerVisible} onClose={() => { setDrawerVisible(false) }} />
      <BreadcrumbWrapper>
        <Card>

          {tabLoading ? <PageLoading /> : <>{!testRecordType.length ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <Tabs defaultActiveKey="1" tabPosition="bottom" >
            {testRecordType.map(item => {
              return <TabPane tab={item.RecordName} key={item.ID} >
                {tabContet(item.ID)}
              </TabPane>
            })}

            <TabPane tab={'检测报告'} key={'9'} >
                {tabContet('9')}
              </TabPane>

          </Tabs>}</>

          }

        </Card>
      </BreadcrumbWrapper>


    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);