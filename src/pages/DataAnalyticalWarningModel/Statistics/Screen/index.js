import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Alert, Tooltip, Spin, Button } from 'antd';
import styles from './styles.less';
import BoxItem from './BoxItem';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import _ from 'lodash';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
  tableLoading: loading.effects['dataModel/StatisAlarmInfoRate'],
  alertLoading: loading.effects['dataModel/StatisTipMsg'],
  StatisForDataLoading: loading.effects['dataModel/StatisForData'],
  StatisVeriAndErLoading: loading.effects['dataModel/StatisVeriAndEr'],
});

const Index = props => {
  const {
    dispatch,
    onCancel,
    visible,
    tableLoading,
    alertLoading,
    StatisVeriAndErLoading,
    StatisForDataLoading,
  } = props;
  // const [visible, setVisible] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataCountStatistics, setDataCountStatistics] = useState([]); // 数据统计分析数据
  const [clueCount, setClueCount] = useState(0); // 线索总数
  const [selectedModelGuid, setSelectedModelGuid] = useState([]); // 选中的ModelGuid
  const [checkInfoAndEntRank, setCheckInfoAndEntRank] = useState({
    checkInfo: [{}, {}, {}], //线索核实情况
    entRank: [], // 企业排名
    entMaxNum: 0,
  }); // 线索核实情况和企业排名
  const [tableSelectedCount, setTableSelectedCount] = useState({
    DisCulesNum: 0,
    VerifiedNum: 0,
    CheckedResult2Count: 0,
    AccuracyRate: '0',
    UniqueParentCodeCount: 0,
    DGIMNCount: 0,
  });

  useEffect(() => {
    StatisForData();
    loadData();
  }, [selectedModelGuid]);

  useEffect(() => {
    StatisAlarmInfoSum();
  }, [selectedRowKeys]);
  //

  // const onCancel = () => {
  //   setVisible(false);
  // };

  const loadData = () => {
    StatisVeriAndEr();
    StatisAlarmInfoRate();
  };

  // 获取数据统计分析 数据
  const StatisForData = () => {
    let body = getRequestBody();
    dispatch({
      type: 'dataModel/StatisForData',
      payload: body,
      callback: res => {
        let count = 0;
        res.map(item => {
          count += item.Count;
        });
        setClueCount(count);
        setDataCountStatistics(res);
      },
    });
  };

  // 获取线索核实情况和企业排名
  const StatisVeriAndEr = () => {
    let body = getRequestBody();
    dispatch({
      type: 'dataModel/StatisVeriAndEr',
      payload: body,
      callback: res => {
        let max = _.maxBy(res.reasonResult, 'Count').Count;
        setCheckInfoAndEntRank({
          checkInfo: res.finalResult, //线索核实情况
          entRank: res.reasonResult, // 企业排名
          entMaxNum: max + max * 0.1,
        });
      },
    });
  };

  // 核实次数及企业及模型执行率 - table 数据
  const StatisAlarmInfoRate = () => {
    let body = getRequestBody();
    dispatch({
      type: 'dataModel/StatisAlarmInfoRate',
      payload: body,
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

  // 已选择行统计
  const StatisAlarmInfoSum = () => {
    if (selectedRowKeys.length) {
      let body = getRequestBody();
      dispatch({
        type: 'dataModel/StatisTipMsg',
        payload: {
          ...body,
          modelGuid: selectedRowKeys,
        },
        callback: res => {
          setTableSelectedCount(res);
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

  // 获取请求参数
  const getRequestBody = () => {
    return {
      beginTime: moment()
        .subtract(1, 'year')
        .format('YYYY-MM-DD 00:00:00'),
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
      entCode: [],
      modelGuid: selectedModelGuid,
    };
  };

  const getOption = () => {
    const { checkInfo } = checkInfoAndEntRank;
    let option = {
      color: ['#0078FF', '#21F087', '#EDE022'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}个 ({d}%)',
      },
      // tooltip: {
      //   show: true,
      //   trigger: 'item',
      // },
      series: [
        {
          name: '线索核实情况',
          type: 'pie',
          radius: ['66%', '87%'],
          avoidLabelOverlap: false,
          // hoverAnimation: true,
          // silent: true,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '线索核实情况',
              fontSize: 15,
              color: '#fff',
              rich: {
                total: {
                  fontSize: 18,
                  fontFamily: '微软雅黑',
                  color: '#fff',
                },
                active: {
                  fontFamily: '微软雅黑',
                  fontSize: 12,
                  color: '#e5e9f3',
                  lineHeight: 22,
                },
              },
            },
            emphasis: {
              show: true,
            },
          },
          data: [
            { value: checkInfo[2].Count, name: '待核实数据' },
            { value: checkInfo[0].Count, name: '核实为误报数据' },
            { value: checkInfo[1].Count, name: '核实为异常数据' },
          ],
        },
      ],
    };
    return option;
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
      title: '发现线索个数',
      dataIndex: 'DisCulesNum',
      ellipsis: true,
      sorter: (a, b) => a.DisCulesNum - b.DisCulesNum,
    },
    {
      title: '已核实个数',
      ellipsis: true,
      dataIndex: 'VerifiedNum',
      sorter: (a, b) => a.VerifiedNum - b.VerifiedNum,
    },
    {
      title: '核实为异常个数',
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

  // 根据ModelGuid获取数据
  const getDataByModelGuid = ModelIDList => {
    setSelectedModelGuid(ModelIDList);
  };

  // 详情跳转
  const onClickDetails = row => {
    const values = {
      date: [
        moment()
          .subtract(1, 'year')
          .format('YYYY-MM-DD 00:00:00'),
        moment().format('YYYY-MM-DD 23:59:59'),
      ],
      entCode: [],
      modelGuid: row.ModelGuid,
    };
    console.log('values', values);
    router.push(
      '/DataAnalyticalWarningModel/Statistics/AnalysisReport?params=' + JSON.stringify(values),
    );
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
    <div className={styles.ScreenWrapper}>
      <header className={styles.header}>异常数据智能精准识别系统</header>
      <Button
        type="primary"
        size="small"
        ghost
        style={{ position: 'absolute', zIndex: 1, right: 22, top: 24, color: 'rgb(101, 217, 255)' }}
        onClick={() => {
          router.push('/DataAnalyticalWarningModel/Statistics/WarningModelAnalysis')
        }}
      >
        返回
      </Button>
      <main>
        <div className={styles.boxWrapper}>
          <BoxItem title="数据统计分析" style={{ flex: 2, marginRight: 14 }}>
            <Spin spinning={StatisForDataLoading}>
              <div className={styles.dataCountStatistics}>
                <div className={styles.countBox} onClick={() => getDataByModelGuid([])}>
                  <p className={styles.text}>异常线索统计</p>
                  <p className={styles.count}>{clueCount}</p>
                </div>
                <div className={styles.groupNums}>
                  <Row>
                    {dataCountStatistics.map(item => {
                      return (
                        <Col
                          span={8}
                          style={{ cursor: 'pointer', marginBottom: 10 }}
                          onClick={() => {
                            getDataByModelGuid(item.ModelIDList);
                          }}
                        >
                          <p className={styles.text}>
                            <i></i>
                            {item.Name}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <p className={styles.count}>
                              <span> {item.Count}</span>个
                            </p>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </div>
            </Spin>
          </BoxItem>
          <BoxItem title="线索核实情况" style={{ flex: 1, marginRight: 14, minWidth: 400 }}>
            <Spin spinning={StatisVeriAndErLoading}>
              <div className={styles.checkBox}>
                <div style={{ width: '40%', height: 200 }}>
                  <ReactEcharts
                    option={getOption()}
                    lazyUpdate
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                    // style={{ height: '700px', width: '100%' }}
                    // onEvents={onEvents}
                  />
                </div>
                <div style={{ width: '60%', paddingLeft: '5%', marginTop: 40 }}>
                  <p className={styles.legendInfo}>
                    <span style={{ background: '#0078FF' }}></span>
                    <span style={{ width: 120 }}>待核实数据</span>
                    <span className={styles.num}>{checkInfoAndEntRank.checkInfo[2].Count}个</span>
                  </p>
                  <p className={styles.legendInfo}>
                    <span style={{ background: '#21F087' }}></span>
                    <span style={{ width: 120 }}>核实为误报数据</span>
                    <span className={styles.num}>{checkInfoAndEntRank.checkInfo[0].Count}个</span>
                  </p>
                  <p className={styles.legendInfo}>
                    <span style={{ background: '#EDE022' }}></span>
                    <span style={{ width: 120 }}>核实为异常数据</span>
                    <span className={styles.num}>{checkInfoAndEntRank.checkInfo[1].Count}个</span>
                  </p>
                </div>
              </div>
            </Spin>
          </BoxItem>
          <BoxItem title="线索数量企业排名" style={{ flex: 1, minWidth: 400 }}>
            <Spin spinning={StatisVeriAndErLoading}>
              <div className={styles.entRankBox}>
                {checkInfoAndEntRank.entRank.map(item => {
                  return (
                    <div className={styles.rankItem}>
                      <div className={styles.info}>
                        <span>{item.EntName}</span>
                        <span style={{ color: '#30D8E5' }}>{item.Count}个</span>
                      </div>
                      <div className={styles.progress}>
                        <div
                          className={styles.inner}
                          style={{
                            width:
                              checkInfoAndEntRank.entMaxNum > 0
                                ? (item.Count / checkInfoAndEntRank.entMaxNum).toFixed(2) * 100 +
                                  '%'
                                : 0,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Spin>
          </BoxItem>
        </div>
        <div className={styles.boxWrapper} style={{}}>
          <BoxItem title="核实信息" style={{ flex: 1, height: 'calc(100vh - 460px)' }}>
            <div className={styles.checkInfoWrapper}>
              <Spin spinning={alertLoading}>
                <Alert
                  banner
                  message={
                    <div style={{ color: '#65D9FF', fontWeight: 500 }}>
                      已选择{selectedRowKeys.length}项{' '}
                      {`总数：发现线索${tableSelectedCount.DisCulesNum}个，已核实${tableSelectedCount.VerifiedNum}个，核实为异常${tableSelectedCount.CheckedResult2Count}个，准确率${tableSelectedCount.AccuracyRate}%；
                    涉及企业${tableSelectedCount.UniqueParentCodeCount}家，排放口${tableSelectedCount.DGIMNCount}个`}
                    </div>
                  }
                  type="info"
                  showIcon
                  style={{ marginTop: 10, background: 'rgba(20,55,120,.6)' }}
                />
              </Spin>
              <Spin spinning={tableLoading}>
                <SdlTable
                  rowKey="ModelGuid"
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={dataSource}
                  style={{ padding: 10 }}
                  bordered={false}
                  // loading={tableLoading}
                  align="center"
                  pagination={false}
                  scroll={{
                    y: 'calc(100vh - 610px)',
                  }}
                />
              </Spin>
            </div>
          </BoxItem>
        </div>
      </main>
    </div>
  );
};

export default connect(dvaPropsData)(Index);
