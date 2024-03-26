/**
 * 功  能：成套售后服务管理 成套节点服务 ，赠送服务 ，配合检查  ，配合其他工作 ，收费服务
 * 创建人：jab
 * 创建时间：2024.09.11
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty, Radio, Space, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import styles from "./style.less"
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import 'echarts-gl';
const { Option } = Select;
import { getPie3D, chartClick, chartMouseover, chartMouseout } from '../getPie3D';
import { CubeLeft, CubeRight, CubeTop } from '../getBar3D';
import { fomatFloat } from '@/utils/utils';
import ServiceDetails from '../components/ServiceDetails';

const namespace = 'ctAfterSalesServiceManagement'
const dvaPropsData = ({ loading, ctAfterSalesServiceManagement, global, common }) => ({
  chargeServiceAnalysisLoading: loading.effects[`${namespace}/GetChargeServiceAnalysis`],
  exportChargeServiceAnalysisLoading: loading.effects[`${namespace}/ExportChargeServiceAnalysis`],
  completeNodeServerAnalysisLoading: loading.effects[`${namespace}/GetCompleteNodeServerAnalysis`],
  exportCompleteNodeServerAnalysisLoaging: loading.effects[`${namespace}/ExportCompleteNodeServerAnalysis`],
  giveServerAnalysisLoading: loading.effects[`${namespace}/GetGiveServerAnalysis`],
  exportGiveServerAnalysisLoading: loading.effects[`${namespace}/ExportGiveServerAnalysis`],
  cooperateInspectionAnalysisLoading: loading.effects[`${namespace}/GetCooperateInspectionAnalysis`],
  exportCooperateInspectionAnalysisLoading: loading.effects[`${namespace}/ExportCooperateInspectionAnalysis`],
  cooperateOtherWorkAnalysisLoading: loading.effects[`${namespace}/GetCooperateOtherWorkAnalysis`],
  exportCooperateOtherWorkAnalysisLoading: loading.effects[`${namespace}/ExportCooperateOtherWorkAnalysis`],
})


const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetChargeServiceAnalysis: (payload, callback) => { //收费服务
      dispatch({
        type: `${namespace}/GetChargeServiceAnalysis`,
        payload: payload,
        callback: callback
      })
    },
    ExportChargeServiceAnalysis: (payload, callback) => { //收费服务 导出
      dispatch({
        type: `${namespace}/ExportChargeServiceAnalysis`,
        payload: payload,
        callback: callback
      })
    },
    GetCompleteNodeServerAnalysis: (payload, callback) => { //成套节点服务
      dispatch({
        type: `${namespace}/GetCompleteNodeServerAnalysis`,
        payload: payload,
        callback: callback
      })
    },
    ExportCompleteNodeServerAnalysis: (payload, callback) => { //成套节点服务 导出
      dispatch({
        type: `${namespace}/ExportCompleteNodeServerAnalysis`,
        payload: payload,
        callback: callback
      })
    },

    GetGiveServerAnalysis: (payload, callback) => { //赠送服务
      dispatch({
        type: `${namespace}/GetGiveServerAnalysis`,
        payload: payload,
        callback: callback
      })
    },
    ExportGiveServerAnalysis: (payload, callback) => { //赠送服务 导出
      dispatch({
        type: `${namespace}/ExportGiveServerAnalysis`,
        payload: payload,
        callback: callback
      })
    },
    GetCooperateInspectionAnalysis: (payload, callback) => { //配合检查
      dispatch({
        type: `${namespace}/GetCooperateInspectionAnalysis`,
        payload: payload,
        callback: callback
      })
    },
    ExportCooperateInspectionAnalysis: (payload, callback) => { //配合检查 导出
      dispatch({
        type: `${namespace}/ExportCooperateInspectionAnalysis`,
        payload: payload,
        callback: callback
      })
    },
    GetCooperateOtherWorkAnalysis: (payload, callback) => { //配合其他工作
      dispatch({
        type: `${namespace}/GetCooperateOtherWorkAnalysis`,
        payload: payload,
        callback: callback
      })
    },
    ExportCooperateOtherWorkAnalysis: (payload, callback) => { //配合其他工作 导出
      dispatch({
        type: `${namespace}/ExportCooperateOtherWorkAnalysis`,
        payload: payload,
        callback: callback
      })
    },



  }
}
const Index = (props) => {

  const { match: { path },
           chargeServiceAnalysisLoading, exportChargeServiceAnalysisLoading,
           completeNodeServerAnalysisLoading, exportCompleteNodeServerAnalysisLoaging,
           giveServerAnalysisLoading, exportGiveServerAnalysisLoading,
           cooperateInspectionAnalysisLoading, exportCooperateInspectionAnalysisLoading,
           cooperateOtherWorkAnalysisLoading, exportCooperateOtherWorkAnalysisLoading,
        } = props;
   
  const commonPath = '/ctManage/afterSalesServiceManage'
  const chargeServicePath = `${commonPath}/chargeService` //收费服务
  const nodeServicesPath = `${commonPath}/nodeServices` //成套节点服务
  const giveServerPath = `${commonPath}/giveServer`//赠送服务
  const cooperateInspectionPath = `${commonPath}/cooperateInspection`//配合检查
  const cooperateOtherWorkPath = `${commonPath}/cooperateOtherWork` //配合其他工作

  const tableLoading = {
    [chargeServicePath]: chargeServiceAnalysisLoading,
    [nodeServicesPath]: completeNodeServerAnalysisLoading,
    [giveServerPath]: giveServerAnalysisLoading,
    [cooperateInspectionPath]: cooperateInspectionAnalysisLoading,
    [cooperateOtherWorkPath]: cooperateOtherWorkAnalysisLoading,
  }


  const exportLoading = {
    [chargeServicePath]: exportChargeServiceAnalysisLoading,
    [nodeServicesPath]: exportCompleteNodeServerAnalysisLoaging,
    [giveServerPath]: exportGiveServerAnalysisLoading,
    [cooperateInspectionPath]: exportCooperateInspectionAnalysisLoading,
    [cooperateOtherWorkPath]: exportCooperateOtherWorkAnalysisLoading,
  }

  const title = {
    [chargeServicePath]: '收费',
    [nodeServicesPath]: '成套节点',
    [giveServerPath]:  '赠送服务',
    [cooperateInspectionPath]: '配合检查',
    [cooperateOtherWorkPath]: '配合其它工作',

  }

  const type = {
    [chargeServicePath]: '5',
    [nodeServicesPath]: '1',
    [giveServerPath]:  '2',
    [cooperateInspectionPath]: '3',
    [cooperateOtherWorkPath]: '4',
  }



  const [form] = Form.useForm();
  const echartsRef = useRef(null);
  const echartsRef2 = useRef(null);

  const [tableDatas, setTableDatas] = useState([])
  const [tableAllDatas, setAllTableDatas] = useState([])
  const [serviceAreaName, setServiceAreaName] = useState([])
  const [serviceNum, setServiceNum] = useState([])
  const [serviceNumAll, setServiceNumAll] = useState([])
  const [workHour, setWorkHour] = useState([])
  
  const [serviceNumRatio, setServiceNumRatio] = useState([])
  const [workHourDataRatio, setWorkHourDataRatio] = useState([])
  const [customHourVal, setCustomHourVal] = useState(0.03456)
  const [queryPar, setQueryPar] = useState([])



  useEffect(() => {
    sessionStorage.clear();
    getData()
  }, []);

  useEffect(() => {
    if (workHourDataRatio?.[0]) {
      setTimeout(() => {
        let myChart = echartsRef2?.current?.getEchartsInstance();
        let echartsOption = echartsRef2?.current?.props;
        myChart.on('mouseover', function (params) {
          chartMouseover(myChart, echartsOption, params)
        });
        myChart.on('globalout', function (params) {
          chartMouseout(myChart, echartsOption, params)  // 修正取消高亮失败的 bug
        });
        //  myChart.on('click', function(params) {
        //  chartClick(myChart,echartsOption,params) 
        //  });

      }, 400)
    }
  }, [workHourDataRatio]);



  const getData = () => {
    const values = form.getFieldsValue()
    const par = { ...values, bTime: values.date ? values.date[0].format('YYYY-MM-DD 00:00:00') : undefined, eTime: values.date ? values.date[1].format('YYYY-MM-DD HH:mm:ss') : undefined, date: undefined }
    switch (path) {
      case nodeServicesPath:
        props.GetCompleteNodeServerAnalysis({ ...par }, (res) => {
          const tableList = res?.ServerAnalysisList ? res.ServerAnalysisList : []
          setTableDatas(tableList)
          setAllTableDatas(tableList)
          if (res?.SumServerAnalysisList) {
            const data = res.SumServerAnalysisList
            let areaName = [], serNum = [], hourData = [], serNumRt = [], hourDataRt = [];
            data.map((item, index) => {
              areaName.push(item.ServiceArea)
              serNum.push({value :item.ServiceNum, label: { textStyle: { color:  '#08BDFF'} }})
              hourData.push(item.WorkHour)
              serNumRt.push({ name: item.ServiceArea, value: item.ServiceNum, rate: item.ServiceRate })
              const color = ['#2451FF', '#5AADD4', '#B35AFF', '#EDCC31', '#FF6B11', '#25BD97', '#4C8FFE', '#2AC3DF','#fe6bba']
              hourDataRt.push({ name: item.ServiceArea, value: item.WorkHour == 0? customHourVal : item.WorkHour, rate: item.WorkRate, itemStyle: { color: color[index] } })

            })
            setServiceAreaName(areaName)
            setWorkHour(hourData)
            setServiceNum(serNum)
            setServiceNumRatio(serNumRt)
            setWorkHourDataRatio(hourDataRt)
          }
          setQueryPar(par)
        })
        break;

    }
  }


  const onChartClick = (e) => {
    const selectedRegionVal = sessionStorage.getItem('selectedRegion')
    echartsRef.current.props.option.series[0].renderItem = (params, api) => {
      return renderItemFun(params, api, 2, e)
    }

    serviceNum.map((item,index)=>{
      if(e.name == selectedRegionVal ||  e.dataIndex != index){ //取消或上一次选中
        serviceNum[index].label = { textStyle: { color: '#08BDFF'} }
      }else{//当前选中
        serviceNum[e.dataIndex].label = { textStyle: { color: '#ffcb72'} }
      }
    })
    echartsRef.current.getEchartsInstance().setOption(echartsRef.current.props.option)
    if(e.name == selectedRegionVal){ //选中取消
      setTableDatas(tableAllDatas)
      sessionStorage.setItem('selectedRegion', '')
    }else{
      const selectedData = tableDatas.filter(item=>item.ServiceArea == e.name)
      setTableDatas(selectedData)
      sessionStorage.setItem('selectedRegion', e.name)
    }
  }

  const exportData = () => {
    switch (path) {
      case nodeServicesPath:
        props.ExportCompleteNodeServerAnalysis({ ...queryPar })
        break;

    }
  }
  
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return (index + 1);
      }
    },
    {
      title: '大区名称',
      dataIndex: 'ServiceArea',
      key: 'ServiceArea',
      align: 'center',
      width: 'auto',
      ellipsis: true,
      render: (text, record, index) => {
        return {
          children: text,
          props: { rowSpan: record.Count },
        };
      },
    },
    {
      title: '省份',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
      width: 'auto',
      ellipsis: true,
    },
    {
      title: '服务次数',
      dataIndex: 'ServiceNum',
      key: 'ServiceNum',
      align: 'center',
      width: 'auto',
      ellipsis: true,
    },
    {
      title: '次数占比',
      dataIndex: 'ServiceRate',
      key: 'ServiceRate',
      align: 'center',
      width: 'auto',
      ellipsis: true,
    },
    {
      title: '工作时长(小时)',
      dataIndex: 'WorkHour',
      key: 'WorkHour',
      align: 'center',
      width: 'auto',
      ellipsis: true,
      render:(text,record)=>{
       return <a onClick={()=>serviceHourDetail(record)}>{text}</a>
      }
    },
    {
      title: '时长占比',
      dataIndex: 'WorkRate',
      key: 'WorkRate',
      align: 'center',
      width: 'auto',
      ellipsis: true,
    },
  ];


  const renderItemFun = (params, api, type, e) => {
    let color1, color2, color3;
    if (type == 1) {
      color1 = '#28CBFA'
      color2 = '#64B0FD'
      color3 = '#08BDFF' //顶部
    } else {
      const selectedData = sessionStorage.getItem('selectedRegion')
      color1 = params.dataIndex == e.dataIndex && e.name != selectedData ? '#ffcb72' : '#28CBFA'
      color2 = params.dataIndex == e.dataIndex && e.name != selectedData ? '#fd9b3b' : '#64B0FD'
      color3 = params.dataIndex == e.dataIndex && e.name != selectedData ? '#ffcb72' : '#08BDFF'//顶部
    }
    const location = api.coord([api.value(0), api.value(1)]);
    return {
      type: "group",
      children: [
        {
          type: "CubeLeft",
          shape: {
            api,
            xValue: api.value(0),
            yValue: api.value(1),
            x: location[0],
            y: location[1],
            xAxisPoint: api.coord([api.value(0), 0]),
          },
          style: {
            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color1 }, { offset: 1, color: color2 }
            ]),
          },
        },
        {
          type: "CubeRight",
          shape: {
            api,
            xValue: api.value(0),
            yValue: api.value(1),
            x: location[0],
            y: location[1],
            xAxisPoint: api.coord([api.value(0), 0]),
          },
          style: {
            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color1 }, { offset: 1, color: color2 }
            ]),
          },
        },
        {
          type: "CubeTop",
          shape: {
            api,
            xValue: api.value(0),
            yValue: api.value(1),
            x: location[0],
            y: location[1],
            xAxisPoint: api.coord([api.value(0), 0]),
          },
          style: {
            fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color3 }, { offset: 1, color: color3 }
            ]),
          },
        },
      ],
    };
  }
  const serviceFrequencyDuration = () => { //各大区赠送服务次数、工作时长
    return {
      grid: {
        left: 50,
        right: 70,
        bottom: 20,
        top: 50,
      },
      legend: {
        // selectedMode: false,
        data: [
          {
            name: '服务次数',
            type: 'square',
            itemStyle: {
              color: {
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{
                  offset: 0, color: '#28CBFA'  // 开始颜色
                }, {
                  offset: 1, color: '#64B0FD'  // 结束颜色
                }]
              }
            }
          },
          {
            name: '工作时长',
            type: 'line',
          },
          // 添加其他图例项...
        ]
      },
      xAxis: {
        type: "category",
        data: serviceAreaName,
        axisLine: {
          lineStyle: {
            color: '#E7E7E7'  // 修改 x 轴的轴线颜色
          }
        },
        axisLabel: {
          textStyle: {
            color: '#333'  // 修改 x 轴刻度文字的颜色
          }
        },
        axisTick: { //刻度
          show: false,
        },
        axisPointer: {
          type: 'shadow'
        },

      },
      yAxis: [{
        type: "value",
        axisLabel: {
          formatter: '{value}次'
        },
        axisTick: {
          show: false,
        },
        splitLine: { //网格线
          lineStyle: { //分割线
            color: "#E7E7E7",
            width: 1,
            type: "dashed" //dotted：虚线 solid:实线
          }
        },
      },
      {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: '{value}小时'
        }
        //boundaryGap: ["20%", "20%"],//坐标轴与边界间距的属性
      },
      ],
      series: [
        {
          name: '服务次数',
          type: "custom",
          renderItem: (params, api) => {
            return renderItemFun(params, api, 1)
          },
          data: serviceNum,
        },
        {
          type: "bar",
          barWidth: 0,
          label: {
            normal: {
              show: true,
              position: "top",
              color:  "#08BDFF",
              offset: [22, -10],//左右 上下
            },
          },
          itemStyle: {
            color: "transparent",
          },
          data: serviceNum,
          z: 2
        },
        {
          type: 'bar', //显示背景图 
          data: workHour,
          itemStyle: { color: 'rgba(86,182,252,0.05)' },
          // itemStyle: { normal: { color: 'red' } },
          barWidth: '60%',  // 柱形的宽度
          barGap: '800%', // Make series be ove
          silent: true, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。  为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面 
          barMinHeight: 1000,
          z: -3
        },
        {
          name: '工作时长',
          type: 'line',
          yAxisIndex: 1,
          data: workHour,
          itemStyle: {
            color: '#42DAB8',
          },
          label: {
            show: true,
            position: 'top',
            distance: 2,
            color: '#42DAB8',
          },
          smooth: true,
          symbol: 'circle',
        }
      ],
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          return (
            `${params[0].name}<br />
            <span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background:linear-gradient(to bottom,#28CBFA, #64B0FD);\"></span> ${params[0].seriesName}：${params[0].value}<br />` + 
            `${params[3].marker} ${params[3].seriesName}：${params[3].value}` 
          )
        }
      },
    };

  }




  const serviceFrequencyRatio = () => {  //服务次数占比
    var total = 0; //总数量
    serviceNumRatio.forEach(function (item) { total += item.value });
    return {
      color: ['#5CDC9F', '#488CF7', '#F46848', '#E0D52B', '#4EEFEF', '#2358DC', '#AFD7DE', '#EAA017','#6c76f1'],
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} ： {c} ({d}%)"
      },
      title: {
        text: `${total}次`,
        textStyle: {
          fontFamily: 'Microsoft YaHei',
          fontWeight: 'bold',
          color: '#3888FF',
          fontSize: 14,
        },
        x: "center",
        y: "center",
      },
      series: [
        {
          name: '服务次数占比',
          type: 'pie',
          radius: [40, 150],
          roseType: 'area',
          itemStyle: {
            normal: {
              shadowBlur: 10,
              shadowColor: 'rgba(44,44,44,0.2)'
            },
          },
          label: {
            show: true,
            position: 'outside',
            color: 'inherit', //继承饼图颜色
            formatter: function (params) {
              const rate = params.data?.rate || params.data?.rate == 0 ? params.data.rate : fomatFloat(params.value / total, 1);
              return (
                "{a| ● } {b|" + params.name + "}\n{c|" + rate + "%}"
              );
            },
            rich: {
              a: {
                fontSize: 18,
                padding: [18, 0, 0, 0]
              },
              b: {
                fontFamily: 'Source Han Sans CN',
                fontWeight: 400,
                fontSize: 14,
                color: '#999999',
                padding: [18, 8, 0, 0]
              },
              c: {
                fontFamily: 'Microsoft YaHei',
                fontWeight: 400,
                fontSize: 16,
                padding: [4, 0, 0, 26]
              }
            }
          },
          labelLine: {
            lineStyle: {
              width: 2  // 引导线宽度
            }
          },
          data: serviceNumRatio
        }
      ]
    };

  }

  const proportionWorkHours = () => {
    var total = 0; //总数量
    workHour.forEach(function (value) { total += value });
    const option = getPie3D(workHourDataRatio, 0.6,[],customHourVal)
    option.title = {
      text: `${total}小时`,
      textStyle: {
        fontFamily: 'Microsoft YaHei',
        fontWeight: 'bold',
        color: '#3888FF',
        fontSize: 13,
      },
      x: "center",
      y: total==0? "50%" : "center",
    }
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
    return option;


  }

  const [serviceHourVisible,setServiceHourVisible] = useState(false)
  const [serviceAreaCode ,setServiceAreaCode] = useState()
  const [province ,setProvince] = useState()

  const serviceHourDetail = (row)=>{
    setServiceHourVisible(true)
    setServiceAreaCode(row.ServiceAreaCode?Number(row.ServiceAreaCode) : undefined )
    setProvince(row.RegionCode || undefined )
  }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      layout='inline'
      className={'ant-advanced-search-form'}
      onFinish={() => { getData() }}
      initialValues={{
        date: [moment().startOf('month'), moment()],
      }}
    >
      <Form.Item name='date' label='日期' >
        <RangePicker style={{ width: 260 }} picker='month'  allowClear={false}/>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={tableLoading[path]}>
            查询
         </Button>
          <Button onClick={() => { form.resetFields(); getData() }} >
            重置
         </Button>
        </Space>
      </Form.Item>
    </Form>
  }
  const echartsComponents = useMemo(() => { //监听变量，第一个参数是函数，第二个参数是依赖，只有依赖变化时才会重新计算函数
    return <ReactEcharts
      option={serviceFrequencyDuration()}
      style={{ height: 'calc(50vh - 170px)' }}
      className="echarts-for-echarts"
      theme="my_theme"
      ref={echartsRef}
      onEvents={{
        'click': onChartClick,
      }}
    />
  }, [tableLoading[path]])
  return (
    <div className={styles.ctAfterSalesServiceManagementSty}>
      <BreadcrumbWrapper>
        <div className='serchContent'>
          <Card>
            {searchComponents()}
          </Card>
        </div>
        <Row style={{ margin: '8px 0' }} className='echartsContentSty'>
          <Col span={9}>
            <Card title={`各大区${title[path]}服务次数、工作时长`}>
              {tableLoading[path] ?
                <Skeleton active paragraph={{ rows: 8 }} />
                :
                echartsComponents
              }
            </Card>
          </Col>
          <Col span={8} style={{ padding: '0 12px' }}>
            <Card title={`服务次数占比`}>
              {tableLoading[path] ?
                <Skeleton active paragraph={{ rows: 8 }} />
                : <ReactEcharts
                  option={serviceFrequencyRatio()}
                  style={{ height: 'calc(50vh - 170px)' }}
                  className="echarts-for-echarts"
                  theme="my_theme"
                />}
            </Card>
          </Col>
          <Col span={7}>
            <Card title={`工作时长占比`}>
              {tableLoading[path] ?
                <Skeleton active paragraph={{ rows: 8 }} />
                : workHourDataRatio?.[0] && 
                 <Row>
                  <Col span={14}>
                  <ReactEcharts
                  option={proportionWorkHours()}
                  style={{ width: "100%", height: 'calc(50vh - 170px)' }}
                  ref={echartsRef2}
                  className="echarts-for-echarts"
                  theme="my_theme"
                />
                </Col>
                <Col span={10} style={{paddingLeft:4,display:'flex',flexDirection:'column',alignItems:'end',justifyContent:'center',justifyItems:'center'}} >{workHourDataRatio.map((item,index)=>{
                    return  <Row align='middle' style={{width:'100%',paddingBottom:index==workHourDataRatio.length? 0 : 8}}>
                          <Row align='middle' wrap={false} style={{width:'calc(100% - 54px)'}}> 
                          <div  style={{display:'inline-block',width:14,height:14, borderRadius:2, backgroundColor:item.itemStyle.color,marginRight:8}}></div> 
                           <div className='textOverflow' style={{width:'calc(100% - 24px)'}}>{item.name}</div>
                          </Row> 
                          <div style={{minWidth:50,textAlign:'right',color:'#2189FC',fontWeight:'bold',marginLeft:4}}>{item.rate}%</div></Row>
                  })
                 }
                 </Col>
                </Row>
              }
            </Card>
          </Col>
        </Row>
        <Row>
          <Card
            title={<><span>各省区{title[path]}服务次数及工作时长</span>
              <Button icon={<ExportOutlined />} loading={exportLoading[path]} style={{ marginLeft: 12 }} onClick={() => { exportData() }}>
                导出
                    </Button>
            </>}
          >
            <SdlTable
              resizable
              loading={tableLoading[path]}
              bordered
              size='small'
              rowClassName={null}
              scroll={{ x: 800, y: 'auto' }}
              dataSource={tableDatas}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Row>
        <Modal
        visible={serviceHourVisible}
        title={`${title[path]}服务明细`}
        onCancel={() => { setServiceHourVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal`}
      >
        <ServiceDetails serviceQueryPar={{ time:[moment(queryPar.bTime),moment(queryPar.eTime)],serviceAreaCode:serviceAreaCode,province:province}} type={type[path]}/>
      </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);