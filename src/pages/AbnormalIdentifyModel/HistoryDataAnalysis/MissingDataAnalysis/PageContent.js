import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Radio,
  Badge,
  Row,
  Col,
  Space,
  Button,
  Statistic,
  Form,
  InputNumber,
  Modal,
} from 'antd';
import styles from '../../styles.less';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { getModelGuidsByBaseTypeCode, handleHomeDate } from '@/pages/AbnormalIdentifyModel/CONST';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import ReactEcharts from 'echarts-for-react';
import MissingDataAnalysis from './index';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  // loading: loading.effects['AbnormalIdentifyModel/GetDataMissAnalysis'],
});

const PageContent = props => {
  const [form] = Form.useForm();

  const { dispatch, pageTitle, DGIMN, warningForm } = props;

  const [date, setDate] = useState([moment().startOf('year'), moment()]); // 时间
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [regionCode, setRegionCode] = useState();
  const [entCode, setEntCode] = useState();
  const [loading, setLoading] = useState(false);
  const [missRate, setMissRate] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [statisticalData, setStatisticalData] = useState({});
  const [dataType, setDataType] = useState(props.dataType || 'region'); //region/ent/point
  const [mildValue, setMildValue] = useState(30); // 轻微
  const [moderateValue, setModerateValue] = useState(50); // 中度
  const [severeValue, setSevereValue] = useState(100); // 严重
  const [levelCounts, setLevelCounts] = useState({
    notMissing: 0,
    mild: 0,
    moderate: 0,
    severe: 0,
    fullyMissing: 0,
  });
  // const [hourStatistics, setHourStatistics] = useState({
  //   MissHours: [],
  //   ShouldHours: [],
  //   CountHours: [],
  //   xData: [],
  // });

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = _dataType => {
    let bTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss');
    let eTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss');
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GetDataMissAnalysis',
      payload: {
        // dgimn: DGIMN,
        entCode: props.entCode,
        regionCode: props.regionCode,
        beginTime: bTime,
        endTime: eTime,
        dataType: _dataType || dataType,
      },
      callback: result => {
        if (result.IsSuccess) {
          setMissRate(result.Datas.MissRate);
          setDataSource(result.Datas.TableData);
          analyzeMissingData(result.Datas.TableData);
        }
        setLoading(false);
        // setHourStatistics(MissHours, ShouldHours, CountHours, xData);
      },
    });
  };

  /**
   * 分析数据缺失程度
   * @param {Array} data - 输入的数据数组，包含Rate字段
   * @param {number} [mild=30] - 轻度缺失的最大值
   * @param {number} [moderate=50] - 中度缺失的最大值
   * @param {number} [severe=100] - 严重缺失的最大值
   * @returns {Array} - 返回包含5个对象的数组，分别是未缺失、轻度、中度、严重和完全缺失的统计
   */

  function analyzeMissingData(data) {
    let mild = mildValue,
      moderate = moderateValue,
      severe = severeValue;
    let result = {
      notMissing: 0,
      mild: 0,
      moderate: 0,
      severe: 0,
      fullyMissing: 0,
    };

    data.forEach(item => {
      if (item.Rate === 0) {
        result['notMissing']++;
      } else if (item.Rate > 0 && item.Rate <= mild) {
        result['mild']++;
      } else if (item.Rate > mild && item.Rate <= moderate) {
        result['moderate']++;
      } else if (item.Rate > moderate && item.Rate < severe) {
        result['severe']++;
      } else if (item.Rate === severe) {
        result['fullyMissing']++;
      }
    });
    // mild 轻微  moderate 中度  severe 严重
    // return result;

    setLevelCounts(result);
  }

  const getOption1 = () => {
    const data = missRate;
    let option = {
      color: '#F46848',
      backgroundColor: '#fff',
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
          radius: ['74%', '66%'],
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
          name: '缺失率',
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
          radius: ['74%', '66%'],
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

  const getOption2 = () => {
    const COLOR = [
      '#1890ff', // 未上传
      '#52c41a', // 轻度
      '#faad14', // 中度
      '#ff4d4f', // 严重
      '#d9d9d9', // 完全缺失
    ];
    let option = {
      color: COLOR,
      tooltip: {
        trigger: 'item',
        // valueFormatter: function(value) {
        //   return value + '%';
        // },
        formatter: '{a} <br/>{b}：{c}个 ({d}%)',
      },
      series: [
        {
          name: '数据缺失分级统计',
          type: 'pie',
          radius: [0, 80],
          // roseType: 'area',
          itemStyle: {
            normal: {
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
          data: [
            {
              value: levelCounts.notMissing,
              name: '未上传',
              itemStyle: {
                color: COLOR[0],
                opacity: 1,
              },
            },
            {
              value: levelCounts.mild,
              name: '轻微缺失',
              itemStyle: {
                color: COLOR[1],
                opacity: 1,
              },
            },
            {
              value: levelCounts.moderate,
              name: '中度缺失',
              itemStyle: {
                color: COLOR[2],
                opacity: 1,
              },
            },
            {
              value: levelCounts.severe,
              name: '严重缺失',
              itemStyle: {
                color: COLOR[3],
                opacity: 1,
              },
            },
            {
              value: levelCounts.fullyMissing,
              name: '完全缺失',
              itemStyle: {
                color: COLOR[4],
                opacity: 1,
              },
            },
          ],
        },
      ],
    };

    return option;
  };

  const getOption3 = () => {
    // 排放口数据缺失统计
    let MissHours = [],
      ShouldHours = [],
      CountHours = [],
      xData = [];
    dataSource.map(item => {
      MissHours.push(item.MissHour);
      ShouldHours.push(item.ShouldHour);
      CountHours.push(item.MissHour + item.ShouldHour);
      xData.push(item.Name);
    });

    let option = {
      color: ['#5cdc9f', '#fac858', '#5370c6'],
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
        borderWidth: 0,
        bottom: 80,
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
          // axisLabel: {
          //   textStyle: {
          //     color: '#666',
          //     fontSize: 16,
          //   },
          // },
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
          // axisLabel: {
          //   textStyle: {
          //     color: '#666',
          //     fontSize: 16,
          //   },
          // },
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
          name: '应传小时数',
          type: 'bar',
          // z: -1,
          barMaxWidth: 50,
          barGap: '-100%',
          itemStyle: {
            // color: '#92cc75',
          },
          label: {
            show: true,
            position: 'insideTop',
            color: '#fff',
          },
          data: ShouldHours,
        },
        {
          name: '缺失小时数',
          type: 'bar',
          z: 99,
          barMaxWidth: 50,
          itemStyle: {
            // color: '#ff4d4f',
          },
          label: {
            show: true,
            color: '#fff',
          },
          data: MissHours,
        },
        {
          name: '总计',
          type: 'line',
          yAxisIndex: 1,
          label: {
            show: true,
            position: 'top',
            // color: '#fff',
          },
          smooth: true,
          // itemStyle: {
          //   color: '#F6A821',
          // },
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
                    setModalTitle(record.Name + ' - 数据缺失情况');
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
            title: '企业',
            dataIndex: 'Name',
            key: 'Name',
            render: (text, record) => {
              return (
                <a
                  onClick={() => {
                    setIsModalOpen(true);
                    setRegionCode(undefined);
                    setEntCode(record.Key);
                    setModalTitle(record.Name + ' - 数据缺失情况');
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
            title: '企业',
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
        title: '缺失率',
        dataIndex: 'Rate',
        key: 'Rate',
        render: text => {
          return text + '%';
        },
      },
      {
        title: '缺失小时数',
        dataIndex: 'MissHour',
        key: 'MissHour',
      },
      {
        title: '应传小时数',
        dataIndex: 'ShouldHour',
        key: 'ShouldHour',
      },
    ];
    return columns;
  };
  {
    console.log('regionCode', regionCode);
  }
  return (
    <div className={styles.PageWrapper}>
      {!props.dataType && (
        <Card>
          <Form
            form={form}
            layout="inline"
            initialValues={{
              date: date,
            }}
            autoComplete="off"
          >
            <Form.Item label="时间" name="date">
              <RangePicker_
                // allowClear={false}
                dataType="day"
                format="YYYY-MM-DD"
                style={{ width: 250 }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" loading={loading} onClick={() => loadData()}>
                查询
              </Button>
            </Form.Item>
            <Form.Item name="dataType" style={{ marginLeft: 20 }}>
              <Radio.Group
                defaultValue="region"
                onChange={e => {
                  setDataType(e.target.value);
                  loadData(e.target.value);
                }}
              >
                <Radio.Button value="region">行政区</Radio.Button>
                <Radio.Button value="ent">企业</Radio.Button>
                <Radio.Button value="point">排放口</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
      )}
      <Row gutter={[0, 16]} style={{ height: 360, marginTop: 10 }}>
        <Col span={5} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              // display: 'flex',
              // flexDirection: 'column',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">缺失率</div>}
          >
            <ReactEcharts
              // ref={echart => {
              //   echart && setEcharts(echart.echarts);
              // }}
              option={getOption1()}
              style={{ height: 'calc(100% - 70px)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
            <Row justify="center">
              <Col span={24} style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Badge status="processing" text="数据缺失企业数量：10个" />
              </Col>
              <Col span={24} style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Badge status="processing" text="排放口数量：10个" />
              </Col>
              <Col span={24} style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Badge status="processing" text="数据缺失小时数：10个" />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={7} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              // display: 'flex',
              // flexDirection: 'column',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">数据缺失分级统计</div>}
          >
            <ReactEcharts
              option={getOption2()}
              style={{ height: 'calc(100% - 70px)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
            {/*  mild 轻微 moderate 中度 severe 严重 */}
            <Row gutter={[8, 8]} style={{ paddingBottom: 10 }}>
              <Col span={12}>
                <Badge status="success" text="轻微缺失< " />
                <InputNumber
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  style={{ marginLeft: 4, width: 80 }}
                  min={0}
                  max={100}
                  value={mildValue}
                  onChange={value => {
                    setMildValue(value);
                  }}
                />
              </Col>
              <Col span={12}>
                <Badge status="warning" text="中度缺失< " />
                <InputNumber
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  style={{ marginLeft: 4 }}
                  min={0}
                  max={100}
                  value={moderateValue}
                  onChange={value => {
                    setModerateValue(value);
                  }}
                />
              </Col>
              <Col span={12}>
                <Badge status="error" text="严重缺失< " />
                <InputNumber
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  style={{ marginLeft: 4 }}
                  min={0}
                  max={100}
                  value={severeValue}
                  onChange={value => {
                    setSevereValue(value);
                  }}
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    analyzeMissingData(dataSource);
                  }}
                >
                  重新统计
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              // display: 'flex',
              // flexDirection: 'column',
            }}
            // bodyStyle={{ padding: '10px 24px', flex: 1 }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">数据缺失统计</div>}
          >
            <ReactEcharts
              option={getOption3()}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </Col>
      </Row>
      {/* 运行情况统计评价 */}
      <Card
        style={{ marginTop: 10 }}
        bodyStyle={{ padding: '10px 24px' }}
        title={<div className="innerCardTitle">数据缺失情况</div>}
      >
        <SdlTable
          loading={loading}
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          pagination={true}
        />
      </Card>

      {isModalOpen && (
        <Modal
          title={modalTitle}
          wrapClassName="spreadOverModal"
          destroyOnClose
          visible={isModalOpen}
          footer={false}
          onCancel={() => setIsModalOpen(false)}
        >
          <MissingDataAnalysis regionCode={regionCode} entCode={entCode} />
        </Modal>
      )}
    </div>
  );
};

export default connect(dvaPropsData)(PageContent);
