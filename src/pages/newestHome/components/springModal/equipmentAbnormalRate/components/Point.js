/**
 * 功  能：设备完好率
 * 创建人：jab
 * 创建时间：2021.2.24
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Card,
  Button,
  Select,
  Progress,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
  Radio,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import { ExportOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
const { Option } = Select;

const namespace = 'equipmentAbnormalRate';

const dvaPropsData = ({ loading, equipmentAbnormalRate, global }) => ({
  tableDatas: equipmentAbnormalRate.pointTableDatas,
  tableLoading: loading.effects[`${namespace}/pointGetExecptionRateList`],
  exportLoading: equipmentAbnormalRate.exportPointLoading,
  clientHeight: global.clientHeight,
  queryPar: equipmentAbnormalRate.queryPar,
  coommonCol: equipmentAbnormalRate.coommonCol,
  coommonCol2: equipmentAbnormalRate.coommonCol2,
  failcoommonCol2: equipmentAbnormalRate.failcoommonCol2,
  pointTableQuery: equipmentAbnormalRate.pointTableQuery,
});

const dvaDispatch = dispatch => {
  return {
    updateState: payload => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      });
    },
    pointGetExecptionRateList: payload => {
      // 监测点详情
      dispatch({
        type: `${namespace}/pointGetExecptionRateList`,
        payload: payload,
      });
    },
    exportExecptionRateList: payload => {
      // 导出
      dispatch({
        type: `${namespace}/exportExecptionRateList`,
        payload: payload,
      });
    },
  };
};
const Index = props => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [dates, setDates] = useState([]);
  const {
    tableDatas,
    tableLoading,
    exportLoading,
    clientHeight,
    type,
    time,
    queryPar,
    coommonCol,
    coommonCol2,
    failcoommonCol2,
    operationSetType,
    deviceType,
    pointTableQuery,
  } = props;

  useEffect(() => {
    getPageData();

    // 卸载时重置表单
    return () => {
      form.resetFields();
    };
  }, []);

  const getPageData = () => {
    let values = form.getFieldsValue();
    props.pointGetExecptionRateList({
      ...queryPar,
      // entName: entName,
      pointType: 3,
      type: operationSetType,
      taskType: deviceType,
      ...values,
      time: undefined,
      beginTime: values.time ? values.time?.[0]?.format('YYYY-MM-DD') : queryPar.beginTime,
      endTime: values.time ? values.time?.[1]?.format('YYYY-MM-DD') : queryPar.endTime,
    });
  };

  const exports = async () => {
    let values = form.getFieldsValue();
    props.exportExecptionRateList({
      ...queryPar,
      ...pointTableQuery,
      pointType: 3,
      type: operationSetType,
      taskType: deviceType,
      ...values,
      time: undefined,
      beginTime: values.time ? values.time?.[0]?.format('YYYY-MM-DD') : queryPar.beginTime,
      endTime: values.time ? values.time?.[1]?.format('YYYY-MM-DD') : queryPar.endTime,
    });
  };
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: '省/市',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
    },
    ...coommonCol,
  ];
  const assessmentCentreCol = deviceType == 1 ? coommonCol2 : failcoommonCol2;
  const columns2 = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: '省',
      dataIndex: 'provinceName',
      key: 'provinceName',
      align: 'center',
      render: (text, record, index) => {
        if (text == '全部合计') {
          return { props: { colSpan: 0 } };
        }
        return text;
      },
    },
    {
      title: '市',
      dataIndex: 'cityName',
      key: 'cityName',
      align: 'center',
      render: (text, record) => {
        const name = record.provinceName == '全部合计' ? '全部合计' : text;
        return {
          props: { colSpan: record.provinceName == '全部合计' ? 2 : 1 },
          children: name,
        };
      },
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
    },
    {
      title: '站点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
    },
    ...assessmentCentreCol,
  ];
  return (
    <div>
      <Form
        form={form}
        layout="inline"
        initialValues={{
          time: [moment(queryPar.beginTime), moment(queryPar.endTime)],
          pollutantType: queryPar.pollutantType,
        }}
      >
        <Form.Item label="日期" name="time" style={{ paddingRight: '16px' }}>
          <RangePicker_ allowClear={false} style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="监测点类型" name="pollutantType" style={{ paddingRight: '16px' }}>
          <Select placeholder="请选择" style={{ width: 150 }} allowClear>
            <Option value={2}>废气</Option>
            <Option value={1}>废水</Option>
          </Select>
        </Form.Item>
        <Form.Item name="entName" label="企业名称">
          <Input placeholder="请输入企业名称" allowClear />
        </Form.Item>
        <Form.Item style={{ paddingBottom: '16px' }}>
          <Button
            type="primary"
            loading={tableLoading}
            style={{ margin: '0 8px' }}
            onClick={() => {
              getPageData();
            }}
          >
            查询
          </Button>
          <Button
            icon={<ExportOutlined />}
            loading={exportLoading}
            onClick={() => {
              exports();
            }}
          >
            导出
          </Button>
        </Form.Item>
      </Form>
      <SdlTable
        loading={tableLoading}
        bordered
        dataSource={tableDatas}
        columns={operationSetType == 1 ? columns2 : columns}
        scroll={{ y: clientHeight - 500 }}
        pagination={false}
      />
    </div>
  );
};
export default connect(
  dvaPropsData,
  dvaDispatch,
)(Index);
