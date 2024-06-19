/**
 * 功  能：污染源信息
 * 创建人：jab
 * 创建时间：2022.04.02
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Tabs, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
import DataVerifica from './components/DataVerifica'
import SystemInfo from './components/SystemInfo'
import DevicePar from './components/DevicePar'
import DeviceInfo from './components/DeviceInfo'
import PointInfo from './components/PointInfo'
import OperationInfo from './components/OperationInfo'
import EntInfo from './components/EntInfo'
import PointCoefficient from '@/pages/operaAchiev/pointCoefficients'
import WorkCoefficient from '@/pages/operaAchiev/workCoefficients'
import OperationCoefficient from './components/AutoFormTable'
import PointMatchingSet from '@/pages/platformManager/configurationInfo/pointMatchingSet'
import { use } from 'echarts';

const namespace = 'pollutantInfo'
const dvaPropsData = ({ loading, pollutantInfo, global }) => ({

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

const filteredHandle = (filters) => {

  let obj = {}
  for (let key in filters) {
    if (filters && filters[key]) {
      obj[key] = filters[key].toString()
    }

  }
  return obj;
}


const Index = (props) => {


  const [tabType, setType] = useState([{ name: '企业信息', key: '1' }, { name: '监测点信息', key: '2' }, { name: '运维信息', key: '3' }, { name: '系统信息', key: '4' },
  { name: '设备信息', key: '5' }, { name: '数据核查项', key: '6' }, { name: '设备参数项', key: '7' }, { name: '监测点系数', key: '8' }, { name: '工单类型系数', key: '9' }, { name: '巡检频次系数', key: '10' }, { name: '点位匹配信息', key: '11' }]);

  useEffect(() => {
    if(props?.location?.query?.nav){
      const filterArray = props?.location?.query?.nav
      const filteredArray = tabType.filter(obj => filterArray.includes(obj.key));
      setType(filteredArray)
    }
  }, [])

  const tabComponents = (key) => {
    switch (key) {
      case '1': return <EntInfo props />;
      case '2': return <PointInfo props filteredHandle={filteredHandle} />;
      case '3': return <OperationInfo props filteredHandle={filteredHandle} />;
      case '4': return <SystemInfo props filteredHandle={filteredHandle} />;
      case '5': return <DeviceInfo props />;
      case '6': return <DataVerifica props filteredHandle={filteredHandle} />;
      case '7': return <DevicePar props filteredHandle={filteredHandle} />;
      case '8': return <PointCoefficient props />;
      case '9': return <WorkCoefficient props />;
      case '10': return <OperationCoefficient props configId='OperationCycleForm' />;
      case '11': return <PointMatchingSet props />;
    }
  }
  return (
    <div className={styles.pollutantInfoSty}>
      <BreadcrumbWrapper>
        <Tabs tabPosition='left'>
          {tabType.map(item => {
            return  <TabPane tab={item.name} key={item.key}>
              {tabComponents(item.key)}
            </TabPane>
          })}
          {/* <TabPane tab="企业信息" key="1">
            <EntInfo props />
          </TabPane>
          <TabPane tab="监测点信息" key="2">
            <PointInfo props filteredHandle={filteredHandle} />
          </TabPane>
          <TabPane tab="运维信息" key="3">
            <OperationInfo props />
          </TabPane>
          <TabPane tab="系统信息" key="4">
            <SystemInfo props filteredHandle={filteredHandle} />
          </TabPane>
          <TabPane tab="设备信息" key="5">
            <DeviceInfo props />
          </TabPane>
          <TabPane tab="数据核查项" key="6">
            <DataVerifica props filteredHandle={filteredHandle} />
          </TabPane>
          <TabPane tab="设备参数项" key="7">
            <DevicePar props filteredHandle={filteredHandle} />
          </TabPane>
          <TabPane tab="监测点系数" key="8">
            <PointCoefficient props />
          </TabPane>
          <TabPane tab="工单类型系数" key="9">
            <WorkCoefficient props />
          </TabPane>
          <TabPane tab="巡检频次系数" key="10">
            <OperationCoefficient props configId='OperationCycleForm' />
          </TabPane>
          <TabPane tab="点位匹配信息" key="11">
            <PointMatchingSet props />
          </TabPane> */}
        </Tabs>
      </BreadcrumbWrapper>


    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);