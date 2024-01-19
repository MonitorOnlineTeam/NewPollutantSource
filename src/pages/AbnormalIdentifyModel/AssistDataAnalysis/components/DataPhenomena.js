/*
 * @Author: JiaQi
 * @Date: 2024-01-18 15:08:40
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-01-19 11:02:58
 * @Description:  数据现象
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Radio, Select, Space } from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';

let tempSelectedNames = [];

const dvaPropsData = ({ loading, common, AbnormalIdentifyModel }) => ({
  pollutantListByDgimn: common.pollutantListByDgimn,
  DataPhenomenaList: AbnormalIdentifyModel.DataPhenomenaList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const DataPhenomena = props => {
  const [form] = Form.useForm();

  const [showType, setShowType] = useState('chart');
  const [selectedNames, setSelectedNames] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState([]);

  const { dispatch, DGIMN, pollutantListByDgimn } = props;
  // const [visible, setVisible] = useState([]);

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
        let pollutantCodes = [],
          pollutantNames = [];
        // let units = {};

        res.map(item => {
          pollutantCodes.push(item.PollutantCode);
          pollutantNames.push(item.PollutantName);
          // units[item.PollutantName] = item.Unit;
        });
        setSelectedNames(pollutantNames);
        setSelectedCodes(pollutantCodes);
        tempSelectedNames = pollutantNames;
        // setUnits(units);
        form.setFieldsValue({ pollutantCodes: pollutantCodes });
        GetHourDataForPhenomenon();
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
        beginTime: moment(values.time[0]).format('YYYY-MM-DD HH:00:00'),
        endTime: moment(values.time[1]).format('YYYY-MM-DD HH:59:59'),
        pollutantCodes: values.pollutantCodes.toString(),
        isAsc: true,
        IsSupplyData: false,
        PhenomenonType: values.PhenomenonType,
      },
    });
  };
  //

  // const onCancel = () => {
  //   setVisible(false);
  // };

  const getOption = (code, index) => {
    const title = selectedNames[index];
    return {
      title: {
        text: title,
        left: 'center',
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
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
          time: [moment().subtract(1, 'day'), moment()],
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
              tempSelectedNames = option.map(item => item.children);
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
              if (!tempSelectedNames.length) {
                message.error('请选择污染物！');
                return;
              }
              setSelectedNames(tempSelectedNames);
              GetHourDataForPhenomenon();
            }}
            // loading={tableLoading}
          >
            查询
          </Button>
        </Space>
        <Spin spinning={false}>
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
      {selectedCodes.map((item, index) => {
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
      })}
    </>
  );
};

export default connect(dvaPropsData)(DataPhenomena);
