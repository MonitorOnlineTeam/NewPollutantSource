import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Select, Form, Button, Space, Modal, Spin, Radio, Input, Empty } from 'antd';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { formatPollutantPopover, permissionButton } from '@/utils/utils';
import SdlTable from '@/components/SdlTable';
import { getColorByName, ModalTypeNameConversion, getPollutantNameByCode } from '../../CONST';
import ReactEcharts from 'echarts-for-react';

const COLOR = '#e6b8b7';

const spacing = 50; // Y轴间隔
const position = {
  left: ['01', '02', '03', '04', 'zs01', 'zs02', 'zs03'],
  right: ['s01', 's03', 's08', 's05', 's02', 'b02'],
}; // Y轴位置

const dvaPropsData = ({ loading, common, navigationtree }) => ({
  selectTreeItem: navigationtree.pointInfo,
  pollutantListByDgimn: common.pollutantListByDgimn,
  loading: loading.effects['AbnormalIdentifyModel/GetHistoryData'],
});

const DataViewByDataType = props => {
  const [form] = Form.useForm();
  const {
    dispatch,
    pollutantListByDgimn,
    DGIMN,
    pollutantCodes,
    open,
    onCancel,
    time,
    loading,
    dataType,
    selectTreeItem,
    warningDate,
  } = props;
  const [displayType, setDisplayType] = useState('chart');
  const [historyData, setHistoryData] = useState([]);
  const [echartRef, setEchartRef] = useState(null);

  useEffect(() => {
    if (time && pollutantCodes) {
      loadData();
    }
    
    // 添加清理函数
    return () => {
      if (echartRef && echartRef.getEchartsInstance) {
        try {
          const instance = echartRef.getEchartsInstance();
          instance.dispose();
        } catch (error) {
          console.error('清理ECharts实例失败:', error);
        }
      }
    };
  }, []);

  // 加载数据
  const loadData = () => {
    try {
      const values = form.getFieldsValue();
      if (!values.time || !values.pollutantCodes) {
        return;
      }
      let beginTime = values.time[0].format('YYYY-MM-DD HH:mm:ss');
      let endTime = values.time[1].format('YYYY-MM-DD HH:mm:ss');
      if (moment().format('YYYY-MM-DD') === values.time[1].format('YYYY-MM-DD')) {
        endTime = moment(endTime)
          .add(-1, 'hour')
          .format('YYYY-MM-DD HH:mm:ss');
      }
      dispatch({
        type: 'AbnormalIdentifyModel/GetHistoryData',
        payload: {
          ...values,
          beginTime: beginTime,
          endTime: endTime,
          pollutantCodes: values.pollutantCodes.toString(),
          dataType,
          DGIMN,
          DGIMNs: DGIMN,
          isAsc: true,
          // pageIndex: 1,
          // pageSize: 9999999,
          time: undefined,
        },
        callback: res => {
          if (res) {
            setHistoryData(res);
          }
        },
      });
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  // 获取表头
  const getColumns = () => {
    let pollutantList = pollutantListByDgimn || [];
    let columns = [
      {
        title: '时间',
        dataIndex: 'MonitorTime',
        key: 'MonitorTime',
        fixed: 'left',
      },
    ];
    pollutantList.map(item => {
      columns.push({
        title: (
          <>
            {item.PollutantName}
            <br />({item.Unit})
          </>
        ),
        dataIndex: item.PollutantCode + '_flag',
        key: item.PollutantCode + '_flag',
        render: (text, record) => {
          return text || '-';
        },
      });
    });

    // setColumns(columns);
    return columns;
  };

  // 获取图表配置
  const getOption = () => {
    if (!historyData || !historyData.length) {
      return {};
    }

    let series = [];
    let yAxis = [];
    let legend = [];
    let leftIndex = 0;
    let rightIndex = 0;

    // 获取所有时间点
    const xAxisData = historyData.map(item => item.MonitorTime);

    // 处理每个污染物
    (pollutantListByDgimn || []).forEach((item, index) => {
      const pollutantCode = item.PollutantCode;
      const pollutantName = item.PollutantName;
      const unit = item.Unit;

      // 获取该污染物的所有数据
      const data = historyData.map(record => record[pollutantCode]);

      // 确定Y轴位置和索引
      const isRight = position.right.includes(pollutantCode);
      const yAxisIndex = isRight ? rightIndex++ : leftIndex++;

      // 添加Y轴配置
      yAxis.push({
        name: `${pollutantName}`,
        type: 'value',
        position: isRight ? 'right' : 'left',
        offset: isRight ? (rightIndex - 1) * spacing : (leftIndex - 1) * spacing,
        alignTicks: true,
        nameLocation: 'end',
        nameRotate: 30,
        axisLine: {
          show: true,
        },
        nameTextStyle: {
          fontSize: 10,
        },
      });

      // 添加图例
      legend.push(pollutantName);

      // 添加数据系列
      series.push({
        id: pollutantCode,
        unit,
        name: pollutantName,
        type: 'line',
        yAxisIndex: index,
        data: data,
        symbol: 'none',
        itemStyle: {
          color: getColorByName[pollutantName],
        },
      });
    });

    // 如果有warningDate数据，为最后一个系列添加markLine
    if (warningDate && warningDate.length && series.length > 0) {
      const markLineData = warningDate.map(item => ({
        name: item.name,
        xAxis: item.date,
        lineStyle: { color: '#c23531' },
        label: {
          position: 'end',
          fontSize: 13,
          color: '#c23531',
          formatter: function(params) {
            return item.name;
          },
        },
      }));

      // 为最后一个系列添加markLine
      series[series.length - 1].markLine = {
        data: markLineData
      };
    }

    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: function(params) {
          if (!params || !params.length) return '';

          // 获取时间
          const time = moment(params[0].axisValue).format('YYYY-MM-DD HH:mm:ss');

          // 获取当前数据点的所有信息
          const { dataIndex } = params[0];
          const currentData = historyData[dataIndex];

          // 构建提示内容
          let content = `<div style="margin-bottom: 5px;">${time}</div>`;

          // 添加每个系列的数据
          params.forEach(item => {
            const { seriesId, marker, seriesName, value } = item;
            // 获取数据标记和单位
            const dataFlag = currentData[seriesId + '_flag'] || '';
            const unit = series.find(s => s.id === seriesId)?.unit || '';

            // 从dataFlag中提取标记部分
            const flagPart = dataFlag.replace(value, '').trim();

            content += `
              <div style="line-height: 20px; margin: 5px 0;">
                ${marker} 
                ${seriesName}：
                ${value === '' || value === undefined || value === null ? '-' : `${value} ${unit} (${flagPart})`}
              </div>
            `;
          });

          return content;
        },
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
        },
      },
      legend: {
        data: legend,
        type: 'scroll',
        top: 0,
        selected: legend.reduce((acc, name) => {
          acc[name] = true;
          return acc;
        }, {}),
      },
      grid: {
        top: 90,
        left: (pollutantListByDgimn.length / 2) * 24,
        right: (pollutantListByDgimn.length / 2) * 24,
        bottom: 20,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        boundaryGap: false,
      },
      yAxis: yAxis,
      series: series,
    };

    // 添加图例点击事件处理
    if (echartRef && echartRef.getEchartsInstance) {
      const instance = echartRef.getEchartsInstance();
      instance.off('legendselectchanged');
      instance.on('legendselectchanged', function(params) {
        // 获取当前所有可见的系列
        const visibleSeries = series.filter((_, index) => {
          const name = legend[index];
          return instance.getOption().legend[0].selected[name];
        });

        if (visibleSeries.length > 0) {
          // 将 markLine 移动到最后一个可见的系列
          const lastVisibleSeries = visibleSeries[visibleSeries.length - 1];
          const markLineData = warningDate.map(item => ({
            name: item.name,
            xAxis: item.date,
            lineStyle: { color: '#c23531' },
            label: {
              position: 'end',
              fontSize: 13,
              color: '#c23531',
              formatter: function(params) {
                return item.name;
              },
            },
          }));

          // 更新 markLine
          instance.setOption({
            series: series.map(s => ({
              ...s,
              markLine: s === lastVisibleSeries ? {
                // silent: true,
                // symbol: ['none', 'none'],
                data: markLineData
              } : undefined
            }))
          });
        }
      });
    }

    return option;
  };

  return (
    <Modal
      title={`${selectTreeItem.pointName} - ${dataType === 'realtime' ? '实时' : '分钟'}数据查看`}
      wrapClassName="fullScreenModal"
      open={open}
      destroyOnClose
      footer={[]}
      onCancel={() => {
        // 在关闭模态框前清理ECharts实例
        if (echartRef && echartRef.getEchartsInstance) {
          try {
            const instance = echartRef.getEchartsInstance();
            instance.dispose();
          } catch (error) {
            console.error('清理ECharts实例失败:', error);
          }
        }
        onCancel();
      }}
    >
      <Form
        form={form}
        layout="inline"
        initialValues={{
          time: time,
          pollutantCodes: pollutantCodes,
          dataType: dataType || 'realtime',
        }}
        autoComplete="off"
      >
        <Form.Item name="pollutantCodes">
          <Select
            mode="multiple"
            maxTagCount={3}
            maxTagTextLength={5}
            maxTagPlaceholder="..."
            style={{ width: 350 }}
            placeholder="请选择污染物"
            onChange={(value, option) => {
              // tempSelectedNames = option.map(item => item.children);
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
            style={{ width: 360 }}
            showTime
            // dataType={'Day'}
            // format={'YYYY-MM-DD'}
            allowClear={false}
          />
        </Form.Item>
        <Form.Item name="dataType">
          <Radio.Group
            options={[
              {
                label: '实时',
                value: 'realtime',
              },
              {
                label: '分钟',
                value: 'minute',
              },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              // if (!tempSelectedNames.length) {
              //   message.error('请选择污染物！');
              //   return;
              // }
              // setSelectedNames(tempSelectedNames);
              loadData();
            }}
            loading={loading}
          >
            查询
          </Button>
        </Space>
        <Spin spinning={loading}>
          <Radio.Group
            defaultValue={displayType}
            optionType="button"
            buttonStyle="solid"
            style={{ marginLeft: 20 }}
            onChange={e => {
              setDisplayType(e.target.value);
            }}
          >
            <Radio.Button value={'data'}>数据</Radio.Button>
            <Radio.Button value={'chart'}>图表</Radio.Button>
          </Radio.Group>
        </Spin>
      </Form>
      {displayType === 'data' && (
        <SdlTable
          loading={loading}
          columns={getColumns()}
          dataSource={historyData}
          style={{ marginTop: 34 }}
        />
      )}
      {displayType === 'chart' && (
        <>
          {loading ? (
            <div
              style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spin tip="数据加载中..." />
            </div>
          ) : !historyData || !historyData.length ? (
            <div
              style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            </div>
          ) : (
            <ReactEcharts
              ref={e => {
                if (e) {
                  setEchartRef(e);
                }
              }}
              theme="light"
              option={getOption()}
              lazyUpdate
              loading={loading}
              id="rightLine"
              notMerge={true}
              style={{
                marginTop: 34,
                width: '100%',
                height: 'calc(100% - 86px)',
              }}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default connect(dvaPropsData)(DataViewByDataType);
