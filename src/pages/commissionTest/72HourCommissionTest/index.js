/**
 * 功  能：CEMS型号清单
 * 创建人：jab
 * 创建时间：2022.07.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag,Tabs,Empty, Typography,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Spin,   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
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
import  ParticleDrift from './components/ParticleDrift'
import  ParticleMatterRefer from './components/ParticleMatterRefer'
import  EntTree  from './components/EntTree'
import Item from 'antd/lib/list/Item';
const namespace = 'hourCommissionTest'




const dvaPropsData =  ({ loading,hourCommissionTest,commissionTest, }) => ({
  testRecordType:hourCommissionTest.testRecordType,
  tabLoading:loading.effects[`${namespace}/get72TestRecordType`],

})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    get72TestRecordType:(payload)=>{ 
      dispatch({
        type: `${namespace}/get72TestRecordType`,
        payload:payload,
      })
    },
  }
}


const Index = (props) => {

  useEffect(()=>{
  },[])

  const [ drawerVisible, setDrawerVisible ] = useState(true)

   
  const [pointId,setPointId] = useState()
  const selectedPoint = (key) =>{
    console.log(key)
    setPointId(key)
    props.get72TestRecordType({
      PointCode: key,
      PollutantCode: 502,
      RecordDate: "",
      Flag: ""
  })
  }
  const tabContet = (key) =>{
     switch(key){
      case "1":
      return <ParticleDrift   pointId={pointId}/>
      case "2":
      return <ParticleMatterRefer   pointId={pointId}/>
      default:
      return <ParticleDrift   pointId={pointId}/>
     }
  }
  const {tabLoading,testRecordType,} = props;
  console.log(testRecordType)
  return (
    <div  className={styles.hourCommissionTestSty} style={{marginLeft:drawerVisible? 320 : 0}}>         
      <EntTree selectedPoint={selectedPoint}   arrowClick={()=>{setDrawerVisible(!drawerVisible)}} drawerVisible={drawerVisible}  onClose={()=>{setDrawerVisible(false)}} />
    <BreadcrumbWrapper>
    <Card>

  {tabLoading?<PageLoading/> : <>{!testRecordType.length ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <Tabs defaultActiveKey="1" tabPosition="bottom" >
      {testRecordType.map(item=>{
      return <TabPane tab={item.RecordName} key={item.ID} >
              {tabContet(item.ID)}
             </TabPane>
      })}
   
    
     
       </Tabs>}</>
      
      }

   </Card>
   </BreadcrumbWrapper>
   

        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);