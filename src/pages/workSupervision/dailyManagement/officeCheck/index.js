import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Row,
  Col,
  message,
  Progress,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from '../styles.less';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import TaskCompletionRecord from './TaskCompletionRecord';
import ChecklistRecordAndManagement from './ChecklistRecordAndManagement';
import { permissionButton } from '@/utils/utils';
const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`wordSupervision/GetOfficeCheckStatisticsForRegion`],
  exportLoading: loading.effects[`wordSupervision/ExportOfficeCheckStatisticsForRegion`],
});

const OfficeCheck = props => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [regionCode, setRegionCode] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [mode, setMode] = useState(); // 1: 办事处检查管理 空：办事处检查纪律
  
  const buttonList = permissionButton(props.match.path);
  const { dispatch, queryLoading, exportLoading } = props;

  useEffect(() => {
    getPageData();
  }, []);

  // 获取页面数据
  const getPageData = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'wordSupervision/GetOfficeCheckStatisticsForRegion',
      payload: {
        beginTime: values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].endOf('months').format('YYYY-MM-DD HH:mm:ss'),
      },
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // 导出
  const onExport = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'wordSupervision/ExportOfficeCheckStatisticsForRegion',
      payload: {
        beginTime: values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].endOf('months').format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        // width: 40,
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
        ellipsis: true,
        width: 'auto',
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: text === '合计' ? 2 : 1 },
          };
        },
      },
      {
        title: '省份',
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
        // width: 200,
        width: 'auto',
        render: (text, record, index) => {
          return {
            children: (
              text
            ),
            props: { colSpan: record.LargeRegion === '合计' ? 0 : 1 },
          };
        },
      },
      {
        title: '应完成任务数量',
        dataIndex: 'CompletedCount',
        key: 'CompletedCount',
        ellipsis: true,
        width: 'auto',
        render: (text, record, index) => {
          return  <a
                onClick={() => {
                  setIsModalOpen(true);
                  setRegionCode(record.RegionCode);
                }}
              >
                {text}
              </a>
          
        },
      },
      {
        title: '实际完成任务数量',
        dataIndex: 'CompletedCountYes',
        key: 'CompletedCountYes',
        ellipsis: true,
        // width: 180,
        width: 'auto',
      },
      {
        title: '任务完成率',
        dataIndex: 'CompletedRate',
        key: 'CompletedRate',
        ellipsis: true,
        // width: 200,
        width: 'auto',
        sorter: (a, b) => {
          if (a.RegionCode !== 'All' && b.RegionCode !== 'All') {
            return a.CheckRate - b.CheckRate;
          }
        },
        render: (text, record) => {
          let percent = text.replace('%', '');
          return (
            <Progress
              percent={percent == '-' ? 0 : percent}
              size="small"
              style={{ width: '80%' }}
              status={percent * 1 < 100 ? 'exception' : 'normal'}
              format={percent => (
                <span style={{ color: 'rgba(0,0,0,.8)' }}>
                  {percent == '-' ? percent : percent + '%'}
                </span>
              )}
            />
          );
        },
      },
    ];

    return columns;
  };

  // 搜索组件
  const SearchComponents = () => {
    return (
      <div>
        <Form
          id="searchForm"
          form={form}
          // layout="inline"
          initialValues={{
            time: [
              moment()
                .subtract(1, 'month')
                .startOf('month'),
              moment()
                .subtract(1, 'month')
                .endOf('month'),
            ],
          }}
          autoComplete="off"
        >
          <Space align="middle">
            <Form.Item name="time" label="任务派发时间">
              <RangePicker
                style={{ width: '100%' }}
                picker="month"
                format="YYYY-MM"
                allowClear={false}
              />
            </Form.Item>
            <Form.Item>
              <Space style={{ marginLeft: 10 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={queryLoading}
                  onClick={() => {
                    getPageData();
                  }}
                >
                  查询
                </Button>
                <Button
                  type="primary"
                  icon={<ExportOutlined />}
                  loading={exportLoading}
                  onClick={() => {
                    onExport();
                  }}
                >
                  导出
                </Button>
                {buttonList.includes('officeManagement') && (
                  <Button
                    type="primary"
                    onClick={() => {
                      setIsModalOpen2(true);
                      setMode('management');
                    }}
                  >
                    办事处检查管理
                  </Button>
                )}
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalOpen2(true);
                    setMode('record');
                  }}
                >
                  办事处检查记录
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </div>
    );
  };

  return (
    <BreadcrumbWrapper>
      <Card title={<SearchComponents />}>
        <SdlTable
          scroll={{x:840}}
          loading={queryLoading}
          align="center"
          dataSource={dataSource}
          columns={getColumns()}
          pagination={false}
        />
      </Card>
      {isModalOpen && (
        <TaskCompletionRecord
          time={form.getFieldValue('time')}
          regionCode={regionCode}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}
      {// 办事处检查记录和管理
      isModalOpen2 && (
        <ChecklistRecordAndManagement
          mode={mode}
          open={isModalOpen2}
          onCancel={() => {
            setIsModalOpen2(false);
          }}
        />
      )}
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(OfficeCheck);
