/**
 * 功  能：异常买模型识别 模型库管理  排放特征学习
 * 创建人：jab
 * 创建时间：2024.06
 */
import React, { useState, useEffect, Fragment } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Spin,
  Tabs,
  Descriptions,
  Form,
  Typography,
  Badge,
  Card,
  Button,
  Select,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  ProfileOutlined,
  AmazonCircleFilled,
} from '@ant-design/icons';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList';
import SdlCascader from '@/pages/AutoFormManager/SdlCascader';
import styles from '../../styles.less';
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import ReactEcharts from 'echarts-for-react';
import { PollutantListConst } from '@/pages/AbnormalIdentifyModel/CONST';
const { Option } = Select;

const namespace = 'ModelBaseManage';

const dvaPropsData = ({ loading, ModelBaseManage, global }) => ({
  tableLoading: loading.effects[`${namespace}/GetTrainingResult`],
  logLoading: loading.effects[`${namespace}/GetTrainingRecords`],
  configInfo: global.configInfo,
  echartLoading: loading.effects[`${namespace}/StatisNormalRange`],
});

const Index = props => {
  const [form] = Form.useForm();

  const { tableLoading } = props;

  const [trainningResult, setTrainningResult] = useState({
    SucNum: 0,
    FailNum: 0,
    Key: '',
    SucRate: 0,
    LastTime: '',
  });
  const [dataSource, setDataSource] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [echarts1, setEcharts1] = useState();
  const [echarts2, setEcharts2] = useState();

  useEffect(() => {
    getPageData({ projectType: 1 });
  }, []);
  // 获取页面数据
  const getPageData = par => {
    props.dispatch({
      type: `${namespace}/GetTrainingResult`,
      payload: {},
      callback: res => {
        setTrainningResult(res?.TrainningResult);
        setDataSource(res?.TrainningItems);
      },
    });
    props.dispatch({
      type: `${namespace}/StatisNormalRange`,
      payload: { ...par },
      callback: res => {
        // 创建一个空数组用于存储处理后的数据
        let processedData = [];
        // 遍历PollutantListConst数组
        for (let i = 0; i < PollutantListConst.length; i++) {
          // 创建一个空对象用于存储处理后的数据
          let data = {
            PollutantName: PollutantListConst[i].PollutantName,
            PollutantCode: PollutantListConst[i].PollutantCode,
            LowerData: [],
            diffData: [],
            xData: [],
            Datas: [],
          };

          // 遍历
          for (let j = 0; j < res.length; j++) {
            // 如果PollutantCode匹配，则将数据添加到对应的数组中
            if (res[j].PollutantCode === PollutantListConst[i].PollutantCode) {
              data.LowerData.push(res[j].LowerLimit);
              data.diffData.push(res[j].InterRange);
              data.Datas.push(res[j]);
              data.xData.push(j);
            }
          }

          // 将处理后的数据添加到processedData数组中
          processedData.push(data);
        }
        setChartData(processedData);
      },
    });
  };

  const columns = [
    {
      title: '项目',
      dataIndex: 'Name',
      key: 'Name',
      align: 'center',
      width: 140,
      ellipsis: true,
    },
    {
      title: '处理成功',
      dataIndex: 'SucNum',
      key: 'SucNum',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (text, record) => {
        return (
          <span style={{ cursor: 'pointer' }} onClick={() => logQuery(record?.Key, 1)}>
            {text}
          </span>
        );
      },
    },
    {
      title: '处理失败',
      dataIndex: 'FailNum',
      key: 'FailNum',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (text, record) => {
        return text > 0 ? (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => logQuery(record?.Key, 0)}
            className="red"
          >
            {text}
          </span>
        ) : (
          text
        );
      },
    },
  ];
  const [logVisible, setLogVisible] = useState(false);
  const [logData, setLogData] = useState([]);

  const logQuery = (key, Status) => {
    setLogVisible(true);
    props.dispatch({
      type: `${namespace}/GetTrainingRecords`,
      payload: { key, Status },
      callback: res => {
        setLogData(res);
      },
    });
  };

  const TitleComponents = ({ title, style }) => {
    return (
      <div
        style={{
          display: 'inline-block',
          fontSize: 18,
          fontWeight: 'bold',
          padding: '0 12px 12px 0',
          ...style,
        }}
      >
        {title}
      </div>
    );
  };
  const getOption = data => {
    let echarts = echarts2,
      colors = ['#5abffc', '#58cdfd', 'rgba(36,220,247,.4)'];
    let dataValue = data;
    if (echarts)
      return {
        title: {
          text: `{v|${dataValue}}{unit|%}`,
          x: 'center',
          y: 'center',
          textStyle: {
            rich: {
              v: { fontSize: 22, fontWeight: 'bold', color: colors[1] },
              unit: { fontSize: 22, fontWeight: 'bold', color: colors[1] },
            },
          },
        },
        series: [
          /** 内心圆 */
          {
            //内圆
            type: 'pie',
            radius: ['64%', '0%'],
            center: ['50%', '50%'],
            z: 1,
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(
                  0.5,
                  0.5,
                  0.5,
                  [
                    {
                      offset: 0,
                      color: 'transparent',
                    },
                    {
                      offset: 0.5,
                      color: 'transparent',
                    },
                    {
                      offset: 1,
                      color: 'transparent',
                    },
                  ],
                  false,
                ),
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            label: {
              show: false,
            },
            tooltip: {
              show: false,
            },
            data: [100],
            animationType: 'scale',
          },
          /** 饼图 */
          {
            name: '已完成',
            type: 'pie',
            startAngle: 90,
            z: 0,
            label: {
              position: 'center',
            },
            radius: ['64%', '52%'],
            silent: true,
            animation: false, // 关闭饼图动画
            data: [
              {
                value: dataValue,
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0.2,
                    x2: 1,
                    y2: 0,
                    colorStops: [{ offset: 0, color: colors[0] }, { offset: 1, color: colors[1] }],
                  },
                },
              },
              {
                name: '未完成',
                value: 100 - dataValue,
                label: { show: false },
                itemStyle: { color: '#f0f2f5' },
              },
            ],
          },
          /** 饼图上刻度 */
          {
            type: 'gauge',
            center: ['50%', '50%'],
            // radius: ['56%', '44%'],
            radius: '86%', // 错位调整此处

            startAngle: 0,
            endAngle: 360,
            splitNumber: 16,
            axisLine: { show: false },
            splitLine: {
              length: 106,
              // length: '24%',
              lineStyle: {
                width: 3,
                color: '#fff',
              },
            },
            axisTick: { show: false },
            axisLabel: { show: false },
          },
          {
            type: 'pie',
            name: '内层细圆环',
            radius: ['70%', '72%'],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                color: colors[2],
              },
            },
            label: {
              show: false,
            },
            data: [100],
          },
        ],
      };

    return {};
  };
  const getOption2 = (title, data) => {
    const grid = {
      left: 100,
      right: 0,
      bottom: 20,
      top: 10,
      // containLabel: true
    };
    if (!data) {
      return {};
    }
    if (title === '波动范围') {
      let otherOptions = {};
      let xAxisData = [];
      if (data && data.Datas)
        for (let index = 0; index < data.Datas.length; index++) {
          xAxisData.push(index);
        }
      let option = {
        color: '#5470c6',
        grid: {
          ...grid,
          left: 40,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: function(params) {
            let dataIndex = params[0].dataIndex;
            let currentData = data.Datas[dataIndex];
            let tooltipText = `企业：${currentData.EntName} <br/>
                排放口：${currentData.PointName} <br/>
                DGIMN：${currentData.DGIMN} <br/>
                波动下限：${currentData.LowerLimit} <br/>
                波动上限：${currentData.UpperLimit} <br/>
                波动范围：${currentData.InterRange} <br/>
              `;
            return tooltipText;
          },
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
        },
        series: [
          {
            name: 'Placeholder',
            type: 'bar',
            stack: 'Total',
            silent: true,
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent',
            },
            emphasis: {
              itemStyle: {
                borderColor: 'transparent',
                color: 'transparent',
              },
            },
            barMaxWidth: 40,
            data: data.LowerData,
          },
          {
            name: 'Income',
            type: 'bar',
            stack: 'Total',
            barMaxWidth: 40,
            data: data.diffData,
          },
        ],
        ...otherOptions,
      };
      return option;
    } else {
      let xAxisData = [],
        yAxisData = [];
      if (data && data.Datas) {
        for (let index = 0; index < data.Datas.length; index++) {
          xAxisData.push(data.Datas[index].EntName);
          yAxisData.push(data.Datas[index].Amplitude);
        }
      }
      let option = {
        grid: {
          ...grid,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '振幅范围',
            type: 'bar',
            data: yAxisData,
          },
        ],
      };
      return option;
    }
  };
  const searchComponents = () => {
    return (
      <Form
        form={form}
        name="advanced_search"
        className={'ant-advanced-search-form'}
        layout="inline"
      >
        <Form.Item label="选择项目">
          <Select
            defaultValue="1"
            style={{ width: 200 }}
            placeholder="内蒙数据同步"
            options={[
              {
                value: '1',
                label: '内蒙数据',
              },
            ]}
          />
        </Form.Item>
      </Form>
    );
  };

  return (
    <div className={`${styles.characteristicLearningSty}`}>
      <BreadcrumbWrapper>
        {/* <Card className='queryCriterTitleSty' bodyStyle={{ padding: '8px 24px' }}>{searchComponents()}</Card> */}
        <Row style={{ maxHeight: 'calc(100vh - 130px)', overflowY: 'auto' }}>
          <Col span={6} style={{ paddingRight: 6 }}>
            <Spin spinning={tableLoading}>
              <Card style={{ marginBottom: 12 }}>
                <TitleComponents title="模型训练结果分析" style={{ padding: 0 }} />
                <ReactEcharts
                  ref={echart => {
                    echart && setEcharts1(echart.echarts);
                  }}
                  option={getOption(trainningResult?.SucRate * 100 || 0)}
                  lazyUpdate={true}
                  style={{ height: '162px', width: '100%' }}
                />
                <Descriptions column={2}>
                  <Descriptions.Item label="成功训练排口">
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => logQuery(trainningResult?.Key, 1)}
                    >
                      {trainningResult?.SucNum || 0}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="失败训练排口">
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => logQuery(trainningResult?.Key, 0)}
                    >
                      {trainningResult?.FailNum || 0}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="最近训练时间">
                    {trainningResult?.LastTime || 0}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Spin>
          </Col>
          <Col span={18} style={{ paddingLeft: 6 }}>
            <Card style={{ marginBottom: 12 }}>
              <TitleComponents title="模型训练结果详情" />
              <SdlTable
                loading={tableLoading}
                bordered
                dataSource={dataSource}
                columns={columns}
                scroll={{ y: 'hidden' }}
                rowClassName={null}
                pagination={false}
              />
            </Card>
          </Col>
          {['波动范围', '振幅范围'].map(titleItem => {
            return (
              <Col span={24}>
                <Card style={{ marginBottom: 12 }} loading={!!props.echartLoading}>
                  <TitleComponents title={titleItem} />
                  <Tabs
                    type="card"
                    size="small"
                    items={PollutantListConst.map((item, i) => {
                      return {
                        label: item.PollutantName,
                        key: item.PollutantCode,
                        children: (
                          <ReactEcharts
                            ref={echart => {
                              echart && setEcharts2(echart.echarts);
                            }}
                            option={getOption2(
                              titleItem,
                              chartData &&
                                chartData[0] &&
                                chartData.filter(
                                  filterItem => filterItem.PollutantCode == item.PollutantCode,
                                )?.[0],
                            )}
                            style={{ height: '180px', width: '100%' }}
                          />
                        ),
                      };
                    })}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
        <Modal
          visible={logVisible}
          title={'训练日志'}
          onCancel={() => {
            setLogVisible(false);
          }}
          destroyOnClose
          footer={null}
        >
          <SdlTable
            loading={props.logLoading}
            bordered
            dataSource={logData}
            columns={[
              {
                title: '企业',
                dataIndex: 'ParentName',
                key: 'ParentName',
                align: 'center',
                width: 140,
                ellipsis: true,
              },
              {
                title: '排口',
                dataIndex: 'PointName',
                key: 'PointName',
                align: 'center',
                width: 120,
                ellipsis: true,
              },
            ]}
            scroll={{ y: 'hidden' }}
            rowClassName={null}
            pagination={false}
          />
        </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);
