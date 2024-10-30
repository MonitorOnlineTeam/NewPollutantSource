import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import {
  Alert,
  Form,
  Space,
  Button,
  Select,
  Radio,
  message,
  Spin,
  Badge,
  Row,
  Modal,
  Input,
  Tag,
} from 'antd';
import ReactEcharts from 'echarts-for-react';
import { formatPollutantPopover, permissionButton } from '@/utils/utils';
import styles from '../../styles.less';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { RightOutlined } from '@ant-design/icons';
import { getColorByName, ModalTypeNameConversion, getPollutantNameByCode } from '../../CONST';
import TableText from '@/components/TableText';
import moment from 'moment';
import UpdateDataFlag from './UpdateDataFlag';
import StopRecord from '@/pages/monitoring/StopRecord/stopRecord.js';

const { CheckableTag } = Tag;

const COLOR = '#e6b8b7';
const ModelWCFlagEnum = {
  Fa: '停炉',
  Sta: '启炉',
  Fb: '停运',
  '': '正常',
};

const spacing = 50;

const rotateLabels = ['流量', '烟气静压'];

const position = {
  left: ['01', '02', '03', '04', 'zs01', 'zs02', 'zs03'],
  right: ['s01', 's03', 's08', 's05', 's02', 'b02'],
};

