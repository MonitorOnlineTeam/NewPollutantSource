import React, { useState, useEffect } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import MissingData from '../components/MissingData';
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
import SelectPollutantType from '@/components/SelectPollutantType';
import { ExportOutlined } from '@ant-design/icons';
import moment from 'moment';
import { downloadFile } from '@/utils/utils';
import EmergencyDetailInfo from '@/pages/EmergencyTodoList/EmergencyDetailInfo';
import SdlTable from '@/components/SdlTable';

const { Option } = Select;
const dvaPropsData = ({ loading, missingData }) => ({
  tableDatil: missingData.tableDatil,
  attentionList: missingData.attentionList,
  loading: loading.effects['missingData/getDefectPointDetail'],
});

const Index = props => {
  const [form] = Form.useForm();
  const [dataType, setDataType] = useState('HourData');
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  // const [dataSource, setDataSource] = useState([]);

  const { dispatch, attentionList, loading, tableDatil } = props;

  useEffect(() => {
    dispatch({ type: 'missingData/getAttentionDegreeList', payload: { RegionCode: '' } }); //获取关注列表
    getTableData();
  }, []);

  const getTableData = () => {
    let values = form.getFieldsValue();
    dispatch({
      type: 'missingData/getDefectPointDetail',
      payload: {
        ...values,
        time: undefined,
        BeginTime: moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        EndTime: moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        EntCode: '',
        RegionCode: '',
        EntType: '1',
        OperationPersonnel: '',
        regionLevel: 2,
        staticType: 3,
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

  //创建并获取模板   导出
  const template = () => {
    let values = form.getFieldsValue();
    dispatch({
      type: 'missingData/exportDefectPointDetail',
      payload: {
        ...values,
        time: undefined,
        BeginTime: moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        EndTime: moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        EntCode: '',
        RegionCode: '',
        EntType: '1',
        OperationPersonnel: '',
        regionLevel: 2,
        staticType: 3,
      },
      callback: data => {
        downloadFile(`${data}`);
      },
    });
  };
  const columns = [
    {
      title: '序号',
    },
    {
      title: <span>{'企业名称'}</span>,
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      width: 250,
      render: (text, record) => {
        return <div style={{ textAlign: 'left', width: '100%' }}>{text}</div>;
      },
    },
    {
      title: <span>监测点名称</span>,
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      render: (text, record) => {
        return <div style={{ textAlign: 'left', width: '100%' }}>{text}</div>;
      },
    },
    {
      title: <span>{'首次缺失时间'}</span>,
      dataIndex: 'firstTime',
      key: 'firstTime',
      // width: '10%',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) =>
        Number(moment(new Date(a.firstTime)).valueOf()) -
        Number(moment(new Date(b.firstTime)).valueOf()),
      //   render: (text, record) => {
      //     return  <div>{ moment( new Date(text)).valueOf()}</div>
      //  },
    },
    {
      title: <span>报警生成时间</span>,
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
    },
    {
      title: <span>报警信息</span>,
      dataIndex: 'message',
      key: 'message',
      align: 'center',
      width: 250,
      render: (text, record) => {
        return <div style={{ textAlign: 'left', width: '100%' }}>{text}</div>;
      },
    },
    {
      title: <span>响应状态</span>,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text, record) => {
        return text == 0 ? '待响应' : '已响应';
      },
    },
    {
      title: <span>响应人</span>,
      dataIndex: 'operationName',
      key: 'operationName',
      align: 'center',
      render: (text, record) => {
        return record.status == 0 ? '-' : text;
      },
    },
    {
      title: <span>响应时间</span>,
      dataIndex: 'xiangyingTime',
      key: 'xiangyingTime',
      align: 'center',
    },
    {
      title: <span>处理详情</span>,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text, record) => {
        return !text ? (
          ''
        ) : (
          <a
            onClick={() => {
              setCurrentRow(record);
              setOpen(true);
            }}
          >
            详情
          </a>
        );
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
                    onClick={template}
                    loading={false}
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
          columns={columns.filter(item => !item.hidden)}
          dataSource={tableDatil}
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
