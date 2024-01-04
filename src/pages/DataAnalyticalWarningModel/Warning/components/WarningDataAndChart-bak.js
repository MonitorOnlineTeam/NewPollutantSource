import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Alert, Form, Space, Button, Select, Radio, message, Spin } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { formatPollutantPopover } from '@/utils/utils';
import styles from '../../styles.less';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { RightOutlined } from '@ant-design/icons';
import { getColorByName } from '../../CONST';

const COLOR = '#e6b8b7';
let tempSelectedNames = [];

const dvaPropsData = ({ loading, dataModel, common }) => ({
  pollutantListByDgimn: common.pollutantListByDgimn,
  allTypeDataList: dataModel.allTypeDataList,
  pollutantLoading: loading.effects['common/getPollutantListByDgimn'],
  tableLoading: loading.effects['dataModel/GetAllTypeDataListForModel'],
  exportLoading: loading.effects['dataModel/ExportHourDataForModel'],
});

const WarningDataAndChart = props => {
  const [form] = Form.useForm();

  const [columns, setColumns] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [legendSelected, setLegendSelected] = useState({});
  const [units, setUnits] = useState({});
  const [showType, setShowType] = useState('chart');

  const {
    dispatch,
    DGIMN,
    pollutantListByDgimn,
    date,
    allTypeDataList,
    pollutantLoading,
    tableLoading,
    exportLoading,
    describe,
    warningDate,
    defaultChartSelected,
  } = props;
  // const [visible, setVisible] = useState([]);

  useEffect(() => {
    if (DGIMN) {
      getPollutantListByDgimn();
    }
  }, [DGIMN]);

  // 根据mn获取污染物
  const getPollutantListByDgimn = () => {
    dispatch({
      type: 'common/getPollutantListByDgimn',
      payload: {
        DGIMNs: DGIMN,
      },
      callback: res => {
        let pollutantCodes = [],
          pollutantNames = [];
        let units = {};

        res.map(item => {
          pollutantCodes.push(item.PollutantCode);
          pollutantNames.push(item.PollutantName);
          units[item.PollutantName] = item.Unit;
        });
        setUnits(units);
        form.setFieldsValue({ pollutantCodes: pollutantCodes });
        setSelectedNames(pollutantNames);
        tempSelectedNames = pollutantNames;
        GetAllTypeDataList();
        getColumns(res);
        // handleLegendSelected();
      },
    }).then(() => {});
  };

  useEffect(() => {
    handleLegendSelected();
  }, [selectedNames]);

  // 处理选中的图例
  const handleLegendSelected = () => {
    let pollutantNames = selectedNames;
    console.log('selectedNames', selectedNames);
    // 处理图例
    let legendSelected = {};
    console.log('pollutantNames', pollutantNames);
    // 默认选中氧含量、烟气湿度、烟气温度、流速
    pollutantNames.map((item, index) => {
      // if (item === '氧含量' || item === '烟气湿度' || item === '烟气温度' || item === '流速') {
      //   legendSelected[item] = true;
      // } else {
      //   legendSelected[item] = false;
      // }
      console.log('defaultChartSelected', defaultChartSelected);
      // 根据不同模型选中污染物
      if (defaultChartSelected.length) {
        if (defaultChartSelected.includes(item)) {
          legendSelected[item] = true;
        } else {
          legendSelected[item] = false;
        }
      }
      // if (index < 1) {
      //   legendSelected[item] = true;
      // } else {
      //   legendSelected[item] = false;
      // }
    });
    setLegendSelected(legendSelected);
  };

  // 获取报警数据
  const GetAllTypeDataList = () => {
    const values = form.getFieldsValue();
    let beginTime = values.time[0].format('YYYY-MM-DD HH:mm:ss');
    let endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss');

    dispatch({
      type: 'dataModel/GetAllTypeDataListForModel',
      payload: {
        DGIMNs: DGIMN,
        beginTime: beginTime,
        endTime: endTime,
        pollutantCodes: values.pollutantCodes.toString(),
        isAsc: true,
        IsSupplyData: false,
      },
      callback: () => {},
    }).then(res => {});
  };

  // 导出
  const ExportHourDataForModel = () => {
    const values = form.getFieldsValue();
    let beginTime = values.time[0].format('YYYY-MM-DD HH:mm:ss');
    let endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'dataModel/ExportHourDataForModel',
      payload: {
        DGIMNs: DGIMN,
        beginTime: beginTime,
        endTime: endTime,
        pollutantCodes: values.pollutantCodes.toString(),
        isAsc: true,
        IsSupplyData: false,
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
        render: (text, record) => {
          let backgroundColor = 'transparent';
          if (record['MonitorTime_Status'] === true) {
            // if (true) {
            backgroundColor = COLOR;
          }
          return (
            <div className={styles.tdBox} style={{ background: backgroundColor }}>
              {text}
            </div>
          );
        },
      },
      {
        title: '工况',
        dataIndex: 'WorkCon',
        key: 'WorkCon',
        render: (text, record) => {
          let backgroundColor = 'transparent';
          if (record['WorkCon_Status'] === true) {
            // if (true) {
            backgroundColor = COLOR;
          }
          return (
            <div className={styles.tdBox} style={{ background: backgroundColor }}>
              {text || '-'}
            </div>
          );
        },
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
          let backgroundColor = 'transparent';
          if (record[item.PollutantCode + '_Status'] === true) {
            // if (true) {
            backgroundColor = COLOR;
          }
          return (
            <div className={styles.tdBox} style={{ background: backgroundColor }}>
              {formatPollutantPopover(text, record[`${item.PollutantCode}_params`])}
            </div>
          );
        },
      });
      // 非折算
      if (item.PollutantCode.indexOf('zs') === -1) {
        columns.push({
          title: (
            <>
              {item.PollutantName}
              <br />
              数据标记
            </>
          ),
          dataIndex: item.PollutantCode + '_Flag',
          key: item.PollutantCode + '_Flag',
          render: (text, record) => {
            let backgroundColor = 'transparent';
            if (record[item.PollutantCode + '_Status'] === true) {
              // if (true) {
              backgroundColor = COLOR;
            }
            return (
              <div className={styles.tdBox} style={{ background: backgroundColor }}>
                {text || '-'}
              </div>
            );
          },
        });
      }
      // }
    });

    setColumns(columns);
  };
  const getOption = () => {
    debugger;
    const values = form.getFieldsValue();
    const { pollutantCodes = [] } = values;
    let series = [];
    let seriesFlag = {
      实测烟尘: [
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '日常维护(M)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
      ],
      氧含量: [
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
      ],
      烟气温度: [
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
      ],
      烟气静压: [
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
      ],
      烟气湿度: [
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
      ],
      流速: [
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
      ],
      流量: [
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
        '正常(N)',
      ],
    };
    let xAxisData = [];
    let WorkConData = {};
    let yxisData = [];
    let idx = 0;

    if (!pollutantCodes || !pollutantCodes.length) {
      return {};
    }

    pollutantCodes.map((pollutant, index) => {
      let seriesdata = [];
      let seriesFlagdata = [];

      let name = selectedNames[index];
      if (legendSelected[name]) {
        idx += 1;
      }
      console.log('idx', idx);
      yxisData.push({
        type: 'value',
        name: name,
        position: idx <= 3 ? 'left' : 'right',
        alignTicks: true,
        offset: idx <= 3 ? (idx - 1) * 60 : (idx - 4) * 60,
        // offset: idx % 3 * 60,
        nameLocation: 'end',
        show: legendSelected[name],
        axisLine: {
          show: true,
          // lineStyle: {
          //   color: colors[0]
          // }
        },
        // axisLabel: {
        //   formatter: '{value} ml',
        // },
      });

      allTypeDataList.map((item1, idx) => {
        seriesdata = seriesdata.concat(item1[pollutant]);
        let flag = item1[pollutant + '_Flag'] || '';
        seriesFlagdata = seriesFlagdata.concat(flag);
      });
      console.log('seriesdata', seriesdata);
      series.push({
        type: 'line',
        name: selectedNames[index],
        unit: pollutant.Unit,
        data: seriesdata,
        yAxisIndex: index,
        label: {
          formatter: pollutant.Unit,
          show: false,
        },
        itemStyle: {
          color: getColorByName[selectedNames[index]],
        },
        symbol: (value, params) => {
          // 污染物flag非正常，显示三角
          // console.log('params', params);

          let flag = seriesFlag[params.seriesName][params.dataIndex];
          if (flag === '正常(N)' || flag === '' || flag === '正常(n)') {
            return 'circle';
          } else {
            return 'triangle';
          }
        },
        symbolSize: (value, params) => {
          // console.log('value', value);
          // console.log('params', params);
          let flag = seriesFlag[params.seriesName][params.dataIndex];
          if (flag === '正常(N)' || flag === '' || flag === '正常(n)') {
            return 4;
          } else {
            return 20;
          }
        },
        // markPoint: {
        //   data: [
        //     {
        //       // 所有
        //       xAxis: '2023-08-19 04:00',
        //       yAxis: 1.055,
        //       symbolSize: 14,
        //       symbol: '/临时/all.png',
        //       itemStyle: {
        //         color: index === 0 ? '#faad14' : 'transparent',
        //       },
        //     },
        //     {
        //       // 故障标记
        //       xAxis: '2023-08-19 05:00',
        //       yAxis: 1.054,
        //       symbolSize: 14,
        //       symbol: 'circle',
        //       itemStyle: {
        //         color: index === 0 ? '#faad14' : 'transparent',
        //       },
        //     },
        //     {
        //       // 运维信息
        //       xAxis: '2023-08-19 06:00',
        //       yAxis: 1.055,
        //       symbolSize: 14,
        //       symbol: 'circle',
        //       itemStyle: {
        //         color: index === 0 ? '#faad14' : 'transparent',
        //       },
        //     },
        //     // {
        //     //   // 所有
        //     //   xAxis: '2023-09-25 14:00',
        //     //   yAxis: 1.055,
        //     //   symbolSize: 14,
        //     //   symbol: 'circle',
        //     //   itemStyle: {
        //     //     color: index === 0 ? '#faad14' : 'transparent',
        //     //   },
        //     // },
        //     // {
        //     //   // 故障标记
        //     //   xAxis: '2023-09-25 15:00',
        //     //   yAxis: 1.054,
        //     //   symbolSize: 14,
        //     //   symbol: 'circle',
        //     //   itemStyle: {
        //     //     color: index === 0 ? '#ff4d4f' : 'transparent',
        //     //   },
        //     // },
        //     // {
        //     //   // 运维信息
        //     //   xAxis: '2023-09-25 16:00',
        //     //   yAxis: 1.055,
        //     //   symbolSize: 14,
        //     //   symbol: 'circle',
        //     //   itemStyle: {
        //     //     color: index === 0 ? '#2f54eb' : 'transparent',
        //     //   },
        //     // },
        //   ],
        // },
      });
      // seriesFlag[selectedNames[index]] = seriesFlagdata;
    });
    console.log('seriesFlag', seriesFlag);
    let markAreaData = [];
    let continuousItem = [];
    allTypeDataList.map((item, idx) => {
      // 时间数据
      xAxisData.push(item.MonitorTime);
      // 数据标识
      WorkConData[item.MonitorTime] = item.WorkCon || '-';
      // 异常工况数据

      // 异常工况开始
      if (item.WorkCon_Status && item.WorkCon && !continuousItem.length) {
        continuousItem.push({
          name: '异常工况',
          xAxis: item.MonitorTime,
        });
      }

      // 异常工况结束
      if (!item.WorkCon_Status && item.WorkCon && continuousItem.length) {
        continuousItem.push({
          name: '异常工况',
          xAxis: item.MonitorTime,
        });

        markAreaData.push(continuousItem);
        continuousItem = [];
      } else if (item.WorkCon_Status && item.WorkCon && idx === allTypeDataList.length - 1) {
        continuousItem.push({
          name: '异常工况',
          xAxis: item.MonitorTime,
        });

        markAreaData.push(continuousItem);
        continuousItem = [];
      }
    });
    console.log('markAreaData', markAreaData);
    let showIndex = yxisData.findIndex(item => item.show === true);
    if (showIndex > -1) {
      // 绘制异常工况阴影
      series[showIndex].markArea = {
        itemStyle: {
          color: 'rgba(0,0,0, .1)',
        },
        data: markAreaData,
      };

      // 绘制报警时间线
      if (warningDate.length) {
        // 过滤出warningDate中的pollutantCode 如果在legendSelected为true的数据, 报警时间线随着图例联动
        let selectedPollutantCodes = Object.keys(legendSelected).filter(
          code => legendSelected[code],
        );
        console.log('selectedPollutantCodes', selectedPollutantCodes);
        let filteredWarningDate = warningDate.filter(item =>
          selectedPollutantCodes.includes(item.pollutantName),
        );
        let newFilteredWarningDate = filteredWarningDate.length ? filteredWarningDate : warningDate;
        let abnormalMarkLine = newFilteredWarningDate.map(item => {
          let color = filteredWarningDate.length ? getColorByName[item.pollutantName] : '#c23531';
          return {
            name: item.name,
            xAxis: item.date,
            // lineStyle: { color: '#ff0000' },
            lineStyle: { color: color },
            label: {
              position: 'end',
              // padding: [0, -120, 0, 0],
              // fontWeight: 'bold',
              fontSize: 13,
              color: color,
              // width: 20,
              // overflow: 'truncate',
              formatter: function(params) {
                return (
                  item.name
                    .split('')
                    // .reverse()
                    .join('\n')
                );
              },
            },
          };
        });
        series[showIndex].markLine = { data: abnormalMarkLine };

        // series[showIndex].markLine = {
        //   // silent: true,
        //   data: [
        //     {
        //       name: '发现异常开始时间',
        //       xAxis: warningDate[0],
        //       lineStyle: { color: '#ff0000' },
        //       label: {
        //         formatter: function(params) {
        //           return '发现异常';
        //         },
        //       },
        //     },
        //     {
        //       name: '发现异常结束时间',
        //       xAxis: warningDate[1],
        //       lineStyle: { color: '#ff0000' },
        //       label: {
        //         formatter: function(params) {
        //           return '发现异常';
        //         },
        //       },
        //     },
        //   ],
        // };
      }
    }

    // series.map(item => {
    //   item.markArea = {
    //     itemStyle: {
    //       color: 'rgba(0,0,0, .1)',
    //     },
    //     data: markAreaData,
    //   };
    // })

    // console.log('yxisData', yxisData);
    // console.log('series', series);
    // console.log('xAxisData', xAxisData);
    // console.log('legendSelected', legendSelected);
    // console.log('seriesFlag', seriesFlag);
    // console.log('markAreaData', markAreaData);
    let option = {
      // color: [
      //   '#38a2da',
      //   '#32c5e9',
      //   '#e062ae',
      //   '#e690d1',
      //   '#8279ea',
      //   '#9D97F6',
      //   '#9fe6b8',
      //   '#ffdb5c',
      //   '#ff9f7f',
      //   '#c23531',
      //   '#c4ccd3',
      //   '#61a0a8',
      // ],
      // color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      // color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
      tooltip: {
        trigger: 'axis',
        formatter: function(params, ticket) {
          //x轴名称 params[0]
          let date = params[0].axisValue;
          let WorkCon1 = `数据特征识别：`;
          let WorkConfen = `-----------------------`;
          let WorkCon = `工况：${WorkConData[date]}`;
          let WorkCon2 = `人为干预：监测样品为空气`;
          let WorkCon3 = `故障原因：系统故障`;
          let WorkCon4 = `大样本模型识别：监测样品为空气`;

          //值
          let value = '';
          params.map(item => {
            value += `${item.marker} ${item.seriesName}: ${item.value || '-'}${
              units[item.seriesName]
            }
          ${seriesFlag[item.seriesName][item.dataIndex]}<br />`;
          });

          return (
            date + '<br />' + WorkCon1 +  '<br />' +  WorkConfen  + '<br />' + WorkCon + '<br />' + WorkCon2 + '<br />' + WorkCon3 + '<br />' + value + '<br />' + WorkCon4
          );
        },
      },
      legend: {
        data: selectedNames,
        selected: legendSelected,
      },
      grid: {
        left: 100,
        right: 100,
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          // dataView: { show: true, readOnly: false },
          // magicType: { show: true, type: ['line', 'bar'] },
          dataZoom: { show: true },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
      },
      yAxis: yxisData,
      series: series,
    };
    console.log('option', option);
    return option;
  };

  //
  const onChartLegendChange = (value, param) => {
    let name = value.name;
    if (legendSelected[name] === true && value.selected[name] === false) {
      // 反选
      setLegendSelected(value.selected);
    } else {
      if (_.values(legendSelected).filter(item => item === true).length >= 6) {
        message.error('最多选择6个显示');
        value.selected[name] = false;
        setLegendSelected({
          ...value.selected,
        });
      } else {
        setLegendSelected({
          ...value.selected,
        });
      }
    }
  };

  const onEvents = {
    legendselectchanged: onChartLegendChange,
  };

  // const onCancel = () => {
  //   setVisible(false);
  // };
  console.log('legendSelected', legendSelected);
  return (
    <>
      {describe && (
        <Alert
          message={describe.replace(',下图为模型判断的过程', '。')}
          type="info"
          showIcon
          style={{ marginBottom: 10 }}
        />
      )}
      <Form
        form={form}
        layout="inline"
        initialValues={{
          time: date,
          pollutantCodes: [],
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
              tempSelectedNames = option.map(item => item.children);
              // setSelectedNames(option.map(item => item.children));
            }}
          >
            {pollutantListByDgimn.map(item => {
              return (
                <Option value={item.PollutantCode} key={item.PollutantCode} data-unit={item.Unit}>
                  {item.PollutantName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="time">
          <RangePicker_
            style={{ width: 300 }}
            dataType={'Day'}
            format={'YYYY-MM-DD'}
            allowClear={false}
          />
        </Form.Item>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              if (!tempSelectedNames.length) {
                message.error('请选择污染物！');
                return;
              }
              setSelectedNames(tempSelectedNames);
              GetAllTypeDataList();
            }}
            loading={tableLoading}
          >
            查询
          </Button>
          <Button type="primary" onClick={ExportHourDataForModel} loading={exportLoading}>
            导出
          </Button>
        </Space>
        <Spin spinning={tableLoading}>
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
          className={styles.WarningDataTable}
          columns={columns}
          dataSource={allTypeDataList}
          align="center"
          loading={tableLoading}
        />
      ) : tableLoading == false && pollutantLoading === false ? (
        // false ? (
        <ReactEcharts
          theme="light"
          option={getOption()}
          lazyUpdate
          notMerge
          id="rightLine"
          onEvents={onEvents}
          style={{ marginTop: 34, width: '100%', height: 'calc(100vh - 304px)' }}
        />
      ) : (
        <div className="example">
          <Spin tip="Loading..." />
        </div>
      )}
    </>
  );
};

WarningDataAndChart.defaultProps = {
  defaultChartSelected: [],
  warningDate: [],
};

export default connect(dvaPropsData)(WarningDataAndChart);
