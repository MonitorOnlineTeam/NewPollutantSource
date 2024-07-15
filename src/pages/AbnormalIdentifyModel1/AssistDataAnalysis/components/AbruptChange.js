import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Spin,
  Button,
  Radio,
  Select,
  Space,
  Popover,
  Badge,
  message,
  InputNumber,
  Row,
} from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import { WarningOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

let tempSelectedNames = [];
let tempSelectPollutantList = [];

const dvaPropsData = ({ loading, common, AbnormalIdentifyModel }) => ({
  pollutantListByDgimn: common.pollutantListByDgimn,
  loading: !!loading.effects['AbnormalIdentifyModel/GetAbruptChangeData'],
  updateLoading: !!loading.effects['AbnormalIdentifyModel/UpdAbruptLinear'],
});

const AbruptChange = props => {
  const [form] = Form.useForm();

  const [showType, setShowType] = useState('chart');
  const [columns, setColumns] = useState([]);
  const [selectPollutantList, SetSelectPollutantList] = useState([]);
  const [abruptChangeData, setAbruptChangeData] = useState({});
  const [coefficientData, setCoefficientData] = useState({});
  const [flag, setFlag] = useState('normal');

  const {
    dispatch,
    DGIMN,
    pollutantListByDgimn,
    date,
    echartBoxHeight,
    tableHeight,
    loading,
    updateLoading,
  } = props;

  useEffect(() => {
    DGIMN && getPollutantListByDgimn();
  }, [DGIMN]);

  // useEffect(() => {
  //   GetAbruptChangeData();
  // }, [flag]);

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
        GetAbruptChangeData();
      },
    }).then(() => {});
  };

  // 获取数据现象
  const GetAbruptChangeData = (body = {}) => {
    let values = form.getFieldsValue();
    dispatch({
      type: 'AbnormalIdentifyModel/GetAbruptChangeData',
      payload: {
        DGIMN: DGIMN,
        beginTime: moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        pollutantCodes: values.pollutantCodes.toString(),
        flag: flag,
        ReExcu: false,
        ...body,
      },
      callback: res => {
        setAbruptChangeData(res);
        setCoefficientData(res);
      },
    });
  };

  // 重新生成
  const UpdAbruptLinear = pollutantCode => {
    dispatch({
      type: 'AbnormalIdentifyModel/UpdAbruptLinear',
      payload: {
        DGIMN: DGIMN,
        pollutantCodes: pollutantCode,
        flag: flag,
        up: coefficientData[pollutantCode].up,
        down: coefficientData[pollutantCode].down,
      },
      callback: res => {
        GetAbruptChangeData({
          ReExcu: true,
        });
      },
    });
  };

  const getOption = chartData => {
    if (!chartData) {
      return {};
    }

    let currentPollutant = selectPollutantList.find(
      item => item.PollutantName === chartData.PollutantName,
    );
    let unit = currentPollutant.Unit || '';

    let markAreaData = [];

    // 陡升
    chartData.upTimeList.map(item => {
      let data = [
        {
          name: name,
          xAxis: item.split('~')[0],
          itemStyle: {
            color: 'rgba(255, 0, 0, 0.13)',
          },
          // label: {
          //   color: '#1890ff',
          // },
        },
        {
          xAxis: item.split('~')[1],
          itemStyle: {
            color: 'rgba(255, 0, 0, 0.13)',
          },
        },
      ];
      markAreaData.push(data);
    });

    // 陡降
    chartData.downTimeList.map(item => {
      let data = [
        {
          name: name,
          xAxis: item.split('~')[0],
          itemStyle: {
            color: 'rgba(0, 255, 255, 0.13)',
          },
          // label: {
          //   color: '#1890ff',
          // },
        },
        {
          xAxis: item.split('~')[1],
          itemStyle: {
            color: 'rgba(0, 255, 255, 0.13)',
          },
        },
      ];
      markAreaData.push(data);
    });

    let markLine = [];
    if (chartData.down && chartData.up) {
      markLine = [
        {
          yAxis: chartData.down,
        },
        {
          yAxis: chartData.up,
        },
      ];
    }
    return {
      title: [
        {
          text: chartData.PollutantName + '_数据图',
          left: 'center',
          top: 0,
        },
        {
          text: chartData.PollutantName + '_差分图',
          left: 'center',
          top: 300,
        },
      ],
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          animation: false,
        },
        formatter: function(params) {
          console.log('params', params);
          let str = '';
          params.forEach((m, index) => {
            let _unit = m.seriesName !== '差分' ? unit : '';
            str += `<div style="padding: 4px 0;">
                  <span class="chart-tooltip-color" style="display: inline-block; margin-right: 10px; background-color: ${
                    m.color
                  }; width: 10px; height: 10px; border-radius:100%; margin-right: 5px"></span>
                  ${m.seriesName}：${m.data == undefined ? '-' : m.data} ${_unit}<br/>
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
            show: true,
            title: {
              zoom: '区域缩放',
              back: '区域缩放还原',
            },
          },
          restore: { show: true, title: '还原' },
          saveAsImage: { show: true, title: '保存为图片' },
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
      grid: [
        {
          bottom: '60%',
        },
        {
          top: '60%',
        },
      ],
      xAxis: [
        {
          data: chartData.dateList,
        },
        {
          data: chartData.dateList,
          gridIndex: 1,
          // min: chartData.down,
        },
      ],
      yAxis: [
        {},
        {
          gridIndex: 1,
        },
      ],
      series: [
        {
          name: '原始数据',
          type: 'line',
          showSymbol: false,
          data: chartData.orDataList,
          markArea: {
            // itemStyle: {
            //   color: 'rgba(255, 173, 177, 0.4)',
            // },
            // label: {
            //   color: 'red',
            // },
            data: markAreaData,
          },
        },
        {
          name: '5小时滑动平均',
          type: 'line',
          showSymbol: false,
          data: chartData.oneDataList,
        },
        {
          name: '10小时滑动平均',
          type: 'line',
          showSymbol: false,
          data: chartData.twoDataList,
        },
        {
          name: '差分',
          type: 'line',
          showSymbol: false,
          data: chartData.chaDataList,
          xAxisIndex: 1,
          yAxisIndex: 1,
          markLine: {
            data: markLine,
          },
        },
      ],
    };
  };

  console.log('loading', loading);
  console.log('abruptChangeData', abruptChangeData);

  return (
    <>
      <Form
        form={form}
        layout="inline"
        initialValues={{
          time: date,
          pollutantCodes: [],
          flag: 'normal',
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
        {/* <Form.Item name="flag">
          <Select placeholder="系数类型" style={{ width: 150 }}>
            <Option value="normal">陡变判断系数</Option>
            <Option value="stop">启停炉陡变判断系数</Option>
          </Select>
        </Form.Item> */}
        <Space>
          <Button
            type="primary"
            onClick={() => {
              if (!tempSelectPollutantList.length) {
                message.error('请选择污染物！');
                return;
              }
              SetSelectPollutantList(tempSelectPollutantList);
              GetAbruptChangeData();
            }}
            loading={loading}
          >
            查询
          </Button>
          <Spin spinning={loading}>
            <Radio.Group
              defaultValue={flag}
              optionType="button"
              buttonStyle="solid"
              style={{ marginLeft: 20 }}
              onChange={e => {
                setFlag(e.target.value);
                GetAbruptChangeData({ flag: e.target.value });
              }}
            >
              <Radio.Button value={'normal'}>陡变判断系数</Radio.Button>
              <Radio.Button value={'stop'}>启停炉陡变判断系数</Radio.Button>
            </Radio.Group>
          </Spin>
          <div style={{ position: 'absolute', right: 12, top: 0 }}>
            <span
              style={{
                padding: '0px 14px',
                background: 'rgba(255, 0, 0, 0.13)',
                display: 'inline-block',
                lineHeight: '32px',
              }}
            >
              陡升
            </span>
            <span
              style={{
                padding: '0px 14px',
                background: 'rgba(0, 255, 255, 0.13)',
                display: 'inline-block',
                lineHeight: '32px',
              }}
            >
              陡降
            </span>
          </div>
        </Space>
      </Form>
      <div
        style={{
          height: echartBoxHeight || 'calc(100vh - 250px)',
          overflowY: 'auto',
          // marginTop: 20,
        }}
      >
        {selectPollutantList.map(item => {
          return (
            <Spin spinning={loading}>
              <Card
                // loading={loading}
                size="small"
                type="inner"
                style={{ marginTop: 20 }}
                bodyStyle={{ minHeight: 650 }}
                title={
                  <div className="innerCardTitle">
                    {abruptChangeData[item.PollutantCode]?.PollutantName}
                  </div>
                }
                extra={
                  // loading || !abruptChangeData[item.PollutantCode] ? (
                  //   ''
                  // ) : (
                  <Space>
                    <span>
                      {flag === 'stop' ? '启停炉' : ''}陡升判断系数:{' '}
                      <InputNumber
                        value={coefficientData[item.PollutantCode]?.up}
                        onChange={value => {
                          let coefficientData_temp = { ...coefficientData };
                          coefficientData_temp[item.PollutantCode].up = value;
                          setCoefficientData(coefficientData_temp);
                        }}
                      />
                    </span>
                    <span>
                      {flag === 'stop' ? '启停炉' : ''}陡降判断系数:{' '}
                      <InputNumber
                        value={coefficientData[item.PollutantCode]?.down}
                        onChange={value => {
                          let coefficientData_temp = { ...coefficientData };
                          coefficientData_temp[item.PollutantCode].down = value;
                          setCoefficientData(coefficientData_temp);
                        }}
                      />
                    </span>
                    <Button
                      type="primary"
                      loading={updateLoading}
                      onClick={() => UpdAbruptLinear(item.PollutantCode)}
                    >
                      重新生成
                    </Button>
                  </Space>
                  // )
                }
              >
                <ReactEcharts
                  theme="light"
                  option={getOption(abruptChangeData[item.PollutantCode])}
                  lazyUpdate
                  notMerge
                  id="rightLine"
                  style={{ marginTop: 34, width: '100%', height: 600 }}
                />
              </Card>
            </Spin>
          );
        })}
      </div>
    </>
  );
};

export default connect(dvaPropsData)(AbruptChange);
