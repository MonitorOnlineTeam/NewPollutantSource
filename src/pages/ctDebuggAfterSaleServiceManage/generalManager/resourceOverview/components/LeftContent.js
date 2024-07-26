/**
 * 功能：左侧
 * 创建人：jab
 * 创建时间：2024.04.12
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Progress, Spin, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio } from 'antd';
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
import Office from '@/pages/workSupervision/management/Office'
import CarPollutanet from './popPage/CarPollutanet'

// import Standby from '@/pages/workSupervision/management/standby/Standby'


const { Option } = Select;

const namespace = 'resourceOverview'




const dvaPropsData = ({ loading, resourceOverview }) => ({
  loading: loading.effects[`${namespace}/GetResourceOverviewLeft`],

})


const Index = (props) => {


  
  const echartsRef = useRef(null);
  const echartsRef2 = useRef(null);

  const {data } = props;
  // const [data, setData] = useState({})

  useEffect(() => {
    // props.dispatch({
    //   type: `${namespace}/GetResourceOverviewLeft`,
    //   payload: {},
    //   callback: (data) => {
    //     setData(data)

    //   }
    // })

  }, []);

  // useEffect(() => {
  //   if(data?.StandbyMachineInfo){
  //   echartsRef?.current?.getEchartsInstance()?.dispatchAction({ type: 'highlight', dataIndex: 2 }); //备机统计 默认高亮
  //   echartsRef2?.current?.getEchartsInstance()?.dispatchAction({ type: 'highlight',  dataIndex: 1 }); //备机统计 默认高亮
  //   }
  // }, [data]);
  const [personType, setPersonType] = useState('1')
  const personlStatistics = () => {
    let name = [], value = [];
    if (personType == 1) {
      data.UserInfo?.JobCategoryList.map(item => {
        name.push(item.JobCategory)
        value.push(item.Num)
      })
    } else {
      data.UserInfo?.YearList.map(item => {
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
  const [vehicleType, setVehicleType] = useState('1')
  const [carPollType, setCarPollType] = useState('')

  const vehicleStatistics = () => {
    let name = [], value = [];
    if (vehicleType == 1) {
      data.CarInfo?.PollutantList.map(item => {
        name.push(item.PollutantName)
        value.push(item.Num)
      })
    } else if (vehicleType == 2) {
      data.CarInfo?.CarClassList.map(item => {
        name.push(item.CarClass)
        value.push(item.Num)
      })
    } else {
      data.CarInfo?.AssetStatusList.map(item => {
        name.push(item.AssetStatus)
        value.push(item.Num)
      })

    }
    return {
      grid: {
        top: 16,
        left: 32,
        right: 12,
        bottom: 22,
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
  // const workStatistics = () => {
  //   const colors = ['#39a0f5', '#00D7E9']
  //   const datalist = data?.OfficeLocationInfo?.UsedList?.map((item, index) => {
  //     return { name: item.Used, value: item.Num, itemStyle: { color: colors[index] } }
  //   });
  //   const option = getPie3D(datalist,
  //     { internalDiameterRatio: 0, height: 12, customVal: customVal, legendOption: { show: false }, defaultselection: false, defaultIndex: 0 },
  //     { //3d效果可以放大、旋转等，请自己去查看官方配置
  //       alpha: 20,// 视角绕 x 轴，即上下旋转的角度(与beta一起控制视野成像效果)
  //       beta: -10,// 视角绕 y 轴，即左右旋转的角度
  //       distance: 188,//调整视角到主体的距离，类似调整zoom
  //       autoRotate: false, //自动旋转   
  //     })
  //   option.tooltip = {
  //     show: true,
  //     trigger: 'item', // 设置触发方式为数据项图形触发
  //     backgroundColor: 'transparent', // 设置背景颜色为透明
  //     padding: 0,
  //     borderWidth: 0,
  //     textStyle: {
  //       color: "#fff", //设置文字颜色
  //     },
  //     borderRadius: 12,
  //     formatter: params => {
  //       let bfb = ''
  //       const bagcolor = params.seriesName == '启用' ? 'rgba(0, 100, 194, .5)' : 'rgba(31, 83, 112, 1)'; // 设置背景颜色为半透明
  //       if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
  //         const item = option.series[params.seriesIndex].pieData
  //         if (item.value == customVal || item.value.rate == 0) {//为0时
  //           bfb = 0
  //         } else {
  //           bfb = item.value
  //         }
  //       }
  //       return `<div style="background-color:${bagcolor};padding:10px 18px;border-radius:12px;"><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span> ${params.seriesName}：` +
  //         `${bfb}个</div>`;

  //     }

  //   }
  //   option.series.push({
  //     name: "pie2d",
  //     type: "pie",
  //     tooltip: {
  //       show: false,
  //     },
  //     label: {
  //       // position: 'inside',
  //       color: 'inherit', //继承饼图颜色
  //       opacity: 1,
  //       formatter: function (params) {
  //         return (
  //           "{a|●} {b|" + params.name + "}\n{c|" + params.value + "个}"
  //         );
  //       },
  //       rich: {
  //         a: {
  //           fontSize: 18,
  //         },
  //         b: {
  //           fontFamily: 'Source Han Sans CN',
  //           fontSize: 14,
  //           color: '#fff',
  //         },
  //         c: {
  //           padding: [2, 0, 0, 16]
  //         },
  //       },
  //       textStyle: {
  //         fontWeight: 400,
  //       },

  //     },
  //     labelLine: {
  //       length: 10,//视觉引导线第一段的长度
  //       length2: 50,//视觉引导线第二段的长度
  //     },
  //     startAngle: 50, //起始角度，支持范围[0, 360]。
  //     clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
  //     radius: ["0%", "80%"],
  //     center: ["50%", "60%"],
  //     data: datalist,
  //     itemStyle: {
  //       opacity: 0,
  //     },
  //   });
  //   return option;
  // }

  const carPollTypeClick = (option) =>{
    setVisible(true)
    setModalTitle(`${option.name} - 车辆统计`)
    setCarPollType(option.name)

  }
  // const bjStatistics = (type) => {
  //   const list = type == 1 ? data?.StandbyMachineInfo?.InsStateList?.map(item => {
  //     return {
  //       value: item.Num, name: item.InsState, itemStyle: {
  //         color: item.InsState == '合格' ? {
  //           x: 0, y: 0, x2: 1, y2: 0,
  //           colorStops: [{
  //             offset: 0,
  //             color: '#116CFD'
  //           }, {
  //             offset: 1,
  //             color: '#0BAEFD'
  //           }],
  //         } :
  //           item.InsState == '准用' ? '#00D1F5' : '#F4BA02'
  //       }
  //     }
  //   }) :
  //     data?.StandbyMachineInfo?.UseState?.map(item => {
  //       return {
  //         value: item.Num, name: item.UseState, itemStyle: {
  //           color: item.UseState == '可使用' ? {
  //             x: 0, y: 0, x2: 1, y2: 0,
  //             colorStops: [{
  //               offset: 0,
  //               color: '#0F82FD'
  //             }, {
  //               offset: 1,
  //               color: '#0CA5FD'
  //             }],
  //           } :
  //             '#00FFCC'
  //         }
  //       }
  //     })
  //   return {
  //     title: {
  //       text: type == 1 ? '仪器\n状态' : '使用\n状态',  //图形标题，配置在中间对应位置
  //       left: "center",
  //       top: "center",
  //       textStyle: {
  //         color: "#fff",
  //         fontSize: 14,
  //         align: "center",
  //         fontWeight: 400
  //       }
  //     },
  //     tooltip: {
  //       show: false
  //     },
  //     legend: {
  //       show: false
  //     },
  //     series: [
  //       {
  //         type: 'pie',
  //         radius: ['28%', '48%'],
  //         avoidLabeloverlap: false,
  //         label: {
  //           show: true,
  //           align: "right",
  //           formatter: '{b}:{c}个\n',
  //           textStyle: {
  //             fontSize: 12,
  //             lineHeight: 16,
  //             color: '#fff',
  //             align: 'left',
  //             padding: [0, type == 1 ? -56 : -68],
  //           }
  //         },
  //         emphasis: {
  //           label: {
  //             show: true, //高亮是标签的样式
  //           }
  //         },
  //         labelLine: {
  //           normal: {
  //             show: true,
  //             length: 4,
  //             length2: 64,
  //             align: "right",
  //           },
  //           emphasis: {
  //             show: true,
  //           },
  //         },
  //         data: list
  //       }
  //     ]
  //   }
  // }
  const [visible, setVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState()

  const viewAll = (title) => {
    setVisible(true)
    setModalTitle(title)
  }
  const { loading } = props;

  // const total = data?.OfficeLocationInfo?.OfficeLocationNum?.toString() || '0'

  return (
    <Spin spinning={!!loading}>
      <div style={{ height: '35%'}}>
        <CardHeader isStatistics index={1} title='人员统计' subtitle='人员总数（ 人 ）' num={data?.UserInfo?.SumUserNum} onClick={() => { viewAll('人员统计') }} />
        <div className='cardBodySty' style={{ height: 'calc(100% - 111px)' }}>
          <Radio.Group onChange={(e) => { setPersonType(e.target.value) }} defaultValue="1" buttonStyle="solid" style={{ marginBottom: 8 }}>
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
      <div style={{ height: '35%', minHeight: 270  }}>
        <CardHeader isStatistics index={2} title='车辆统计' subtitle='车辆总数（ 辆 ）' num={data?.CarInfo?.CarNum} onClick={() => { viewAll('车辆统计') }} />
        <div className='cardBodySty' style={{ height: 'calc(100% - 36px - 66px - 8px)' }}>
          <Row justify='space-between' align='middle'  style={{ marginBottom: 8 }}>
            <Radio.Group onChange={(e) => { setVehicleType(e.target.value) }} defaultValue="1" buttonStyle="solid">
              <Radio.Button value="1">行业属性</Radio.Button>
              <Radio.Button value="2">车辆分类</Radio.Button>
              <Radio.Button value="3">车辆资产状态</Radio.Button>
            </Radio.Group>
            <span style={{ fontSize: 12 }}>单位：（辆）</span>
          </Row>
          <ReactEcharts
            option={vehicleStatistics()}
            style={{ width: "100%", height: 'calc(100% - 32px - 8px)' }}
            className="echarts-for-echarts"
            theme="my_theme"
            onEvents={{ click:  vehicleType==1 && carPollTypeClick }}
          />
        </div>
      </div>
      <div style={{ height: '30%' }}>
        <CardHeader title='办事处统计' onClick={() => { viewAll('办事处统计') }} />
        {/* <div className='cardBodySty' style={{ height: 'calc(100% - 45px)' }}>
          <Row justify='space-between' style={{ padding: '18px 56px 12px 56px', fontSize: 16 }}>
            办事处总数
        <div>
              {total && Array.from(total).map((item, index) => {
                return <> <span style={{ fontFamily: 'Source Han Sans CN', fontSize: 22, display: 'inline-block', width: 30, height: 30, marginRight: 6, textAlign: 'center', background: '#002B61', boxShadow: "0px 0px 6px 0px #003DBA", borderRadius: 2 }}>{item}</span></>
              })}
              <span style={{ paddingLeft: 4 }}>个</span>
            </div>
          </Row>
          {data?.OfficeLocationInfo?.UsedList && <ReactEcharts
            option={workStatistics()}
            style={{ width: '100%', height: 'calc(100% - 112px)' }}
            ref={echartsRef}
            className="echarts-for-echarts"
            theme="my_theme"
          />}
          <div style={{ textAlign: 'center', paddingTop: 12 }}><span style={{ display: 'inline-block', textAlign: 'center', background: 'url(/currencyResOver/xbtk.png) no-repeat', color: '#B8D3F1' }}>使用状态</span>  </div>
        </div> */}
        {/* <CardHeader title='备机统计' onClick={()=>{viewAll('备机统计')}}/>
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
        </div> */}
      </div>
      <Modal
        visible={visible}
        title={modalTitle}
        onCancel={() => { setVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal`}
        mask={false}
        bodyStyle={{ padding: 0 }}
      >
        {modalTitle == '人员统计' ? 
         <PersonnelFiles isModal /> 
        : modalTitle == '车辆统计' ?
         <VehicleManager isModal /> 
        : modalTitle == '办事处统计' ?
        <Office isModal onlyAppendHandleRows /> 
        : <CarPollutanet carPollTypeList={data.CarInfo?.PollutantList}  carPollType={carPollType}/> 
      }
      </Modal>
    </Spin>

  );
};
export default connect(dvaPropsData)(Index);