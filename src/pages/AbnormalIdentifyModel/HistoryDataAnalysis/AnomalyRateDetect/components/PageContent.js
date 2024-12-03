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
import CluesListModal from '@/pages/AbnormalIdentifyModel/Home/ModalPage/CluesListModal.js';
import QuestionTooltip from '@/components/QuestionTooltip';
import ExceptionProblem from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/ExceptionProblem';
import PointCluesStatistics from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/ExceptionProblem/PointCluesStatistics.js';
import { getDataTypeByConfigInfo } from '@/pages/AbnormalIdentifyModel/CONST.js';
import DataTypeSelect from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/components/DataTypeSelect.js';
import { convertTextByConfig } from '@/utils/utils';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  warningForm: AbnormalIdentifyModel.warningForm,
  // loading: loading.effects['AbnormalIdentifyModel/GetDataMissAnalysis'],
});

const PageContent = props => {
  const [form] = Form.useForm();

  const { dispatch, time, pageTitle, DGIMN, warningForm } = props;

  const [date, setDate] = useState(time || [moment().startOf('year'), moment()]); // 时间
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [regionCode, setRegionCode] = useState();
  const [entCode, setEntCode] = useState();
  const [loading, setLoading] = useState(false);
  const [barType, setBarType] = useState('rate');
  const [rateData, setRateData] = useState({
    TranEffRate: 0,
    TranInvRate: 0,
    EffRate: 0,
    InvRate: 0,
  });
  const [dataSource, setDataSource] = useState([]);
  const [dataSource2, setDataSource2] = useState([]);
  const [dataType, setDataType] = useState(props.dataType || getDataTypeByConfigInfo('region')); //region/ent/point
  const [level2PageOpen, setLevel2PageOpen] = useState(false);
  const [level2Params, setLevel2Params] = useState({});
  const [level2PageTitle, setLevel2PageTitle] = useState();
  const [pointCluesModalOpen, setPointCluesModalOpen] = useState();
  const [currentPointData, setCurrentPointData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  //
  const loadData = _dataType => {
    let bTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss');
    let eTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss');
    setLoading(true);
    dispatch({
      type: 'AbnormalIdentifyModel/GetDiagnoAnalysis',
      payload: {
        entCode: props.entCode,
        regionCode: props.regionCode,
        beginTime: bTime,
        endTime: eTime,
        dataType: _dataType || dataType,
      },
      callback: result => {
        if (result.IsSuccess) {
          setRateData(result.Datas.TranRatePie);
          setDataSource(result.Datas.TableData);
          setDataSource2(result.Datas.QuesTable);
        }
        setLoading(false);
      },
    });
  };

  const getOption1 = () => {
    let option = {
      color: ['#5cdc9f', '#fac858'],
      tooltip: {
        trigger: 'item',
        valueFormatter: function(value) {
          return value + '%';
        },
        // formatter: '{a} <br/>{b}：{c}个 ({d}%)',
      },
      series: [
        {
          name: '传输有效率',
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
              return '{b|' + params.name + '}\n{c|' + params.value + '%}\n{hr|●}';
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
              value: rateData.TranEffRate,
              name: '传输有效率',
              // itemStyle: {
              //   color: COLOR[0],
              //   opacity: 1,
              // },
            },
            {
              value: rateData.TranInvRate,
              name: '无效占比',
              // itemStyle: {
              //   color: COLOR[1],
              //   opacity: 1,
              // },
            },
          ],
        },
      ],
    };

    return option;
  };

  const getOption2 = () => {
    let option = {
      color: ['#5cdc9f', '#fac858'],
      tooltip: {
        trigger: 'item',
        valueFormatter: function(value) {
          return value + '%';
        },
      },
      series: [
        {
          name: '模型识别异常分析',
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
              return '{b|' + params.name + '}\n{c|' + params.value + '%}\n{hr|●}';
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
              name: '有效数据占比',
              value: rateData.EffRate,
            },
            {
              name: '无效占比',
              value: rateData.InvRate,
            },
          ],
        },
      ],
    };

    return option;
  };

  const getOption3 = () => {
    let seriesName0 = barType === 'rate' ? '传输有效率无效占比' : '传输有效率无效数据个数',
      seriesName1 = barType === 'rate' ? '模型识别疑似异常占比' : '模型识别异常数据个数',
      seriesData0 = [],
      seriesData1 = [],
      xData = [];
    dataSource.map(item => {
      if (barType === 'rate') {
        seriesData0.push(item.TranInvRate);
        seriesData1.push(item.ExcepRate);
      } else {
        seriesData0.push(item.InvHours);
        seriesData1.push(item.ExcepHours);
      }
      if (dataType === 'point') {
        xData.push(item.ParentName + '-' + item.Name);
      } else {
        xData.push(item.Name);
      }
    });

    let option = {
      color: ['#73c0de', '#fac858'],
      // color: ['#5cdc9f', '#fac858', '#5370c6'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        valueFormatter: function(value) {
          let unit = barType === 'rate' ? '%' : '个';
          return value + unit;
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
          name: barType === 'rate' ? '（%）' : '（个）',
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
          name: seriesName0,
          type: 'bar',
          barMaxWidth: 50,
          label: {
            show: true,
            position: 'inside',
            // color: '#fff',
            formatter: '{c}%',
          },
          data: seriesData0,
        },
        {
          name: seriesName1,
          type: 'bar',
          barMaxWidth: 50,
          label: {
            show: true,
            position: 'inside',
            // color: '#fff',
            formatter: '{c}%',
          },
          data: seriesData1,
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
        title: '传输有效率',
        children: [
          {
            title: (
              <span>
                传输有效率
                <QuestionTooltip content="传输率 * 有效率" />
              </span>
            ),
            dataIndex: 'TranEffRate',
            key: 'TranEffRate',
            align: 'center',
            showSorterTooltip: false,
            sorter: (a, b) => a.TranEffRate - b.TranEffRate,
            render: text => {
              return text + '%';
            },
          },
          {
            title: (
              <span>
                无效占比
                <QuestionTooltip content="100% - 传输有效率" />
              </span>
            ),
            dataIndex: 'TranInvRate',
            key: 'TranInvRate',
            align: 'center',
            showSorterTooltip: false,
            sorter: (a, b) => a.TranInvRate - b.TranInvRate,
            render: text => {
              return text + '%';
            },
          },
          {
            title: (
              <span>
                无效数据个数
                <QuestionTooltip content="传输个数 - 有效个数" />
              </span>
            ),
            dataIndex: 'InvHours',
            key: 'InvHours',
            align: 'center',
            showSorterTooltip: false,
            sorter: (a, b) => a.InvHours - b.InvHours,
          },
        ],
      },
      {
        title: '模型识别异常',
        children: [
          {
            title: (
              <span>
                疑似异常占比
                <QuestionTooltip content="异常时长 / 运行时长 * 100%" />
              </span>
            ),
            dataIndex: 'ExcepRate',
            key: 'ExcepRate',
            align: 'center',
            showSorterTooltip: false,
            sorter: (a, b) => a.ExcepRate - b.ExcepRate,
            render: (text, row) => {
              return <a onClick={() => onEnterSecondaryPage(row)}>{text} %</a>;
            },
          },
          {
            title: (
              <span>
                异常数据个数
                <QuestionTooltip content="运行个数 - 正常个数" />
              </span>
            ),
            dataIndex: 'ExcepHours',
            key: 'ExcepHours',
            align: 'center',
            showSorterTooltip: false,
            sorter: (a, b) => a.ExcepHours - b.ExcepHours,
          },
        ],
      },
      {
        title: '主要异常问题',
        dataIndex: 'Reason',
        key: 'Reason',
        ellipsis: true,
        width: 400,
        showSorterTooltip: false,
        render: Reason => <Tooltip title={Reason}>{Reason}</Tooltip>,
      },
    ];
    return columns;
  };

  const getColumns2 = () => {
    const columns = [
      {
        title: '序号',
      },
      {
        title: '异常场景',
        dataIndex: 'ModelName',
        key: 'ModelName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '异常次数',
        dataIndex: 'WarningCount',
        key: 'WarningCount',
        width: 100,
        sorter: (a, b) => a.WarningCount - b.WarningCount,
      },
      {
        title: '异常小时数',
        dataIndex: 'OccurrenceCount',
        key: 'OccurrenceCount',
        width: 100,
        sorter: (a, b) => a.OccurrenceCount - b.OccurrenceCount,
      },
      {
        title: '涉及排放口数量',
        dataIndex: 'UniqueDGIMNCount',
        key: 'UniqueDGIMNCount',
        width: 160,
        sorter: (a, b) => a.UniqueDGIMNCount - b.UniqueDGIMNCount,
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                setPointCluesModalOpen(true);
                setCurrentPointData(record);
              }}
            >
              {text}
            </a>
          );
        },
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

  // 进入二级页面
  const onEnterSecondaryPage = row => {
    let typeName = '',
      params = {};
    switch (dataType) {
      case 'region':
        typeName = row.Name;
        params = {
          regionCode: row.Key,
          date: date,
        };
        break;
      case 'ent':
        typeName = row.Name;
        params = {
          entCode: row.Key,
          date: date,
        };
        break;
      case 'point':
        typeName = row.ParentName + ' - ' + row.Name;
        params = {
          dgimn: row.Key,
          entCode: row.ParentKey,
          date: date,
        };
        break;
    }
    setLevel2Params(params);
    let bTime = moment(date[0]).format('YYYY-MM-DD');
    let eTime = moment(date[1]).format('YYYY-MM-DD');
    setLevel2PageTitle(`${typeName}（${bTime} - ${eTime}）`);
    setLevel2PageOpen(true);
    // dgimn: '',
    // entCode: '',
    // regionCode: '',
    // beginTime: '2024-01-23',
    // endTime: '2024-07-23',
    // modelExcepLevel: '',
    // modelExcepType: '',
    // modelExcepAction: '',
    // modelGuid: '',
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
      <Row gutter={[0, 16]} style={{ height: 320, marginTop: 8 }}>
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
            title={<div className="innerCardTitle">传输有效率分析（标准）</div>}
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
            title={<div className="innerCardTitle">传输有效率分析（模型）</div>}
          >
            <ReactEcharts
              option={getOption2()}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </Col>
        <Col span={10} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">异常问题分布</div>}
          >
            <SdlTable
              size="small"
              loading={loading}
              align="center"
              columns={getColumns2()}
              dataSource={dataSource2}
              pagination={false}
              scroll={{ y: 180 }}
            />
          </Card>
        </Col>
      </Row>
      <Card
        loading={loading}
        style={{
          height: 300,
          marginTop: 8,
        }}
        bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
        title={<div className="innerCardTitle">{dataTypeName}疑似异常占比分析</div>}
        extra={
          <Radio.Group
            size="small"
            onChange={e => {
              setBarType(e.target.value);
            }}
            defaultValue={barType}
          >
            <Radio.Button value="rate">无效数据占比</Radio.Button>
            <Radio.Button value="num">无效数据个数</Radio.Button>
          </Radio.Group>
        }
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
      <Card
        style={{ marginTop: 8 }}
        bodyStyle={{ padding: '10px 24px' }}
        title={<div className="innerCardTitle">{dataTypeName}疑似异常占比分析</div>}
      >
        <SdlTable
          loading={loading}
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: '400px' }}
        />
      </Card>
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
          <WorkingAnalysis regionCode={regionCode} entCode={entCode} time={date} />
        </Modal>
      )}
      <CluesListModal
        // history={props.history}
        open={isModalOpen2}
        onCancel={() => setIsModalOpen2(false)}
      />
      {level2PageOpen && (
        <ExceptionProblem
          title={level2PageTitle}
          reqParams={level2Params}
          open={level2PageOpen}
          onCancel={() => setLevel2PageOpen(false)}
        />
      )}

      {pointCluesModalOpen && (
        <PointCluesStatistics
          open={pointCluesModalOpen}
          onCancel={() => setPointCluesModalOpen(false)}
          data={currentPointData}
          reqParams={{
            date: date
          }}
        />
      )}
    </div>
  );
};

export default connect(dvaPropsData)(PageContent);
