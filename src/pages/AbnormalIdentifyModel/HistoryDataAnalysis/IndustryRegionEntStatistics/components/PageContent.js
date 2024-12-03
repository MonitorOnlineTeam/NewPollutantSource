import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Tooltip, Button, Form, InputNumber, message } from 'antd';
import styles from '../../../styles.less';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import ReactEcharts from 'echarts-for-react';
import ExceptionProblem from '@/pages/AbnormalIdentifyModel/HistoryDataAnalysis/ExceptionProblem';
import { convertTextByConfig } from '@/utils/utils';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  loading: loading.effects['AbnormalIdentifyModel/GetExcepDataAnalysis'],
});

const PageContent = props => {
  const [form] = Form.useForm();

  const { dispatch, loading, dataType, time, regionCode, entCode } = props;

  const [date, setDate] = useState(time || [moment().startOf('year'), moment()]); // 时间
  const [dataSource, setDataSource] = useState([]);
  const [rank, setRank] = useState(10);
  const [level2PageOpen, setLevel2PageOpen] = useState(false);
  const [level2Params, setLevel2Params] = useState({});
  const [level2PageTitle, setLevel2PageTitle] = useState();

  useEffect(() => {
    loadData();
  }, [dataType]);

  //
  const loadData = () => {
    if (dataType === 'point' && !rank) {
      message.error('异常排名不能为空!');
      return;
    }

    let bTime = moment(date[0]).format('YYYY-MM-DD HH:mm:ss');
    let eTime = moment(date[1]).format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'AbnormalIdentifyModel/GetExcepDataAnalysis',
      payload: {
        regionCode,
        entCode,
        beginTime: bTime,
        endTime: eTime,
        dataType: dataType,
        rank: dataType === 'point' ? rank : undefined,
      },
      callback: result => {
        setDataSource(result.TableData);
      },
    });
  };

  const getOption3 = () => {
    let seriesData0 = [],
      seriesData1 = [],
      xData = [];
    dataSource.map(item => {
      seriesData0.push(item.ExcepRate);
      seriesData1.push(item.ExcepNums || item.ExcepHours);
      xData.push(item.Name);
    });

    let option = {
      color: ['#fc8452', '#fac858'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        formatter: function(params) {
          var tooltipText = params[0].axisValueLabel + '<br/>';
          params.forEach(function(param) {
            var unit = param.seriesType === 'line' ? '小时' : '%';
            tooltipText +=
              param.marker + ' ' + param.seriesName + '：' + param.value + unit + '<br/>';
          });
          return tooltipText;
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
            textStyle: {
              color: '#383838',
            },
          },
          data: xData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '（%）',
          max: 100,
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
          name: '异常率',
          type: 'bar',
          barMaxWidth: 50,
          label: {
            show: true,
            position: 'inside',
            color: '#fff',
            formatter: '{c}%',
          },
          data: seriesData0,
        },
        {
          name: '异常小时数',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          label: {
            show: true,
            position: 'top',
          },
          data: seriesData1,
        },
      ],
    };

    return option;
  };

  const getColumns = () => {
    const columns = [
      {
        title: dataType === 'indus' ? '行业' : '区域',
        dataIndex: 'Name',
        key: 'Name',
      },
      {
        title: '异常率',
        dataIndex: 'ExcepRate',
        key: 'ExcepRate',
        align: 'center',
        sorter: (a, b) => a.ExcepRate - b.ExcepRate,
        render: (text, row) => {
          return <a onClick={() => onEnterSecondaryPage(row)}>{text} %</a>;
        },
      },
      {
        title: '异常次数',
        dataIndex: 'ExcepNums',
        key: 'ExcepNums',
        align: 'center',
        sorter: (a, b) => a.ExcepNums - b.ExcepNums,
        render: (text, row) => {
          return <a onClick={() => onEnterSecondaryPage(row)}>{text}</a>;
        },
      },
      {
        title: '异常小时数',
        dataIndex: 'ExcepHours',
        key: 'ExcepHours',
        align: 'center',
        sorter: (a, b) => a.ExcepHours - b.ExcepHours,
        render: (text, row) => {
          return <a onClick={() => onEnterSecondaryPage(row)}>{text}</a>;
        },
      },
      {
        title: '主要异常问题',
        dataIndex: 'Reason',
        key: 'Reason',
        ellipsis: true,
        width: 400,
        render: Reason => <Tooltip title={Reason}>{Reason}</Tooltip>,
      },
    ];
    return columns;
  };

  const getColumn2 = () => {
    const columns = [
      {
        title: '排名',
        width: 60,
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: convertTextByConfig('企业'),
        dataIndex: 'ParentName',
        key: 'ParentName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '排放口',
        dataIndex: 'Name',
        key: 'Name',
        width: 200,
        ellipsis: true,
      },
      {
        title: '疑似异常率',
        dataIndex: 'ExcepRate',
        key: 'ExcepRate',
        align: 'center',
        sorter: (a, b) => a.ExcepRate - b.ExcepRate,
        render: (text, row) => {
          return <a onClick={() => onEnterSecondaryPage(row)}>{text} %</a>;
        },
      },
      {
        title: '异常小时数',
        dataIndex: 'ExcepHours',
        key: 'ExcepHours',
        align: 'center',
        sorter: (a, b) => a.ExcepHours - b.ExcepHours,
        render: (text, row) => {
          return <a onClick={() => onEnterSecondaryPage(row)}>{text}</a>;
        },
      },
      {
        title: '运行率',
        dataIndex: 'RunRate',
        key: 'RunRate',
        align: 'center',
        sorter: (a, b) => a.RunRate - b.RunRate,
        render: text => {
          return text + '%';
        },
      },
      {
        title: '停炉小时数',
        dataIndex: 'StopHour',
        key: 'StopHour',
        align: 'center',
        sorter: (a, b) => a.StopHour - b.StopHour,
      },
      {
        title: '运行小时数',
        dataIndex: 'RunHour',
        key: 'RunHour',
        align: 'center',
        sorter: (a, b) => a.RunHour - b.RunHour,
      },
      {
        title: '总小时数',
        dataIndex: 'AllHour',
        key: 'AllHour',
        align: 'center',
        sorter: (a, b) => a.AllHour - b.AllHour,
      },
      {
        title: '异常问题',
        dataIndex: 'Reason',
        key: 'Reason',
        ellipsis: true,
        width: 400,
        render: Reason => <Tooltip title={Reason}>{Reason}</Tooltip>,
      },
    ];
    return columns;
  };

  let title1 = '',
    title2 = '';
  switch (dataType) {
    case 'indus':
      title1 = '行业异常分析';
      title2 = '行业异常分析详情';
      break;
    case 'region':
      title1 = '区域异常分析';
      title2 = '区域异常分析详情';
      break;
    case 'point':
      // title1 = '重点异常企业分析';
      // title2 = '重点异常企业名单';
      title1 = '重点异常分析';
      title2 = '重点异常名单';
      break;
  }

  // 进入二级页面
  const onEnterSecondaryPage = row => {
    let typeName = '',
      params = {};
    switch (dataType) {
      case 'indus':
        typeName = row.Name + '行业';
        params = {
          IndustryType: row.Key,
          date: date,
        };
        break;
      case 'region':
        typeName = row.Name;
        params = {
          regionCode: row.Key,
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
      <Card bodyStyle={{ padding: '12px 24px' }}>
        <Form
          form={form}
          layout="inline"
          initialValues={{
            date: date,
            rank: rank,
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
          {dataType === 'point' && (
            <Form.Item label="异常排名" name="rank">
              <InputNumber
                min={1}
                style={{ width: 200 }}
                placeholder="请输入异常率低于xx名"
                allowClear={false}
                onChange={value => {
                  setRank(value);
                }}
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" loading={loading} onClick={() => loadData()}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card
        loading={loading}
        style={{
          height: 340,
          marginTop: 8,
        }}
        bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
        title={<div className="innerCardTitle">{title1}</div>}
      >
        <ReactEcharts
          option={getOption3()}
          style={{ height: 'calc(100%)' }}
          className="echarts-for-echarts"
          theme="my_theme"
          onEvents={{
            click: event => {
              const { dataIndex } = event;
              onEnterSecondaryPage(dataSource[dataIndex]);
            },
          }}
        />
      </Card>
      <Card
        style={{ marginTop: 8 }}
        bodyStyle={{ padding: '10px 24px' }}
        title={<div className="innerCardTitle">{title2}</div>}
      >
        <SdlTable
          loading={loading}
          align="center"
          columns={dataType === 'point' ? getColumn2() : getColumns()}
          dataSource={dataSource}
          pagination={false}
          // scroll={{ y: '400px' }}
        />
      </Card>
      {level2PageOpen && (
        <ExceptionProblem
          title={level2PageTitle}
          reqParams={level2Params}
          open={level2PageOpen}
          onCancel={() => setLevel2PageOpen(false)}
        />
      )}
    </div>
  );
};

export default connect(dvaPropsData)(PageContent);
