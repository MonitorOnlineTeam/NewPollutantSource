import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Alert, Tooltip, Spin, Button, Progress, Modal, DatePicker, Select } from 'antd';
import styles from './styles.less';
import BoxItem from './BoxItem';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import _ from 'lodash';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';
import { RollbackOutlined, CalendarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ModalNameConversion } from '@/pages/DataAnalyticalWarningModel/CONST';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;

const DateOptions = [
  {
    value: [moment().startOf('month'), moment().endOf('months')],
    label: '本月',
  },
  {
    value: [moment().startOf('year'), moment().endOf('years')],
    label: '本年',
  },
  {
    value: [moment().format(`YYYY-01-01`), moment().format(`YYYY-06-30`)],
    label: '上半年',
  },
  {
    value: [moment().format(`YYYY-07-01`), moment().endOf('years')],
    label: '下半年',
  },
  {
    value: [
      moment()
        .startOf('year')
        .quarter(1)
        .startOf('quarter'),
      moment()
        .startOf('year')
        .quarter(1)
        .endOf('quarter'),
    ],
    label: '一季度',
  },
  {
    value: [
      moment()
        .startOf('year')
        .quarter(2)
        .startOf('quarter'),
      moment()
        .startOf('year')
        .quarter(2)
        .endOf('quarter'),
    ],
    label: '二季度',
  },
  {
    value: [
      moment()
        .startOf('year')
        .quarter(3)
        .startOf('quarter'),
      moment()
        .startOf('year')
        .quarter(3)
        .endOf('quarter'),
    ],
    label: '三季度',
  },
  {
    value: [
      moment()
        .startOf('year')
        .quarter(4)
        .startOf('quarter'),
      moment()
        .startOf('year')
        .quarter(4)
        .endOf('quarter'),
    ],
    label: '四季度',
  },
  {
    value: [
      moment()
        .subtract(1, 'year')
        .startOf('year'),
      moment()
        .subtract(1, 'year')
        .endOf('year'),
    ],
    label: '去年',
  },
  {
    value: [
      moment()
        .subtract(2, 'year')
        .startOf('year'),
      moment()
        .subtract(2, 'year')
        .endOf('year'),
    ],
    label: '前年',
  },
];

