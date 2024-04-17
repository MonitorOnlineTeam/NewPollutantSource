/**
 * 功能：右侧
 * 创建人：jab
 * 创建时间：2024.04.12
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
import PageLoading from '@/components/PageLoading'
import moment from 'moment'
import CardHeader from '../components/publicComponents/CardHeader'
import {
  getPie3D,
  chartMouseover,
  chartMouseout,
} from '@/pages/ctDebuggAfterSaleServiceManage/utils/getPie3D';
const { Option } = Select;

const namespace = 'resourceOverview'




const dvaPropsData = ({ loading, resourceOverview }) => ({

})

const Index = (props) => {

  const echartsRef = useRef(null);



  const { } = props;

  const [customHourVal, setCustomHourVal] = useState(0.03456)
  useEffect(() => {

  }, []);
  const workStatistics = () => {
    const datalist = [
      {
        name: '启用',
        value: 925,
        itemStyle: {
          opacity: 1,
          color: '#56bcfd',
          // color: {
          //   x: 0, y: 0, x2: 1, y2: 0,
          //   colorStops: [{
          //     offset: 0, color: '#00A8FF'  // 开始颜色
          //   }, {
          //     offset: 1, color: '#8FDFFE'  // 结束颜色
          //   }]
          // },
        }
      }, {
        name: '停用',
        value: 285,
        itemStyle: {
          opacity: 1,
          color: '#00D7E9',
          // color: 'linear-gradient(90deg, #00A8FF 0%, #8FDFFE 100%)'
        }

      }]
    const option = getPie3D(datalist,
      { internalDiameterRatio: 0, height: 12, customVal: customHourVal, legendOption: { show: false },defaultSelection:true },
      { //3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 20,
				// 饼块开始得角度
				beta: -10,
        distance: 235,//调整视角到主体的距离，类似调整zoom
        autoRotate: false, //自动旋转   
      })
    // option.series.push({ //需要label指引线的话
    //   name: 'pie2d',
    //   type: 'pie',
    //   avoidLabelOverlap: true,
    //   label: {
    //     show: false, 
    //    },
    //   labelLine: {
    //     show: false,
    //   },
    //   startAngle: -20, //起始角度，支持范围[0, 360]。
    //   clockwise: false,//饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
    //   radius: ['40%', '100%'],
    //   center: ['50%', '50%'],
    //   data: workHourDataRatio,
    //   itemStyle: {
    //     opacity: 0
    //   },
    // })
    console.log(option)

    return option;
  }
  const bxColor1 = { bagColor: 'linear-gradient(90deg, #19BC23, rgba(31,196,40,0))', textColor: 'linear-gradient(0deg, #FFFFFF 0.1220703125%, rgba(122,255,129,0.8) 100%)' }
  const bxColor2 = { bagColor: 'linear-gradient(90deg, #25A5FF, rgba(37,165,255,0.01))', textColor: ' linear-gradient(0deg, #FFFFFF 0.1220703125%, rgba(134,205,255,0.8) 100%)' }
  const bxColor3 = { bagColor: 'linear-gradient(90deg, #FF0000, rgba(255,0,0,0))', textColor: 'linear-gradient(0deg, #FFFFFF 0.1220703125%, rgba(255,141,154,0.8) 100%)' }

  const bx1 = [{ name: '合格', value: 23, bagColor: bxColor1.bagColor, textColor: bxColor1.textColor }, { name: '准用', value: 23, bagColor: bxColor2.bagColor, textColor: bxColor2.textColor }, { name: '停用', value: 23, bagColor: bxColor3.bagColor, textColor: bxColor3.textColor }]
  const bx2 = [{ name: '可使用', value: 23, bagColor: bxColor1.bagColor, textColor: bxColor1.textColor }, { name: '使用中', value: 23, bagColor: bxColor2.bagColor, textColor: bxColor2.textColor }]
  return (
    <div>
      <CardHeader title='便携式仪器统计' />
      <div className='cardBodySty' style={{ height: 280, padding: '16px 0 16px 16px' }}>
        <Row justify='space-between' style={{ height: '100%' }}>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '45%', textAlign: 'center' }}>
            <div style={{ paddingTop: 24 }}>
              <div style={{ color: '#C4C5C5', fontSize: 15 }}>便携式仪器总数</div>
              <div style={{ fontFamily: 'YouSheBiaoTiHei', background: 'linear-gradient(to bottom, #FFFFFF, #0059D2)', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent' }}>
                <span style={{ fontSize: 28 }}>40</span>
                <span>个</span>
              </div>
            </div>
            <img style={{ paddingBottom: 26 }} src={`/currencyResOver/bxsyy.png`} />
          </div>


          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: 8, padding: '12px 0 12px 18px', width: 'calc(55% - 8px)', height: '100%', borderLeft: '1px dashed #042767' }}>
            <div>
              <div style={{ paddingBottom: 12 }}>仪器状态</div>
              <Row>
                {bx1.map((item, index) => {
                  return <Col span={8} style={{ textAlign: 'center' }}><div style={{ color: '#C4C5C5', background: `${item.bagColor} no-repeat`, backgroundSize: '32px 5px', 'background-position-x': 'center', 'background-position-y': 12 }}> {item.name} </div><div style={{ fontSize: 20, fontWeight: 'bold', background: item.textColor, '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent' }}> {item.value} </div></Col>
                })}
              </Row>
            </div>
            <div>
              <div style={{ paddingBottom: 12 }}>使用状态</div>
              <Row>
                {bx2.map(item => {
                  return <Col span={8} style={{ textAlign: 'center' }}><div style={{ color: '#C4C5C5', background: `${item.bagColor} no-repeat`, backgroundSize: '42px 5px', 'background-position-x': 'center', 'background-position-y': 12 }}> {item.name} </div><div style={{ fontSize: 20, fontWeight: 'bold', background: item.textColor, '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent' }}> {item.value} </div></Col>
                })}
              </Row>
            </div>
          </div>
        </Row>
      </div>
      <CardHeader title='办事统计处' />
      <div className='cardBodySty' style={{ height: 294 }}>
        <ReactEcharts
          option={workStatistics()}
          style={{ width: '100%', height: '100%' }}
          ref={echartsRef}
          className="echarts-for-echarts"
          theme="my_theme"
        />
      </div>

    </div>

  );
};
export default connect(dvaPropsData)(Index);