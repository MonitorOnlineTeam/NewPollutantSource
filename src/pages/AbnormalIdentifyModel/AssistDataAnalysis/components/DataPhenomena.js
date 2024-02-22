/*
 * @Author: JiaQi
 * @Date: 2024-01-18 15:08:40
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-02-22 09:20:30
 * @Description:  数据现象
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Radio, Select, Space, Popover, Badge, message } from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import { WarningOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

let tempSelectedNames = [];
let tempSelectPollutantList = [];

const dvaPropsData = ({ loading, common, AbnormalIdentifyModel }) => ({
  pollutantListByDgimn: common.pollutantListByDgimn,
  DataPhenomenaChartList: AbnormalIdentifyModel.DataPhenomenaChartList,
  DataPhenomenaTableList: AbnormalIdentifyModel.DataPhenomenaTableList,
  loading: loading.effects['AbnormalIdentifyModel/GetHourDataForPhenomenon'],
});

const DataPhenomena = props => {
  const [form] = Form.useForm();

  const [showType, setShowType] = useState('chart');
  const [columns, setColumns] = useState([]);
  const [selectPollutantList, SetSelectPollutantList] = useState([]);

  const {
    dispatch,
    DGIMN,
    pollutantListByDgimn,
    DataPhenomenaChartList,
    DataPhenomenaTableList,
    date,
    echartBoxHeight,
    tableHeight,
    loading,
  } = props;

  useEffect(() => {
    DGIMN && getPollutantListByDgimn();
  }, [DGIMN]);

  // 根据mn获取污染物
  const getPollutantListByDgimn = () => {
    dispatch({
      type: 'common/getPollutantListByDgimn',
      payload: {
        DGIMNs: DGIMN,
      },
      callback: res => {
        let pollutantCodes = res.map(item => {
          return item.PollutantCode;
        });

        tempSelectPollutantList = res;
        SetSelectPollutantList(res);
        // setUnits(units);
        form.setFieldsValue({ pollutantCodes: pollutantCodes });
        GetHourDataForPhenomenon();
        getColumns(res);
      },
    }).then(() => {});
  };

  // 获取数据现象
  const GetHourDataForPhenomenon = () => {
    let values = form.getFieldsValue();
    dispatch({
      type: 'AbnormalIdentifyModel/GetHourDataForPhenomenon',
      payload: {
        DGIMNs: DGIMN,
        beginTime: moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        pollutantCodes: values.pollutantCodes,
        isAsc: true,
        IsSupplyData: false,
        PhenomenonType: values.PhenomenonType,
      },
    });
  };

  // 获取表头
  const getColumns = pollutantList => {
    let columns = [
      {
        title: '时间',
        dataIndex: 'MonitorTime',
        key: 'MonitorTime',
        fixed: 'left',
      },
    ];
    pollutantList.map(item => {
      // if (
      //   item.PollutantCode === '01' ||
      //   item.PollutantCode === '02' ||
      //   item.PollutantCode === '03'
      // ) {
      columns.push({
        title: (
          <>
            {item.PollutantName}
            <br />({item.Unit})
          </>
        ),
        dataIndex: item.PollutantCode,
        key: item.PollutantCode,
        render: (text, record) => {
          let color = 'rgba(0, 0, 0, 0.85)';
          let _text = record[item.PollutantCode + '_ME'];
          let content = '';

          let icon = '';

          if (_text && _text !== 0 && _text !== '-') {
            color = 'red';
            let PhenomenonType = form.getFieldValue('PhenomenonType');
            if (PhenomenonType === '1') {
              _text = '零值';
            } else if (PhenomenonType === '2') {
              _text = '恒值';
            } else if (PhenomenonType === '3') {
              if (_text == 1) {
                // name = '陡升';
                icon = <ArrowUpOutlined />;
              } else {
                // name = '陡降';
                icon = <ArrowDownOutlined />;
              }
              _text = '陡变';
            }

            content = (
              <div>
                <div style={{ marginBottom: 10 }}>
                  <WarningOutlined style={{ color: '#faad14', fontSize: 25, marginRight: 10 }} />
                  <span style={{ fontWeight: 'Bold', fontSize: 16 }}>数据现象</span>
                </div>
                <li style={{ listStyle: 'none', marginBottom: 10 }}>
                  <Badge status="error" text={`${_text}`} />
                </li>
              </div>
            );
          }
          if (content)
            return (
              <Popover content={content}>
                <div style={{ color: color }}>
                  {text}
                  <span style={{ position: 'absolute', right: 4 }}>{icon}</span>
                </div>
              </Popover>
            );

          return text || '-';
        },
      });
      // // 非折算
      // if (item.PollutantCode.indexOf('zs') === -1) {
      //   columns.push({
      //     title: (
      //       <>
      //         {item.PollutantName}
      //         <br />
      //         数据标记
      //       </>
      //     ),
      //     dataIndex: item.PollutantCode + '_ME',
      //     key: item.PollutantCode + '_ME',
      //     render: (text, record) => {
      //       let color = 'rgba(0, 0, 0, 0.85)';
      //       let _text = text;
      //       if (text !== 0 && text !== '-') {
      //         color = 'red';
      //         let PhenomenonType = form.getFieldValue('PhenomenonType');
      //         if (PhenomenonType === '1') {
      //           _text = '零值';
      //         } else if (PhenomenonType === '2') {
      //           _text = '恒值';
      //         } else if (PhenomenonType === '3') {
      //           _text = '陡变';
      //         }
      //       }

      //       return <div style={{ color: color }}>{_text}</div>;
      //     },
      //   });
      // }
      // }
    });

    setColumns(columns);
  };

  //
  const findColorBlocks = data => {
    let result = [];
    let currentColor = data[0] === 0 || data[0] === '-' ? 'green' : 'red';
    let start = -1;

    for (let i = 0; i < data.length; i++) {
      if ((data[i] === 0 || data[i] === '-') && currentColor === 'red') {
        result.push({
          gt: start > -1 ? start - 1 : start,
          lte: i - 1,
          color: data[i - 1] === 2 ? '#1890ff' : 'red',
          flag: data[i - 1],
        });
        start = i;
        currentColor = 'green';
      } else if ((data[i] === 1 || data[i] === 2) && currentColor === 'green') {
        result.push({
          gt: start > -1 ? start - 1 : start,
          lte: i - 1,
          color: 'green',
          flag: data[i - 1],
        });
        start = i;
        // currentColor = data[i] === 1 ? 'red' : '#1890ff';
        currentColor = 'red';
      }
    }

    // 处理最后一个区块
    result.push({
      gt: start,
      lte: data.length - 1,
      color: currentColor,
      flag: data[data.length - 1],
    });

    return result;
  };

  const getOption1 = () => {
    let title = [],
      grid = [],
      xAxis = [],
      yAxis = [],
      series = [];
    selectPollutantList.map((pollutant, index) => {
      title.push({
        text: pollutant.PollutantName,
        left: 'center',
        top: index * 300,
      });
      grid.push({
        left: 80,
        right: 50,
        top: index * 300 + 40,
        height: 200,
      });
      xAxis.push({
        gridIndex: index,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        data: DataPhenomenaChartList.MonitorTimeList,
        // position: 'top'
      });
      yAxis.push({
        gridIndex: index,
        name: pollutant.Unit,
        type: 'value',
      });
      const currentData = DataPhenomenaChartList.dataList[pollutant.PollutantCode];
      const currentDataME = DataPhenomenaChartList.dataList[pollutant.PollutantCode + '_ME'] || [];
      console.log(pollutant.PollutantName + '-currentDataME', currentDataME);
      let visualMapPieces = findColorBlocks(currentDataME);
      console.log('visualMapPieces', visualMapPieces);
      let markAreaData = [];
      // 处理阴影
      visualMapPieces.map(item => {
        if ((item.color === 'red' || item.color === '#1890ff') && item.flag !== undefined) {
          let PhenomenonType = form.getFieldValue('PhenomenonType');
          let name = '',
            otherParams = {};

          if (PhenomenonType === '1') {
            name = '零值';
          } else if (PhenomenonType === '2') {
            name = '恒值';
          } else if (PhenomenonType === '3') {
            if (item.flag === 1) {
              name = '陡升';
            } else if (item.flag === 2) {
              name = '陡降';
              otherParams = {
                itemStyle: {
                  color: 'rgba(24, 144, 255, 0.4)',
                },
                label: {
                  color: '#1890ff',
                },
              };
            }
          }

          let data = [
            { name: name, xAxis: DataPhenomenaChartList.MonitorTimeList[item.gt], ...otherParams },
            { xAxis: DataPhenomenaChartList.MonitorTimeList[item.lte], ...otherParams },
          ];
          markAreaData.push(data);
        }
      });
      series.push({
        name: pollutant.PollutantName,
        data: currentData,
        type: 'line',
        xAxisIndex: index,
        yAxisIndex: index,
        smooth: true,
        markArea: {
          itemStyle: {
            color: 'rgba(255, 173, 177, 0.4)',
          },
          label: {
            color: 'red',
          },
          data: markAreaData,
        },
      });
    });

    return {
      title: title,
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          animation: false,
        },
        formatter: function(params) {
          let str = '';
          params.forEach((m, index) => {
            str += `<div style="padding: 4px 0;">
                  <span class="chart-tooltip-color" style="display: inline-block; margin-right: 10px; background-color: ${m.color}; width: 10px; height: 10px; border-radius:100%; margin-right: 5px"></span>
                  ${m.seriesName}：${m.data} ${selectPollutantList[m.seriesIndex].Unit}<br/>
                </div>
                `;
            // str += `${m.seriesName}:${m.data}<br/>`;
            // str += `${index % 3 === 0 ? '<br/>' : ''}`;
          });
          return `<p style="margin-bottom: 6px; font-weight: 500;">${params[0].axisValue}</p>
          ${str}`;
        },
      },
      // legend: {},
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      axisPointer: {
        link: [
          {
            xAxisIndex: 'all',
          },
        ],
      },
      // dataZoom: [
      //   {
      //     type: 'inside',
      //     xAxisIndex: [0, 1],
      //   },
      // ],
      grid: grid,
      xAxis: xAxis,
      yAxis: yAxis,
      series: series,
    };
  };

  const getOption = (pollutant, index) => {
    if (loading) {
      return {};
    }

    const title = pollutant.PollutantName;
    const currentData = DataPhenomenaChartList.dataList[pollutant.PollutantCode];

    return {
      title: {
        text: title,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          formatter: function(params) {
            let str = '';
            str += `${params[0].axisValue}<br/>`;
            params.forEach((m, index) => {
              str += `<span class="chart-tooltip-color" style="display: inline-block; margin-right: 10px; background-color: ${m.color}; width: 10px; height: 10px; border-radius:100%; margin-right: 5px"></span>`;
              str += `${m.seriesName}:${m.data}`;
              str += `${index % 3 === 0 ? '<br/>' : ''}`;
            });
            return str;
          },
        },
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: '4%',
        right: '4%',
        // top: '17%',
        bottom: '4%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: DataPhenomenaChartList.MonitorTimeList,
      },
      yAxis: {
        name: pollutant.Unit,
        type: 'value',
      },
      visualMap: {
        show: false,
        dimension: 0,
        pieces: visualMapPieces,
      },
      series: [
        {
          data: currentData,
          type: 'line',
          smooth: true,
          markArea: {
            itemStyle: {
              color: 'rgba(255, 173, 177, 0.4)',
            },
            label: {
              color: 'red',
            },
            data: markAreaData,
          },
        },
      ],
    };
  };

  return (
    <>
      <Form
        form={form}
        layout="inline"
        initialValues={{
          time: date,
          pollutantCodes: [],
          PhenomenonType: '1',
        }}
        autoComplete="off"
      >
        <Form.Item name="pollutantCodes">
          <Select
            mode="multiple"
            // allowClear
            maxTagCount={3}
            maxTagTextLength={5}
            maxTagPlaceholder="..."
            style={{ width: 350 }}
            placeholder="请选择污染物"
            onChange={(value, option) => {
              tempSelectPollutantList = option.map(item => item['data-item']);
            }}
          >
            {pollutantListByDgimn.map(item => {
              return (
                <Option value={item.PollutantCode} key={item.PollutantCode} data-item={item}>
                  {item.PollutantName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="time">
          <RangePicker_
            style={{ width: 280 }}
            // dataType={'Hour'}
            // format={'YYYY-MM-DD HH'}
            // showTime
            dataType={'Day'}
            format={'YYYY-MM-DD'}
            allowClear={false}
          />
        </Form.Item>
        <Form.Item name="PhenomenonType">
          <Radio.Group optionType="button" buttonStyle="solid" onChange={e => {}}>
            <Radio.Button value={'1'}>零值</Radio.Button>
            <Radio.Button value={'2'}>恒值</Radio.Button>
            <Radio.Button value={'3'}>陡变</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              if (!tempSelectPollutantList.length) {
                message.error('请选择污染物！');
                return;
              }
              SetSelectPollutantList(tempSelectPollutantList);
              GetHourDataForPhenomenon();
            }}
            loading={loading}
          >
            查询
          </Button>
        </Space>
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
      </Form>
      {showType === 'data' ? (
        <SdlTable
          style={{ marginTop: 10 }}
          rowKey="MonitorTime"
          // className={styles.WarningDataTable}
          columns={columns}
          dataSource={DataPhenomenaTableList}
          align="center"
          loading={loading}
          scroll={{ y: tableHeight || 'calc(100vh - 390px)' }}
        />
      ) : (
        <div style={{ height: echartBoxHeight || 'calc(100vh - 300px)', overflowY: 'auto' }}>
          {/* {selectPollutantList.map((item, index) => {
            return (
              <ReactEcharts
                theme="light"
                option={getOption(item, index)}
                lazyUpdate
                notMerge
                id="rightLine"
                style={{ marginTop: 34, width: '100%', height: '300px' }}
              />
            );
          })} */}
          <ReactEcharts
            theme="light"
            option={getOption1()}
            lazyUpdate
            notMerge
            id="rightLine"
            style={{ marginTop: 34, width: '100%', height: selectPollutantList.length * 300 }}
          />
        </div>
      )}
    </>
  );
};

export default connect(dvaPropsData)(DataPhenomena);