// 获取默认时间
const getDefaultDate = timeFlag => {
  let beginTime, endTime;
  switch (timeFlag) {
    case 'before':
      beginTime = moment().subtract(10, 'year');
      endTime = moment('2023-06').endOf('month');
      break;
    case 'after':
      beginTime = moment('2023-07').startOf('month');
      endTime = moment();
      break;
    default:
      // beginTime = moment().subtract(1, 'year');
      beginTime = moment().startOf('year');
      endTime = moment();
      break;
  }
  return [beginTime, endTime];
};

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
    tableLoading,
    alertLoading,
    StatisVeriAndErLoading,
    StatisForDataLoading,
  } = props;
  const [queryDate, setQueryDate] = useState(getDefaultDate(props.location.query.timeFlag));
  const _SELF = {
    queryDate: queryDate,
    queryDateLabel: '本年',
  };

  const [visible, setVisible] = useState(false);
  const [queryDateLabel, setQueryDateLabel] = useState('本年');
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataCountStatistics, setDataCountStatistics] = useState([]); // 数据统计分析数据
  const [clueCount, setClueCount] = useState(0); // 线索总数
  const [selectedModelGuid, setSelectedModelGuid] = useState([]); // 选中的ModelGuid
  const [checkInfoAndEntRank, setCheckInfoAndEntRank] = useState({
    checkInfo: [{}, {}, {}], //线索核实情况
    entRank: [], // 企业排名
    checkInfoMaxNum: 0,
  }); // 线索核实情况和企业排名
  const [tableSelectedCount, setTableSelectedCount] = useState({
    DisCulesNum: 0,
    VerifiedNum: 0,
    CheckedResult2Count: 0,
    AccuracyRate: '0',
    UniqueParentCodeCount: 0,
    DGIMNCount: 0,
    VerifiedRate: 0,
  });

  useEffect(() => {
    StatisForData();
    loadData();
  }, [selectedModelGuid, queryDate]);

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
        let max = 0;
        if (res.finalResult.length) {
          max = _.maxBy(res.finalResult, 'Count').Count;
        }
        setCheckInfoAndEntRank({
          checkInfo: res.finalResult, //线索核实情况
          // entRank: res.reasonResult, // 企业排名
          checkInfoMaxNum: max + max * 0.1,
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
            VerifiedRate: 0,
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
        VerifiedRate: 0,
      });
    }
  };

  // 获取请求参数
  const getRequestBody = () => {
    let beginTime, endTime;
    beginTime = moment(queryDate[0]).format('YYYY-MM-DD 00:00:00');
    endTime = moment(queryDate[1]).format('YYYY-MM-DD 23:59:59');
    return {
      beginTime: beginTime,
      endTime: endTime,
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
          name: '异常线索核实情况',
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
              fontSize: 18,
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
        let _text = ModalNameConversion(text);
        return (
          <Tooltip title={_text}>
            <span className={styles.textOverflow}>{_text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '发现线索数量',
      dataIndex: 'DisCulesNum',
      ellipsis: true,
      sorter: (a, b) => a.DisCulesNum - b.DisCulesNum,
    },
    {
      title: '已核实数量',
      ellipsis: true,
      dataIndex: 'VerifiedNum',
      sorter: (a, b) => a.VerifiedNum - b.VerifiedNum,
    },
    // {
    //   title: '核实为异常个数',
    //   ellipsis: true,
    //   dataIndex: 'CheckedResult2Count',
    //   sorter: (a, b) => a.CheckedResult2Count - b.CheckedResult2Count,
    // },
    // {
    //   title: '准确率',
    //   ellipsis: true,
    //   dataIndex: 'AccuracyRate',
    //   sorter: (a, b) => a.AccuracyRate - b.AccuracyRate,
    //   render: (text, record) => {
    //     return text + '%';
    //   },
    // },
    {
      title: '核实率',
      ellipsis: true,
      dataIndex: 'VerifiedRate',
      sorter: (a, b) => a.VerifiedRate - b.VerifiedRate,
      render: (text, record) => {
        return text + '%';
      },
    },
    {
      title: '待整改数量',
      ellipsis: true,
      dataIndex: 'RectRecordNum',
      sorter: (a, b) => a.RectRecordNum - b.RectRecordNum,
    },
    {
      title: '已整改数量',
      ellipsis: true,
      dataIndex: 'RectedNum',
      sorter: (a, b) => a.RectedNum - b.RectedNum,
    },
    {
      title: '整改率',
      ellipsis: true,
      dataIndex: 'RectRate',
      sorter: (a, b) => a.RectRate - b.RectRate,
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
      title: '排口',
      ellipsis: true,
      dataIndex: 'DGIMNCount',
      sorter: (a, b) => a.DGIMNCount - b.DGIMNCount,
    },
    // {
    //   title: '异常原因',
    //   dataIndex: 'ExceptionReason',
    //   ellipsis: true,
    //   width: 200,
    //   render: (text, record) => {
    //     let _text = text || '-';
    //     return (
    //       <Tooltip title={_text}>
    //         <span>{_text}</span>
    //       </Tooltip>
    //     );
    //   },
    // },
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
    router.push(
      '/DataAnalyticalWarningModel/Statistics/AnalysisReport?params=' + JSON.stringify(values),
    );
  };

  const renderProgress = () => {
    let el = '';
    for (let index = 0; index < 50; index++) {
      el += <li></li>;
    }
    console.log('el', el);
    return el;
  };

  const onSelectChange = newSelectedRowKeys => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const confirm = () => {
    let beginTime, endTime;
    beginTime = moment(queryDate[0]).format('YYYY-MM-DD');
    endTime = moment(queryDate[1]).format('YYYY-MM-DD');
    Modal.confirm({
      title: '看板时间选择',
      icon: <ExclamationCircleOutlined />,
      content: (
        // <RangePicker
        //   locale={locale}
        //   allowClear={false}
        //   defaultValue={_SELF.queryDate}
        //   onChange={date => {
        //     _SELF.queryDate = date;
        //   }}
        // />
        <>
          <Row align="middle" style={{ fontSize: 12, color: '#878282', marginBottom: 10 }}>
            {/* <ExclamationCircleOutlined style={{ marginBottom: 2, marginRight: 10 }} /> */}
            <span>
              当前数据时间：{queryDateLabel}（{beginTime} - {endTime}）
            </span>
          </Row>
          <Select
            placeholder="请选择时间"
            style={{
              width: 200,
            }}
            onChange={(value, option) => {
              let date = option['data-date'];
              _SELF.queryDate = date;
              _SELF.queryDateLabel = value;
            }}
          >
            {DateOptions.map((item, index) => {
              return (
                <Option key={index} value={item.label} data-date={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </>
      ),
      okText: '查询',
      cancelText: '取消',
      onOk() {
        setQueryDate(_SELF.queryDate);
        setQueryDateLabel(_SELF.queryDateLabel);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // console.log('_SELF.queryDate1',  moment(_SELF.queryDate[0]).format('YYYY-MM-DD 00:00:00'))
  // console.log('_SELF.queryDate2',  moment(_SELF.queryDate[1]).format('YYYY-MM-DD 23:59:59'))
  return (
    <div className={styles.ScreenWrapper}>
      <header className={styles.header}>
        异常数据智能精准识别系统
        <div className={styles.SelectWrapper} style={{ top: 26 }}>
          <Select
            value={queryDateLabel}
            placeholder="请选择时间"
            style={{
              width: 160,
            }}
            onChange={(value, option) => {
              let date = option['data-date'];
              setQueryDate(date);
              setQueryDateLabel(value);
            }}
            popupClassName={styles.popupStyle}
          >
            {DateOptions.map((item, index) => {
              return (
                <Option key={index} value={item.label} data-date={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </div>
        <Tooltip title="返回">
          <RollbackOutlined
            style={{
              position: 'absolute',
              zIndex: 1,
              border: '2px solid rgb(49 97 141)',
              fontSize: 16,
              padding: 4,
              cursor: 'pointer',
              fontWeight: 'bold',
              right: 22,
              top: 34,
              color: 'rgb(101, 217, 255)',
            }}
            onClick={() => {
              router.push('/DataAnalyticalWarningModel/Statistics/FluctuateRange');
            }}
          />
        </Tooltip>
      </header>
      {/* <Button
        type="primary"
        size="small"
        ghost
        onClick={() => {
          router.push('/DataAnalyticalWarningModel/Statistics/WarningModelAnalysis');
        }}
      >
        返回
      </Button> */}

      {/* <Tooltip title="看板时间选择">
        <CalendarOutlined
          style={{
            position: 'absolute',
            zIndex: 1,
            border: '2px solid rgb(49 97 141)',
            fontSize: 16,
            padding: 4,
            cursor: 'pointer',
            fontWeight: 'bold',
            right: 62,
            top: 34,
            color: 'rgb(101, 217, 255)',
          }}
          onClick={confirm}
          // onClick={() => setVisible(true)}
        />
      </Tooltip> */}

      <main>
        <div className={styles.boxWrapper}>
          <BoxItem title={<>异常线索统计分析</>} style={{ flex: 1, marginRight: 14 }}>
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
                          style={{ cursor: 'pointer', marginBottom: 30 }}
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
          {/* <BoxItem title="线索核实情况" style={{ flex: 1, marginRight: 14, minWidth: 400 }}> */}
          <BoxItem title="异常线索核实情况" style={{ width: '40%', minWidth: 400 }}>
            <Spin spinning={StatisVeriAndErLoading}>
              <div className={styles.checkBox}>
                <div className={styles.legendInfo}>
                  <p style={{ width: 150, fontWeight: 'bold', marginBottom: 0 }}>
                    {/* 核实为误报线索 */}
                    核实存在异常
                  </p>
                  <div className={styles.content}>
                    <Progress
                      style={{ width: '100%' }}
                      strokeWidth={18}
                      percent={
                        checkInfoAndEntRank.checkInfo[0].Count
                          ? (
                              checkInfoAndEntRank.checkInfo[0].Count /
                              checkInfoAndEntRank.checkInfoMaxNum
                            ).toFixed(2) *
                              100 >
                            2
                            ? (
                                checkInfoAndEntRank.checkInfo[0].Count /
                                checkInfoAndEntRank.checkInfoMaxNum
                              ).toFixed(2) * 100
                            : 2
                          : 0
                      }
                      steps={50}
                      showInfo={false}
                      strokeColor={'#EBE051'}
                      trailColor="rgba(52,84,119,.85)"
                    />
                    <span className={styles.num}>{checkInfoAndEntRank.checkInfo[0].Count}个</span>
                    <p className={styles.ent}>
                      涉及企业
                      <span className={styles.entCount}>
                        {checkInfoAndEntRank.checkInfo[0].EntCount}个
                      </span>
                    </p>
                  </div>
                </div>
                <div className={styles.legendInfo}>
                  <p style={{ width: 150, fontWeight: 'bold', marginBottom: 0 }}>待核实线索</p>
                  <div className={styles.content}>
                    <Progress
                      style={{ width: '100%' }}
                      strokeWidth={18}
                      percent={
                        checkInfoAndEntRank.checkInfo[2].Count
                          ? (
                              checkInfoAndEntRank.checkInfo[2].Count /
                              checkInfoAndEntRank.checkInfoMaxNum
                            ).toFixed(2) *
                              100 >
                            2
                            ? (
                                checkInfoAndEntRank.checkInfo[2].Count /
                                checkInfoAndEntRank.checkInfoMaxNum
                              ).toFixed(2) * 100
                            : 2
                          : 0
                      }
                      steps={50}
                      showInfo={false}
                      trailColor="rgba(52,84,119,.85)"
                    />
                    <span className={styles.num}>{checkInfoAndEntRank.checkInfo[2].Count}个</span>
                    <p className={styles.ent}>
                      涉及企业
                      <span className={styles.entCount}>
                        {checkInfoAndEntRank.checkInfo[2].EntCount}个
                      </span>
                    </p>
                  </div>
                </div>
                <div className={styles.legendInfo}>
                  <p style={{ width: 150, fontWeight: 'bold', marginBottom: 0 }}>
                    {/* 核实为异常线索 */}
                    核实无异常
                  </p>
                  <div className={styles.content}>
                    <Progress
                      style={{ width: '100%' }}
                      strokeWidth={18}
                      percent={
                        checkInfoAndEntRank.checkInfo[1].Count
                          ? (
                              checkInfoAndEntRank.checkInfo[1].Count /
                              checkInfoAndEntRank.checkInfoMaxNum
                            ).toFixed(2) *
                              100 >
                            2
                            ? (
                                checkInfoAndEntRank.checkInfo[1].Count /
                                checkInfoAndEntRank.checkInfoMaxNum
                              ).toFixed(2) * 100
                            : 2
                          : 0
                      }
                      steps={50}
                      showInfo={false}
                      strokeColor={'#72ED91'}
                      trailColor="rgba(52,84,119,.85)"
                    />
                    <span className={styles.num}>{checkInfoAndEntRank.checkInfo[1].Count}个</span>
                    <p className={styles.ent}>
                      涉及企业
                      <span className={styles.entCount}>
                        {checkInfoAndEntRank.checkInfo[1].EntCount}个
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Spin>
          </BoxItem>
          {/* <BoxItem title="线索数量企业排名" style={{ flex: 1, minWidth: 400 }}>
            <Spin spinning={StatisVeriAndErLoading}>
              <div className={styles.entRankBox}>
                {checkInfoAndEntRank.entRank.length ? (
                  checkInfoAndEntRank.entRank.map(item => {
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
                  })
                ) : (
                  <p
                    style={{
                      color: '#71cdf9',
                      textAlign: 'center',
                      marginTop: 20,
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}
                  >
                    暂无数据
                  </p>
                )}
              </div>
            </Spin>
          </BoxItem> */}
        </div>
        <div className={styles.boxWrapper} style={{ marginBottom: 0 }}>
          <BoxItem
            title="核实信息"
            style={{ flex: 1, height: 'calc(100vh - 440px)', minHeight: 400, width: '100%' }}
            bodyStyle={{ height: 'calc(100% - 44px)' }}
          >
            <div className={styles.checkInfoWrapper} style={{ height: '100%' }}>
              {/* <Spin spinning={alertLoading}> */}
              <Alert
                banner
                message={
                  <div style={{ color: '#65D9FF', fontWeight: 500, fontSize: 16 }}>
                    已选择{selectedRowKeys.length}项&nbsp;&nbsp;&nbsp;&nbsp;
                    {/* {`总数：发现线索${tableSelectedCount.DisCulesNum}个，已核实${tableSelectedCount.VerifiedNum}个，
                      核实为异常${tableSelectedCount.CheckedResult2Count}个，
                      核实率${tableSelectedCount.VerifiedRate}%；
                    涉及企业${tableSelectedCount.UniqueParentCodeCount}家，排放口${tableSelectedCount.DGIMNCount}个`} */}
                    {`总数：发现线索${tableSelectedCount.DisCulesNum}个，已核实${tableSelectedCount.VerifiedNum}个，
                      核实无异常${tableSelectedCount.CheckedResult2Count}个，
                      核实率${tableSelectedCount.VerifiedRate}%；
                    涉及企业${tableSelectedCount.UniqueParentCodeCount}家，排放口${tableSelectedCount.DGIMNCount}个`}
                  </div>
                }
                type="info"
                showIcon
                style={{ marginTop: 0, background: 'rgba(20,55,120,.6)' }}
              />
              <div className={styles.tableWrapper}>
                <SdlTable
                  rowKey="ModelGuid"
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={dataSource}
                  style={{ padding: 10, paddingTop: 0 }}
                  bordered={false}
                  loading={tableLoading}
                  align="center"
                  pagination={false}
                  scroll={{
                    x: 'max-content',
                    y: 'calc(100% - 50px)',
                  }}
                />
              </div>
              {/* </Spin> */}
            </div>
          </BoxItem>
        </div>
        <Modal
          title="选择时间"
          visible={visible}
          // onOk={handleOk}
          onCancel={() => setVisible(false)}
        ></Modal>
      </main>
    </div>
  );
};

export default connect(dvaPropsData)(Index);
