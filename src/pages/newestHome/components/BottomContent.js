/**
 * 功能：首页
 * 创建人：贾安波
 * 创建时间：2021.11.03
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio } from 'antd';
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

const { Option } = Select;

const namespace = 'newestHome'




const dvaPropsData = ({ loading, newestHome }) => ({
  exportLoading: loading.effects[`${namespace}/exportnewestHomeList`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => { //更新参数
      dispatch({
        type: `${namespace}/updateState`,
        payload: { ...payload },
      })
    },
    getnewestHomeList: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/getnewestHomeList`,
        payload: payload,
        callback: callback
      })

    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();


  const [tableDatas, setTableDatas] = useState([])
  const [pollutantType, setPollutantType] = useState('')


  const { tableLoading, exportLoading, checkName, totalDatas } = props;

  const consumablesEchartsRef = useRef(null);

  useEffect(() => {
    initData()

  }, []);

  const initData = () => {
    const getnewestHomeList = (value) => {
      props.getnewestHomeList({ PollutantType: value }, (res) => {
        setTableDatas(res.notExpired7List)
      })
    }
    let consumablesEchartsInstance = consumablesEchartsRef.current.getEchartsInstance()

    consumablesEchartsInstance.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 }); //耗材统计默认第一条高亮
  }

  const [clockBtnCheck, setClockBtnCheck] = useState(1)
  const clockAbnormalClick = (key) => { //现场打卡 日期切换
    setClockBtnCheck(key)
  }


  const [consumablesCheck, setConsumablesCheck] = useState(1)
  const consumablesClick = (key) => { //耗材统计 日期切换
    setConsumablesCheck(key)
  }

  const [deviceAbnormalCheck, setDeviceAbnormalCheck] = useState(1)
  const deviceAbnormalClick = (key) => { //设备异常 日期切换
    setDeviceAbnormalCheck(key)
  }

  const moreBtnClick = (type) => {
    console.log(type)
  }
  const sceneClockOption = (data) => {

    let rate = data ? data.replace('%', '') / 100 : data;
    var option = {
      series: [{
        type: 'liquidFill',
        data: [rate],
        color: ['#05ADFB'],
        radius: "85%", //水球的半径
        center: ['50%', '50%'],
        silent: true,
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
          color: 'none'
        },
        label: {
          normal: {
            formatter: function (name) {
              let val = name.value ? (name.value * 100).toFixed(2) : '0.00';
              return `{val|${val}%}`
            },
            rich: {
              //富文本 对字体进一步设置样式。val对应的 value
              val: {
                fontSize: 20,
                fontWeight: "bold"
              }
            }
          }
        },
      },
      ]

    };

    return option;
  }
  const consumablesOption = {  //耗材统计
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
              fontSize: 14,
              color: '#fff',
              align: "left",
              padding: [5, 10, 20, 10]
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

        data: [
          { value: 310, name: '易耗品更换数量', },
          {
            value: 234, name: '试剂更换数量',
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
          {
            value: 135, name: '标液更换数量', itemStyle: {
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
          { value: 335, name: '备品备件更换数量' },
        ]
      }
    ]
  };
  const deviceAbnormalOption = (type) => {  //计划运维图表

    let color1 = ["#FFCC00", "#323A70"], color2 = ["#FF0000", '#323A70'], color3 = ['#3571EA', '#323A70']
    let option = {
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      color: type == 1 ? color1 : type == 2 ? color2 : color3,
      title: {
        text: type == 1 ? '90.00%' : type == 2 ? '90.00%' : '90.00%',
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
            { value: type == 1 ? 90.00 : type == 2 ? 90.00 : 90.00, name: '已完成' },
            { value: type == 1 ? (100 - 90.00) : type == 2 ? (100 - 90.00) : (100 - 90.00), name: '未完成' },
          ],
          // minAngle: 0,//最小角度
          startAngle:350, //起始角度
        }
      ]
    };
    return option;
  }

  const deviceAbnormals = () =>{
    console.log(1111)
  }
  const deviceAbnormalEcharts = useMemo(()=>{  

   return <Row type='flex' align='middle' justify='space-between'>
    <Col span={8} align='middle'>

      <ReactEcharts
        option={deviceAbnormalOption(1)}
        style={{ width: '100%', height: 151 }}
        onEvents={{ click: deviceAbnormals }}
      />
     <div>设备异常率</div>
    </Col>
    <Col span={8} align='middle'>
      <ReactEcharts
        option={deviceAbnormalOption(2)}
        style={{ width: '100%', height: 151 }}
      />
      <div>设备故障率</div>
    </Col>
    <Col span={8} align='middle'>
      <ReactEcharts
        option={deviceAbnormalOption(3)}
        style={{ width: '100%', height: 151 }}
      />
      <div>设备修复率</div>
    </Col>
  </Row>
  },[])
  return (
    <Row style={{ flexFlow: 'row nowrap' }} justify='space-between'>


      <Col className={styles.clockAbnormal}>
        <CardHeader btnClick={clockAbnormalClick} showBtn type='week' btnCheck={clockBtnCheck} title='现场打卡异常统计' />
        <div style={{ paddingTop: 11 }}>
          <Row>
            <div style={{ width: '50%' }}>
              <ReactEcharts
                option={sceneClockOption('90%')}
                style={{ height: '112px', width: '100%' }}
              />
              <Row style={{ padding: '3px 0 10px 0', fontWeight: 'bold' }} justify='center' >计划内打卡异常率</Row>
              <Row justify='center'>
                <div className={styles.clockNumTextBag}>
                  <Row justify='center'>
                    <Col>
                      <div className={styles.clockNum}>100次</div>
                      <div className={styles.clockText}>打卡次数</div>
                    </Col>
                    <Col style={{ paddingLeft: 43 }}>
                      <div className={styles.clockNum}>90次</div>
                      <div className={styles.clockText}>打卡异常次数</div>
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>
            <div style={{ width: '50%' }}>
              <ReactEcharts
                option={sceneClockOption('90%')}
                style={{ height: '112px', width: '100%' }}
              />
              <Row style={{ padding: '3px 0 10px 0', fontWeight: 'bold' }} justify='center' >计划外打卡异常率</Row>
              <Row justify='center'>
                <div className={styles.clockNumTextBag}>
                  <Row justify='center'>
                    <Col>
                      <div className={styles.clockNum}>100次</div>
                      <div className={styles.clockText}>打卡次数</div>
                    </Col>
                    <Col style={{ paddingLeft: 43 }}>
                      <div className={styles.clockNum}>90次</div>
                      <div className={styles.clockText}>打卡异常次数</div>
                    </Col>
                  </Row>
                </div>
              </Row>
            </div>
          </Row>
        </div>
      </Col>


      <Col className={styles.consumablesStatistics}>
        <CardHeader btnClick={consumablesClick} showBtn type='week' btnCheck={consumablesCheck} title='耗材统计' />
        <Row justify='center' align='middle' className={styles.consumablesChart} >
          <div style={{ position: 'absolute', height: '167px', width: '167px', borderRadius: '50%', border: '1px solid #2d3d59' }}></div>
          <ReactEcharts
            option={consumablesOption}
            style={{ height: '182px', width: '100%' }}
            ref={consumablesEchartsRef}
          />
          <MoreBtn className={styles.moreBtnAbsoluteSty} type='planComplete' moreBtnClick={moreBtnClick} />
        </Row>
      </Col>



      <Col className={styles.deviceAbnormal}> {/**设备异常统计 */}
        <CardHeader btnClick={deviceAbnormalClick} showBtn type='week' btnCheck={deviceAbnormalCheck} title='设备异常统计' />
        <div style={{ height: '100%', padding: '41px 0 0' }}> {/**当图表有点击事件时 更新更新页面时  图表抖动 */}
           { deviceAbnormalEcharts }
        </div>
      </Col>
    </Row>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);