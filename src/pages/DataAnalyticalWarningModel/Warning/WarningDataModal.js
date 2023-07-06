import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Tabs, Form, Space, Button, Select, Radio, message, Spin } from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import styles from '../styles.less';
import SdlTable from '@/components/SdlTable';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import PollutantImages from '@/pages/DataAnalyticalWarningModel/Warning/components/PollutantImages';
import { formatPollutantPopover } from '@/utils/utils';

const COLOR = '#e6b8b7';
let tempSelectedNames = [];

const dvaPropsData = ({ loading, dataModel, common }) => ({
  pollutantListByDgimn: common.pollutantListByDgimn,
  allTypeDataList: dataModel.allTypeDataList,
  tableLoading: loading.effects['dataModel/GetAllTypeDataListForModel'],
  exportLoading: loading.effects['dataModel/ExportHourDataForModel'],
});

const WarningData = props => {
  const [form] = Form.useForm();
  const {
    dispatch,
    onCancel,
    visible,
    DGIMN,
    pollutantListByDgimn,
    date,
    allTypeDataList,
    tableLoading,
    exportLoading,
    PointName,
  } = props;
  const [columns, setColumns] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [legendSelected, setLegendSelected] = useState({});
  const [units, setUnits] = useState({});
  const [images, setImages] = useState([]);
  const [showType, setShowType] = useState('data');

  useEffect(() => {
    getPollutantListByDgimn();
    getImages();
  }, [DGIMN]);

  // useEffect(() => {
  //   getOption();
  // }, [allTypeDataList]);

  //

  // const onCancel = () => {
  //   setVisible(false);
  // };

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

        // 处理图例
        let legendSelected = {};
        pollutantNames.map((item, index) => {
          if (index < 6) {
            legendSelected[item] = true;
          } else {
            legendSelected[item] = false;
          }
        });
        setLegendSelected(legendSelected);
      },
    }).then(() => {});
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
    const values = form.getFieldsValue();
    const { pollutantCodes } = values;
    let series = [];
    let seriesFlag = {};
    let xAxisData = [];
    let WorkConData = {};
    let yxisData = [];
    let idx = 0;

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
        offset: idx <= 3 ? idx * 60 : (idx - 3) * 60,
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
        symbol: (value, params) => {
          // console.log('params', params);
          let flag = seriesFlag[params.seriesName][params.dataIndex];
          if (flag === '正常(N)' || flag === '') {
            return 'circle';
          } else {
            return 'triangle';
          }
        },
        symbolSize: (value, params) => {
          // console.log('value', value);
          // console.log('params', params);
          let flag = seriesFlag[params.seriesName][params.dataIndex];
          if (flag === '正常(N)' || flag === '') {
            return 4;
          } else {
            return 20;
          }
        },
      });
      seriesFlag[selectedNames[index]] = seriesFlagdata;
    });

    let markAreaData = [];
    let continuousItem = [];
    allTypeDataList.map((item, idx) => {
      // 时间数据
      xAxisData.push(item.MonitorTime);
      // 数据标识
      WorkConData[item.MonitorTime] = item.WorkCon || '-';
      // 异常工况数据

      // 异常工况开始
      if (item.WorkCon_Status && !continuousItem.length) {
        continuousItem.push({
          name: '异常工况',
          xAxis: item.MonitorTime,
        });
      }

      // 异常工况结束
      if (!item.WorkCon_Status && continuousItem.length) {
        continuousItem.push({
          name: '异常工况',
          xAxis: item.MonitorTime,
        });

        markAreaData.push(continuousItem);
        continuousItem = [];
      }
    });

    // 绘制异常工况阴影
    series[0].markArea = {
      itemStyle: {
        color: 'rgba(0,0,0, .1)',
      },
      data: markAreaData,
    };

    // series.map(item => {
    //   item.markArea = {
    //     itemStyle: {
    //       color: 'rgba(0,0,0, .1)',
    //     },
    //     data: markAreaData,
    //   };
    // })

    console.log('yxisData', yxisData);
    console.log('series', series);
    // console.log('xAxisData', xAxisData);
    // console.log('legendSelected', legendSelected);
    // console.log('seriesFlag', seriesFlag);
    let option = {
      color: ['#38a2da', '#32c5e9', '#e062ae', '#e690d1', '#8279ea', '#9D97F6', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#c23531', '#c4ccd3', '#61a0a8'],
      // color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      // color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
      tooltip: {
        trigger: 'axis',
        formatter: function(params, ticket) {
          //x轴名称 params[0]
          let date = params[0].axisValue;
          let WorkCon = `工况：${WorkConData[date]}`;

          //值
          let value = '';
          params.map(item => {
            value += `${item.marker} ${item.seriesName}: ${item.value} ${units[item.seriesName]}
            ${seriesFlag[item.seriesName][item.dataIndex]}<br />`;
          });

          return date + '<br />' + WorkCon + '<br />' + value;
        },
      },
      legend: {
        data: selectedNames,
        selected: legendSelected,
      },
      grid: {
        left: 150,
        right: 150,
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
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

  // 获取波动范围图表
  const getImages = () => {
    if (DGIMN) {
      dispatch({
        type: 'dataModel/GetPointParamsRange',
        payload: {
          DGIMN,
        },
        callback: res => {
          setImages(res.image);
        },
      });
    }
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

  console.log('legendSelected', legendSelected);
  console.log('selectedNames', selectedNames);
  console.log('units', units);
  // console.log('option', option);

  return (
    <Modal
      title={`报警关联数据（${PointName}）`}
      destroyOnClose
      visible={visible}
      wrapClassName="spreadOverModal"
      footer={false}
      onCancel={() => onCancel()}
      bodyStyle={{ paddingTop: 6 }}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="数据列表" key="1">
          <Form
            form={form}
            layout="inline"
            initialValues={{
              time: date,
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
                    <Option
                      value={item.PollutantCode}
                      key={item.PollutantCode}
                      data-unit={item.Unit}
                    >
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
                defaultValue={'data'}
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
          ) : (
            <ReactEcharts
              theme="light"
              option={getOption()}
              lazyUpdate
              notMerge
              id="rightLine"
              onEvents={onEvents}
              style={{ marginTop: 34, width: '100%', height: 'calc(100vh - 278px)' }}
            />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="波动范围" key="2">
          <PollutantImages images={images} />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(dvaPropsData)(WarningData);
