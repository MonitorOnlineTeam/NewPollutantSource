import React, { useState, useEffect } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Space,
  Modal,
  Input,
  Button,
  Select,
  Radio,
  Form,
} from 'antd';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { ExportOutlined } from '@ant-design/icons';
import moment from 'moment';
import EmergencyDetailInfo from '@/pages/EmergencyTodoList/EmergencyDetailInfo';
import SdlTable from '@/components/SdlTable';

const { Option } = Select;
const dvaPropsData = ({ loading, exceptionrecordNew, missingData }) => ({
  exceptionAlarmListForEntDataSource: exceptionrecordNew.exceptionAlarmListForEntDataSource,
  attentionList: missingData.attentionList,
  loading: loading.effects['exceptionrecordNew/getExceptionAlarmListForEnt'],
  exportLoading: loading.effects['exceptionrecordNew/exportExceptionAlarmListForEnt'],
});

const Index = props => {
  const [form] = Form.useForm();
  const [dataType, setDataType] = useState('HourData');
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  // const [dataSource, setDataSource] = useState([]);

  const {
    dispatch,
    attentionList,
    loading,
    exportLoading,
    exceptionAlarmListForEntDataSource,
  } = props;

  useEffect(() => {
    dispatch({ type: 'missingData/getAttentionDegreeList', payload: { RegionCode: '' } }); //获取关注列表
    getTableData();
  }, []);

  const getTableData = () => {
    let values = form.getFieldsValue();
    dispatch({
      type: 'exceptionrecordNew/getExceptionAlarmListForEnt',
      payload: {
        ...values,
        time: undefined,
        beginTime: moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        RegionCode: '',
        OperationPersonnel: '',
        ResponseStatus: '0',
        regionLevel: 3,
      },
    });
  };

  const attentchildren = () => {
    const selectList = [];
    if (attentionList.length > 0) {
      attentionList.map(item => {
        selectList.push(
          <Option key={item.AttentionCode} value={item.AttentionCode}>
            {item.AttentionName}
          </Option>,
        );
      });
      return selectList;
    }
  };

  //
  const onExport = () => {
    let values = form.getFieldsValue();
    dispatch({
      type: 'exceptionrecordNew/exportExceptionAlarmListForEnt',
      payload: {
        ...values,
        time: undefined,
        beginTime: moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        RegionCode: '',
        OperationPersonnel: '',
        ResponseStatus: '0',
        regionLevel: 3,
      },
    });
  };

  const columns = [
    {
      title: '序号',
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
    },
    {
      title: '数据类型',
      dataIndex: 'DataType',
      key: 'DataType',
    },
    {
      title: '首次报警时间',
      dataIndex: 'FirstTime',
      key: 'FirstTime',
    },
    {
      title: '报警生成时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
    },
    {
      title: '报警类型',
      dataIndex: 'ExceptionTypeName',
      key: 'ExceptionTypeName',
      width: 100,
    },
    {
      title: '报警信息',
      dataIndex: 'AlarmMsg',
      key: 'AlarmMsg',
      width: 300,
    },
    {
      title: '响应状态',
      dataIndex: 'ResponseStatusName',
      key: 'ResponseStatusName',
    },
    {
      title: '响应人',
      dataIndex: 'OperationName',
      key: 'OperationName',
      render: (text, record) => {
        if (record.CompleteTime === '0001-01-01 00:00:00') {
          return '-';
        }
        return text ? text : '-';
      },
    },
    {
      title: '响应时间',
      dataIndex: 'CompleteTime',
      key: 'CompleteTime',
      align: 'center',
      render: (text, record) => {
        if (record.CompleteTime === '0001-01-01 00:00:00') {
          return '-';
        }
        return text ? text : '-';
      },
    },
    {
      title: '处理详情',
      align: 'center',
      render: (text, record) => {
        if (record.TaskId && record.DGIMN) {
          return (
            <a
              onClick={() => {
                <a
                  onClick={() => {
                    setCurrentRow(record);
                    setOpen(true);
                  }}
                >
                  详情
                </a>;
              }}
            >
              详情
            </a>
          );
        }
        return '-';
      },
    },
  ];

  return (
    <BreadcrumbWrapper>
      <Card
        bordered={false}
        title={
          <Form
            form={form}
            layout="inline"
            initialValues={{
              //   BeginTime: moment()
              //   .subtract(1, 'day')
              //   .format('YYYY-MM-DD 00:00:00'),
              // EndTime: moment().format('YYYY-MM-DD 23:59:59'),
              DataType: 'HourData',
              time: [moment().subtract(1, 'day'), moment()],
            }}
          >
            <Row style={{ width: '100%', marginBottom: 12 }}>
              <Form.Item name="DataType" label="数据类型">
                <Select
                  placeholder="数据类型"
                  style={{ width: 181 }}
                  onChange={value => {
                    let _time = [moment().subtract(1, 'day'), moment()];
                    if (value === 'DayData') {
                      _time = [moment().subtract(1, 'month'), moment()];
                    }
                    form.setFieldsValue({ time: _time });
                  }}
                >
                  <Option key="0" value="HourData">
                    小时
                  </Option>
                  <Option key="1" value="DayData">
                    日均
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item label="日期查询" name="time">
                <RangePicker_
                  format="YYYY-MM-DD"
                  allowClear={false}
                  style={{ width: '231px', marginRight: '10px' }}
                />
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="关注程度" name="AttentionCode">
                <Select allowClear placeholder="关注程度" style={{ width: 181 }}>
                  {attentchildren()}
                </Select>
              </Form.Item>
              <Form.Item label="响应状态" name="Status">
                <Radio.Group style={{ width: 181 }}>
                  <Radio.Button value="">全部</Radio.Button>
                  <Radio.Button value="1">已响应</Radio.Button>
                  <Radio.Button value="0">待响应</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item style={{ marginLeft: 16 }}>
                <Space>
                  <Button type="primary" loading={loading} onClick={getTableData}>
                    查询
                  </Button>
                  <Button
                    style={{ margin: '0 5px' }}
                    icon={<ExportOutlined />}
                    onClick={onExport}
                    loading={exportLoading}
                  >
                    导出
                  </Button>
                </Space>
              </Form.Item>
            </Row>
          </Form>
        }
      >
        <SdlTable
          rowKey={(record, index) => `complete${index}`}
          loading={loading}
          columns={columns}
          dataSource={exceptionAlarmListForEntDataSource}
        />
      </Card>
      <Modal
        title="任务详情"
        open={open}
        wrapClassName="spreadOverModal"
        mask={false}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <EmergencyDetailInfo DGIMN={currentRow.DGIMN} TaskID={currentRow.TaskID} />
      </Modal>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Index);
