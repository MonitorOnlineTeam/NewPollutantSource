import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Alert, Form, Space, Button, Select, Radio, message, Spin, Badge, Row } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { formatPollutantPopover } from '@/utils/utils';
import styles from '../../styles.less';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { RightOutlined } from '@ant-design/icons';
import { getColorByName } from '../../CONST';
import TableText from '@/components/TableText';

const COLOR = '#e6b8b7';

let tempSelectedNames = [];

const dvaPropsData = ({ loading, AbnormalIdentifyModel, common }) => ({
  pollutantListByDgimn: common.pollutantListByDgimn,
  // allTypeDataList: AbnormalIdentifyModel.allTypeDataList,
  pollutantLoading: loading.effects['common/getPollutantListByDgimn'],
  tableLoading: loading.effects['AbnormalIdentifyModel/GetAllTypeDataListForModel'],
  exportLoading: loading.effects['AbnormalIdentifyModel/ExportHourDataForModel'],
});

const WarningDataAndChart = props => {
  const [form] = Form.useForm();

  const [columns, setColumns] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [legendSelected, setLegendSelected] = useState({});
  const [allTypeDataList, setAllTypeDataList] = useState([]);
  const [units, setUnits] = useState({});
  const [showType, setShowType] = useState('chart');

  const {
    dispatch,
    DGIMN,
    pollutantListByDgimn,
    date,
    // allTypeDataList,
    pollutantLoading,
    tableLoading,
    exportLoading,
    describe,
    warningDate,
    defaultChartSelected,
    chartStyle,
    chartPollutantList,
  } = props;
  // const [visible, setVisible] = useState([]);

  useEffect(() => {
    if (DGIMN) {
      getPollutantListByDgimn();
    }
  }, [DGIMN]);

  // 根据mn获取污染物
  const getPollutantListByDgimn = () => {
    if (chartPollutantList) {
      // 数据快照：使用报警的污染物
      initData(chartPollutantList);
    } else {
      // 辅助数据分析：获取所有污染物
      dispatch({
        type: 'common/getPollutantListByDgimn',
        payload: {
          DGIMNs: DGIMN,
        },
        callback: res => {
          initData(res);
        },
      }).then(() => {});
    }
  };

  const initData = res => {
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
  };

  useEffect(() => {
    handleLegendSelected();
  }, [selectedNames]);

  // 处理选中的图例
  const handleLegendSelected = () => {
    let pollutantNames = selectedNames;
    let pollutantCodes = form.getFieldValue('pollutantCodes');
    // 处理图例
    let legendSelected = {};
    // 默认选中氧含量、烟气湿度、烟气温度、流速
    pollutantNames.map((item, index) => {
      // if (item === '氧含量' || item === '烟气湿度' || item === '烟气温度' || item === '流速') {
      //   legendSelected[item] = true;
      // } else {
      //   legendSelected[item] = false;
      // }
      // 根据不同模型选中污染物
      if (defaultChartSelected.length) {
        if (defaultChartSelected.includes(pollutantCodes[index])) {
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
      type: 'AbnormalIdentifyModel/GetAllTypeDataListForModel',
      payload: {
        DGIMNs: DGIMN,
        beginTime: beginTime,
        endTime: endTime,
        pollutantCodes: values.pollutantCodes.toString(),
        isAsc: true,
        IsSupplyData: false,
      },
      callback: res => {
        setAllTypeDataList(res);
      },
    }).then(res => {});
  };

  // 导出
  const ExportHourDataForModel = () => {
    const values = form.getFieldsValue();
    let beginTime = values.time[0].format('YYYY-MM-DD HH:mm:ss');
    let endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'AbnormalIdentifyModel/ExportHourDataForModel',
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
        title: '数据特征识别',
        key: 'WC',
        children: [
          {
            title: '工况',
            dataIndex: 'ModelWCFlag',
            key: 'ModelWCFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text !== '正常') {
                // if (true) {
                backgroundColor = COLOR;
              }
              let _text = text || '-';
              if (text === 'StopMiss') {
                _text = '停运工况缺失';
              }
              if (text === 'NormalMiss') {
                _text = '正常工况缺失';
              }

              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={_text || '-'} />
                </div>
              );
            },
          },
          {
            title: '人为干预',
            dataIndex: 'WCArtificialFlag',
            key: 'WCArtificialFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text || record['MonitorTime_Status'] === true) {
                // if (true) {
                backgroundColor = COLOR;
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
          {
            title: '故障原因',
            dataIndex: 'WCFaultFlag',
            key: 'WCFaultFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text || record['MonitorTime_Status'] === true) {
                // if (true) {
                backgroundColor = COLOR;
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
        ],
      },
      {
        title: '大样本识别',
        key: 'QH',
        children: [
          {
            title: '工况',
            dataIndex: 'ModelQHFlag',
            key: 'ModelQHFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text !== '正常') {
                // if (true) {
                backgroundColor = COLOR;
              }
              let _text = text || '-';
              if (text === 'StopMiss') {
                _text = '停运工况缺失';
              }
              if (text === 'NormalMiss') {
                _text = '正常工况缺失';
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
          {
            title: '人为干预',
            dataIndex: 'QHArtificialFlag',
            key: 'QHArtificialFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text || record['MonitorTime_Status'] === true) {
                // if (true) {
                backgroundColor = COLOR;
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
          {
            title: '故障原因',
            dataIndex: 'QHFaultFlag',
            key: 'QHFaultFlag',
            width: 180,
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
              let backgroundColor = 'transparent';
              if (text || record['MonitorTime_Status'] === true) {
                // if (true) {
                backgroundColor = COLOR;
              }
              return (
                <div className={styles.tdBox} style={{ background: backgroundColor }}>
                  <TableText content={text || '-'} />
                </div>
              );
            },
          },
        ],
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
    const values = form.getFieldsValue();
    const { pollutantCodes = [] } = values;
    let series = [];
    let xAxisData = [];
    let yxisData = [];
    let idx = 0;

    if (!pollutantCodes || !pollutantCodes.length) {
      return {};
    }

    pollutantCodes.map((pollutant, index) => {
      let name = selectedNames[index];
      if (legendSelected[name]) {
        idx += 1;
      }
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
        },
      });
      let serieData = [];
      allTypeDataList.map(item => {
        // serieData = serieData.concat(item[pollutant] * 1);
        serieData = serieData.concat(item[pollutant]);
      });
      series.push({
        type: 'line',
        id: pollutant,
        name: selectedNames[index],
        unit: pollutant.Unit,
        data: serieData,
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
          let { dataIndex, seriesId } = params;
          let currentData = allTypeDataList[dataIndex];
          let flag = currentData[seriesId + '_Flag'];

          if (flag === '正常(N)' || flag === '' || flag === '正常(n)') {
            return 'circle';
          } else {
            return 'triangle';
          }
        },
        symbolSize: (value, params) => {
          let { dataIndex, seriesId } = params;
          let currentData = allTypeDataList[dataIndex];
          let flag = currentData[seriesId + '_Flag'];
          if (flag === '正常(N)' || flag === '' || flag === '正常(n)') {
            return 4;
          } else {
            return 20;
          }
        },
      });
    });

    let showIndex = yxisData.findIndex(item => item.show === true);

    // 异常工况数据
    let markAreaData = [];
    let continuousItem = [];
    let continuousItem1 = [];
    let continuousItem2 = [];
    // 人为干预和故障数据
    let RenAndGuData = [];
    if (showIndex > -1) {
      allTypeDataList.map((item, idx) => {
        let index = 0;
        // interval = 0.05;

        let min = _.min(series[showIndex].data);
        let max = _.max(series[showIndex].data);
        if (min < 0) {
          min = Math.abs(min);
        } else {
          min = 0;
        }

        let interval = (min + max) / 50;
        // 时间数据
        xAxisData.push(item.MonitorTime);
        // 绘制异常工况
        {
          let flag = item.ModelQHFlag || item.ModelWCFlag;
          if (flag !== 'StopMiss' && flag !== 'NormalMiss') {
            // 异常工况开始
            if (
              (item.ModelQHFlag !== '正常' || item.ModelWCFlag !== '正常') &&
              !continuousItem.length
            ) {
              continuousItem.push({
                name: '异常工况',
                xAxis: item.MonitorTime,
              });
            }

            // 异常工况结束
            if (
              item.ModelQHFlag === '正常' &&
              item.ModelWCFlag === '正常' &&
              continuousItem.length
            ) {
              continuousItem.push({
                name: '异常工况',
                xAxis: item.MonitorTime,
              });

              markAreaData.push(continuousItem);
              continuousItem = [];
            } else if (
              (item.ModelQHFlag !== '正常' || item.ModelWCFlag !== '正常') &&
              idx === allTypeDataList.length - 1
            ) {
              continuousItem.push({
                name: '异常工况',
                xAxis: item.MonitorTime,
              });

              markAreaData.push(continuousItem);
              continuousItem = [];
            }
          }
        }
        // 绘制正常工况缺失
        {
          let flag = item.ModelQHFlag || item.ModelWCFlag;
          // 开始
          if (flag === 'NormalMiss' && !continuousItem1.length) {
            continuousItem1.push({
              name: '正常工况缺失',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(0,0,0, .3)',
              },
            });
          }
          // 结束
          if (flag !== 'NormalMiss' && continuousItem1.length) {
            continuousItem1.push({
              name: '正常工况缺失',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(0,0,0, .3)',
              },
            });

            markAreaData.push(continuousItem1);
            continuousItem1 = [];
          } else if (flag === 'NormalMiss' && idx === allTypeDataList.length - 1) {
            continuousItem1.push({
              name: '正常工况缺失',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(0,0,0, .3)',
              },
            });

            markAreaData.push(continuousItem1);
            continuousItem1 = [];
          }
        }
        // 绘制停运工况缺失
        {
          let flag = item.ModelQHFlag || item.ModelWCFlag;
          // 开始
          if (flag === 'StopMiss' && !continuousItem2.length) {
            continuousItem2.push({
              name: '停运工况缺失',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(255, 173, 177, 0.4)',
              },
            });
          }
          // 结束
          if (flag !== 'StopMiss' && continuousItem2.length) {
            continuousItem2.push({
              name: '停运工况缺失',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(255, 173, 177, 0.4)',
              },
            });

            markAreaData.push(continuousItem2);
            continuousItem2 = [];
          } else if (flag === 'StopMiss' && idx === allTypeDataList.length - 1) {
            continuousItem2.push({
              name: '停运工况缺失',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(255, 173, 177, 0.4)',
              },
            });

            markAreaData.push(continuousItem2);
            continuousItem2 = [];
          }
        }
        // 绘制人为干预、设备故障时间线
        {
          let RenStatus = item.WCArtificialFlag || item.QHArtificialFlag;
          let GuStatus = item.WCFaultFlag || item.QHFaultFlag;
          let CEMSRunStatus = item.WCOperationFlag || item.QHOperationFlag;

          // 运行管理异常
          if (CEMSRunStatus) {
            index++;
            RenAndGuData.push({
              yAxis: index * interval,
              xAxis: item.MonitorTime,
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#faad14',
              },
            });
          }

          // 故障
          if (GuStatus) {
            index++;
            RenAndGuData.push({
              yAxis: index * interval,
              xAxis: item.MonitorTime,
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#ff4d4f',
              },
            });
          }

          // 人为干预
          if (RenStatus) {
            index++;
            RenAndGuData.push({
              yAxis: index * interval,
              xAxis: item.MonitorTime,
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#722ed1',
              },
            });
          }

          // if (RenStatus && GuStatus) {
          //   RenAndGuData.push({
          //     name: '人为干预、设备故障',
          //     xAxis: item.MonitorTime,
          //     lineStyle: { color: '#ff5500', type: 'solid', width: 2 },
          //     label: {
          //       position: 'end',
          //       fontSize: 13,
          //       color: '#ff5500',
          //       formatter: function(params) {
          //         return '人为干预\n设备故障';
          //       },
          //     },
          //   });
          // } else if (RenStatus) {
          //   RenAndGuData.push({
          //     name: '人为干预',
          //     xAxis: item.MonitorTime,
          //     lineStyle: { color: '#ff5500', type: 'solid', width: 2 },
          //     label: {
          //       position: 'end',
          //       fontSize: 13,
          //       color: '#ff5500',
          //       formatter: function(params) {
          //         return '人为干预\n设备故障';
          //       },
          //     },
          //   });
          // } else if (GuStatus) {
          //   RenAndGuData.push({
          //     name: '设备故障',
          //     xAxis: item.MonitorTime,
          //     lineStyle: { color: '#ff5500', type: 'solid', width: 2 },
          //     label: {
          //       position: 'end',
          //       fontSize: 13,
          //       color: '#ff5500',
          //       formatter: function(params) {
          //         return '人为干预\n设备故障';
          //       },
          //     },
          //   });
          // }
        }
      });

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
                return item.name;
                // .split('')
                // // .reverse()
                // .join('\n')
              },
            },
          };
        });
        // series[showIndex].markLine = { data: [...abnormalMarkLine, ...RenAndGuData] };
        series[showIndex].markLine = { data: [...abnormalMarkLine] };
        series[showIndex].markPoint = {
          data: RenAndGuData,
        };
      } else {
        // 绘制人为干预、设备故障时间线
        series[showIndex].markPoint = {
          data: RenAndGuData,
        };
      }
    }
    let option = {
      tooltip: {
        trigger: 'axis',
        confine: true,
        extraCssText:
          'background: rgba(255,255,255,.9); border: 1px solid #ddd; padding: 0; font-size: 13px; border-radius: 0;',
        textStyle: 'color: rgba(0,0,0,.5)',
        formatter: function(params, ticket) {
          //x轴名称 params[0]
          let { dataIndex } = params[0];
          let currentData = allTypeDataList[dataIndex];

          //值
          let value = '';
          params.map(item => {
            let dataParams = currentData[item.seriesId + '_params'];
            // 状态：超标、异常
            let status = dataParams ? dataParams.split('§')[0] : '';
            // 标记
            let dataFlag = currentData[item.seriesId + '_Flag'];

            value += `
              <p style="line-height: 20px">
                ${item.marker} ${item.seriesName}： ${item.value || '-'}
                ${units[item.seriesName]}
                ${dataFlag}
                <span style="font-weight: bold; color: ${status === '0' ? '#ff4d4f' : '#faad14'}">${
              status === '0' ? '超标' : status !== '' ? '异常' : ''
            }</span>
              <p>
            `;
          });

          // 工况颜色
          let WorkConColor = currentData.ModelWCFlag === '正常' ? '#52c41a' : '#faad14';
          let WorkConColor2 = currentData.ModelQHFlag === '正常' ? '#52c41a' : '#faad14';

          // 数据特征识别：人为干预
          let WCArtificialFlag = currentData.WCArtificialFlag
            ? currentData.WCArtificialFlag.split(',')
            : [];
          // 数据特征识别：故障原因
          let WCFaultFlag = currentData.WCFaultFlag ? currentData.WCFaultFlag.split(',') : [];
          // 数据特征识别：运行管理异常
          let WCOperationFlag = currentData.WCOperationFlag
            ? currentData.WCOperationFlag.split(',')
            : [];

          // 大样本识别：人为干预
          let QHArtificialFlag = currentData.QHArtificialFlag
            ? currentData.QHArtificialFlag.split(',')
            : [];
          // 大样本识别：故障原因
          let QHFaultFlag = currentData.QHFaultFlag ? currentData.QHFaultFlag.split(',') : [];
          // 大样本识别：运行管理异常
          let QHOperationFlag = currentData.QHOperationFlag
            ? currentData.QHOperationFlag.split(',')
            : [];

          let ModelWCFlag = currentData.ModelWCFlag;
          if (ModelWCFlag === 'StopMiss') {
            ModelWCFlag = '停运工况缺失';
          }
          if (ModelWCFlag === 'NormalMiss') {
            ModelWCFlag = '正常工况缺失';
          }

          let content = `
            <div style="background: #eeeeee; padding: 4px 10px; font-size: 14px">${
              currentData.MonitorTime
            }</div>
            <div style="line-height: 20px">
              <div>
                <i style="display: inline-block;width: 2px; height: 16px; margin-right: 8px; background: #3988ff;  vertical-align: middle;"></i>
                <span style="display: inline-block; vertical-align: middle; color: #000">数据特征识别：</span>
              </div>
              <div style="padding: 0 14px">
                <p>工况：<span style="color: ${WorkConColor}; font-weight: bold">${ModelWCFlag ||
            '-'}<p>
                <div>
                  <div style="display: inline-block;vertical-align: top;">人为干预：</div>
                  <div  style="display: inline-block;">
                    ${WCArtificialFlag.length ? WCArtificialFlag.join('<br/>') : '-'}
                  </div>
                </div>
                <div style="margin-top: 4px">
                  <div style="display: inline-block;vertical-align: top;">故障原因：</div>
                  <div  style="display: inline-block;">
                    ${WCFaultFlag.length ? WCFaultFlag.join('<br/>') : '-'}
                  </div>
                </div>
                <div style="margin-top: 4px; display: ${WCOperationFlag.length ? 'block' : 'none'}">
                  <div style="display: inline-block;vertical-align: top;">运行管理异常：</div>
                  <div  style="display: inline-block;">
                    ${WCOperationFlag.length ? WCOperationFlag.join('<br/>') : '-'}
                  </div>
                </div>
              </div>
            </div>
            <div style="line-height: 20px; margin-top: 10px">
              <div>
                <i style="display: inline-block;width: 2px; height: 16px; margin-right: 8px; background: #3988ff;  vertical-align: middle;"></i>
                <span style="display: inline-block; vertical-align: middle; color: #000">大样本识别：</span>
              </div>
              <div style="padding: 0 14px">
                <p>工况：<span style="color: ${WorkConColor2}; font-weight: bold">${currentData.ModelQHFlag ||
            '-'}<p>
                <div>
                  <div style="display: inline-block;vertical-align: top;">人为干预：</div>
                  <div  style="display: inline-block;">
                    ${QHArtificialFlag.length ? QHArtificialFlag.join('<br/>') : '-'}
                  </div>
                </div>
                <div style="margin-top: 4px">
                  <div style="display: inline-block;vertical-align: top;">故障原因：</div>
                  <div  style="display: inline-block;">
                    ${QHFaultFlag.length ? QHFaultFlag.join('<br/>') : '-'}
                  </div>
                </div>
                <div style="margin-top: 4px; display: ${QHOperationFlag.length ? 'block' : 'none'}">
                  <div style="display: inline-block;vertical-align: top;">运行管理异常：</div>
                  <div  style="display: inline-block;">
                    ${QHOperationFlag.length ? QHOperationFlag.join('<br/>') : '-'}
                  </div>
                </div>
              </div>
            </div>
            <div style="margin: 8px;background: #f7f7f7; padding: 0 6px;">
              ${value}
            </div>
          `;

          return content;
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
        style={{ display: chartPollutantList ? 'none' : '' }}
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
            style={{ width: 260 }}
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
          scroll={{ y: 'calc(100vh - 390px)' }}
        />
      ) : tableLoading == false && !pollutantLoading ? (
        // false ? (
        <>
          <ReactEcharts
            theme="light"
            option={getOption()}
            lazyUpdate
            notMerge
            id="rightLine"
            onEvents={onEvents}
            style={{ marginTop: 34, width: '100%', height: 'calc(100vh - 304px)', ...chartStyle }}
          />
          <Row justify="center" style={{ width: '100%' }}>
            <Space size={20}>
              <Badge
                // status="processing"
                color="#722ed1"
                text="人为干预"
              />
              <Badge
                // status="processing"
                color="#ff4d4f"
                text="故障"
              />
              <Badge
                // status="processing"
                color="#faad14"
                text="运行管理异常"
              />
            </Space>
          </Row>
        </>
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
  chartStyle: {},
};

export default connect(dvaPropsData)(WarningDataAndChart);
