/**
 * 功能：左侧
 * 创建人：jab
 * 创建时间：2024.04.12
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Progress,Spin, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import ReactEcharts from 'echarts-for-react';
import PageLoading from '@/components/PageLoading'
import moment from 'moment'
import CardHeader from '../components/publicComponents/CardHeader'
import PersonnelFiles from '@/pages/ctDebuggAfterSaleServiceManage/generalManager/personnelFiles'
import VehicleManager from '@/pages/ctDebuggAfterSaleServiceManage/generalManager/vehicleManager'
import Standby from '@/pages/workSupervision/management/standby/Standby'


const { Option } = Select;

const namespace = 'resourceOverview'




const dvaPropsData = ({ loading, resourceOverview }) => ({
  loading : loading.effects[`${namespace}/GetResourceOverviewLeft`],

})


const Index = (props) => {



  const echartsRef = useRef(null);
  const echartsRef2 = useRef(null);

  const [data,setData ] =useState({})

  useEffect(() => {
    props.dispatch({
      type: `${namespace}/GetResourceOverviewLeft`,
      payload: {},
      callback: (data) => {
        setData(data)
        
      }
    })

  }, []);
 
  // useEffect(() => {
  //   if(data?.StandbyMachineInfo){
  //   echartsRef?.current?.getEchartsInstance()?.dispatchAction({ type: 'highlight', dataIndex: 2 }); //备机统计 默认高亮
  //   echartsRef2?.current?.getEchartsInstance()?.dispatchAction({ type: 'highlight',  dataIndex: 1 }); //备机统计 默认高亮
  //   }
  // }, [data]);
  const [personType,setPersonType] = useState('1')
  const personlStatistics = () => {
    let name = [],value=[];
    if(personType==1){
       data.UserInfo?.JobCategoryList.map(item=>{
        name.push(item.JobCategory)
        value.push(item.Num)
      })
    }else{
        data.UserInfo?.YearList.map(item=>{
          name.push(item.Year)
          value.push(item.Num)
        })

    }
    return {
      grid: {
        left: 68,
        right: 16,
        bottom: 28,
        top: 4,
      },
      xAxis: {
        type: "value",
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },

        axisLabel: {
          //  改变x轴字体颜色和大小
          textStyle: {
            color: "#ABC6E5",
            fontSize: 13,
          },
        },
      },
      yAxis: {
        type: "category",
        data: name,
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: "#fff",
            fontSize: 12,
            opacity: 0.3
          },
        },
      },
      series: [
        {
          type: "bar",
          barWidth: 12,
          itemStyle: {
            normal: {
              label: {
                show: true, //开启显示
                position: "right", //在右边显示
                textStyle: {
                  //数值样式
                  color: "#07BCFF",
                  fontSize: 13,
                },
              },
              color: {
                x: 0, y: 0, x2: 1, y2: 0,
                colorStops: [{
                  offset: 0, color: '#1B7EF9'  // 开始颜色
                }, {
                  offset: 1, color: '#3FB1E5'  // 结束颜色
                }]
              },
            },
          },
          data: value,
        },
      ],
    };

  }
  const [vehicleType,setVehicleType] = useState('1')

  const vehicleStatistics = () => {
    let name = [],value=[];
    if(vehicleType==1){
       data.CarInfo?.CarClassList.map(item=>{
        name.push(item.CarClass)
        value.push(item.Num)
      })
    }else{
        data.CarInfo?.AssetStatusList.map(item=>{
          name.push(item.AssetStatus)
          value.push(item.Num)
        })

    }
    return {
      grid: {
        top: 12,
        left: 32,
        right: 12,
        bottom: 28,
      },
      tooltip: {
        show: false,
        // 格式化提示内容
        // formatter: function (params) {
        //   return params.name +
        //     ' : ' + params.value + '辆'
        // }
      },
      xAxis: [
        {
          type: 'category',
          axisLabel: {
            interval: 0,
            //坐标轴刻度标签的相关设置
            textStyle: {
              color: '#DAEBFF',
              fontSize: 12,
            },
          },
          axisLine: {
            lineStyle: {
              color: '#37B6F2',
              opacity: 0.3
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: name,
        },
      ],
      yAxis: [
        {
          min: 0,
          minInterval: 1,
          type: 'value',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#37B6F2',
              opacity: 0.3
            },
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: '#DAEBFF',
            },
          },
        },
      ],
      series: [
        {
          name: "车辆",
          type: 'bar',
          data: value,
          barWidth: 12,
          itemStyle: {
            normal: {
              color: function (params) {
                let colors = ['rgba(0, 135, 255, 0.58)', 'rgba(34, 68, 172, 0)']
                return {
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [{
                    offset: 0, color: colors[0]  // 开始颜色
                  }, {
                    offset: 1, color: colors[1] // 结束颜色
                  }]
                }
              }
            }
          },
        },
        {
          data: value.map(item => {
            return { value: item }
          }),
          type: 'pictorialBar',
          label: {
            show: true,
            position: 'top',
            textStyle: {
              fontSize: 12,
              color: '#41CDFF',
            },
          },
          symbol: 'rect',
          symbolPosition: 'end',
          symbolSize: [16, 3],
          symbolOffset: [0, -3],
          itemStyle: {
            normal: {
              color: '#5DD6FF'
            }
          },
        },
      ]
    }
  }

  const bjStatistics = (type) => {
    const list = type == 1 ? data?.StandbyMachineInfo?.InsStateList?.map(item=>{
      return {
        value: item.Num, name: item.InsState, itemStyle: {
          color: item.InsState=='合格'? {
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [{
              offset: 0,
              color: '#116CFD'
            }, {
              offset: 1,
              color: '#0BAEFD'
            }],
          } :
          item.InsState=='准用'? '#00D1F5' : '#F4BA02'
        }
      }
    }) :
      data?.StandbyMachineInfo?.UseState?.map(item=>{
        return {
          value: item.Num, name: item.UseState, itemStyle: {
            color: item.UseState=='可使用'? {
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [{
                offset: 0,
                color: '#0F82FD'
              }, {
                offset: 1,
                color: '#0CA5FD'
              }],
            } :
             '#00FFCC'
          }
        }
      })
    return {
      title: {
        text: type == 1 ? '仪器\n状态' : '使用\n状态',  //图形标题，配置在中间对应位置
        left: "center",
        top: "center",
        textStyle: {
          color: "#fff",
          fontSize: 14,
          align: "center",
          fontWeight: 400
        }
      },
      tooltip: {
        show: false
      },
      legend: {
        show: false
      },
      series: [
        {
          type: 'pie',
          radius: ['28%', '48%'],
          avoidLabeloverlap: false,
          label: {
            show:true,
            align: "right",
            formatter: '{b}:{c}个\n',
            textStyle: {
              fontSize: 12,
              lineHeight:16,
              color: '#fff',
              align:'left',
              padding:  [0, type==1?-56:-68],
            }
          },
          emphasis: {
            label: {
              show: true, //高亮是标签的样式
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 4,
              length2: 64,
              align: "right",
            },
            emphasis: {
              show: true,
            },
          },
          data: list
        }
      ]
    }
  }
  const [visible,setVisible] = useState(false)
  const [modalTitle,setModalTitle] = useState()

  const  viewAll = (title)=>{
    setVisible(true)
    setModalTitle(title)
  }
  const { loading } = props;
  return (
    <Spin spinning={!!loading}>
      <div style={{height:'35%',minHeight:270}}>
      <CardHeader isStatistics index={1} title='人员统计' subtitle='人员总数（ 人 ）' num={data?.UserInfo?.SumUserNum} onClick={()=>{viewAll('人员统计')}}/>
      <div className='cardBodySty' style={{height:'calc(100% - 111px)'}}>
        <Radio.Group onChange={(e)=>{setPersonType(e.target.value)}} defaultValue="1" buttonStyle="solid" style={{ marginBottom: 8 }}>
          <Radio.Button value="1">业务属性</Radio.Button>
          <Radio.Button value="2">司龄</Radio.Button>
        </Radio.Group>
        <ReactEcharts
          option={personlStatistics()}
          style={{ width: "100%", height: 'calc(100% - 32px - 8px)' }}
          className="echarts-for-echarts"
          theme="my_theme"
        />
      </div>
      </div>
      <div style={{height:'35%'}}>
       <CardHeader isStatistics index={2} title='车辆统计' subtitle='车辆总数（ 辆 ）' num={data?.CarInfo?.CarNum} onClick={()=>{viewAll('车辆统计')}}/>
      <div className='cardBodySty'   style={{height:'calc(100% - 36px - 66px - 8px)'}}>
        <Row justify='space-between' align='middle'>
        <Radio.Group onChange={(e)=>{setVehicleType(e.target.value)}} defaultValue="1" buttonStyle="solid" style={{ marginBottom: 8 }}>
          <Radio.Button value="1">车辆分类</Radio.Button>
          <Radio.Button value="2">车辆资产状态</Radio.Button>
        </Radio.Group>
        <span style={{fontSize:12}}>单位：（辆）</span>
        </Row>
      <ReactEcharts
          option={vehicleStatistics()}
          style={{ width: "100%",height:'calc(100% - 32px - 8px)' }}
          className="echarts-for-echarts"
          theme="my_theme"
        /> 
      </div>
      </div>
      <div style={{height:'30%'}}>
      <CardHeader title='备机统计' onClick={()=>{viewAll('备机统计')}}/>
      <div className='cardBodySty'    style={{ height: "calc(100% - 47px)" }}>
        <div style={{lineHeight:'34px',padding:'12px 0'}}>
        <div style={{ background: 'url(/currencyResOver/bjk.png)',backgroundSize:'100% 100%'}}>
             <span style={{paddingLeft:76,color:'#BAE3FF'}}>备机总数</span>
             <span style={{fontSize:16,position:'absolute',right:32}}>{data?.StandbyMachineInfo?.StandbyMachineNum || 0}个</span>
          </div>
        </div>
      <Row align='middle' justify='space-between' style={{ height: "calc(100% - 58px)" }}>
      <div  style={{position:'relative',width: '50%',height:'100%',paddingRight:2}}>
      <div className='bjkSty'> </div>
      <ReactEcharts
          option={bjStatistics(1)}
          style={{ width: '100%', height: '100%'}}
          ref={echartsRef}
          className="echarts-for-echarts"
          theme="my_theme"
        /> 
      </div>
      <div  style={{position:'relative',width: '50%',height:'100%',paddingLeft:2}}>
      <div className='bjkSty'> </div>
         <ReactEcharts
          option={bjStatistics(2)}
          style={{ width: '100%',height:'100%'}}
          ref={echartsRef2}
          className="echarts-for-echarts"
          theme="my_theme"
        /> 
          </div>
        </Row>
        </div>
        </div>
        <Modal
        visible={visible}
        title={modalTitle}
        onCancel={() => { setVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal`}
        mask={false}
        bodyStyle={{padding:0}}
      >
        {modalTitle=='人员统计'? <PersonnelFiles isModal/> : modalTitle=='车辆统计'? <VehicleManager isModal/> : <Standby isModal notOperate/>}
      </Modal>
    </Spin>

  );
};
export default connect(dvaPropsData)(Index);