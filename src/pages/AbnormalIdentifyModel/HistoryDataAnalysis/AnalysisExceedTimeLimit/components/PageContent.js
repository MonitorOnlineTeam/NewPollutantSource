import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Radio, Badge, Row, Col, Button, Form, Modal } from 'antd';
import styles from '../../../styles.less';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import ReactEcharts from 'echarts-for-react';
import AnalysisExceedTimeLimit from '../index';
import WarningTableData from '@/pages/AbnormalIdentifyModel/Home/ModalPage/WarningTableData.js';
import { getDataTypeByConfigInfo } from '@/pages/AbnormalIdentifyModel/CONST.js';
import DataTypeSelect from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/components/DataTypeSelect.js';
import { convertTextByConfig } from '@/utils/utils';
import SelectPollutantType from '@/components/SelectPollutantType';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  loading: loading.effects['AbnormalIdentifyModel/GetOverDataAnalysis'],
});

const PageContent = props => {
  const [form] = Form.useForm();

  const { dispatch, time, loading } = props;

  const [date, setDate] = useState(time || [moment().startOf('month'), moment()]); // 时间
  const [pollutantType, setPollutantType] = useState(props.pollutantType || undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [currentPointData, setCurrentPointData] = useState({});
  const [modalTitle, setModalTitle] = useState();
  const [regionCode, setRegionCode] = useState();
  const [entCode, setEntCode] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [dataType, setDataType] = useState(props.dataType || getDataTypeByConfigInfo('region')); //region/ent/point
  const [entAndPointCount, setEntAndPointCount] = useState({
    EntCount: 0,
    PointCount: 0,
  });
  const [counts, setCounts] = useState({
    折算烟尘: 0,
    '折算SO₂': 0,
    折算NOx: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = _dataType => {
    let bTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss');
    let eTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'AbnormalIdentifyModel/GetOverDataAnalysis',
      payload: {
        entCode: props.entCode,
        regionCode: props.regionCode,
        beginTime: bTime,
        endTime: eTime,
        dataType: _dataType || dataType,
        pollutantType: pollutantType,
      },
      callback: result => {
        setEntAndPointCount(result.Desc);
        setCounts(result.OverPollutant);
        setDataSource(result.TableData);
        // setHourStatistics(MissHours, ShouldHours, CountHours, xData);
      },
    });
  };

  const getOption1 = () => {
    let color = ['#5370c6', '#fac858', '#5cdc9f'];

    const nameList = [];
    const seriesData = [];
    let index = 0;
    for (const key in counts) {
      nameList.push(key);
      seriesData.push({
        value: counts[key],
        itemStyle: {
          color: color[index],
        },
      });
      index += 1;
    }
    console.log('seriesData', seriesData);
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
        },
      },
      grid: {
        left: 60,
        right: 0,
        bottom: 26,
        top: 20,
      },
      xAxis: {
        type: 'value',
        name: '时长',
        axisLine: {
          show: false,
          lineStyle: {
            color: '#202c55',
          },
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: nameList,
        axisLabel: {
          textStyle: {
            // fontSize: 14,
            // color: '#fff',
          },
        },
        axisLine: {
          //y轴线的配置
          show: false, //是否展示
          lineStyle: {
            color: '#202c55', //y轴线的颜色（若只设置了y轴线的颜色，未设置y轴文字的颜色，则y轴文字会默认跟设置的y轴线颜色一致）
          },
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: '超标污染物分析',
          type: 'bar',
          barWidth: 30,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
          },
          label: {
            show: true,
            // position: 'right'
          },
          emphasis: {
            focus: 'series',
          },
          data: seriesData,
          // itemStyle: {
          //   color: '#58CA73', // 自定义颜色
          // },
        },
      ],
    };

    return option;
  };

  const getOption3 = () => {
    let nox = [],
      so2 = [],
      yan = [],
      xData = [];
    dataSource.map(item => {
      nox.push(item['折算NOx']);
      yan.push(item['折算烟尘']);
      so2.push(item['折算SO₂']);
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
        bottom: 30,
        right: 30,
        left: 60,
      },
      // dataZoom: [
      //   {
      //     show: true,
      //     realtime: true,
      //     startValue: 0,
      //     endValue: 6,
      //   },
      // ],
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
      ],
      series: [
        {
          name: '折算NOx',
          type: 'line',
          itemStyle: {
            // color: '#92cc75',
          },
          data: nox,
        },
        {
          name: '折算SO₂',
          type: 'line',
          itemStyle: {
            // color: '#92cc75',
          },
          data: so2,
        },
        {
          name: '折算烟尘',
          type: 'line',
          itemStyle: {
            // color: '#92cc75',
          },
          data: yan,
        },
      ],
    };

    return option;
  };

  const getColumns = () => {
    let column = [];
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
                    drillDownClick(record);
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
                    drillDownClick(record);
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
            render: (text, row) => {
              return (
                <a
                  onClick={() => {
                    setIsModalOpen2(true);
                    setCurrentPointData(row);
                  }}
                >
                  {text}
                </a>
              );
            },
          },
        ];
        break;

      default:
        break;
    }

    let pollutantList = [];
    for (const key in counts) {
      pollutantList.push({
        title: key,
        dataIndex: key,
        key: key,
        sorter: (a, b) => a[key] - b[key],
      });
    }

    const columns = [...column, ...pollutantList];
    return columns;
  };

  let dataTypeName = '行政区';
  switch (dataType) {
    case 'region':
      dataTypeName = '行政区';
      break;
    case 'ent':
      dataTypeName = convertTextByConfig('企业');
      break;
    case 'point':
      dataTypeName = '排放口';
      break;
    default:
      break;
  }

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

  return (
    <div className={styles.PageWrapper}>
      {!props.dataType && (
        <Card bodyStyle={{ padding: '12px 24px' }}>
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
              <SelectPollutantType allowClear style={{ width: 120 }} placeholder="请选择监测点类型"
                onChange={value => {
                  setPollutantType(value);
                }}
              />
            </Form.Item>
            <Form.Item label="时间" name="date">
              <RangePicker_
                // allowClear={false}
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
      <Row gutter={[0, 16]} style={{ height: 360, marginTop: 10 }}>
        <Col span={8} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)', position: 'relative' }}
            title={<div className="innerCardTitle">超标污染物分析</div>}
          >
            <p style={{ position: 'absolute', right: 4, top: 10, color: '#383838', fontSize: 13 }}>
              （时长）
            </p>
            <ReactEcharts
              option={getOption1()}
              style={{ height: 'calc(100% - 40px)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
            <Row justify="center">
              <Col span={12} style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Badge
                  status="processing"
                  text={`${convertTextByConfig('企业')}数量：${entAndPointCount.EntCount}个`}
                />
              </Col>
              <Col span={12} style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                <Badge status="processing" text={`排放口数量：${entAndPointCount.PointCount}个`} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={16} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">{`${dataTypeName}超标统计`}</div>}
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
      <Card
        style={{ marginTop: 10 }}
        bodyStyle={{ padding: '10px 24px' }}
        title={<div className="innerCardTitle">{`${dataTypeName}超标统计详情`}</div>}
      >
        <SdlTable
          loading={loading}
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          pagination={false}
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
          <AnalysisExceedTimeLimit regionCode={regionCode} entCode={entCode} time={date} pollutantType={pollutantType} />
        </Modal>
      )}

      {isModalOpen2 && (
        // 数据图表
        <WarningTableData
          open={isModalOpen2}
          DGIMN={currentPointData.Key}
          date={date}
          title={`(${currentPointData.ParentName}/${currentPointData.Name})`}
          showOnlyList={['数据图表']}
          onCancel={() => {
            setIsModalOpen2(false);
          }}
          pollutantType={pollutantType}
        />
      )}
    </div>
  );
};

export default connect(dvaPropsData)(PageContent);
