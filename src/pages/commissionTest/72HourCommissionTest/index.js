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
import TestReport from './components/TestReport'
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
  const selectedPoint = (key,status) => {
    setPointId(key)
    props.get72TestRecordType({
      PointCode: key,
      PollutantCode: 502,
      RecordDate: "",
      Flag: ""
    })
    setWarnArr([])
  }
  
  const timeCompare  = (startTime,endTime,callback,callback2,sampling)=>{  //比较时间大小
    const startTimeVal = startTime&&startTime.replaceAll(':','')
    const endTimeVal = endTime&&endTime.replaceAll(':','')
    if(startTimeVal&&endTimeVal&&startTimeVal>=endTimeVal){
        message.warning('结束时间必须大于开始时间')
        callback&&callback()
    }else{
        callback2&&callback2(startTimeVal,endTimeVal)
    }
  }
  const [warnArr, setWarnArr] = useState([])
  const timeColCompareFun = (type, index, createDateBefore, createDateAfter, createDate) => {
    switch (type) {
        case 1:
        case 2:
            const diffMinutes = createDateAfter.diff(createDateBefore, 'minutes');
            if (diffMinutes < 24 * 60) {
                timeComparWarnMessAlert()
                setWarnArr([...warnArr, index])
            } else {
                const list = warnArr.filter(item => item != index)
                setWarnArr(list)
            }
            break;
        case 3:
            const diffMinutes1 = createDateAfter.diff(createDateBefore, 'minutes');
            const diffMinutes2 = createDate.diff(createDateAfter, 'minutes');
            let list = warnArr;
            if (diffMinutes1 < 24 * 60 || diffMinutes2 < 24 * 60) {
                timeComparWarnMessAlert('间隔时间不足24h')
                if (diffMinutes1 < 24 * 60) {
                    list = [...list, index]
                }
                if (diffMinutes2 < 24 * 60) {
                    list = [...list, index + 1]
                }

            }
            if (diffMinutes1 >= 24 * 60) {
                list = list.filter(item => item != index)
            }
            if (diffMinutes2 >= 24 * 60) {
                list = list.filter(item => item != index + 1)
            }
            setWarnArr(list)
            break;
    }
}
  const timeComparWarnMessAlert = (content) =>{
    message.warning({
        content: content,
        style: { marginTop: '50vh', },
        className:`${styles.timeComparWarnMessAlertSty}`,
        duration: 3,
      });
   }
  const tabContet = (key) => {
    switch (key) {
      case "1":
        return <ParticleDrift {...props} pointId={pointId} warnArr={warnArr} timeColCompareFun={timeColCompareFun}  timeCompare={timeCompare}/> //颗粒物CEMS零点和量程漂移检测
      case "2":
        return <ParticleMatterRefer {...props} pointId={pointId} timeComparWarnMessAlert={timeComparWarnMessAlert} timeCompare={timeCompare}/> //参比方法校准颗粒物CEMS
      case "3":
        return <CemsOxygenZero {...props} pointId={pointId} warnArr={warnArr} timeColCompareFun={timeColCompareFun} timeCompare={timeCompare}/> //气态污染物CEMS（含氧量）零点和量程漂移检测
      case "4":
        return <CemsResponseTime {...props} pointId={pointId}/> // 气态污染物CEMS示值误差和系统响应时间检测
      case "5":
        return <ReferenceOxygenZero {...props} pointId={pointId}  timeCompare={timeCompare}/> //参比方法评估气态污染物CEMS（含氧量）准确度
      case "6":
        return <Speed {...props} pointId={pointId}  timeCompare={timeCompare}/> //速度场系数检测
      case "7":
        return <Temperature {...props} pointId={pointId}  timeCompare={timeCompare}/> //温度CMS准确度检测
      case "8":
        return <Humidity {...props} pointId={pointId}  timeCompare={timeCompare}/> //湿度CMS准确度检测
      case "9":
        return <TestReport pointId={pointId} /> //检测报告
      default:
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
  }
  const { tabLoading, testRecordType, } = props;
  return (
    <div className={styles.hourCommissionTestSty} style={{ marginLeft: drawerVisible ? 320 : 0 }}>
      <EntTree {...props} selectedPoint={selectedPoint}  arrowClick={() => { setDrawerVisible(!drawerVisible) }} drawerVisible={drawerVisible} onClose={() => { setDrawerVisible(false) }} />
      <BreadcrumbWrapper>
        <Card>

          {tabLoading ? 
          <PageLoading /> 
          : <>{!testRecordType.length ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> 
          : <Tabs defaultActiveKey="1" tabPosition="bottom"  moreIcon={<>更多</>}>
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