/*
 * @Author: JiaQi
 * @Date: 2023-08-31 09:34:04
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-09-14 10:32:54
 * @Description：场景模型分析
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Tooltip, Alert, Divider, Empty } from 'antd';
import styles from '../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import { DetailIcon } from '@/utils/icon';
import moment from 'moment';
import { router } from 'umi';

const noData = {
  value: 0,
  name: '暂无数据',
  itemStyle: {
    color: '#ccc',
  },
};

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,

  entLoading: loading.effects['common/getEntByRegion'],
  clueInfoChartLoading: loading.effects['dataModel/StatisAlarmInfo'],
  reasonsAndCheckChartLoading: loading.effects['dataModel/StatisAlarmInfoCheck'],
  ExportStatisAlarm: loading.effects['dataModel/ExportStatisAlarm'],
  tableLoading: loading.effects['dataModel/StatisAlarmInfoRate', 'dataModel/StatisAlarmInfoSum'],
});

const Index = props => {
  const [form] = Form.useForm();

  const {
    dispatch,
    entLoading,
    clueInfoChartLoading,
    reasonsAndCheckChartLoading,
    tableLoading,
    exportLoading,
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [regionCode, setRegionCode] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [tableSelectedCount, setTableSelectedCount] = useState({
    DisCulesNum: 0,
    VerifiedNum: 0,
    CheckedResult2Count: 0,
    AccuracyRate: '0',
    UniqueParentCodeCount: 0,
    DGIMNCount: 0,
  });
  const [clueInfoData, setClueInfoData] = useState({});
  const [reasonsAndCheckData, setReasonsAndCheckData] = useState({
    reasonsData: { yAxisData: [], seriesData: [] },
  });
  const [date, setDate] = useState([
    moment()
      .subtract(3, 'month')
      .startOf('month')
      .startOf('day'),
    moment().endOf('day'),
  ]);

  useEffect(() => {
    getPageData();
  }, []);

  useEffect(() => {
    StatisAlarmInfoSum();
  }, [selectedRowKeys]);

  const getPageData = () => {
    getStatisAlarmInfo();
    getStatisAlarmInfoCheck();
    StatisAlarmInfoRate();
  };

  // 获取线索信息统计数据
  const getStatisAlarmInfo = () => {
    let reqBody = getRequestBody();
    dispatch({
      type: 'dataModel/StatisAlarmInfo',
      payload: reqBody,
      callback: res => {
        // CheckedResult1Count  工况正常
        // CheckedResult2Count 有异常
        // CheckedResultNullCount 待核实
        // UniqueParentCodeCount  企业数量
        let normal = [],
          exception = [],
          waiting = [],
          entCount = [],
          xAxisData = [],
          ModelNames = [];
        res.map(item => {
          normal.push(item.CheckedResult1Count);
          exception.push(item.CheckedResult2Count);
          waiting.push(item.CheckedResultNullCount);
          entCount.push(item.UniqueParentCodeCount);
          xAxisData.push(item.ModelNumber);
          ModelNames.push(item.ModelName);
        });

        setClueInfoData({
          xAxisData: xAxisData,
          ModelNames: ModelNames,
          series: [
            {
              name: '待核实',
              type: 'bar',
              stack: '核实情况',
              data: waiting,
            },
            {
              name: '核实有异常',
              type: 'bar',
              stack: '核实情况',
              data: exception,
            },
            {
              name: '工况正常',
              type: 'bar',
              stack: '核实情况',
              data: normal,
            },
            {
              name: '企业',
              type: 'bar',
              data: entCount,
            },
          ],
        });
      },
      errorCallback: () => {
        setClueInfoData({});
      },
    });
  };

  // 报警统计 - 统计核实、异常原因
  const getStatisAlarmInfoCheck = () => {
    let reqBody = getRequestBody();
    dispatch({
      type: 'dataModel/StatisAlarmInfoCheck',
      payload: {
        ...reqBody,
        takeNum: 6,
        modelGuid: [],
      },
      callback: res => {
        // 统计核实
        let checkData = res.finalResult.map(item => {
          // 1：工况正常、2：有异常、3：待核实
          return { value: item.Count, name: item.CheckedResult };
        });

        // 异常原因
        let reasonsData = { yAxisData: [], seriesData: [] };
        res.reasonResult.map(item => {
          reasonsData.yAxisData.push(item.UntruthReason);
          reasonsData.seriesData.push(item.ReasonCount);
        });
        setReasonsAndCheckData({ checkData, reasonsData });
      },
      errorCallback: () => {
        setReasonsAndCheckData({
          checkData: [noData],
          reasonsData: { yAxisData: [], seriesData: [] },
        });
      },
    });
  };

  // 核实次数及企业及模型执行率 - table 数据
  const StatisAlarmInfoRate = () => {
    let reqBody = getRequestBody();
    dispatch({
      type: 'dataModel/StatisAlarmInfoRate',
      payload: {
        ...reqBody,
        modelGuid: [],
      },
      callback: res => {
        setDataSource(res);
        let newSelectedRowKeys = res.map(item => item.ModelGuid);
        setSelectedRowKeys(newSelectedRowKeys);
      },
      errorCallback: () => {
        setSelectedRowKeys([]);
        setDataSource([]);
      },
    });
  };

  // 导出
  const ExportStatisAlarm = () => {
    let reqBody = getRequestBody();
    dispatch({
      type: 'dataModel/ExportStatisAlarm',
      payload: {
        ...reqBody,
        takeNum: 6,
        modelGuid: [],
      },
    });
  };

  // 已选择行统计
  const StatisAlarmInfoSum = () => {
    if (selectedRowKeys.length) {
      let reqBody = getRequestBody();
      dispatch({
        type: 'dataModel/StatisAlarmInfoSum',
        payload: {
          ...reqBody,
          modelGuid: selectedRowKeys,
        },
        callback: res => {
          setTableSelectedCount(res.NumInfo);
        },
        errorCallback: () => {
          setTableSelectedCount({
            DisCulesNum: 0,
            VerifiedNum: 0,
            CheckedResult2Count: 0,
            AccuracyRate: '0',
            UniqueParentCodeCount: 0,
            DGIMNCount: 0,
          });
        },
      });
    } else {
      setTableSelectedCount({
        DisCulesNum: 0,
        VerifiedNum: 0,
        CheckedResult2Count: 0,
        AccuracyRate: '0',
        UniqueParentCodeCount: 0,
        DGIMNCount: 0,
      });
    }
  };

  const columns = [
    {
      title: '编号',
      width: 80,
      dataIndex: 'ModelNumber',
    },
    {
      title: '场景名称',
      dataIndex: 'ModelName',
      ellipsis: true,
      width: 200,
      render: (text, record) => {
        return (
          <Tooltip title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '有效执行率',
      dataIndex: 'EffeRate',
      ellipsis: true,
      sorter: (a, b) => a.EffeRate - b.EffeRate,
      render: (text, record) => {
        return text + '%';
      },
    },
    {
      title: '发现线索次数',
      dataIndex: 'DisCulesNum',
      ellipsis: true,
      sorter: (a, b) => a.DisCulesNum - b.DisCulesNum,
    },
    {
      title: '已核实',
      ellipsis: true,
      dataIndex: 'VerifiedNum',
      sorter: (a, b) => a.VerifiedNum - b.VerifiedNum,
    },
    {
      title: '异常次数',
      ellipsis: true,
      dataIndex: 'CheckedResult2Count',
      sorter: (a, b) => a.CheckedResult2Count - b.CheckedResult2Count,
    },
    {
      title: '准确率',
      ellipsis: true,
      dataIndex: 'AccuracyRate',
      sorter: (a, b) => a.AccuracyRate - b.AccuracyRate,
      render: (text, record) => {
        return text + '%';
      },
    },
    {
      title: '企业',
      ellipsis: true,
      dataIndex: 'UniqueParentCodeCount',
      sorter: (a, b) => a.UniqueParentCodeCount - b.UniqueParentCodeCount,
    },
    {
      title: '异常原因',
      dataIndex: 'ExceptionReason',
      ellipsis: true,
      width: 200,
      render: (text, record) => {
        let _text = text || '-';
        return (
          <Tooltip title={_text}>
            <span>{_text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'address',
      render: (text, record) => {
        return (
          <Tooltip title="查看">
            <a
              onClick={() => {
                onClickDetails(record);
              }}
            >
              <DetailIcon />
            </a>
          </Tooltip>
        );
      },
    },
  ];

  // 详情跳转
  const onClickDetails = row => {
    const values = {
      ...form.getFieldsValue(),
      modelGuid: row.ModelGuid,
    };
    console.log('values', values);
    router.push(
      '/DataAnalyticalWarningModel/Statistics/AnalysisReport?params=' + JSON.stringify(values),
    );
  };

  // 获取请求参数
  const getRequestBody = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      date: undefined,
      EntCode: values.EntCode || [],
      BeginTime: moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss'),
      EndTime: moment(values.date[1]).format('YYYY-MM-DD HH:mm:ss'),
    };
  };

  // 线索信息统计
  const getClueInfoOption = () => {
    return {
      color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
      title: {
        text: '线索信息统计',
        left: 'left',
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params, ticket) {
          //x轴名称
          let dataIndex = params[0].dataIndex;
          let name = clueInfoData.ModelNames[dataIndex];
          //值
          let value = '';
          params.map(item => {
            value += `${item.marker} ${item.seriesName}: ${item.value || '-'} <br />`;
          });

          return name + '<br />' + value;
        },
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      legend: {
        data: ['待核实', '核实有异常', '工况正常', '企业'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          ModelNames: clueInfoData.ModelNames,
          data: clueInfoData.xAxisData,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: clueInfoData.series,
    };
  };

  // 统计核实
  const getCheckOption = () => {
    return {
      color: ['#91cc75', '#fac858', '#5470c6'],
      title: {
        text: '统计核实',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      grid: {
        bottom: '6%',
        containLabel: true,
      },
      series: [
        {
          name: '统计核实',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: reasonsAndCheckData.checkData,
          itemStyle: {
            normal: {
              label: {
                //饼图图形上的文本标签
                show: true,
                position: 'inner', //标签的位置
                textStyle: {
                  // color: 'rgba(0, 0, 0, 0.85)',
                  fontWeight: 500,
                  fontSize: 13, //文字的字体大小
                },
                formatter: '{d}%',
              },

              labelLine: {
                show: false, //隐藏标示线
              },
            },
          },

          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          // 设置指示线和指示线上的文字的饼状图
          name: '统计核实',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          itemStyle: {
            normal: {
              label: {
                //饼图图形上的文本标签
                show: true,
              },

              labelLine: {
                show: true, //隐藏标示线
              },
            },
          },
          data: reasonsAndCheckData.checkData,
        },
      ],
    };
  };

  // 异常原因
  const getReasonsOption = () => {
    return {
      color: '#5470c6',
      title: {
        text: '异常原因',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        show: false,
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: reasonsAndCheckData.reasonsData.yAxisData.length
          ? reasonsAndCheckData.reasonsData.yAxisData
          : ['暂无数据'],
      },
      series: [
        {
          name: '异常原因',
          type: 'bar',
          showBackground: true,
          barWidth: '70%',
          data: reasonsAndCheckData.reasonsData.seriesData.length
            ? reasonsAndCheckData.reasonsData.seriesData
            : ['-'],
          label: {
            show: true,
            position: 'right',
          },
        },
      ],
    };
  };

  const onSelectChange = newSelectedRowKeys => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.WarningModelAnalysis}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card bodyStyle={{ paddingTop: 0 }}>
            <Form
              name="basic"
              form={form}
              layout="inline"
              style={{ padding: '10px 0', marginBottom: 10 }}
              initialValues={{
                date: date,
              }}
              autoComplete="off"
              // onValuesChange={onValuesChange}
              onValuesChange={(changedFields, allFields) => {
                // console.log('changedFields', changedFields);
                // console.log('allFields', allFields);
                // dispatch({
                //   type: 'dataModel/updateState',
                //   payload: {
                //     warningForm: {
                //       ...props.warningForm,
                //       ...changedFields,
                //     },
                //   },
                // });
              }}
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
              <Spin spinning={entLoading}>
                <Form.Item label="企业" name="EntCode">
                  <EntAtmoList mode="multiple" regionCode={regionCode} style={{ width: 200 }} />
                </Form.Item>
              </Spin>
              <Form.Item label="行业" name="IndustryTypeCode">
                <SearchSelect
                  placeholder="请选择排口所属行业"
                  style={{ width: 200 }}
                  configId={'IndustryType'}
                  itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
                  itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
                />
              </Form.Item>
              <Form.Item label="日期" name="date">
                <RangePicker_
                  allowClear={false}
                  dataType="day"
                  format="YYYY-MM-DD"
                  style={{ width: 250 }}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    // loading={queryLoading}
                    onClick={() => {
                      getPageData();
                    }}
                  >
                    查询
                  </Button>
                  {/* <Button onClick={() => onReset()}>重置</Button> */}
                  <Button
                    type="primary"
                    loading={exportLoading}
                    onClick={() => ExportStatisAlarm()}
                  >
                    导出
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
          <Card>
            <div className={styles.chartWrapper}>
              <div className={styles.chartItemBox} style={{ width: '40%', minWidth: 700 }}>
                <Spin wrapperClassName={styles.spinWrapper} spinning={clueInfoChartLoading}>
                  <ReactEcharts
                    theme="light"
                    option={getClueInfoOption()}
                    lazyUpdate
                    notMerge
                    style={{ width: '100%', height: '100%' }}
                  />
                </Spin>
              </div>
              <div className={styles.chartItemBox} style={{ width: '30%', minWidth: 400 }}>
                <Spin wrapperClassName={styles.spinWrapper} spinning={reasonsAndCheckChartLoading}>
                  <ReactEcharts
                    theme="light"
                    option={getCheckOption()}
                    lazyUpdate
                    notMerge
                    style={{ width: '100%', height: '100%' }}
                  />
                </Spin>
              </div>
              <div className={styles.chartItemBox} style={{ width: '30%', minWidth: 400 }}>
                <Spin wrapperClassName={styles.spinWrapper} spinning={reasonsAndCheckChartLoading}>
                  <ReactEcharts
                    theme="light"
                    option={getReasonsOption()}
                    lazyUpdate
                    notMerge
                    style={{ width: '100%', height: '100%' }}
                  />
                </Spin>
              </div>
            </div>
          </Card>
          <Card bodyStyle={{ paddingBottom: 20 }}>
            <Spin spinning={tableLoading}>
              <Alert
                message={
                  <>
                    已选择 <span style={{ color: 'blue' }}>{selectedRowKeys.length}</span> 项{' '}
                    <Divider type="vertical" />
                    {`总数：发现线索次数${tableSelectedCount.DisCulesNum}次，已核实${tableSelectedCount.VerifiedNum}次，
                  发现异常${tableSelectedCount.CheckedResult2Count}次，准确率${tableSelectedCount.AccuracyRate}；
                  涉及企业${tableSelectedCount.UniqueParentCodeCount}家，排放口${tableSelectedCount.DGIMNCount}个。`}
                  </>
                }
                type="info"
                showIcon
                style={{ marginBottom: 10 }}
              />
              <SdlTable
                rowKey="ModelGuid"
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                // loading={tableLoading}
                align="center"
                pagination={false}
                scroll={{
                  y: 'calc(100vh - 700px)',
                }}
              />
            </Spin>
          </Card>
        </Space>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Index);
