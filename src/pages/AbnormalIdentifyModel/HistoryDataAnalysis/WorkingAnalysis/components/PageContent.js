import React, { useState, useEffect, Children } from 'react';
import { connect } from 'dva';
import {
  Card,
  Radio,
  Tooltip,
  Row,
  Col,
  Space,
  Button,
  Statistic,
  Form,
  InputNumber,
  Modal,
} from 'antd';
import styles from '../../../styles.less';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import ReactEcharts from 'echarts-for-react';
import WorkingAnalysis from '../index';
import { MoreOutlined } from '@ant-design/icons';
import CluesListModal from '@/pages/AbnormalIdentifyModel/Home/ModalPage/CluesListModal.js';
import PointCluesStatistics from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/ExceptionProblem/PointCluesStatistics.js';
import { getDataTypeByConfigInfo } from '@/pages/AbnormalIdentifyModel/CONST.js';
import { convertTextByConfig } from '@/utils/utils';
import DataTypeSelect from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/components/DataTypeSelect.js';
import SelectPollutantType from '@/components/SelectPollutantType';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  warningForm: AbnormalIdentifyModel.warningForm,
  // loading: loading.effects['AbnormalIdentifyModel/GetDataMissAnalysis'],
});

const PageContent = props => {
  const [form] = Form.useForm();

  const { dispatch, pageTitle, DGIMN, warningForm, time } = props;

  const [date, setDate] = useState(time || [moment().startOf('year'), moment()]); // 时间
  const [pollutantType, setPollutantType] = useState(props.pollutantType || undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [regionCode, setRegionCode] = useState();
  const [entCode, setEntCode] = useState();
  const [loading, setLoading] = useState(false);
  const [stopRate, setStopRate] = useState(0);
  const [stopReportRate, setStopReportRate] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [dataType, setDataType] = useState(props.dataType || getDataTypeByConfigInfo('region')); //region/ent/point
  const [stopPieData, setStopPieData] = useState([{}, {}, {}, {}]);
  const [stopReportPie, setStopReportPie] = useState([{}, {}, {}, {}]);
  const [warningInfo, setWarningInfo] = useState([]);
  const [pointCluesModalOpen, setPointCluesModalOpen] = useState(false);
  const [currentPointData, setCurrentPointData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = _dataType => {
    console.log('pollutantType', pollutantType)
    let bTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss');
    let eTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss');
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GetDataGkAnalysis',
      payload: {
        entCode: props.entCode,
        regionCode: props.regionCode,
        beginTime: bTime,
        endTime: eTime,
        dataType: _dataType || dataType,
        pollutantType: pollutantType,
      },
      callback: result => {
        if (result.IsSuccess) {
          setStopRate(result.Datas.StopRate);
          setStopReportRate(result.Datas.StopReportRate);
          setDataSource(result.Datas.TableData);
          setWarningInfo(result.Datas.WarningInfo);
          let StopPie = [];
          for (const key in result.Datas.StopPie) {
            StopPie.push({
              name: key,
              value: result.Datas.StopPie[key],
            });
          }
          setStopPieData(StopPie);
          let StopReportPie = [];
          for (const key in result.Datas.StopReportPie) {
            StopReportPie.push({
              name: key,
              value: result.Datas.StopReportPie[key],
            });
          }
          setStopReportPie(StopReportPie);
        }
        setLoading(false);
      },
    });
  };

  // 更新异常线索清单model状态
  const updateCluesListFormState = ModelGuid => {
    setIsModalOpen2(true);
    let params = {
      date: [],
      pollutantType: pollutantType,
      date1: [date[0], date[1]],
      regionCode: props.regionCode ? props.regionCode.split(',')[2] : undefined,
      warningTypeCode: [ModelGuid],
      PollutantCode: '',
      pageSize: 20,
      pageIndex: 1,
      EntCode: props.entCode,
      DGIMN: DGIMN,
    };

    // 进入线索列表，传入时间、场景类型、企业、污染物
    dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        warningForm: {
          ...warningForm,
          all: {
            ...warningForm['all'],
            rowKey: undefined,
            scrollTop: 0,
            ...params,
          },
        },
      },
    });
  };

  const getOption1 = type => {
    const data = type === 1 ? stopRate : stopReportRate;
    let option = {
      color: '#F46848',
      backgroundColor: '#fff',
      // title: [
      //   {
      //     text: data,
      //     textStyle: {
      //       color: '#444444',
      //       fontSize: 20,
      //       fontWeight: 'bold',
      //     },
      //     itemGap: 20,
      //     left: 'center',
      //     top: 'center',
      //   },
      // ],
      title: {
        text: '{val|' + data + '}{unit|%}',
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            unit: {
              fontSize: 14,
              color: '#000',
              padding: [0, 0, 0, 2],
            },
            val: {
              fontSize: 24,
              fontWeight: 'bolder',
              color: '#488CF7',
            },
          },
        },
      },
      grid: [
        {
          containLabel: true,
        },
      ],
      angleAxis: {
        polarIndex: 0,
        min: 0,
        max: 100,
        show: false,
        boundaryGap: ['40%', '40%'],
        startAngle: 90,
      },
      radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      polar: [
        {
          center: ['50%', '50%'], //中心点位置
          // radius: '80%', //图形大小
          radius: ['64%', '56%'],
        },
      ],
      // tooltip: {
      //   trigger: 'axis',
      // },
      xAxis: {
        show: false,
        type: 'value',
      },
      yAxis: [
        {
          type: 'category',
          inverse: true,
          axisLabel: {
            show: false,
            textStyle: {
              color: '#444444',
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          type: 'bar',
          z: 10,
          name: '完成度',
          data: [data],
          showBackground: false,
          backgroundStyle: {
            borderWidth: 10,
            width: 10,
          },
          coordinateSystem: 'polar',
          roundCap: true,
          barWidth: 10, //大的占比环
          itemStyle: {
            normal: {
              opacity: 1,
              color: '#488CF7',
            },
          },
        },
        {
          type: 'pie',
          name: '内层细圆环',
          radius: ['64%', '56%'],
          center: ['50%', '50%'], //中心点位置
          startAngle: 90,
          hoverAnimation: false,
          clockWise: true,
          silent: true,
          itemStyle: {
            normal: {
              color: '#f3f3f7',
              shadowBlur: 0,
              shadowColor: '#66666a',
            },
          },
          tooltip: {
            show: false,
          },
          label: {
            show: false,
          },
          data: [100],
        },
      ],
    };

    return option;
  };

  const getOption2 = type => {
    let option = {
      color: [
        '#5CDC9F',
        '#488CF7',
        '#F46848',
        '#E0D52B',
        '#4EEFEF',
        '#2358DC',
        '#AFD7DE',
        '#EAA017',
        '#6c76f1',
      ],
      tooltip: {
        trigger: 'item',
        valueFormatter: function(value) {
          return value + '个';
        },
      },
      series: [
        {
          name: '停运时长分布',
          type: 'pie',
          radius: [40, 70],
          center: ['50%', '40%'],
          // roseType: 'area',
          padAngle: 1,
          itemStyle: {
            normal: {
              borderRadius: 10,
              shadowBlur: 10,
              shadowColor: 'rgba(44,44,44,0.2)',
            },
          },
          label: {
            show: true,
            position: 'outside',
            color: 'inherit', //继承饼图颜色
            formatter: function(params) {
              return '{b|' + params.name + '}\n{c|' + params.value + '个}\n{hr|●}';
            },
            rich: {
              // a: {
              //   fontSize: 18,
              //   padding: [18, 0, 0, 0],
              // },
              b: {
                fontFamily: 'Source Han Sans CN',
                fontWeight: 500,
                fontSize: 14,
                color: '#999999',
                padding: [18, 8, 0, 6],
              },
              c: {
                fontFamily: 'Microsoft YaHei',
                fontWeight: 500,
                fontSize: 16,
                padding: [4, 0, 0, 4],
                align: 'left',
                // color: '#0055FE',
              },
              hr: {
                color: 'inherit',
                // borderRadius: 100,
                width: 4,
                height: 4,
                verticalAlign: 'top',
                lineHeight: -20,
                padding: [-28, -10, 0, -10],
                // shadowColor: 'inherit',
                // shadowBlur: 1,
                // shadowOffsetX: '0',
                // shadowOffsetY: '-26',
              },
            },
          },
          labelLine: {
            lineStyle: {
              // length: 20,
              // length2: 5,
              width: 2, // 引导线宽度
            },
          },
          data: type === 1 ? stopPieData : stopReportPie,
        },
      ],
    };

    return option;
  };

  const getOption3 = type => {
    let RunHours = [],
      StopHours = [],
      RunReportHour = [],
      StopReportHour = [],
      CountHours = [],
      xData = [];
    dataSource.map(item => {
      RunHours.push(item.RunHour);
      StopHours.push(item.StopHour);
      RunReportHour.push(item.RunReportHour);
      StopReportHour.push(item.StopReportHour);
      CountHours.push(item.ShouldHour);
      xData.push(item.Name);
    });

    let option = {
      color: ['#5cdc9f', '#fac858', '#3ba272', '#fc8452', '#5370c6'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      legend: {},
      grid: {
        borderWidth: 20,
        top: 40,
        bottom: 70,
        right: 80,
        left: 80,
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          startValue: 0,
          endValue: 6,
        },
      ],
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#EAEAEA',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            // interval: 0,
            // formatter: function(value, index) {
            //   if (index == 0) {
            //     return `{clickItem|${value}}`;
            //   } else {
            //     return `{defalutItem|${value}}`;
            //   }
            // },
            textStyle: {
              // fontSize: 14,
              color: '#383838',
            },
          },
          data: xData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '（小时）',
          nameTextStyle: {
            padding: [0, 50, 0, 0],
            color: '#666',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f9f9f9',
            },
          },
        },
        {
          type: 'value',
          name: '（小时）',
          nameTextStyle: {
            padding: [0, 50, 0, 0],
            color: '#666',
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f9f9f9',
            },
          },
        },
      ],
      series: [
        {
          name: '正常运行时长（模型）',
          type: 'bar',
          // z: -1,
          barMaxWidth: 50,
          // barGap: '-100%',
          stack: 'count',
          // itemStyle: {
          //   color: '#92cc75',
          // },
          label: {
            show: true,
            position: 'insideTop',
            color: '#fff',
          },
          data: RunHours,
        },
        {
          name: '停运时长（模型）',
          type: 'bar',
          // z: 99,
          stack: 'count',
          barMaxWidth: 50,
          // itemStyle: {
          //   color: '#ff4d4f',
          // },
          label: {
            show: true,
            color: '#fff',
          },
          data: StopHours,
        },
        {
          name: '正常运行时长（上报）',
          type: 'bar',
          // z: -1,
          barMaxWidth: 50,
          // barGap: '-100%',
          stack: 'count2',
          // itemStyle: {
          //   color: '#92cc75',
          // },
          label: {
            show: true,
            position: 'insideTop',
            color: '#fff',
          },
          data: RunReportHour,
        },
        {
          name: '停运时长（上报）',
          type: 'bar',
          // z: 99,
          stack: 'count2',
          barMaxWidth: 50,
          // itemStyle: {
          //   color: '#ff4d4f',
          // },
          label: {
            show: true,
            color: '#fff',
          },
          data: StopReportHour,
        },
        {
          name: '总时长',
          type: 'line',
          yAxisIndex: 1,
          label: {
            show: true,
            position: 'top',
            // color: '#fff',
          },
          smooth: true,
          data: CountHours,
        },
      ],
    };

    return option;
  };

  const getColumns = () => {
    let column = [];
    // region/ent/point
    switch (dataType) {
      case 'region':
        column = [
          {
            title: '行政区',
            dataIndex: 'Name',
            key: 'Name',
            render: (text, record) => {
              return (
                <a
                  onClick={() => {
                    setIsModalOpen(true);
                    setRegionCode(record.Key);
                    setEntCode(undefined);
                    setModalTitle(record.Name + ' - 停运详情');
                  }}
                >
                  {text}
                </a>
              );
            },
          },
        ];
        break;
      case 'ent':
        column = [
          {
            title: convertTextByConfig('企业'),
            dataIndex: 'Name',
            key: 'Name',
            render: (text, record) => {
              return (
                <a
                  onClick={() => {
                    setIsModalOpen(true);
                    setRegionCode(undefined);
                    setEntCode(record.Key);
                    setModalTitle(record.Name + ' - 停运详情');
                  }}
                >
                  {text}
                </a>
              );
            },
          },
        ];
        break;
      case 'point':
        column = [
          {
            title: convertTextByConfig('企业'),
            dataIndex: 'ParentName',
            key: 'ParentName',
          },
          {
            title: '排口',
            dataIndex: 'Name',
            key: 'Name',
          },
        ];
        break;

      default:
        break;
    }

    const columns = [
      ...column,
      {
        title: '模型',
        children: [
          {
            title: '运行率',
            dataIndex: 'RunRate',
            key: 'RunRate',
            align: 'center',
            sorter: (a, b) => a.RunRate - b.RunRate,
            render: text => {
              return text + '%';
            },
          },
          {
            title: '正常运行时间',
            dataIndex: 'RunHour',
            key: 'RunHour',
            align: 'center',
            sorter: (a, b) => a.RunHour - b.RunHour,
          },
          {
            title: '停运时长',
            dataIndex: 'StopHour',
            key: 'StopHour',
            align: 'center',
            sorter: (a, b) => a.StopHour - b.StopHour,
          },
          {
            title: '停运时间占比',
            dataIndex: 'StopRate',
            key: 'StopRate',
            align: 'center',
            sorter: (a, b) => a.StopRate - b.StopRate,
            render: text => {
              return text + '%';
            },
          },
        ],
      },
      {
        title: '上报',
        children: [
          {
            title: '运行率',
            dataIndex: 'RunReportRate',
            key: 'RunReportRate',
            align: 'center',
            sorter: (a, b) => a.RunReportHour - b.RunReportHour,
            render: text => {
              return text + '%';
            },
          },
          {
            title: '正常运行时间',
            dataIndex: 'RunReportHour',
            key: 'RunReportHour',
            align: 'center',
            sorter: (a, b) => a.RunReportHour - b.RunReportHour,
          },
          {
            title: '停运时长',
            dataIndex: 'StopReportHour',
            key: 'StopReportHour',
            align: 'center',
            sorter: (a, b) => a.StopReportHour - b.StopReportHour,
          },
          {
            title: '停运时间占比',
            dataIndex: 'StopReportRate',
            key: 'StopReportRate',
            align: 'center',
            sorter: (a, b) => a.StopReportRate - b.StopReportRate,
            render: text => {
              return text + '%';
            },
          },
        ],
      },
      {
        title: '停运次数',
        dataIndex: 'StopNums',
        key: 'StopNums',
        width: 120,
        sorter: (a, b) => a.StopNums - b.StopNums,
      },
      {
        title: '总时长',
        dataIndex: 'ShouldHour',
        key: 'ShouldHour',

        sorter: (a, b) => a.ShouldHour - b.ShouldHour,
      },
    ];
    return columns;
  };

  // 下钻点击
  const drillDownClick = record => {
    if (dataType === 'region') {
      setRegionCode(record.Key);
      setEntCode(undefined);
    } else {
      setRegionCode(undefined);
      setEntCode(record.Key);
    }

    setIsModalOpen(true);
    setModalTitle(record.Name + ' - 数据缺失情况');
  };

  // 图表点击事件 - 分类点击
  const onClickEcharts = e => {
    const { dataIndex } = e;
    if (dataType !== 'point') {
      let record = dataSource[dataIndex];
      drillDownClick(record);
    }
  };

  const echartTitleStyle = {
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 12,
    fontSize: 14,
  };

  return (
    <div className={styles.PageWrapper}>
      {!props.dataType && (
        <Card size="small">
          <Form
            form={form}
            layout="inline"
            initialValues={{
              date: date,
              pollutantType: pollutantType,
            }}
            autoComplete="off"
          >
            <Form.Item label="监测点类型" name="pollutantType">
              <SelectPollutantType
                allowClear
                style={{ width: 120 }}
                onChange={value => {
                  setPollutantType(value);
                }}
              />
            </Form.Item>
            <Form.Item label="时间" name="date">
              <RangePicker_
                allowClear={false}
                dataType="day"
                format="YYYY-MM-DD"
                style={{ width: 250 }}
                onChange={value => {
                  setDate(value);
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" loading={loading} onClick={() => loadData()}>
                查询
              </Button>
            </Form.Item>
            <Form.Item name="dataType" style={{ marginLeft: 20 }}>
              <DataTypeSelect
                defaultValue={dataType}
                onChange={e => {
                  setDataType(e.target.value);
                  loadData(e.target.value);
                }}
              />
            </Form.Item>
          </Form>
        </Card>
      )}
      <Row gutter={[0, 16]} style={{ height: 280, marginTop: 8 }}>
        <Col span={10} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              // display: 'flex',
              // flexDirection: 'column',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">停运时长占比</div>}
          >
            <Row style={{ height: '100%' }}>
              <Col span={12}>
                <ReactEcharts
                  option={getOption1(1)}
                  style={{ height: 'calc(90%)' }}
                  className="echarts-for-echarts"
                  theme="my_theme"
                />
                <p style={echartTitleStyle}>模型停运时长占比</p>
              </Col>
              <Col span={12}>
                <ReactEcharts
                  option={getOption1(2)}
                  style={{ height: 'calc(90%)' }}
                  className="echarts-for-echarts"
                  theme="my_theme"
                />
                <p style={echartTitleStyle}>上报停运时长占比</p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={14} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">停运时长分布</div>}
          >
            <Row style={{ height: '100%' }}>
              <Col span={12}>
                <ReactEcharts
                  option={getOption2(1)}
                  style={{ height: 'calc(90%)' }}
                  className="echarts-for-echarts"
                  theme="my_theme"
                />
                <p style={{ ...echartTitleStyle, bottom: 8 }}>模型停运时长分布</p>
              </Col>
              <Col span={12}>
                <ReactEcharts
                  option={getOption2(2)}
                  style={{ height: 'calc(90%)' }}
                  className="echarts-for-echarts"
                  theme="my_theme"
                />
                <p style={{ ...echartTitleStyle, bottom: 8 }}>上报停运时长分布</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row gutter={[0, 16]} style={{ height: 300, marginTop: 8 }}>
        <Col span={24} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">停运时长统计</div>}
          >
            <ReactEcharts
              option={getOption3()}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
              onEvents={{
                click: onClickEcharts,
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[0, 16]} style={{ marginTop: 8 }}>
        {loading
          ? [
              <Col span={12}>
                <Card style={{ height: 130 }} loading={true}></Card>
              </Col>,
              <Col span={12}>
                <Card style={{ height: 130 }} loading={true}></Card>
              </Col>,
            ]
          : warningInfo.map((item, index) => {
              return (
                <Col span={12}>
                  <Card
                    loading={loading}
                    style={{ marginRight: (index + 1) % 2 === 0 ? 0 : 8 }}
                    bodyStyle={{ padding: '16px 24px' }}
                    title={<div className="innerCardTitle">{item.ModelName}</div>}
                    extra={
                      <Tooltip title="查看线索数据">
                        <a
                          onClick={() => {
                            // updateCluesListFormState(item.ModelGuid);
                            setPointCluesModalOpen(true);
                            setCurrentPointData(item);
                          }}
                        >
                          <MoreOutlined />
                        </a>
                      </Tooltip>
                    }
                  >
                    <Row>
                      <Col
                        span={8}
                        // onClick={() => {
                        //   updateCluesListFormState(item.ModelGuid);
                        // }}
                      >
                        <Statistic
                          title="线索数据"
                          value={item.WarningNums}
                          // valueStyle={{
                          //   color: '#1890ff',
                          //   cursor: 'pointer',
                          // }}
                        />
                      </Col>
                      <Col
                        span={8}
                        // onClick={() => {
                        //   updateCluesListFormState(item.ModelGuid);
                        // }}
                      >
                        <Statistic
                          title={`${convertTextByConfig('企业')}数量`}
                          value={item.EntNums}
                          // valueStyle={{
                          //   color: '#1890ff',
                          //   cursor: 'pointer',
                          // }}
                        />
                      </Col>
                      <Col
                        span={8}
                        // onClick={() => {
                        //   updateCluesListFormState(item.ModelGuid);
                        // }}
                      >
                        <Statistic
                          title="排放口数量"
                          value={item.PointNums}
                          // valueStyle={{
                          //   color: '#1890ff',
                          //   cursor: 'pointer',
                          // }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })}
      </Row>
      {/* 运行情况统计评价 */}
      <Card
        style={{ marginTop: 8 }}
        bodyStyle={{ padding: '10px 24px' }}
        title={<div className="innerCardTitle">停运详情</div>}
      >
        <SdlTable
          loading={loading}
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 600 }}
        />
      </Card>
      {isModalOpen && (
        <Modal
          title={modalTitle}
          wrapClassName="spreadOverModal"
          destroyOnClose
          open={isModalOpen}
          footer={false}
          onCancel={() => setIsModalOpen(false)}
        >
          <WorkingAnalysis
            regionCode={regionCode}
            entCode={entCode}
            time={date}
            pollutantType={pollutantType}
          />
        </Modal>
      )}
      <CluesListModal
        // history={props.history}
        open={isModalOpen2}
        onCancel={() => setIsModalOpen2(false)}
      />
      {pointCluesModalOpen && (
        <PointCluesStatistics
          open={pointCluesModalOpen}
          onCancel={() => setPointCluesModalOpen(false)}
          data={currentPointData}
          pollutantType={pollutantType}
          reqParams={{
            modelGuid: currentPointData.ModelGuid,
            date: date,
          }}
        />
      )}
    </div>
  );
};

export default connect(dvaPropsData)(PageContent);
