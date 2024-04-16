/**
 * 功能：左侧
 * 创建人：jab
 * 创建时间：2024.04.12
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm,Progress, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio } from 'antd';
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

const { Option } = Select;

const namespace = 'resourceOverview'




const dvaPropsData = ({ loading, resourceOverview }) => ({

})


const Index = (props) => {





  const { } = props;

  useEffect(() => {

  }, []);

  const personlStatistics = () => {
    return {
      grid: {
        left: 60,
        right: 16,
        bottom: 32,
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
        data: [
          "响水大",
          "滨海南",
          "滨海北",
          "东海马陵山",
          "徐州贾汪",
          "响水陈家港",
        ],
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
          data: [19, 29, 39, 81, 29, 39],
        },
      ],
    };

  }

  const vehicleStatistics = () => {
    var xLabel = ['黄浦区', '徐汇区', '长宁区', '静安区', '虹口区', '闵行区', '宝山区'];
    var getwkrs = [140, 161, 168, 153, 154, 155, 164];
    return {
      grid: {
        top: 12,
        left: 32,
        right: 12,
        bottom: 32,
      },
      tooltip: {
        show:false,
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
          data: xLabel,
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
            show:true,
            lineStyle: {
              color: '#37B6F2',
              opacity: 0.3
            },
          },
          axisLabel: {
            textStyle: {
              fontSize:12,
              color: '#DAEBFF',
            },
          },
        },
      ],
      series: [
        {
          name: "车辆",
          type: 'bar',
          data: getwkrs,
          barWidth: 12,
          itemStyle: {
            normal: {
              color: function (params) {         
                let colors = ['rgba(0, 135, 255, 0.58)','rgba(34, 68, 172, 0)']
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
          data: getwkrs.map(item=>{
            return {value:item}
          }),
          type: 'pictorialBar',
          label: {
            show: true,
            position: 'top',
            textStyle: {
              fontSize:12,
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

 const bjNum = ()=>{

 }
  return (
    <div>
      <CardHeader isStatistics index={1} title='人员统计' subtitle='人员总数（ 人 ）' num={1000} />
      <div className='cardBodySty'>
        <Radio.Group defaultValue="1" buttonStyle="solid" style={{ marginBottom: 8 }}>
          <Radio.Button value="1">业务属性维度</Radio.Button>
          <Radio.Button value="2">司龄</Radio.Button>
        </Radio.Group>
        <ReactEcharts
          option={personlStatistics()}
          style={{ width: "100%", height: 280 }}
          className="echarts-for-echarts"
          theme="my_theme"
        />
      </div>

      {/* <CardHeader isStatistics index={2} title='车辆统计' subtitle='车辆总数（ 人 ）' num={1000} />
      <div className='cardBodySty'>
        <Row justify='space-between' align='middle'>
        <Radio.Group defaultValue="1" buttonStyle="solid" style={{ marginBottom: 8 }}>
          <Radio.Button value="1">车辆分类</Radio.Button>
          <Radio.Button value="2">车辆资产状态</Radio.Button>
        </Radio.Group>
        <span style={{fontSize:12}}>单位：（辆）</span>
        </Row>
      <ReactEcharts
          option={vehicleStatistics()}
          style={{ width: "100%",height:260 }}
          className="echarts-for-echarts"
          theme="my_theme"
        /> 
      </div> */}
      <CardHeader title='备机统计' num={1000} />
      <div className='cardBodySty'>
       <div style={{background:'url(/currencyResOver/bjk.png)'}}><Progress percent={30} /></div>
      </div>
  
      {/* <ReactEcharts
          option={bjNum()}
          style={{ width: "100%"}}
          className="echarts-for-echarts"
          theme="my_theme"
        /> */}
    </div>

  );
};
export default connect(dvaPropsData)(Index);