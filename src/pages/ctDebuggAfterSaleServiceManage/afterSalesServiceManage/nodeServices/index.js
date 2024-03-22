/**
 * 功  能：成套售后服务管理
 * 创建人：jab
 * 创建时间：2024.09.11
 */
import React, { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty, Radio, } from 'antd';
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
import { getPie3D,chartClick,chartMouseover,chartMouseout } from '../getPie3D';

const namespace = 'ctAfterSalesServiceManagement'

const dvaPropsData = ({ loading, ctAfterSalesServiceManagement, global, common }) => ({
  tableLoading: loading.effects[`common/getCTProjectList`],
  tableDatas: common.ctProjectList,
  tableTotal: common.ctProjectTotal,
  queryPar: common.ctAfterSalesServiceManagementPar,
  loadingConfirm: loading.effects[`${namespace}/updateCTProject`],
  exportLoading: loading.effects[`${namespace}/exportCTProjectList`],
  entAndPointLoading: loading.effects[`common/getCtEntAndPointList`] || false,
  rojectPointRelationLoading: loading.effects[`${namespace}/getrojectPointRelationList`] || false,
  addProjectPointRelationLoading: loading.effects[`${namespace}/addProjectPointRelation`] || false,
  addProjectEntRelationLoading: loading.effects[`${namespace}/addProjectEntRelation`] || false,
  configInfo: global.configInfo,
  clientHeight: global.clientHeight,
  checkPoint: ctAfterSalesServiceManagement.checkPoint,
  permisBtnTip: global.permisBtnTip,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `common/updateState`,
        payload: payload,
      })
    },
    getProjectInfoList: (payload) => { //项目查询列表
      dispatch({
        type: `common/getCTProjectList`,
        payload: payload,
      })
    },
    updateCTProject: (payload, callback) => { //修改
      dispatch({
        type: `${namespace}/updateCTProject`,
        payload: payload,
        callback: callback
      })
    },
    getrojectPointRelationList: (payload, callback) => { //获取项目与站点管理关系
      dispatch({
        type: `${namespace}/getrojectPointRelationList`,
        payload: payload,
        callback: callback
      })
    },
    addProjectPointRelation: (payload, callback) => { //添加成套项目与站点关联关系
      dispatch({
        type: `${namespace}/addProjectPointRelation`,
        payload: payload,
        callback: callback
      })
    },
    addProjectEntRelation: (payload, callback) => { //添加成套项目与企业关联关系
      dispatch({
        type: `${namespace}/addProjectEntRelation`,
        payload: payload,
        callback: callback
      })
    },
    getEntAndPoint: (payload, callback) => { //企业监测点
      dispatch({
        type: `common/getCtEntAndPointList`,
        payload: payload,
        callback: callback
      })
    },
    exportProjectInfoList: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportCTProjectList`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();



  const { tableDatas, tableTotal, loadingConfirm, tableLoading, exportLoading, queryPar, entAndPointLoading, rojectPointRelationLoading, addProjectPointRelationLoading, checkPoint, addProjectEntRelationLoading, } = props;

  const echartsRef = useRef(null);
  const echartsRef2 = useRef(null);

  useEffect(() => {
    sessionStorage.clear()
  }, []);

  useEffect(() => {
     let myChart = echartsRef2.current.getEchartsInstance();
     let echartsOption = echartsRef2.current.props;

       myChart.on('mouseover', function(params) {
        chartMouseover(myChart,echartsOption,params)
       });

       myChart.on('globalout', function(params) {
        chartMouseout(myChart,echartsOption,params)  // 修正取消高亮失败的 bug
       });

       myChart.on('click', function(params) {
       chartClick(myChart,echartsOption,params) 
       });

  }, []);
  let columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '服务流水号',
      dataIndex: 'SerialNum',
      key: 'SerialNum',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同签订人',
      dataIndex: 'SignName',
      key: 'SignName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '立项号',
      dataIndex: 'ItemCode',
      key: 'ItemCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '签约客户名称',
      dataIndex: 'CustomName',
      key: 'CustomName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '最终用户单位',
      dataIndex: 'CustomEnt',
      key: 'CustomEnt',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同类型',
      dataIndex: 'ProjectType',
      key: 'ProjectType',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '项目所在省',
      dataIndex: 'Province',
      key: 'Province',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '提供服务大区',
      dataIndex: 'Region',
      key: 'Region',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目负责人',
      dataIndex: 'Director',
      key: 'Director',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目所属行业',
      dataIndex: 'Industry',
      key: 'Industry',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同服务天数',
      dataIndex: 'ProjectDays',
      key: 'ProjectDays',
      align: 'center',
      ellipsis: true,
    },

    {
      title: '项目点位数量',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'CreateUser',
      key: 'CreateUser',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'UpdateUser',
      key: 'UpdateUser',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'UpdateTime',
      key: 'UpdateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: 180,
      ellipsis: true,
      render: (text, record) => {
        return <span>
          {/* {editPermisPoint&&<Fragment><Tooltip title={'编辑'}> <a onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>} */}
          <Fragment> <Tooltip title="详情">
            <a onClick={() => detail(record)}  ><DetailIcon /></a>
          </Tooltip></Fragment>
          {associaePermisPoint && <Fragment><Divider type="vertical" /><Tooltip title={"关联企业和监测点"} >  <a onClick={() => { associaePoint(record) }} ><PointIcon /></a></Tooltip></Fragment>}

        </span>
      }
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
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const xAxisPoint = shape.xAxisPoint;
      const c0 = [shape.x, shape.y];
      const c1 = [shape.x - 9, shape.y - 9];
      const c2 = [xAxisPoint[0] - 9, xAxisPoint[1] - 0];
      const c3 = [xAxisPoint[0], xAxisPoint[1]];
      ctx
        .moveTo(c0[0], c0[1])
        .lineTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .closePath();
    },
  });
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const xAxisPoint = shape.xAxisPoint;
      const c1 = [shape.x, shape.y];
      const c2 = [xAxisPoint[0], xAxisPoint[1]];
      const c3 = [xAxisPoint[0] + 18, xAxisPoint[1] - 0];
      const c4 = [shape.x + 18, shape.y - 9];
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    },
  });
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0,
    },
    buildPath: function (ctx, shape) {
      const c1 = [shape.x, shape.y];
      const c2 = [shape.x + 18, shape.y - 9];
      const c3 = [shape.x + 9, shape.y - 18];
      const c4 = [shape.x - 9, shape.y - 9];
      ctx
        .moveTo(c1[0], c1[1])
        .lineTo(c2[0], c2[1])
        .lineTo(c3[0], c3[1])
        .lineTo(c4[0], c4[1])
        .closePath();
    },
  });
  echarts.graphic.registerShape("CubeLeft", CubeLeft);
  echarts.graphic.registerShape("CubeRight", CubeRight);
  echarts.graphic.registerShape("CubeTop", CubeTop);

  const MAX = [
    6000, 6000, 6000, 6000, 6000, 5000, 4000, 3000, 2000, 4000, 3000, 2000,
  ];
  const VALUE = [
    2012, 1230, 3790, 2349, 1654, 1230, 3790, 2349, 1654, 3790, 2349, 1654,
  ];

  const renderItemFun = (params, api, type, e) => {
    let color1, color2, color3;
    if (type == 1) {
      color1 = '#28CBFA'
      color2 = '#64B0FD'
      color3 = '#08BDFF' //顶部
    } else {
      const selectedData = sessionStorage.getItem('selectedRegion')
      color1 = params.dataIndex == e.dataIndex && e.name != selectedData ? '#fff' : '#28CBFA'
      color2 = params.dataIndex == e.dataIndex && e.name != selectedData ? '#fff' : '#64B0FD'
      color3 = params.dataIndex == e.dataIndex && e.name != selectedData ? '#fff' : '#08BDFF'//顶部
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
      // color:['#08BDFF'],
      legend: {
        data: [
          {
            name: 'Precipitation',
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
            name: 'Temperature',
            type: 'line',
          },
          // 添加其他图例项...
        ]
      },
      xAxis: {
        type: "category",
        data: [
          "德州",
          "德城区",
          "陵城区",
          "禹城市",
          "乐陵市",
          "临邑县",
          "平原县",
          "夏津县",
          "武城县",
          "庆云县",
          "宁津县",
          "齐河县",
        ],
        // offset: 25,
        axisLine: { //网格线
          show: true,
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
          name: 'Precipitation',
          type: "custom",
          renderItem: (params, api) => {
            return renderItemFun(params, api, 1)
          },
          data: VALUE,
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
          data: VALUE,
          z: 2
        },
        {
          type: 'bar', //显示背景图 
          data: VALUE,
          itemStyle: { color: 'rgba(86,182,252,0.05)' },
          // itemStyle: { normal: { color: 'red' } },
          barWidth: '80%',  // 柱形的宽度
          barGap: '800%', // Make series be ove
          silent: true, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。  为了防止鼠标悬浮让此柱状图显示在真正的柱状图上面 
          barMinHeight: 1000,
          z: -3
        },
        {
          name: 'Temperature',
          type: 'line',
          yAxisIndex: 1,
          data: VALUE,
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

  const echartsComponents = useMemo(() => { //监听变量，第一个参数是函数，第二个参数是依赖，只有依赖变化时才会重新计算函数
    return <ReactEcharts
      option={serviceFrequencyDuration()}
      style={{ height: 'calc(50vh - 140px)' }}
      className="echarts-for-echarts"
      theme="my_theme"
      ref={echartsRef}
      onEvents={{
        'click': onChartClick,
      }}
    />
  }, [])


  const serviceFrequencyRatio = () => {  //服务次数占比
    return {
      color: ['#5CDC9F', '#488CF7', '#F46848', '#E0D52B', '#4EEFEF', '#2358DC', '#AFD7DE', '#EAA017'],
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} ： {c} ({d}%)"
      },
      title: {
        text: `${1000}次`,
        textStyle: {
          fontFamily: 'Microsoft YaHei',
          fontWeight: 'bold',
          color: '#3888FF',
          fontSize:14,
        },
        x: "center",
        y: "center",
      },
      series: [
        {
          name: '增值电信业务统计表',
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
              var total = 0; //总数量
              var percent = 0; //占比
              [10, 5, 15, 25, 20, 35, 30, 40].forEach(function (value) {
                total += value;
              });
              percent = ((params.value / total) * 100).toFixed(1);
              return (
                "{a| ● } {b|" + params.name + "}\n{c|" + percent + "%}"
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
          data: [
            { value: 10, name: 'rose1' },
            { value: 5, name: 'rose2' },
            { value: 15, name: 'rose3' },
            { value: 25, name: 'rose4' },
            { value: 20, name: 'rose5' },
            { value: 35, name: 'rose6' },
            { value: 30, name: 'rose7' },
            { value: 40, name: 'rose8' }
          ]
        }
      ]
    };

  }

  const proportionWorkHours = () => {
    const color = ['#2451FF','#5AADD4','#B35AFF','#EDCC31','#FF6B11','#25BD97','#4C8FFE','#2AC3DF']
    let optionData = [{
      name: '林地面积统计1',
      value: 19900,
    }, {
      name: '草地面积统计2',
      value: 12116,
    }, {
      name: '耕地地面积统计3',
      value: 16616,
    },
    {
      name: '耕地地面积统计4',
      value: 14616,
    },
    {
      name: '耕地地面积统计5',
      value: 17616,
    },
    {
      name: '耕地地面积统计6',
      value: 19616,
    },
    {
      name: '耕地地面积统计7',
      value: 11616,
    },
    {
      name: '耕地地面积统计8',
      value: 13616,
    },
  ]
  optionData =  optionData.map((item,index)=>{
    return {
        name: item.name,
        value: item.value,
        itemStyle: {
          color: color[index]
        }
    }
  })
    const option = getPie3D(optionData, 0.6)
    option.title = {
      text: `${100}小时`,
      textStyle: {
        fontFamily: 'Microsoft YaHei',
        fontWeight: 'bold',
        color: '#3888FF',
        fontSize:14,
      },
      x:"18.5%",
      y: "43%",
    },
    option.series.push({
      name: 'pie2d',
      type: 'pie',
      color:['#2451FF','#5AADD4','#B35AFF','#EDCC31','#FF6B11','#25BD97','#4C8FFE','#2AC3DF'],
      avoidLabelOverlap: true,
      labelLine: {
        show:false,
      },
      startAngle: -20, //起始角度，支持范围[0, 360]。
      clockwise: false,//饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
      radius: ['25%', '70%'],
      center: ['20%', '50%'],
      data: optionData,
      itemStyle: {
        opacity: 0
      },
    })
    console.log(option)
    return option;


  }

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      layout='inline'
      className={'ant-advanced-search-form'}
      onFinish={() => { onFinish(pageIndex, pageSize) }}
      initialValues={{
        time: [moment().subtract(6, 'months'), moment()],
      }}
    >
      <Form.Item name='time' label='日期' >
        <RangePicker style={{ width: 260 }} picker='month' />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={tableLoading}>
          查询
         </Button>
        <Button onClick={() => { form.resetFields(); }} style={{ margin: '0 8px' }}  >
          重置
         </Button>
        <Button icon={<ExportOutlined />} loading={exportLoading} style={{ marginRight: 8 }} onClick={() => { exports() }}>
          导出
         </Button>
      </Form.Item>
    </Form>
  }

  return (
    <div className={styles.ctAfterSalesServiceManagementSty}>
      <BreadcrumbWrapper>
        <Card>
          {searchComponents()}
        </Card>
        <Row style={{ margin: '8px 0' }} className='echartsContentSty'>
          <Col span={9}>
            <Card title={`各大区赠送服务次数、工作时长`}>
              {echartsComponents}
            </Card>
          </Col>
          <Col span={8} style={{ padding: '0 12px' }}>
            <Card title={`服务次数占比`}>
              <ReactEcharts
                option={serviceFrequencyRatio()}
                style={{ height: 'calc(50vh - 140px)' }}
                className="echarts-for-echarts"
                theme="my_theme"
              />
            </Card>
          </Col>
          <Col span={7}>
            <Card title={`工作时长占比`}>
              <ReactEcharts
                option={proportionWorkHours()}
                style={{width:"100%", height: 'calc(50vh - 140px)' }}
                ref={echartsRef2}
                className="echarts-for-echarts"
                theme="my_theme"
              />
            </Card>
          </Col>
        </Row>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);