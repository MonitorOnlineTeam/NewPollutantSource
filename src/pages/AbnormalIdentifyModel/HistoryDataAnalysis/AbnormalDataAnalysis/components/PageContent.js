import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Radio,
  Tooltip,
  Row,
  Col,
  Select,
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
import AbnormalDataAnalysis from '../index';
import { MoreOutlined } from '@ant-design/icons';

const { Option } = Select;

const defaultColor = [
  '#ff7f50',
  '#87cefa',
  '#da70d6',
  '#32cd32',
  '#6495ed',
  '#ff69b4',
  '#ba55d3',
  '#cd5c5c',
  '#ffa500',
  '#40e0d0',
  '#1e90ff',
  '#ff6347',
  '#7b68ee',
  '#00fa9a',
  '#ffd700',
  '#6699FF',
  '#ff6666',
  '#3cb371',
  '#b8860b',
  '#30e0e0',
];

const pageInfoData = {
  level: {
    color: [
      '#52c41a', // 轻度
      '#1990ff', // 一般
      '#faad14', // 重点
      '#ff4d4f', // 严重
    ],
    list: ['轻微异常', '一般异常', '重点异常', '严重异常'],
  },
  type: {
    color: defaultColor,
    list: ['样品气异常', '测量值异常', '数据标记异常', '设备异常', '参数设置异常'],
  },
  action: {
    color: [
      '#52c41a', // 轻度
      '#1990ff', // 一般
      '#faad14', // 重点
      '#ff4d4f', // 严重
    ],
    list: ['疑似人为干预', '疑似设备故障', 'CEMS运行管理异常', '数据缺失'],
  },
};

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  warningForm: AbnormalIdentifyModel.warningForm,
  // loading: loading.effects['AbnormalIdentifyModel/GetDataMissAnalysis'],
});

