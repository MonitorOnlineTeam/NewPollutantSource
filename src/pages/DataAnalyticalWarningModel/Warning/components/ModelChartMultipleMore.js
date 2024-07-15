import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Form, Space, Button, Spin } from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  loading: loading.effects['dataModel/GetAllTypeDataListForModel2'],
});

const ModelChartMultipleBig = props => {
  const [form] = Form.useForm();
  const [seriesData, setSeriesData] = useState([]);
  const [xAxisData, setxAxisData] = useState([]);

  const {
    dispatch,
    onCancel,
    visible,
    title,
    params,
    WarningTypeCode,
    PointNames,
    loading,
  } = props;
  const { date, DGIMNs, pollutantCodes } = params;
  // const [visible, setVisible] = useState([]);

  useEffect(() => {
    form.setFieldsValue({ date: [moment(date[0]), moment(date[1])] });
    GetAllTypeDataListForModel2();
  }, [DGIMNs]);


  // 获取数据
  const GetAllTypeDataListForModel2 = () => {
    const values = form.getFieldsValue();
    console.log('values', values);
    dispatch({
      type: 'dataModel/GetAllTypeDataListForModel2',
      payload: {
        DGIMNs: DGIMNs.toString(),
        beginTime: moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(values.date[1]).format('YYYY-MM-DD HH:mm:ss'),
        pollutantCodes: _.uniq(pollutantCodes).toString(),
        isAsc: true,
        IsSupplyData: false,
      },
      callback: res => {
        let xAxis = [];
        let seriesData = DGIMNs.map((item, index) => {
          xAxis = res[item].map(itm => itm.MonitorTime);
          return res[item].map(itm => itm[pollutantCodes[index]]);
        });
        setSeriesData(seriesData);
        setxAxisData(xAxis);
      },
    });
  };

  const getOption = () => {
    // 多Y轴（同一现场借用其他合格监测设备数据，引用错误、虚假的原始信号值 ）
    let isMultipleYAxis =
      WarningTypeCode === 'ab2bf5ec-3ade-43fc-a720-c8fd92ede402' ||
      WarningTypeCode === 'f021147d-e7c6-4c1d-9634-1d814ff9880a';

    let yAxisData = isMultipleYAxis
      ? []
      : {
          type: 'value',
        };

    let newSeries = seriesData.map((item, index) => {
      let yAxisIndex = {};
      if (isMultipleYAxis) {
        yAxisIndex = {
          yAxisIndex: index,
        };
        yAxisData.push({
          type: 'value',
          name: PointNames[index],
          alignTicks: true,
          nameLocation: 'middle',
          nameGap: 35,
          // nameLocation: 'end',
          axisLine: {
            show: true,
          },
        });
      }
      return {
        name: PointNames[index],
        data: item,
        type: 'line',
        ...yAxisIndex,
      };
    });

    return {
      color: ['#5470c6', '#91cc75'],
      title: {
        text: title,
        left: 'center',
      },
      legend: {
        // selectedMode: 'single',
        x: 'center', // 可设定图例在左、右、居中
        y: 'bottom', // 可设定图例在上、下、居中
        padding: [15, 30, 0, 0], // 可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
      },
      tooltip: {
        trigger: 'axis',
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
      grid: {
        left: 40,
        right: 60,
        bottom: 30,
        top: 70,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        splitLine: {
          show: true,
        },
      },
      yAxis: yAxisData,
      series: newSeries,
    };
  };

  // const onCancel = () => {
  //   setVisible(false);
  // };

  return (
    <Modal
      title={title}
      destroyOnClose
      wrapClassName={'spreadOverModal'}
      visible={visible}
      footer={false}
      onCancel={() => onCancel()}
    >
      <Form form={form} layout="inline" initialValues={{}} autoComplete="off">
        <Form.Item name="date">
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
              GetAllTypeDataListForModel2();
            }}
            loading={loading}
          >
            查询
          </Button>
        </Space>
      </Form>
      {seriesData.length ? (
        <ReactEcharts
          showLoading={loading}
          option={getOption()}
          lazyUpdate
          style={{ height: 'calc(100vh - 240px)', width: '100%', marginTop: '30px' }}
        />
      ) : (
        <div className="example">
          <Spin tip="Loading..." />
        </div>
      )}
    </Modal>
  );
};

export default connect(dvaPropsData)(ModelChartMultipleBig);
