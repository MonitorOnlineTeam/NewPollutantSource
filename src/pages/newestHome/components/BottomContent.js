/**
 * 功能：首页
 * 创建人：jab
 * 创建时间：2021.11.03
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio,Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import 'echarts-liquidfill';
import CardHeader from './publicComponents/CardHeader'
import PageLoading from '@/components/PageLoading'
import moment from 'moment'
import styles from "../style.less"
import { InitVideo } from '@/utils/video';
import MoreBtn from './publicComponents/MoreBtn'
import ClockAbnormalModal from './springModal/abnormalWorkStatistics'
import ConsumablesStatisticsModal from './springModal/consumablesStatistics'
import EquipmentAbnormalRateModal from './springModal/equipmentAbnormalRate'
import EquipmentFailureRate from './springModal/equipmentFailureRate'
import EquipmentFailurerePairRate from './springModal/equipmentFailurerePairRate'


const { Option } = Select;

const namespace = 'newestHome'



const dvaPropsData = ({ loading, newestHome }) => ({
  exceptionSignTaskRateLoading: loading.effects[`${namespace}/GetExceptionSignTaskRate`],
  exceptionSignTaskRateList:newestHome.exceptionSignTaskRateList,
  consumablesLoading: loading.effects[`${namespace}/GetConsumablesList`],
  exceptionListLoading: loading.effects[`${namespace}/GetOpertionExceptionList`],
  consumablesList:newestHome.consumablesList,
  latelyDays30:newestHome.latelyDays30,
  latelyDays7:newestHome.latelyDays7,
  pollType:newestHome.pollType,
  subjectFontSize:newestHome.subjectFontSize,
  modalType:newestHome.pollType,
  opertionExceptionList:newestHome.opertionExceptionList,
  smallResolution:newestHome.smallResolution,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => { //更新参数
      dispatch({
        type: `${namespace}/updateState`,
        payload: { ...payload },
      })
    },
    GetExceptionSignTaskRate:(payload)=>{ //现场打卡异常
      dispatch({
        type: `${namespace}/GetExceptionSignTaskRate`, 
        payload:{...payload},
      }) 
    },
    GetConsumablesList:(payload)=>{ //耗材统计
      dispatch({
        type: `${namespace}/GetConsumablesList`, 
        payload:{...payload},
      }) 
    },
    GetOpertionExceptionList:(payload)=>{ //异常设备统计
      dispatch({
        type: `${namespace}/GetOpertionExceptionList`, 
        payload:{...payload},
      }) 
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();


  const [tableDatas, setTableDatas] = useState([])


  const {pollType,latelyDays7, latelyDays30,subjectFontSize,smallResolution,} = props;

  const consumablesEchartsRef = useRef(null);
  const planInsideClockAbnormalEchartsRef = useRef(null);
  const planOutClockAbnormalEchartsRef = useRef(null);


  const pollutantType = pollType[props.type]


  useEffect(() => {
    initData()


  }, []);

  const initData = () => {
    let consumablesEchartsInstance = consumablesEchartsRef.current.getEchartsInstance()
    consumablesEchartsInstance.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 }); //耗材统计默认第一条高亮
  
    getExceptionSignTaskRate(latelyDays7); 
    getConsumablesList(latelyDays7)
    getOpertionExceptionList(latelyDays7)

    const planInsideClockAbnormalEchartsInstance = planInsideClockAbnormalEchartsRef.current.getEchartsInstance(); //现场打卡异常 计划内  点击事件
     planInsideClockAbnormalEchartsInstance.getZr().on('click', (params) => {
      setClockAbnormalVisible(true)
    });
    const planOutClockAbnormalEchartsInstance = planOutClockAbnormalEchartsRef.current.getEchartsInstance(); //现场打卡异常 计划外  点击事件
    planOutClockAbnormalEchartsInstance.getZr().on('click', (params) => {
      setClockAbnormalVisible(true)
    });
 
  //   planInsideClockAbnormalEchartsInstance.getZr().on('mousemove',(params)=> {
  //       planInsideClockAbnormalEchartsInstance.getZr().setCursorStyle('pointer');
  // });
  
  //   planOutClockAbnormalEchartsInstance.getZr().on('mousemove', (params)=> {
  //       planInsideClockAbnormalEchartsInstance.getZr().setCursorStyle('pointer');
  // })
  }

  const getExceptionSignTaskRate = (date) =>{ //现场打卡异常
    props.GetExceptionSignTaskRate({ 
      pollutantType: pollutantType,
      ...date
    })
  }
  const getConsumablesList = (date) =>{ //耗材统计
    props.GetConsumablesList({ 
      pollutantType: pollutantType,
      ...date
    })
  }
  const getOpertionExceptionList = (date) =>{ //设备异常总览
    props.GetOpertionExceptionList({ 
      pollutantType: pollutantType,
      ...date
    })
  }
  const [clockBtnCheck, setClockBtnCheck] = useState(latelyDays7)
  const clockAbnormalClick = (key) => { //现场打卡异常 日期切换
    setClockBtnCheck(key)
    getExceptionSignTaskRate(key)
  }


  const [consumablesCheck, setConsumablesCheck] = useState(latelyDays7)
  const consumablesClick = (key) => { //耗材统计 日期切换
    setConsumablesCheck(key)
    getConsumablesList(key)
  }

  const [deviceAbnormalCheck, setDeviceAbnormalCheck] = useState(latelyDays7)
  const deviceAbnormalClick = (key) => { //设备异常 日期切换
    setDeviceAbnormalCheck(key)
    getOpertionExceptionList(key)
  }
   
  const [consumablesStatisticsVisible,setConsumablesStatisticsVisible] = useState(false)
  const moreBtnClick = (type) => {
    if(type === 'consumables'){ //耗材统计
      setConsumablesStatisticsVisible(true)
    }
 
  }
  const sceneClockOption = (data) => { 

    let rate = data=='-' ? "-" : data? data.replace('%', '') / 100 : data;
    var option = {
      series: [{
        type: 'liquidFill',
        data: [rate],
        color: ['#05ADFB'],
        radius: "85%", //水球的半径
        center: ['50%', '50%'],
        // silent: true,
        minAngle:100,
        itemStyle: {
          shadowBlur: 0,
        },
        outline: {
          borderDistance: 0,//内环padding值
          color: 'none',
          itemStyle: { //外环
            borderWidth: 5, //圆边线宽度
            shadowBlur: 10,
            shadowColor: 'rgba(63, 218, 255, 0.5)',
            borderColor: { //线性渐变，多用于折线柱形图，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，
              type: 'linear',
              x: 0,         //（x,y），（x2， y2）分别表示线性渐变的起始点和结束点，globalCoord 为true 表示两个坐标点是绝对坐标        
              y: 0,
              x2: .2,
              y2: 1,
              colorStops: [
                {
                  offset: 0.5,
                  color: ['#05ADFB'], // 50% 处的颜色
                },
                {
                  offset: 0,
                  color: ['#263249'], // 100% 处的颜色
                },
              ],
              globalCoord: true // 缺省为 false
            }
          }
        },
        backgroundStyle: { //内环
          borderWidth: 5,
          borderColor: '#263249',
          color: 'none',     
        },
        label: {
          normal: {
            formatter: function (name) {
              let val = name.value=='-'? '-' : (name.value * 100).toFixed(2);
              return val=='-'?'-' : `{val|${val}%}`
            },
            rich: {
              //富文本 对字体进一步设置样式。val对应的 value
              val: {
                fontSize: 20,
                fontWeight: "bold",
              }
            }
          }
        },
      },
      ]

    };

    return option;
  }

  const { consumablesList } = props;

  const consumablesOption = ()=>{
    
    const commonData =[
        { value: consumablesList.consumablesReplaceCount, name: '易耗品更换数量', },
        { value: consumablesList.sparePartReplaceRecordCount, name: '备品备件更换数量' },
      ]
    return {  //耗材统计
    color: ['#00DCFF', '#FFC200'],
    tooltip: {
      show: false
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '耗材统计',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: true,
        minAngle: 90,//最小角度
        emphasis: {
          label: {
            show: true, //高亮是标签的样式
          }
        },
        label: {
          // position: 'outer',
          // alignTo: 'edge',
          formatter: '{name|{b}}\n{num|{c}}',
          rich: {
            name: {
              fontSize: subjectFontSize,
              color: '#fff',
              align: "left",
              padding: smallResolution? [5, 2, 18, 2] : [5, 5, 18, 5]  //上左下右 逆时针 
            },
            num: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#3BBFFE',
              align: "left",
              padding: [0, 10, 0, 10]
            }
          },
        },
        labelLine: {
          normal: {
            length: 8,  // 视觉引导线第一段的长度。
            length2: '11%', //视觉引导线第二段的长度。
            lineStyle: {
              color: "#fff"  // 改变标示线的颜色
            }
          },

        },

        data: pollutantType==1?[
          ...commonData,
          {
            value: consumablesList.standardLiquidRepalceCount, name: '试剂更换数量',
            itemStyle: {
              normal: {
                color: {
                  type: 'linear', // 线性渐变
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [{
                    offset: 0,
                    color: '#E94F7B' // 0%处的颜色为红色
                  }, {
                    offset: 1,
                    color: '#F66188' // 100%处的颜色为蓝
                  }],
                }
              },
            }
          },

        ]:[
          ...commonData,
            {
            value: consumablesList.standardGasRepalceCoun, name: '标准气体更换数量', itemStyle: {
              normal: {
                color: {
                  type: 'linear', // 线性渐变
                  x: 0, y: 0, x2: 1, y2: 0,
                  colorStops: [{
                    offset: 0,
                    color: '#116CFD' // 0%处的颜色为红色
                  }, {
                    offset: 1,
                    color: '#0BAEFD' // 100%处的颜色为蓝
                  }],
                }
              },
            }
          },
        ]
      }
    ]
  }
  };
  const deviceAbnormalOption = (type) => {  //设备异常统计图表
   const { opertionExceptionList } = props; 
    let color1 = ["#FFCC00", "#323A70"], color2 = ["#FF0000", '#323A70'], color3 = ['#3571EA', '#323A70']
    let option = {
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      color: type == 1 ? color1 : type == 2 ? color2 : color3,
      title: {
        text: type == 1 ? opertionExceptionList.intactRate=='-'?'-': ` ${ opertionExceptionList.intactRate }%` : type == 2 ? opertionExceptionList.failureRate=='-'?'-':  `${opertionExceptionList.failureRate}%` : opertionExceptionList.repairRate=='-'?'-':  `${opertionExceptionList.repairRate}%`,
        left: "center",
        top: "42%",
        textStyle: {
          color: type == 1 ? color1[0] : type == 2 ? color2[0] : color3[0],
          fontSize: 18,
          align: "center",
          fontWeight: 'bold',
        }
      },
      series: [
        {
          name: type == 1 ? '计划巡检完成率' : type == 2 ? '计划校准完成率' : '实际校准完成率',
          type: 'pie',
          radius: ['70%', '83%'],
          avoidLabelOverlap: false,
          label: { normal: { show: false, position: 'center' }, },
          data: [
            { value: type == 1 ? opertionExceptionList.intactRate  : type == 2 ? opertionExceptionList.failureRate: opertionExceptionList.repairRate, name: '已完成' },
            { value: type == 1 ? opertionExceptionList.intactRate=='-'? 0 : (100 - opertionExceptionList.intactRate) : type == 2 ? opertionExceptionList.failureRate=='-'? 0 : (100 - opertionExceptionList.failureRate) : opertionExceptionList.repairRate=='-'? 0  : (100 - opertionExceptionList.repairRate), name: '未完成' },
          ],
          minAngle: 0,//最小角度
          startAngle:350, //起始角度
        }
      ]
    };
    return option;
  }
  const [deviceType,setdeviceType] = useState(1)
  const deviceAbnormals = () =>{ //设备完好率
    setEquipmentAbnormalRateVisible(true)
    setdeviceType(1)
  }

  const deviceFailureRate = () =>{ //设备完好率
    setEquipmentFailureRateVisible(true)
    // setEquipmentAbnormalRateVisible(true)
    // setdeviceType(2)
  }
  const deviceFailurerePairRate = () =>{ //设备故障修复率
    setEquipmentFailurerePairRateVisible(true)
  }
  const deviceAbnormalEcharts = useMemo(()=>{  
   return <Row type='flex' align='middle' justify='space-between'>
    <Col span={8} align='middle'>

      <ReactEcharts
        option={deviceAbnormalOption(1)}
        style={{ width: '100%', height: 151 }}
        onEvents={{ click: deviceAbnormals }}
      />
     <div>设备完好率</div>
    </Col>
    <Col span={8} align='middle'>
      <ReactEcharts
        option={deviceAbnormalOption(2)}
        style={{ width: '100%', height: 151 }}
        onEvents={{ click: deviceFailureRate }}
      />
      <div>设备故障率</div>
    </Col>
    <Col span={8} align='middle'>
      <ReactEcharts
        option={deviceAbnormalOption(3)}
        style={{ width: '100%', height: 151 }}
        onEvents={{ click: deviceFailurerePairRate }}
      />
      <div>故障修复率</div>
    </Col>
  </Row>
  },[props.opertionExceptionList])

  const { exceptionSignTaskRateLoading,exceptionSignTaskRateList } = props; //现场打卡
  const { consumablesLoading } = props; //耗材统计
  const [clockAbnormalVisible,setClockAbnormalVisible] = useState(false)  //现场打卡 弹框
  const { exceptionListLoading } = props; //设备异常总览
  const [equipmentAbnormalRateVisible,setEquipmentAbnormalRateVisible ] = useState(false) //设备完好率 弹框
  const [equipmentFailureRateVisible,setEquipmentFailureRateVisible ] = useState(false) //设备故障率 弹框
  const [equipmentFailurerePairRateVisible,setEquipmentFailurerePairRateVisible ] = useState(false) //设备故障修复率 弹框
 
  
  return (
    <Row style={{ flexFlow: 'row nowrap' }} justify='space-between'>

      <Spin spinning={exceptionSignTaskRateLoading}>
      <Col className={styles.clockAbnormal}>
        <CardHeader btnClick={clockAbnormalClick} showBtn type='week' btnCheck={clockBtnCheck} title='现场打卡异常' />
        <div style={{ paddingTop: 11 }}>
          <Row>
            <div style={{ width: '50%' }}>
              <ReactEcharts
                option={sceneClockOption(exceptionSignTaskRateList.insidePlanRate=='-'? '-': ` ${ exceptionSignTaskRateList.insidePlanRate}%`)}
                style={{ height: '112px', width: '100%' }}
                ref={planInsideClockAbnormalEchartsRef}
              />
              <Row style={{ padding: '3px 0 10px 0', fontWeight: 'bold' }} justify='center' >计划内打卡异常率</Row>
              <Row justify='center'>
                <div className={styles.clockNumTextBag}>
                  <Row justify='center'>
                    <Col>
                      <div className={styles.clockNum}>{exceptionSignTaskRateList.insidePlanTaskCount}次</div>
                      <div className={styles.clockText}>打卡次数</div>
                    </Col>
                    <Col style={{ paddingLeft: 43 }}>
                      <div className={styles.clockNum}>{exceptionSignTaskRateList.insidePlanTaskExceptionCount}次</div>
                      <div className={styles.clockText}>打卡异常次数</div>
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>
            <div style={{ width: '50%' }}>
              <ReactEcharts
                option={sceneClockOption(exceptionSignTaskRateList.outPlanTaskRate=='-'? '-': `${exceptionSignTaskRateList.outPlanTaskRate}%`)}
                style={{ height: '112px', width: '100%' }}
                ref={planOutClockAbnormalEchartsRef}
              />
              <Row style={{ padding: '3px 0 10px 0', fontWeight: 'bold' }} justify='center' >计划外打卡异常率</Row>
              <Row justify='center'>
                <div className={styles.clockNumTextBag}>
                  <Row justify='center'>
                    <Col>
                      <div className={styles.clockNum}>{exceptionSignTaskRateList.outPlanTaskCount}次</div>
                      <div className={styles.clockText}>打卡次数</div>
                    </Col>
                    <Col style={{ paddingLeft: 43 }}>
                      <div className={styles.clockNum}>{exceptionSignTaskRateList.outPlanTaskExceptionCount}次</div>
                      <div className={styles.clockText}>打卡异常次数</div>
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>
          </Row>
        </div>
      </Col>
      </Spin>

      <Spin spinning={consumablesLoading}>
      <Col className={styles.consumablesStatistics}>
        <CardHeader btnClick={consumablesClick} showBtn type='week' btnCheck={consumablesCheck} title='耗材统计' />
        <Row justify='center' align='middle' className={styles.consumablesChart} >
          <div style={{ position: 'absolute', height: '167px', width: '167px', borderRadius: '50%', border: '1px solid #2d3d59' }}></div>
          <ReactEcharts
            option={consumablesOption()}
            style={{ height: '182px', width: '100%' }}
            ref={consumablesEchartsRef}
          />
          <MoreBtn className={styles.moreBtnAbsoluteSty} type='consumables' moreBtnClick={moreBtnClick} />
        </Row>
      </Col>
     </Spin>

     <Spin spinning={exceptionListLoading}>
      <Col className={styles.deviceAbnormal}> {/**设备异常总览 */}
        <CardHeader btnClick={deviceAbnormalClick} showBtn type='week' btnCheck={deviceAbnormalCheck} title='设备异常总览' />
        <div style={{ height: '100%', padding: '41px 0 0' }}> 
           { deviceAbnormalEcharts }{/**当图表有点击事件时 更新更新页面时  图表抖动 */}
        </div>
      </Col>
    </Spin>
       <ClockAbnormalModal  //现场打卡异常弹框
        modalType='clockAbnormal'
        visible={clockAbnormalVisible}
        type={pollutantType}
        onCancel={()=>{setClockAbnormalVisible(false)}}
        time={[moment(clockBtnCheck.beginTime),moment(clockBtnCheck.endTime)]}
      />
      <ConsumablesStatisticsModal  //耗材统计弹框
        visible={consumablesStatisticsVisible}
        type={Number(pollutantType)}
        onCancel={()=>{setConsumablesStatisticsVisible(false)}}
        time={[moment(consumablesCheck.beginTime),moment(consumablesCheck.endTime)]}
      />    
      <EquipmentAbnormalRateModal  //设备完好率弹框
        visible={equipmentAbnormalRateVisible}
        type={Number(pollutantType)}
        onCancel={()=>{setEquipmentAbnormalRateVisible(false)}}
        time={[moment(deviceAbnormalCheck.beginTime),moment(deviceAbnormalCheck.endTime)]}
        deviceType={deviceType} //1设备完好率 2设备故障率 新
      />  
      <EquipmentFailureRate  //设备故障率弹框
        visible={equipmentFailureRateVisible}
        type={Number(pollutantType)}
        onCancel={()=>{setEquipmentFailureRateVisible(false)}}
        time={[moment(deviceAbnormalCheck.beginTime),moment(deviceAbnormalCheck.endTime)]}
      />  
      <EquipmentFailurerePairRate //设备故障修复率弹框
        visible={equipmentFailurerePairRateVisible}
        type={Number(pollutantType)}
        onCancel={()=>{setEquipmentFailurerePairRateVisible(false)}}
        time={[moment(deviceAbnormalCheck.beginTime),moment(deviceAbnormalCheck.endTime)]}
      /> 
         
    </Row>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);