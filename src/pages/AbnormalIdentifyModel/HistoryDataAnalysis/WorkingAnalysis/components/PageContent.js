import React, { useState, useEffect } from 'react';
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

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  warningForm: AbnormalIdentifyModel.warningForm,
  // loading: loading.effects['AbnormalIdentifyModel/GetDataMissAnalysis'],
});

const PageContent = props => {
  const [form] = Form.useForm();

  const { dispatch, pageTitle, DGIMN, warningForm } = props;

  const [date, setDate] = useState([moment().startOf('year'), moment()]); // 时间
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [regionCode, setRegionCode] = useState();
  const [entCode, setEntCode] = useState();
  const [loading, setLoading] = useState(false);
  const [stopRate, setStopRate] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [dataType, setDataType] = useState(props.dataType || 'region'); //region/ent/point
  const [stopPieData, setStopPieData] = useState([{}, {}, {}, {}]);
  const [warningInfo, setWarningInfo] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = _dataType => {
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
      },
      callback: result => {
        if (result.IsSuccess) {
          setStopRate(result.Datas.StopRate);
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

  const getOption1 = () => {
    const data = stopRate;
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

  const getOption2 = () => {
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
          data: stopPieData,
        },
      ],
    };

    return option;
  };

  const getOption3 = () => {
    let RunHours = [],
      StopHours = [],
      CountHours = [],
      xData = [];
    dataSource.map(item => {
      RunHours.push(item.RunHour);
      StopHours.push(item.StopHour);
      CountHours.push(item.ShouldHour);
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
          name: '正常运行时长',
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
          name: '停运时长',
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
        title: '运行率',
        dataIndex: 'RunRate',
        key: 'RunRate',
        sorter: (a, b) => a.RunRate - b.RunRate,
        render: text => {
          return text + '%';
        },
      },
      {
        title: '正常运行时间',
        dataIndex: 'RunHour',
        key: 'RunHour',
        sorter: (a, b) => a.RunHour - b.RunHour,
      },
      {
        title: '停运次数',
        dataIndex: 'StopNums',
        key: 'StopNums',
        sorter: (a, b) => a.StopNums - b.StopNums,
      },
      {
        title: '停运时长',
        dataIndex: 'StopHour',
        key: 'StopHour',
        sorter: (a, b) => a.StopHour - b.StopHour,
      },
      {
        title: '总时长',
        dataIndex: 'ShouldHour',
        key: 'ShouldHour',
        sorter: (a, b) => a.ShouldHour - b.ShouldHour,
      },
      {
        title: '停运时间占比',
        dataIndex: 'StopRate',
        key: 'StopRate',
        sorter: (a, b) => a.StopRate - b.StopRate,
        render: text => {
          return text + '%';
        },
      },
    ];
    return columns;
  };

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
                allowClear={false}
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
      <Row gutter={[0, 16]} style={{ height: 320, marginTop: 8 }}>
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
            title={<div className="innerCardTitle">停运时长占比</div>}
          >
            <ReactEcharts
              option={getOption1()}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </Col>
        <Col span={7} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">停运时长分布</div>}
          >
            <ReactEcharts
              option={getOption2()}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </Col>
        <Col span={12} style={{ height: '100%' }}>
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
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[0, 16]}>
        {loading
          ? [
              <Col span={12}>
                <Card style={{ height: 130 }} loading={true}></Card>
              </Col>,
              <Col span={12}>
                <Card style={{ height: 130 }} loading={true}></Card>
              </Col>,
            ]
          : warningInfo.map(item => {
              return (
                <Col span={12}>
                  <Card
                    loading={loading}
                    style={{ marginTop: 8, marginRight: 8 }}
                    bodyStyle={{ padding: '16px 24px' }}
                    title={<div className="innerCardTitle">{item.ModelName}</div>}
                    extra={
                      <Tooltip title="查看线索数据">
                        <a
                          onClick={() => {
                            updateCluesListFormState(item.ModelGuid);
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
                          title="企业数量"
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
          <WorkingAnalysis regionCode={regionCode} entCode={entCode} />
        </Modal>
      )}
      <CluesListModal
        // history={props.history}
        open={isModalOpen2}
        onCancel={() => setIsModalOpen2(false)}
      />
    </div>
  );
};

export default connect(dvaPropsData)(PageContent);