const PageContent = props => {
  const [form] = Form.useForm();
  console.log('match', props);
  const { dispatch, pageTitle, DGIMN, excepType, location, time } = props;

  const [date, setDate] = useState(time || [moment().startOf('year'), moment()]); // 时间
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [regionCode, setRegionCode] = useState();
  const [entCode, setEntCode] = useState();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataType, setDataType] = useState(props.dataType || 'region'); //region/ent/point
  const [dataType2, setDataType2] = useState(props.dataType || 'region'); //region/ent/point
  const [rtnType, setRtnType] = useState(props.rtnType || 'nums');
  const [rtnType2, setRtnType2] = useState(props.rtnType || 'nums');
  const [pieData, setPieData] = useState([{}, {}, {}, {}]);

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = (_dataType, _rtnType) => {
    let bTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss');
    let eTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss');
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GetWarningLevelAnalysis',
      payload: {
        entCode: props.entCode,
        regionCode: props.regionCode,
        beginTime: bTime,
        endTime: eTime,
        dataType: _dataType || dataType,
        ExcepType: excepType,
        RtnType: _rtnType || rtnType,
      },
      callback: result => {
        if (result.IsSuccess) {
          setDataSource(result.Datas.TableData);
          let ExcepPie = [];
          for (const key in result.Datas.ExcepPie) {
            ExcepPie.push({
              name: key,
              value: result.Datas.ExcepPie[key],
            });
          }
          setPieData(ExcepPie);
        }
        setLoading(false);
      },
    });
  };

  // 区分页面类型文字
  let excepTypeName = '分级';
  switch (excepType) {
    case 'level':
      excepTypeName = '分级';
      break;
    case 'type':
      excepTypeName = '分类';
      break;
    case 'action':
      excepTypeName = '行为';
      break;
    default:
      break;
  }

  const getOption1 = () => {
    let unit = rtnType === 'nums' ? '次' : '小时';
    let option = {
      color: pageInfoData[excepType].color,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}' + unit + ' ({d}%)',
        // valueFormatter: function(value) {
        //   return value + unit;
        // },
      },
      series: [
        {
          name: '异常数据' + excepTypeName + '分析',
          type: 'pie',
          radius: [50, 80],
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
              let unit = rtnType === 'nums' ? '次' : '小时';
              return '{b|' + params.name + '}\n{c|' + params.value + unit + '}\n{hr|●}';
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
          data: pieData,
        },
      ],
    };

    return option;
  };

  const getOption2 = () => {
    let listText = pageInfoData[excepType].list;

    let series0 = [],
      series1 = [],
      series2 = [],
      series3 = [],
      series4 = [],
      series5 = [],
      xData = [],
      AllCount = [];
    dataSource.map(item => {
      // if (excepType === 'level') {
      if (true) {
        series0.push(item[listText[0]]);
        series1.push(item[listText[1]]);
        series2.push(item[listText[2]]);
        series3.push(item[listText[3]]);
        series4.push(item[listText[4]]);
        series5.push(item[listText[5]]);
      }

      if (excepType === 'type') {
      }

      AllCount.push(item.AllCount);
      xData.push(item.Name);
    });

    let seriesData = [series0, series1, series2, series3, series4, series5];

    let series = pageInfoData[excepType].list.map((item, index) => {
      return {
        name: item,
        type: 'bar',
        barMaxWidth: 50,
        stack: 'count',
        label: {
          // show: true,
          position: 'insideTop',
          color: '#fff',
        },
        data: seriesData[index],
      };
    });

    let unit = rtnType === 'nums' ? '（次）' : '（小时）';
    let option = {
      color: pageInfoData[excepType].color,
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
          name: unit,
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
          name: unit,
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
        ...series,
        {
          name: '异常总次数',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          label: {
            show: true,
            position: 'top',
            // color: '#fff',
          },
          itemStyle: {
            color: '#F6A821',
          },
          data: AllCount,
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
                    setModalTitle(record.Name + ` - 异常${excepTypeName}分析详情`);
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
                    setModalTitle(record.Name + ` - 异常${excepTypeName}分析详情`);
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

    let listText = pageInfoData[excepType].list;
    let column2 = listText.map(item => {
      return {
        title: item,
        dataIndex: item,
        key: item,
        sorter: (a, b) => a[item] - b[item],
      };
    });

    const columns = [
      ...column,
      ...column2,
      {
        title: '异常总次数',
        dataIndex: 'AllCount',
        key: 'AllCount',
        sorter: (a, b) => a.AllCount - b.AllCount,
      },
    ];
    return columns;
  };

  let dataTypeName = '行政区';
  switch (dataType) {
    case 'region':
      dataTypeName = '行政区';
      break;
    case 'ent':
      dataTypeName = '企业';
      break;
    case 'point':
      dataTypeName = '排放口';
      break;
    default:
      break;
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
              dataType: dataType,
              rtnType: rtnType,
            }}
            autoComplete="off"
          >
            {/* <Form.Item label="分析维度" name="dataType">
              <Select
                placeholder="请选择监测点类型"
                allowClear={false}
                style={{ width: 120 }}
                onChange={value => {
                  setDataType2(value);
                }}
              >
                <Option key={'region'} value={'region'}>
                  行政区
                </Option>
                <Option key={'ent'} value={'ent'}>
                  企业
                </Option>
                <Option key={'point'} value={'point'}>
                  排放口
                </Option>
              </Select>
            </Form.Item> */}
            {/* <Form.Item label="分析方式" name="rtnType">
              <Select
                style={{ width: 160 }}
                placeholder="请选择监测点类型"
                allowClear={false}
                onChange={value => {
                  setRtnType2(value);
                }}
              >
                <Option key={1} value={'nums'}>
                  异常次数
                </Option>
                <Option key={2} value={'hours'}>
                  异常时长
                </Option>
              </Select>
            </Form.Item> */}
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
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  // setDataType(dataType2);
                  // setRtnType(rtnType2);
                  loadData();
                }}
              >
                查询
              </Button>
            </Form.Item>
            <Form.Item name="dataType" style={{ marginLeft: 10 }}>
              <Radio.Group
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
            <Form.Item name="rtnType" style={{ marginLeft: 0 }}>
              <Radio.Group
                onChange={e => {
                  setRtnType(e.target.value);
                  loadData(dataType, e.target.value);
                }}
              >
                <Radio.Button value="nums">异常次数</Radio.Button>
                <Radio.Button value="hours">异常时长</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>
      )}
      <Row gutter={[0, 16]} style={{ height: 320, marginTop: 8 }}>
        <Col span={7} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">异常数据{excepTypeName}分析</div>}
          >
            <ReactEcharts
              option={getOption1()}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </Col>
        <Col span={17} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={
              <div className="innerCardTitle">
                {dataTypeName}异常{excepTypeName}分析
              </div>
            }
          >
            <ReactEcharts
              option={getOption2()}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </Col>
      </Row>
      {/* 运行情况统计评价 */}
      <Card
        style={{ marginTop: 8 }}
        bodyStyle={{ padding: '10px 24px' }}
        title={
          <div className="innerCardTitle">
            {dataTypeName}异常{excepTypeName}分析详情
          </div>
        }
      >
        <SdlTable
          loading={loading}
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          pagination={true}
        />
      </Card>
      {console.log(' window.location', window.location)}
      {isModalOpen && (
        <Modal
          title={modalTitle}
          wrapClassName={
            window.location.pathname === '/SystemDashboard/AbnormalIdentify'
              ? 'fullScreenModal'
              : 'spreadOverModal'
          }
          destroyOnClose
          visible={isModalOpen}
          footer={false}
          bodyStyle={
            window.location.pathname === '/SystemDashboard/AbnormalIdentify' ? { padding: 0 } : {}
          }
          onCancel={() => setIsModalOpen(false)}
        >
          <AbnormalDataAnalysis
            time={date}
            regionCode={regionCode}
            entCode={entCode}
            rtnType={rtnType}
            location={location}
          />
        </Modal>
      )}
    </div>
  );
};

export default connect(dvaPropsData)(PageContent);
