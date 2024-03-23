/**
 * 功  能：成套售后服务管理
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

const namespace = 'ctAfterSalesServiceManagement'
const dvaPropsData = ({ loading, ctAfterSalesServiceManagement, global, common }) => ({
  completeNodeServerAnalysisLoading: loading.effects[`${namespace}/GetCompleteNodeServerAnalysis`],
  exportCompleteNodeServerAnalysisLoaging: loading.effects[`${namespace}/ExportCompleteNodeServerAnalysis`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetCompleteNodeServerAnalysis: (payload, callback) => { //节点服务
      dispatch({
        type: `${namespace}/GetCompleteNodeServerAnalysis`,
        payload: payload,
        callback: callback
      })
    },
    ExportCompleteNodeServerAnalysis: (payload, callback) => { //节点服务 导出
      dispatch({
        type: `${namespace}/ExportCompleteNodeServerAnalysis`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {




  const { match: { path }, completeNodeServerAnalysisLoading, exportCompleteNodeServerAnalysisLoaging } = props;

  const nodeServicesPath = '/ctManage/afterSalesServiceManage/nodeServices'
  const tableLoading = {
    [nodeServicesPath]: completeNodeServerAnalysisLoading
  }

  const exportLoading = {
    [nodeServicesPath]: exportCompleteNodeServerAnalysisLoaging
  }

  const title = {
    [nodeServicesPath]: '节点服务'
  }





  const [form] = Form.useForm();
  const echartsRef = useRef(null);
  const echartsRef2 = useRef(null);

  const [tableDatas, setTableDatas] = useState([])
  const [serviceAreaName, setServiceAreaName] = useState([])
  const [serviceNum, setServiceNum] = useState([])
  const [workHour, setWorkHour] = useState([])
  const [serviceNumRatio, setServiceNumRatio] = useState([])
  const [workHourDataRatio, setWorkHourDataRatio] = useState([])
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

      }, 300)
    }
  }, [workHourDataRatio]);



  const getData = () => {
    const values = form.getFieldsValue()
    const par = { ...values, bTime: values.date ? values.date[0].format('YYYY-MM-DD 00:00:00') : undefined, eTime: values.date ? values.date[1].format('YYYY-MM-DD HH:mm:ss') : undefined, date: undefined }
    switch (path) {
      case nodeServicesPath:
        props.GetCompleteNodeServerAnalysis({ ...par }, (res) => {
          setTableDatas(res?.ServerAnalysisList ? res.ServerAnalysisList : [])
          if (res?.SumServerAnalysisList) {
            const data = res.SumServerAnalysisList
            let areaName = [], serNum = [], hourData = [], serNumRt = [], hourDataRt = [];
            data.map((item, index) => {
              areaName.push(item.ServiceArea)
              serNum.push(item.ServiceNum)
              hourData.push(item.WorkHour)
              serNumRt.push({ name: item.ServiceArea, value: item.ServiceNum, rate: item.ServiceRate })
              const color = ['#2451FF', '#5AADD4', '#B35AFF', '#EDCC31', '#FF6B11', '#25BD97', '#4C8FFE', '#2AC3DF']
              hourDataRt.push({ name: item.ServiceArea, value: item.WorkHour, rate: item.WorkRate, itemStyle: { color: color[index] } })

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
  const [selectedRegion, setSelectedRegion] = useState()

  const onChartClick = (e) => {
    echartsRef.current.props.option.series[0].renderItem = (params, api) => {
      return renderItemFun(params, api, 2, e)
    }
    echartsRef.current.getEchartsInstance().setOption(echartsRef.current.props.option)
    sessionStorage.setItem('selectedRegion', e.name == sessionStorage.getItem('selectedRegion') ? '' : e.name)

  }


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
        left: 40,
        right: 40,
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
        min: 0,
        splitLine: {
          show: false,
        },
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
              color: "#08BDFF",
              offset: [30, -15],//左右 上下
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
          data: serviceNum,
          itemStyle: { color: 'rgba(86,182,252,0.05)' },
          // itemStyle: { normal: { color: 'red' } },
          barWidth: '80%',  // 柱形的宽度
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
            ${params[0].seriesName}：${params[0].value}`
          )
        }
      },
    };

  }




  const serviceFrequencyRatio = () => {  //服务次数占比
    var total = 0; //总数量
    serviceNum.forEach(function (value) { total += value });
    return {
      color: ['#5CDC9F', '#488CF7', '#F46848', '#E0D52B', '#4EEFEF', '#2358DC', '#AFD7DE', '#EAA017'],
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
    const option = getPie3D(workHourDataRatio, 0.6)
    option.title = {
      text: `${total}小时`,
      textStyle: {
        fontFamily: 'Microsoft YaHei',
        fontWeight: 'bold',
        color: '#3888FF',
        fontSize: 13,
      },
      x: "center",
      y: "43.8%",
    },
      option.series.push({
        name: 'pie2d',
        type: 'pie',
        avoidLabelOverlap: true,
        label: {
          show: false, 
         },
        labelLine: {
          show: false,
        },
        startAngle: -20, //起始角度，支持范围[0, 360]。
        clockwise: false,//饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ['40%', '100%'],
        center: ['50%', '50%'],
        data: workHourDataRatio,
        itemStyle: {
          opacity: 0
        },
      })
    return option;


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
        <RangePicker style={{ width: 260 }} picker='month' />
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
            <Card title={`各大区${title[path]}次数、工作时长`}>
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
                  <Col span={12}>
                  <ReactEcharts
                  option={proportionWorkHours()}
                  style={{ width: "100%", height: 'calc(50vh - 170px)' }}
                  ref={echartsRef2}
                  className="echarts-for-echarts"
                  theme="my_theme"
                />
                </Col>
                <Col style={{display:'flex',flexDirection:'column',alignItems:'end',justifyContent:'center',justifyItems:'center'}}  span={12}>{workHourDataRatio.map((item,index)=>{
                    return  <Row  align='middle' style={{paddingBottom:index==workHourDataRatio.length? 0 : 8}}> <Row align='middle'> <div style={{display:'inline-block',width:14,height:14, borderRadius:2, backgroundColor:item.itemStyle.color,marginRight:8}}></div> <div style={{width:120}}>{item.name}</div></Row> <div style={{width:50,textAlign:'right',color:'#2189FC',fontWeight:'bold',marginLeft:4}}>{item.rate}%</div></Row>
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
            title={<><span>各省区{title[path]}次数及工作时长</span>
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
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);