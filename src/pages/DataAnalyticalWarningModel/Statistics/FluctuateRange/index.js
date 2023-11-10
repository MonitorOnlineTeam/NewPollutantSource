/*
 * @Author: JiaQi
 * @Date: 2023-08-31 09:47:00
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-11-01 10:12:56
 * @Description:
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Tooltip, Row, Select, Col, Radio, Modal } from 'antd';
import styles from '../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import { DetailIcon } from '@/utils/icon';
import { PollutantListConst } from '../../CONST';
import AbnormalJudgmentPage from '@/pages/DataAnalyticalWarningModel/Warning/AbnormalJudgmentPage.js';
import { ZoomInOutlined } from '@ant-design/icons';

const zoomInStyle = {
  position: 'absolute',
  right: 40,
  top: 30,
  cursor: 'pointer',
  fontSize: 18,
  color: '#888',
  zIndex: 1,
};

const dvaPropsData = ({ loading, common }) => ({
  entLoading: loading.effects['common/getEntByRegion'],
  loading: loading.effects['dataModel/StatisNormalRange'],
  exportLoading: loading.effects['dataModel/ExportStatisNormalRange'],
});

const Index = props => {
  const [form] = Form.useForm();
  const { dispatch, entLoading, loading, exportLoading } = props;

  const [regionCode, setRegionCode] = useState();
  const [selectPollutant, setSelectPollutant] = useState(PollutantListConst);
  const [dataSource, setDataSource] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [zoomInChartData, setZoomInChartData] = useState(); // 存放放大图表的数据
  const [currentData, setCurrentData] = useState({}); // 当前点击的柱状图数据
  const [visible, setVisible] = useState(false);
  const [zoomInVisible, setZoomInVisible] = useState(false); // 放大图标弹窗是否显示
  const [showType, setShowType] = useState('chart');

  useEffect(() => {
    getPageData();
  }, []);

  // 获取页面数据
  const getPageData = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'dataModel/StatisNormalRange',
      payload: { ...values, entCode: values.entCode || [] },
      callback: res => {
        // 创建一个空数组用于存储处理后的数据
        let processedData = [];

        // 遍历selectPollutant数组
        for (let i = 0; i < selectPollutant.length; i++) {
          // 创建一个空对象用于存储处理后的数据
          let data = {
            PollutantName: selectPollutant[i].PollutantName,
            PollutantCode: selectPollutant[i].PollutantCode,
            LowerData: [],
            diffData: [],
            xData: [],
            Datas: [],
          };

          // 遍历
          for (let j = 0; j < res.length; j++) {
            // 如果PollutantCode匹配，则将数据添加到对应的数组中
            if (res[j].PollutantCode === selectPollutant[i].PollutantCode) {
              data.LowerData.push(res[j].LowerLimit);
              data.diffData.push(res[j].InterRange);
              data.Datas.push(res[j]);
              data.xData.push(j);
            }
          }

          // 将处理后的数据添加到processedData数组中
          processedData.push(data);
          console.log('processedData', processedData);
        }
        setDataSource(res);
        setChartData(processedData);
      },
    });
  };

  // 导出
  const ExportStatisNormalRange = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'dataModel/ExportStatisNormalRange',
      payload: { ...values, entCode: values.entCode || [] },
    });
  };

  const getOption = (data, flag) => {
    if (!data) {
      return {};
    }

    let otherOptions = {};
    // 大图增加配置
    if (flag) {
      otherOptions.toolbox = {
        feature: {
          // dataView: { show: true, readOnly: false },
          // magicType: { show: true, type: ['line', 'bar'] },
          dataZoom: { show: true },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      };
    }

    //
    let xAxisData = [];
    if (data && data.Datas)
      for (let index = 0; index < data.Datas.length; index++) {
        xAxisData.push(index);
      }

    let option = {
      color: '#5470c6',
      title: {
        text: data.PollutantName,
        left: 'center',
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
          if (!flag) {
            tooltipText +=
              '<span style="color: #faad14;font-weight: bold">点击查看该排放口所有因子的波动范围</span>';
          }
          return tooltipText;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        containLabel: true,
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
          data: data.LowerData,
        },
        {
          name: 'Income',
          type: 'bar',
          stack: 'Total',
          // label: {
          //   show: true,
          //   position: 'top',
          // },
          data: data.diffData,
        },
      ],
      ...otherOptions,
    };

    if (zoomInVisible === true) {
      option.dataZoom = [{}];
    }

    return option;
  };

  // 重置form
  const onReset = () => {
    form.resetFields();
  };

  const columns = [
    {
      title: '序号',
    },
    {
      title: '企业',
      dataIndex: 'EntName',
      ellipsis: true,
    },
    {
      title: '排放口',
      dataIndex: 'PointName',
      ellipsis: true,
    },
    {
      title: '监测因子',
      dataIndex: 'PollutantName',
      ellipsis: true,
    },
    {
      title: '因子编码',
      ellipsis: true,
      dataIndex: 'PollutantCode',
    },
    {
      title: '波动上限',
      ellipsis: true,
      dataIndex: 'UpperLimit',
      sorter: (a, b) => a.UpperLimit - b.UpperLimit,
    },
    {
      title: '波动下限',
      ellipsis: true,
      dataIndex: 'LowerLimit',
      sorter: (a, b) => a.LowerLimit - b.LowerLimit,
    },
    {
      title: '波动范围',
      ellipsis: true,
      dataIndex: 'InterRange',
      sorter: (a, b) => a.InterRange - b.InterRange,
    },
    {
      title: '操作',
      dataIndex: 'handle',
      render: (text, record) => {
        return (
          <Tooltip title="查看该排放口所有因子的波动范围">
            <a
              onClick={() => {
                onShowAbnormalJudgmentPage(record);
              }}
            >
              <DetailIcon />
            </a>
          </Tooltip>
        );
      },
    },
  ];

  // 显示波动范围弹窗
  const onShowAbnormalJudgmentPage = row => {
    setCurrentData(row);
    setVisible(true);
  };

  // 放大图表
  const onZoomInChart = chartData => {
    setZoomInChartData(chartData);
    setZoomInVisible(true);
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.FluctuateRange}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card bodyStyle={{ paddingTop: 0 }}>
            <Form
              name="basic"
              form={form}
              layout="inline"
              style={{ padding: '10px 0', marginBottom: 10 }}
              initialValues={{
                pollutantCode: PollutantListConst.map(item => item.PollutantCode),
                IndustryTypeCode: '1',
              }}
              autoComplete="off"
              onValuesChange={(changedFields, allFields) => {}}
            >
              <Form.Item label="行政区" name="RegionCode">
                <RegionList
                  noFilter
                  style={{ width: 140 }}
                  onChange={value => {
                    // 重置企业列表
                    setRegionCode(value);
                    form.setFieldsValue({ EntCode: undefined });
                  }}
                />
              </Form.Item>
              {// 脱敏角色不显示企业
              !currentUser.RoleIds.includes('1dd68676-cd35-43bb-8e16-40f0fde55c6c') && (
                <Spin spinning={entLoading}>
                  <Form.Item label="企业" name="EntCode">
                    <EntAtmoList mode="multiple" regionCode={regionCode} style={{ width: 200 }} />
                  </Form.Item>
                </Spin>
              )}
              <Form.Item label="行业" name="IndustryTypeCode">
                <SearchSelect
                  placeholder="排口所属行业"
                  style={{ width: 130 }}
                  configId={'IndustryType'}
                  itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
                  itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
                />
              </Form.Item>
              <Form.Item label="污染物" name="pollutantCode">
                <Select
                  mode="multiple"
                  // allowClear
                  maxTagCount={3}
                  maxTagTextLength={5}
                  maxTagPlaceholder="..."
                  style={{ width: 350 }}
                  placeholder="请选择污染物"
                  onChange={(value, option) => {
                    let SelectPollutantList = option.map(item => {
                      return { PollutantName: item.children, PollutantCode: item.key };
                    });
                    setSelectPollutant(SelectPollutantList);
                  }}
                >
                  {PollutantListConst.map(item => {
                    return (
                      <Option value={item.PollutantCode} key={item.PollutantCode}>
                        {item.PollutantName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={() => {
                      getPageData();
                    }}
                  >
                    查询
                  </Button>
                  <Button onClick={() => onReset()}>重置</Button>
                  <Button
                    type="primary"
                    loading={exportLoading}
                    onClick={() => ExportStatisNormalRange()}
                  >
                    导出
                  </Button>
                  <Spin spinning={loading}>
                    <Radio.Group
                      defaultValue={showType}
                      optionType="button"
                      buttonStyle="solid"
                      style={{ marginLeft: 20 }}
                      onChange={e => {
                        setShowType(e.target.value);
                      }}
                    >
                      <Radio.Button value={'data'}>数据</Radio.Button>
                      <Radio.Button value={'chart'}>图表</Radio.Button>
                    </Radio.Group>
                  </Spin>
                </Space>
              </Form.Item>
            </Form>
            {showType === 'chart' ? (
              <Row className={styles.ChartWrapper}>
                {chartData.map(item => {
                  return (
                    <Col span={12} style={{ marginBottom: 20, position: 'relative' }}>
                      <Tooltip title="点击放大图表">
                        <ZoomInOutlined style={zoomInStyle} onClick={() => onZoomInChart(item)} />
                      </Tooltip>
                      <ReactEcharts
                        theme="light"
                        option={getOption(item)}
                        lazyUpdate
                        notMerge
                        style={{ width: '100%', height: '340px' }}
                        onEvents={{
                          click: event => {
                            onShowAbnormalJudgmentPage(item.Datas[event.dataIndex]);
                          },
                        }}
                      />
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <SdlTable
                style={{ marginTop: 10 }}
                rowKey="index"
                columns={columns}
                dataSource={dataSource}
                align="center"
                loading={loading}
              />
            )}
          </Card>
        </Space>
      </div>
      <Modal
        title={`波动范围（${currentData.EntName} - ${currentData.PointName}）`}
        wrapClassName="spreadOverModal"
        destroyOnClose
        visible={visible}
        footer={false}
        onCancel={() => setVisible(false)}
        bodyStyle={{ padding: 0 }}
      >
        <AbnormalJudgmentPage displayType="modal" DGIMN={currentData.DGIMN} />
      </Modal>
      <Modal
        title=""
        wrapClassName="spreadOverModal"
        destroyOnClose
        visible={zoomInVisible}
        footer={false}
        onCancel={() => setZoomInVisible(false)}
        bodyStyle={{ padding: 0 }}
      >
        <Card bodyStyle={{ paddingTop: 60 }}>
          <ReactEcharts
            theme="light"
            option={getOption(zoomInChartData, true)}
            lazyUpdate
            notMerge
            style={{ width: '100%', height: 'calc(100vh - 140px)' }}
          />
        </Card>
      </Modal>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Index);