let tempSelectedNames = [];
let legendSelected = {};

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
  // const [legendSelected, setLegendSelected] = useState({});
  const [allTypeDataList, setAllTypeDataList] = useState([]);
  const [units, setUnits] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStopRecordModalOpen, setIsStopRecordModalOpen] = useState(false);
  const [showType, setShowType] = useState(props.defaultShowType || 'chart');
  const [currentBrushRangeDate, setCurrentBrushRangeDate] = useState([]);
  const [brushRangeIndex, setBrushRangeIndex] = useState([]);
  const [updatedModelWCFlag, setUpdatedModelWCFlag] = useState();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [dataZoomPosition, setDataZoomPosition] = useState([]);
  const [echartRef, setEchartRef] = useState();
  const [currentLegend, setCurrentLegend] = useState([]);
  const [isModalOpenDataFlag, setIsModalOpenDataFlag] = useState(false);

  const buttonList = permissionButton(location.pathname);
  const RWGYText = ModalTypeNameConversion('人为干预');
  const GZText = ModalTypeNameConversion('故障原因');

  //   let tempSelectedNames = [];
  // let legendSelected = {};

  const legendList = [
    {
      text: RWGYText,
      value: 'ren',
      color: '#722ed1',
    },
    {
      text: '故障',
      value: 'gu',
      color: '#ff4d4f',
    },
    {
      text: '运行管理异常',
      value: 'run',
      color: '#faad14',
    },
    {
      text: '数据现象异常',
      value: 'xian',
      color: '#797979',
    },
    {
      text: '数据上传标记',
      value: 'upload',
      color: '#1890ff',
    },
  ];

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
    pointInfo,
    chartPollutantList,
    defaultShowType,
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
    let legend = {};
    // 默认选中氧含量、烟气湿度、烟气温度、流速
    pollutantNames.map((item, index) => {
      // 根据不同模型选中污染物
      if (defaultChartSelected.length) {
        if (defaultChartSelected.includes(pollutantCodes[index])) {
          legend[item] = true;
        } else {
          legend[item] = false;
        }
      } else {
        legend[item] = true;
      }
    });

    /**
     * 如果和报警污染物匹配不上的话，则全部选中，并加上报警的污染物
     */
    const allFalse = Object.values(legend).every(value => value === false);
    // 如果所有属性值都是 false，则将它们全部转换为 true
    if (allFalse) {
      Object.keys(legend).forEach(key => {
        legend[key] = true;
      });

      // 加上报警的污染物
      defaultChartSelected.map(item => {
        if (getPollutantNameByCode[item]) {
          legend[getPollutantNameByCode[item]] = true;
        }
      });
    }
    legendSelected = legend;
  };

  // 获取报警数据
  const GetAllTypeDataList = () => {
    const values = form.getFieldsValue();
    let beginTime = values.time[0].format('YYYY-MM-DD HH:mm:ss');
    let endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss');
    if (moment().format('YYYY-MM-DD') === values.time[1].format('YYYY-MM-DD')) {
      endTime = moment(endTime)
        .add(-1, 'hour')
        .format('YYYY-MM-DD HH:mm:ss');
    }

    dispatch({
      type: 'AbnormalIdentifyModel/GetAllTypeDataListForModel',
      payload: {
        DGIMNs: DGIMN,
        beginTime: beginTime,
        endTime: endTime,
        pollutantCodes: values.pollutantCodes.toString(),
        isAsc: true,
        IsSupplyData: false,
        quotaType: props.quotaType,
        ModelGuid: props.ModelGuid,
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
            title: RWGYText,
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
            title: GZText,
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
          {
            title: '运行管理异常',
            dataIndex: 'WCOperationFlag',
            key: 'WCOperationFlag',
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
            title: RWGYText,
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
          {
            title: '运行管理异常',
            dataIndex: 'QHOperationFlag',
            key: 'QHOperationFlag',
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

  const getOption = isEditing => {
    // if (!echartRef) {
    //   return {};
    // }

    const values = form.getFieldsValue();
    const { pollutantCodes = [] } = values;
    let series = [];
    let xAxisData = [];
    let yxisData = [];
    let idx = 0;
    let leftIdx = 0,
      rightIdx = 0;

    if (!pollutantCodes || !pollutantCodes.length) {
      return {};
    }
    pollutantCodes.map((pollutant, index) => {
      let name = selectedNames[index];

      // 定位y轴位置
      let _position = 'right';
      if (position.left.includes(pollutant)) {
        _position = 'left';
        if (legendSelected[name]) {
          leftIdx += 1;
        }
      } else {
        if (legendSelected[name]) {
          rightIdx += 1;
        }
      }

      yxisData.push({
        type: 'value',
        name: name,
        code: pollutant,
        alignTicks: true,
        position: _position,
        offset: _position === 'left' ? (leftIdx - 1) * spacing : (rightIdx - 1) * spacing,
        nameLocation: 'end',
        nameRotate: 30,
        show: legendSelected[name],
        axisLine: {
          show: true,
        },
        nameTextStyle: {
          fontSize: 10,
        },
        axisLabel: {
          // inside: !!spacing[name],
          rotate: rotateLabels.includes(name) ? 46 : 0,
        },
      });
      let serieData = [];
      allTypeDataList.map(item => {
        serieData = serieData.concat(
          item[pollutant] !== undefined && item[pollutant] !== '-' ? item[pollutant] * 1 : '-',
        );
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
        showSymbol: true,
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
            return 5;
          } else {
            return 20;
          }
        },
      });
    });

    let showIndex = yxisData.findIndex(item => item.show === true);

    // 异常工况数据
    let markAreaData = [];
    let continuousItem = []; // 停运工况
    let continuousItem1 = []; // 正常工况缺失
    let continuousItem2 = []; // 停运工况缺失
    let continuousItem3 = []; // 停炉工况
    let continuousItem4 = []; // 启炉工况
    // 人为干预和故障数据
    let RenAndGuData = [];
    if (showIndex > -1) {
      allTypeDataList.map((item, idx) => {
        let index = 0;
        // interval = 0.05;
        let min = _.min(series[showIndex].data);
        let max = _.maxBy(series[showIndex].data, item => {
          if (isNaN(item)) {
            return 0;
          }
          return item;
        });

        // 时间数据
        xAxisData.push(item.MonitorTime);
        // 绘制正常工况缺失
        {
          let flag = item.ModelQHFlag || item.ModelWCFlag;
          // 开始
          if (flag === 'NormalMiss' && !continuousItem1.length) {
            continuousItem1.push({
              name: '缺失',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(0,0,0, 0)',
              },
            });
          }
          // 结束
          if (flag !== 'NormalMiss' && continuousItem1.length) {
            continuousItem1.push({
              name: '缺失',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(0,0,0, 0)',
              },
            });

            markAreaData.push(continuousItem1);
            continuousItem1 = [];
          } else if (flag === 'NormalMiss' && idx === allTypeDataList.length - 1) {
            continuousItem1.push({
              name: '缺失',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(0,0,0, 0)',
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
              name: '缺失',
              xAxis: item.MonitorTime,
            });
          }
          // 结束
          if (flag !== 'StopMiss' && continuousItem2.length) {
            continuousItem2.push({
              name: '缺失',
              xAxis: item.MonitorTime,
            });

            markAreaData.push(continuousItem2);
            continuousItem2 = [];
          } else if (flag === 'StopMiss' && idx === allTypeDataList.length - 1) {
            continuousItem2.push({
              name: '缺失',
              xAxis: item.MonitorTime,
            });

            markAreaData.push(continuousItem2);
            continuousItem2 = [];
          }
        }
        // 绘制启炉工况
        {
          let flag = item.ModelWCFlag || item.ModelQHFlag;
          // 开始
          if (flag === '启炉' && !continuousItem4.length) {
            continuousItem4.push({
              name: '启炉',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(0, 255, 255, 0.13)',
              },
            });
          }
          // 结束
          if (flag !== '启炉' && continuousItem4.length) {
            continuousItem4.push({
              name: '启炉',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(0, 255, 255, 0.13)',
              },
            });

            markAreaData.push(continuousItem4);
            continuousItem4 = [];
          } else if (flag === '启炉' && idx === allTypeDataList.length - 1) {
            continuousItem4.push({
              name: '启炉',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(0, 255, 255, 0.13)',
              },
            });

            markAreaData.push(continuousItem4);
            continuousItem4 = [];
          }
        }
        // 绘制停炉工况
        {
          let flag = item.ModelWCFlag || item.ModelQHFlag;
          // 开始
          if (flag === '停炉' && !continuousItem3.length) {
            continuousItem3.push({
              name: '停炉',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(255, 0, 0, 0.13)',
              },
            });
          }
          // 结束
          if (flag !== '停炉' && continuousItem3.length) {
            continuousItem3.push({
              name: '停炉',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(255, 0, 0, 0.13)',
              },
            });

            markAreaData.push(continuousItem3);
            continuousItem3 = [];
          } else if (flag === '停炉' && idx === allTypeDataList.length - 1) {
            continuousItem3.push({
              name: '停炉',
              xAxis: item.MonitorTime,
              itemStyle: {
                color: 'rgba(255, 0, 0, 0.13)',
              },
            });

            markAreaData.push(continuousItem3);
            continuousItem3 = [];
          }
        }
        // 绘制停炉工况
        {
          let flag = item.ModelWCFlag || item.ModelQHFlag;
          // 开始
          if (flag === '停运' && !continuousItem.length) {
            continuousItem.push({
              name: '停运',
              xAxis: item.MonitorTime,
            });
          }
          // 结束
          if (flag !== '停运' && continuousItem.length) {
            continuousItem.push({
              name: '停运',
              xAxis: item.MonitorTime,
            });

            markAreaData.push(continuousItem);
            continuousItem = [];
          } else if (flag === '停运' && idx === allTypeDataList.length - 1) {
            continuousItem.push({
              name: '停运',
              xAxis: item.MonitorTime,
            });

            markAreaData.push(continuousItem);
            continuousItem = [];
          }
        }
        // 绘制人为干预、设备故障时间线
        {
          // 人为干预
          let RenStatus = item.WCArtificialFlag || item.QHArtificialFlag;
          // 设备故障
          let GuStatus = item.WCFaultFlag || item.QHFaultFlag;
          // 运行管理异常
          let CEMSRunStatus = item.WCOperationFlag || item.QHOperationFlag;
          // 数据现象异常
          let dataExcept = item.WCShortDataExcept;
          // 数据上传标记
          let dataFlag = item.WCPollutantFlag;

          // 运行管理异常
          if (CEMSRunStatus) {
            // index++;
            let yAxis = 0;
            if (min < 0) {
              yAxis = min - (min / 50) * 3;
            } else {
              yAxis = (max / 50) * 3;
            }
            // var yAxisScale = echartRef.getModel().getComponent('yAxis', 0).axis.scale;
            // console.log('yAxisScale', yAxisScale);

            RenAndGuData.push({
              yAxis: yAxis,
              xAxis: item.MonitorTime,
              symbol: 'circle',
              symbolSize: 6,
              type: 'run',
              itemStyle: {
                color: '#faad14',
              },
            });
          }

          // 故障
          if (GuStatus) {
            let yAxis = 0;
            // index++;
            if (min < 0) {
              yAxis = min - (min / 50) * 2;
            } else {
              yAxis = (max / 50) * 2;
            }
            RenAndGuData.push({
              yAxis: yAxis,
              xAxis: item.MonitorTime,
              symbol: 'circle',
              symbolSize: 6,
              type: 'gu',
              itemStyle: {
                color: '#ff4d4f',
              },
            });
          }

          // 人为干预
          if (RenStatus) {
            let yAxis = 0;
            // index++;
            if (min < 0) {
              yAxis = min - (min / 50) * 1;
            } else {
              yAxis = (max / 50) * 1;
            }
            RenAndGuData.push({
              yAxis: yAxis,
              xAxis: item.MonitorTime,
              symbol: 'circle',
              symbolSize: 6,
              type: 'ren',
              itemStyle: {
                color: '#722ed1',
              },
            });
          }

          // 数据现象异常
          if (dataExcept) {
            let yAxis = 0;
            // index++;
            if (min < 0) {
              yAxis = min - (min / 50) * 4;
            } else {
              yAxis = (max / 50) * 4;
            }
            RenAndGuData.push({
              yAxis: yAxis,
              xAxis: item.MonitorTime,
              symbol: 'circle',
              symbolSize: 6,
              type: 'xian',
              itemStyle: {
                // color: '#eb2f96',
                color: '#797979',
              },
            });
          }

          // 数据上传标记
          if (dataFlag) {
            let yAxis = 0;
            // index++;
            if (min < 0) {
              yAxis = min - (min / 50) * 5;
            } else {
              yAxis = (max / 50) * 5;
            }
            RenAndGuData.push({
              yAxis: yAxis,
              xAxis: item.MonitorTime,
              symbol: 'circle',
              symbolSize: 6,
              type: 'upload',
              itemStyle: {
                color: '#1890ff',
              },
            });
          }
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
            lineStyle: { color: color },
            label: {
              position: 'end',
              fontSize: 13,
              color: color,
              formatter: function(params) {
                return item.name;
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

    let brushObj = {};
    if (isEditing) {
      brushObj = {
        brush: {
          type: ['lineX'],
          title: {
            lineX: '框选',
          },
        },
      };
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
            let dataFlag = currentData[item.seriesId + '_Flag'] || '';

            value += `
              <p style="line-height: 20px; margin-bottom: 0;">
                ${item.marker} ${item.seriesName}： ${item.value}
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

          // 数据特征识别：数据现象异常
          let WCDataExcept = currentData.WCShortDataExcept
            ? currentData.WCShortDataExcept.split(',')
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
                <p>
                  <span>工况：<span style="color: ${WorkConColor}; font-weight: bold">${ModelWCFlag ||
            '-'}</span>
            <span style="margin-left: 10px;">上报工况：<span style="color: ${
              currentData.WorkCon === '正常' ? '#52c41a' : '#faad14'
            }">${currentData.WorkCon || '-'}</span>
                </p>
                <div>
                  <div style="display: inline-block;vertical-align: top;">${RWGYText}：</div>
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
                <div style="margin-top: 4px; display: 'block'}">
                  <div style="display: inline-block;vertical-align: top;">运行管理异常：</div>
                  <div  style="display: inline-block;">
                    ${WCOperationFlag.length ? WCOperationFlag.join('<br/>') : '-'}
                  </div>
                </div>
                <div style="margin-top: 4px; display: 'block'}">
                  <div style="display: inline-block;vertical-align: top;">数据现象异常：</div>
                  <div  style="display: inline-block;">
                    ${WCDataExcept.length ? WCDataExcept.join('<br/>') : '-'}
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
                  <div style="display: inline-block;vertical-align: top;">${RWGYText}：</div>
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
                <div style="margin-top: 4px; display: 'block'}">
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
        top: 0,
        selected: legendSelected,
      },
      grid: {
        top: 90,
        left: (_.values(legendSelected).filter(item => item === true).length / 2) * 24,
        right: (_.values(legendSelected).filter(item => item === true).length / 2) * 24,
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          dataZoom: {
            show: true,
            yAxisIndex: 'none',
            title: {
              zoom: '区域缩放',
              back: '区域缩放还原',
            },
          },
          restore: { show: true, title: '还原' },
          saveAsImage: { show: true, title: '保存为图片' },
          ...brushObj,
          // brush: {
          //   type: ['lineX', 'clear'],
          // },
        },
      },

      // dataZoom: [
      //   {
      //     show: true,
      //     realtime: true,
      //     start: 0,
      //     end: 100,
      //   },
      // ],
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: xAxisData,
      },
      yAxis: yxisData,
      series: series,
    };

    if (isEditing) {
      option.brush = {
        toolbox: ['lineX'],
        xAxisIndex: 0,
      };
    }

    // console.log('option', option)
    return option;
  };

  //
  const onChartLegendChange = (value, param) => {
    let selected = value.selected;
    let name = value.name;
    // // 处理选中图例
    // if (_.values(selected).filter(item => item === true).length > 6) {
    //   message.error('最多选择6个显示');
    //   value.selected[name] = false;
    //   selected = {
    //     ...value.selected,
    //   };
    // }
    let echarts_instance = echartRef.getEchartsInstance();
    let option = echarts_instance.getOption();

    // 处理y轴
    let yAxis = option.yAxis,
      leftIdx = 0,
      rightIdx = 0;
    let yData = yAxis.map((item, index) => {
      // 定位y轴位置
      let _position = 'right';
      if (position.left.includes(item.code)) {
        _position = 'left';
        if (selected[item.name]) {
          leftIdx += 1;
        }
      } else {
        if (selected[item.name]) {
          rightIdx += 1;
        }
      }

      return {
        ...item,
        position: _position,
        offset: _position === 'left' ? (leftIdx - 1) * spacing : (rightIdx - 1) * spacing,
        show: selected[item.name],
      };
    });
    // 计算图表左右边距
    let grid = option.grid[0];
    let yAxisSelectedLength = _.values(selected).filter(item => item === true).length;
    grid.left = (yAxisSelectedLength / 2) * 24;
    grid.right = (yAxisSelectedLength / 2) * 24;

    // 处理series的mark跟随最新图例显示
    let series = option.series;
    let firstIndex = _.values(selected).findIndex(item => item === true);
    let markIndex = series.findIndex(item => item.markLine || item.markPoint || item.markArea);
    if (firstIndex > -1 && markIndex > -1 && firstIndex !== markIndex) {
      //
      series[firstIndex].markLine = series[markIndex].markLine;
      series[firstIndex].markPoint = series[markIndex].markPoint;
      series[firstIndex].markArea = series[markIndex].markArea;
      series[markIndex].markLine = undefined;
      series[markIndex].markPoint = undefined;
      series[markIndex].markArea = undefined;
    }
    legendSelected = selected;
    echarts_instance.setOption({
      legend: {
        selected: { ...selected },
      },
      yAxis: yData,
      grid: grid,
      series: series,
    });
  };

  const onBrushEnd = params => {
    let { areas } = params;
    if (areas.length) {
      let range = areas[0].coordRange;

      let rangeStart = allTypeDataList[range[0]].MonitorTime;
      let rangeEnd = allTypeDataList[range[1]].MonitorTime;
      setCurrentBrushRangeDate([rangeStart, rangeEnd]);
      setBrushRangeIndex(range);
    } else {
      setCurrentBrushRangeDate([]);
      setBrushRangeIndex([]);
    }

    // GetAllTypeDataList();
  };

  const onDataZoom = params => {
    // setCurrentBrushRangeDate([]);
    // setBrushRangeIndex([]);
    const batch = params.batch;
    if (batch) {
      let positionData = params.batch[0];
      setDataZoomPosition([positionData.startValue, positionData.endValue]);
    }
  };

  const onChartRestore = params => {
    // setCurrentBrushRangeDate([]);
    // setBrushRangeIndex([]);
    setDataZoomPosition([]);
  };

  const onEvents = {
    legendselectchanged: onChartLegendChange,
    // brush: onBrushEnd,
    brushEnd: onBrushEnd,
    dataZoom: onDataZoom,
    restore: onChartRestore,
  };

  // 修改数据工况
  const updateWorkCon = () => {
    setUpdateLoading(true);
    let start = brushRangeIndex[0];
    let end = brushRangeIndex[1];

    dispatch({
      type: 'AbnormalIdentifyModel/UpdateHourDataWCFlag',
      payload: {
        dgimn: DGIMN,
        beginTime: moment(currentBrushRangeDate[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(currentBrushRangeDate[1]).format('YYYY-MM-DD HH:mm:ss'),
        wcFlag: updatedModelWCFlag,
      },
      callback: () => {
        // 更新图表
        const allTypeDataList_temp = [...allTypeDataList];
        let ModelWCFlag = ModelWCFlagEnum[updatedModelWCFlag];
        allTypeDataList_temp.slice(start, end).forEach(obj => (obj.ModelWCFlag = ModelWCFlag));
        setAllTypeDataList(allTypeDataList_temp);
        setCurrentBrushRangeDate([]);
        setUpdateLoading(false);
      },
    });
  };

  const renderEcharts = useMemo(() => {
    return (
      <ReactEcharts
        ref={e => {
          if (e) {
            setEchartRef(e);
          }
        }}
        theme="light"
        option={getOption()}
        lazyUpdate
        // notMerge
        id="rightLine"
        onEvents={onEvents}
        style={{ marginTop: 34, width: '100%', height: props.chartHeight || 'calc(100vh - 304px)' }}
      />
    );
  }, [allTypeDataList, echartRef]);

  const editingEcharts = useMemo(() => {
    return (
      <ReactEcharts
        ref={e => {
          // echartRef = e;
          if (e) {
            const echartInstance = e.getEchartsInstance();
            echartInstance.dispatchAction({
              type: 'takeGlobalCursor',
              key: 'brush',
              brushOption: {
                brushType: 'lineX', // 指定选框类型
              },
            });

            if (dataZoomPosition.length)
              echartInstance.dispatchAction({
                type: 'dataZoom',
                // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
                // dataZoomIndex: number,
                // 开始位置的百分比，0 - 100
                // start: number,
                // // 结束位置的百分比，0 - 100
                // end: number,
                // 开始位置的数值
                startValue: dataZoomPosition[0],
                // 结束位置的数值
                endValue: dataZoomPosition[1],
              });
          }
        }}
        onChartReady={e => {}}
        theme="light"
        option={getOption(true)}
        // lazyUpdate
        // notMerge
        id="rightLine"
        onEvents={onEvents}
        style={{ marginTop: 34, width: '100%', height: 'calc(100vh - 210px)' }}
      />
    );
  }, [allTypeDataList, legendSelected]);

  // 图例点击
  const onClickLegend = (data, checked) => {
    let tag = data.value;
    let selectedTags = [...currentLegend];
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);

    let echarts_instance = echartRef.getEchartsInstance();
    let option = echarts_instance.getOption();
    let markIndex = option.series.findIndex(item => item.markPoint);

    option.series[markIndex].markPoint.data.forEach(item => {
      if (!nextSelectedTags.length || nextSelectedTags.includes(item.type)) {
        item.itemStyle.opacity = 1;
      } else {
        item.itemStyle.opacity = 0;
      }
    });

    setCurrentLegend(nextSelectedTags);
    echarts_instance.setOption({
      ...option,
    });
  };

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
        style={{ display: chartPollutantList ? 'none' : '', position: 'relative' }}
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

        <Form.Item style={{ paddingTop: 1 }}>
          <Input.Group compact>
            <Button
              onClick={() => {
                let time = form.getFieldValue('time');
                form.setFieldsValue({
                  time: [
                    moment(time[0]).subtract(1, 'month'),
                    moment(time[1]).subtract(1, 'month'),
                  ],
                });
              }}
            >
              上一月
            </Button>
            <Form.Item name="time">
              <RangePicker_
                style={{ width: 260 }}
                dataType={'Day'}
                format={'YYYY-MM-DD'}
                allowClear={false}
              />
            </Form.Item>
            <Button
              style={{ marginRight: 16 }}
              onClick={() => {
                let time = form.getFieldValue('time');
                form.setFieldsValue({
                  time: [moment(time[0]).add(1, 'month'), moment(time[1]).add(1, 'month')],
                });
              }}
            >
              下一月
            </Button>
          </Input.Group>
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
        {!defaultShowType && (
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
        )}
        <Space style={{ position: 'absolute', right: 0, top: 0 }}>
          {props.displayType == 'modal' && pointInfo && buttonList.includes('UpdateDataScript') && (
            // {true && (
            <Button
              type="primary"
              onClick={() => {
                setIsModalOpenDataFlag(true);
              }}
              // style={{ position: 'absolute', right: 0, top: 50 }}
            >
              修改数据标记
            </Button>
          )}
          {// 弹窗不显示编辑功能
          props.displayType !== 'modal' && (
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              // style={{ position: 'absolute', right: 12, top: 0 }}
            >
              编辑图表
            </Button>
          )}
          {props.entCode && (
            <Button
              type="primary"
              onClick={() => setIsStopRecordModalOpen(true)}
              // style={{ position: 'absolute', right: 12, top: 0 }}
            >
              停运记录
            </Button>
          )}
        </Space>
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
          scroll={{ y: props.tableHeight || 'calc(100vh - 390px)' }}
        />
      ) : tableLoading == false && !pollutantLoading ? (
        // false ? (
        <>
          {/* <ReactEcharts
            // ref={e => {
            //   echartRef = e;
            // }}
            theme="light"
            option={getOption()}
            // lazyUpdate
            // notMerge
            id="rightLine"
            onEvents={onEvents}
            style={{ marginTop: 34, width: '100%', height: 'calc(100vh - 304px)', ...chartStyle }}
          /> */}
          {renderEcharts}

          <Row justify="center" style={{ width: '100%', marginTop: -10 }}>
            <Space size={20}>
              {legendList.map(item => {
                return (
                  <CheckableTag
                    style={{
                      backgroundColor: 'transparent',
                      padding: '2px 10px',
                      cursor: 'pointer',
                      borderRadius: 0,
                      marginRight: 0,
                      border: currentLegend.includes(item.value) ? `1px solid ${item.color}` : '',
                    }}
                    key={item.value}
                    checked={currentLegend.indexOf(item.value) > -1}
                    onChange={checked => onClickLegend(item, checked)}
                  >
                    <Badge
                      color={item.color}
                      text={
                        <span
                          style={{ color: currentLegend.includes(item.value) ? item.color : '' }}
                        >
                          {item.text}
                        </span>
                      }
                    />
                  </CheckableTag>
                );
              })}
            </Space>
          </Row>
        </>
      ) : (
        <Row justify="center" style={{ width: '100%' }}>
          <div className="example">
            <Spin tip="加载中..." />
          </div>
        </Row>
      )}

      <Modal
        title="编辑数据工况"
        wrapClassName="fullScreenModal"
        open={isModalOpen}
        destroyOnClose
        // open={false}
        footer={[]}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrentBrushRangeDate([]);
          setBrushRangeIndex([]);
          setDataZoomPosition([]);
        }}
      >
        {currentBrushRangeDate.length ? (
          <Alert
            message={
              <div>
                {`已选择时间：${currentBrushRangeDate[0]} - ${currentBrushRangeDate[1]}`},
                可将数据工况修改为
                <Select
                  style={{ width: 100, margin: '0 6px' }}
                  placeholder="请选择"
                  onChange={value => {
                    setUpdatedModelWCFlag(value);
                  }}
                >
                  <Option value="">正常</Option>
                  <Option value="Fa">停炉</Option>
                  <Option value="Sta">启炉</Option>
                  <Option value="Fb">停运</Option>
                </Select>
                <Button type="primary" loading={updateLoading} onClick={e => updateWorkCon()}>
                  修改
                </Button>
              </div>
            }
            type="info"
            showIcon
          />
        ) : (
          <Alert message="请框选时间！" type="warning" showIcon />
        )}
        <Spin spinning={updateLoading}>{editingEcharts}</Spin>
        <Row justify="center" style={{ width: '100%' }}>
          <Space size={20}>
            <Badge
              // status="processing"
              color="#722ed1"
              text={RWGYText}
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
      </Modal>
      {isModalOpenDataFlag && (
        <UpdateDataFlag
          pointInfo={pointInfo}
          warningId={props.warningId}
          open={isModalOpenDataFlag}
          onCancel={() => {
            setIsModalOpenDataFlag(false);
          }}
        />
      )}
      <Modal
        title="停运记录"
        wrapClassName="fullScreenModal"
        open={isStopRecordModalOpen}
        destroyOnClose
        // open={false}
        footer={[]}
        onCancel={() => {
          setIsStopRecordModalOpen(false);
        }}
      >
        {isStopRecordModalOpen && (
          <StopRecord
            hideBreadcrumb
            time={form.getFieldValue('time')}
            DGIMN={DGIMN}
            entCode={props.entCode}
          />
        )}
      </Modal>
    </>
  );
};

WarningDataAndChart.defaultProps = {
  defaultChartSelected: ['01', '02', '03', 's01', 's03', 's02'],
  warningDate: [],
  chartStyle: {},
};

export default connect(dvaPropsData)(WarningDataAndChart);
