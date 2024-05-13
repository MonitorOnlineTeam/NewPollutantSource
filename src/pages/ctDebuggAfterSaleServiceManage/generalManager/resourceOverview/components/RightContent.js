/**
 * 功能：右侧
 * 创建人：jab
 * 创建时间：2024.04.12
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Popover, Radio } from 'antd';
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
  chartClick,
} from '@/pages/ctDebuggAfterSaleServiceManage/utils/getPie3D';
import Portable from '@/pages/workSupervision/management/Portable'
import Office from '@/pages/workSupervision/management/Office'
import StorehouseManager from '@/pages/platformManager/basicInfo/storehouseManager/AutoFormManager'

const { Option } = Select;

const namespace = 'resourceOverview'




const dvaPropsData = ({ loading, resourceOverview }) => ({
  loading: loading.effects[`${namespace}/GetResourceOverviewRight`],

})

const Index = (props) => {

  const echartsRef = useRef(null);



  const { } = props;

  const customVal = 0.03456
  const [data, setData] = useState({})

  useEffect(() => {
    props.dispatch({
      type: `${namespace}/GetResourceOverviewRight`,
      payload: {},
      callback: (data) => {
        setData(data)

      }
    })

  }, []);

  useEffect(() => {
    if (data?.OfficeLocationInfo?.UsedList) {
      if (echartsRef?.current) {
        setTimeout(() => {
          let myChart = echartsRef?.current?.getEchartsInstance();
          // // 显示 tooltip，参数为 {SeriesIndex} 系列的索引和 {DataIndex} 数据的索引
          // myChart.dispatchAction({
          //   type: 'showTip',
          //   seriesIndex: 0,
          //   dataIndex: 0 // 这里可以指定你想要显示 tooltip 的数据点的索引
          // });
          let echartsOption = echartsRef?.current?.props;
          myChart.on('click', function (params) {
            chartClick(myChart, echartsOption, params, 10)
          });
        }, 200)
      }

    }
  }, [data?.OfficeLocationInfo]);
  const [visible, setVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState()

  const viewAll = (title) => {
    setVisible(true)
    setModalTitle(title)
  }
  const workStatistics = () => {
    const colors = ['#39a0f5', '#00D7E9']
    const datalist = data?.OfficeLocationInfo?.UsedList?.map((item, index) => {
      return { name: item.Used, value: item.Num, itemStyle: { color: colors[index] } }
    });
    const option = getPie3D(datalist,
      { internalDiameterRatio: 0, height: 12, customVal: customVal, legendOption: { show: false }, defaultselection: true, defaultIndex: 0},
      { //3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 20,// 视角绕 x 轴，即上下旋转的角度(与beta一起控制视野成像效果)
        beta: -10,// 视角绕 y 轴，即左右旋转的角度
        distance: 188,//调整视角到主体的距离，类似调整zoom
        autoRotate: false, //自动旋转   
      })
    option.tooltip = {
      show: true,
      trigger: 'item', // 设置触发方式为数据项图形触发
      backgroundColor: 'transparent', // 设置背景颜色为透明
      padding: 0,
      borderWidth: 0,
      textStyle: {
        color: "#fff", //设置文字颜色
      },
      borderRadius: 12,
      formatter: params => {
        let bfb = ''
        const bagcolor = params.seriesName == '启用' ? 'rgba(0, 100, 194, .5)' : 'rgba(31, 83, 112, 1)'; // 设置背景颜色为半透明
        if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
          const item = option.series[params.seriesIndex].pieData
          if (item.value == customVal || item.value.rate == 0) {//为0时
            bfb = 0
          } else {
            bfb = item.value
          }
        }
        return `<div style="background-color:${bagcolor};padding:10px 18px;border-radius:12px;"><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span> ${params.seriesName}：` +
          `${bfb}个</div>`;

      }

    }
    console.log(option)
    return option;
  }
  const bxColor0 = { bagColor: 'linear-gradient(90deg, #19BC23, rgba(31,196,40,0))', textColor: 'linear-gradient(0deg, #FFFFFF 0.1220703125%, rgba(122,255,129,0.8) 100%)' }
  const bxColor1 = { bagColor: 'linear-gradient(90deg, #25A5FF, rgba(37,165,255,0.01))', textColor: ' linear-gradient(0deg, #FFFFFF 0.1220703125%, rgba(134,205,255,0.8) 100%)' }
  const bxColor2 = { bagColor: 'linear-gradient(90deg, #FF0000, rgba(255,0,0,0))', textColor: 'linear-gradient(0deg, #FFFFFF 0.1220703125%, rgba(255,141,154,0.8) 100%)' }

  const bx1 = data?.PortableInstrumentInfo?.InsStateList?.map((item, index) => ({ name: item.InsState, value: item.Num, bagColor: item.InsState == '合格' ? bxColor0.bagColor : item.InsState == '准用' ? bxColor1.bagColor : bxColor2.bagColor, textColor: item.InsState == '合格' ? bxColor0.textColor : item.InsState == '准用' ? bxColor1.textColor : bxColor2.textColor }))
  const bx2 = data?.PortableInstrumentInfo?.UseState?.map((item, index) => ({ name: item.UseState, value: item.Num, bagColor: item.UseState == '可使用' ? bxColor0.bagColor : bxColor1.bagColor, textColor: item.UseState == '可使用' ? bxColor0.textColor : bxColor1.textColor }))

  const total = data?.OfficeLocationInfo?.OfficeLocationNum?.toString() || '0'
  const { loading } = props;
  return (
    <Spin spinning={!!loading}>
      <div style={{ height: '35%', minHeight: 270 }}>
        <CardHeader title='便携仪器统计' onClick={() => { viewAll('便携仪器统计') }} />
        <div className='cardBodySty' style={{ height: 'calc(100% - 45px)', padding: '16px 0 16px 16px' }}>
          <Row justify='space-between' style={{ height: '100%' }}>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '45%' }}>
              <div style={{ paddingTop: '12%', textAlign: 'center' }}>
                <div style={{ color: '#C4C5C5', fontSize: 15 }}>便携仪器总数</div>
                <div>
                  <span style={{ fontSize: 36 }} className='youSheBiaoTiHeiSty'>{data?.PortableInstrumentInfo?.PortableInstrumentNum || 0}</span>
                  <span className='youSheBiaoTiHeiSty'>个</span>
                </div>
              </div>
              {/**height:122,width:173  */}
              <img style={{ paddingBottom: '12%', width: 173, height: 122 }} src={`/currencyResOver/bxsyy.png`} />
            </div>


            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 8, padding: '12px 0 12px 18px', width: 'calc(55% - 8px)', height: '100%', borderLeft: '1px dashed #042767' }}>
              <div style={{ paddingBottom: '6%' }}>
                <div style={{ paddingBottom: '6%' }}>仪器状态</div>
                <Row>
                  {bx1?.map((item, index) => {
                    return <Col span={8} style={{ textAlign: 'center' }}><div style={{ color: '#C4C5C5', background: `${item.bagColor} no-repeat`, backgroundSize: '32px 5px', 'background-position-x': 'center', 'background-position-y': 12 }}> {item.name} </div><div style={{ fontSize: 20, fontWeight: 'bold', background: item.textColor, '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent' }}> {item.value} </div></Col>
                  })}
                </Row>
              </div>
              <div style={{ paddingTop: 12 }}>
                <div style={{ paddingBottom: 12 }}>使用状态</div>
                <Row>
                  {bx2?.map(item => {
                    return <Col span={8} style={{ textAlign: 'center' }}><div style={{ color: '#C4C5C5', background: `${item.bagColor} no-repeat`, backgroundSize: '42px 5px', 'background-position-x': 'center', 'background-position-y': 12 }}> {item.name} </div><div style={{ fontSize: 20, fontWeight: 'bold', background: item.textColor, '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent' }}> {item.value} </div></Col>
                  })}
                </Row>
              </div>
            </div>
          </Row>
        </div>
      </div>
      <div style={{ height: '35%' }}>
        <CardHeader title='办事处统计' onClick={() => { viewAll('办事处统计') }} />
        <div className='cardBodySty' style={{ height: 'calc(100% - 45px)' }}>
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
        </div>
      </div>
      <div style={{ height: '30%' }}>
        <CardHeader title='备件库统计' onClick={() => { viewAll('备件库统计') }} />
        <div className='cardBodySty' style={{ height: 'calc(100% - 45px)' }}>
          <Row justify='center' align='middle' style={{ height: '100%', padding: '24px 0' }}>
            <Col span={12} style={{ height: '100%' }}>
              <Row align='middle' justify='center' style={{ marginTop: 12, height: '100%', background: 'url(/currencyResOver/bjkzs.png)', backgroundSize: '100% 100%' }}>
                <div style={{ display: 'inline-block', margin: '-80px 0 0 80px' }}>
                  <div style={{
                    fontSize: 30, fontWeight: 'bold',
                    'background': 'linear-gradient(0deg, #048BEB 0%, #F0F7FF 98.6328125%)',
                    '-webkit-background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent'
                  }}><span style={{ fontSize: 30 }}>{data?.StorehouseInfo?.StorehouseNum || 0}</span><span style={{ fontSize: 12 }}>个</span></div>
                  <div style={{ color: '#CBE9FE' }}>备件库总数</div>
                </div>
              </Row>
            </Col>
            <Col span={12} style={{ paddingLeft: 6 }}>
              {data?.StorehouseInfo?.UsedList.map((item, index) => {
                return <div style={{ height: 32, marginBottom: index == 0 ? 38 : 0, marginTop: index == 1 ? 38 : 0, background: 'url(/currencyResOver/syztxbk.png)', backgroundSize: '100% 100%' }}><Row justify='space-between' style={{ paddingLeft: 36 }}><span>使用状态：{item.Used}</span> <span style={{ fontFamily: 'YouSheBiaoTiHei', fontSize: 18, lineHeight: '100%' }}>{item.Num}</span></Row></div>
              })
              }
            </Col>
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
        bodyStyle={{ padding: 0, marginTop: -1 }}
      >
        {modalTitle == '便携仪器统计' ? <Portable isModal notOperate /> : modalTitle == '办事处统计' ? <Office isModal onlyAppendHandleRows /> : <StorehouseManager isModal notOperate match={{ params: { configId: 'Storehouse' } }} />}
      </Modal>
    </Spin>

  );
};
export default connect(dvaPropsData)(Index);