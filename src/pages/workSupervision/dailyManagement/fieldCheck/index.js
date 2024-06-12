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
  Modal,
  Progress,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from '../styles.less';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import TaskCompletionRecord from './TaskCompletionRecord';
import { permissionButton } from '@/utils/utils';
import SupervisionManager from '@/pages/operations/supervisionManager';
import { API } from '@config/API';
const { RangePicker } = DatePicker;
const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`wordSupervision/GetSiteInspectionForRegion`],
  exportLoading: loading.effects[`wordSupervision/ExportSiteInspectionForRegion`],
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
      type: 'wordSupervision/GetSiteInspectionForRegion',
      payload: {
        beginTime: values.time?.[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time?.[1].endOf('month').format('YYYY-MM-DD HH:mm:ss'),
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
      type: 'wordSupervision/ExportSiteInspectionForRegion',
      payload: {
        beginTime: values.time[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        width: 40,
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
        ellipsis: true,
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
        width: 200,
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: record.LargeRegion === '合计' ? 0 : 1 },
          };
        },
      },
      {
        title: '应完成任务数量',
        dataIndex: 'CompletedCount',
        key: 'CompletedCount',
        ellipsis: true,
        render: (text, record, index) => {
          return (
            <a
              onClick={() => {
                setIsModalOpen(true);
                setRegionCode(record.RegionCode);
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: '实际完成任务数量',
        dataIndex: 'CompletedCountYes',
        key: 'CompletedCountYes',
        ellipsis: true,
        width: 200,
      },
      {
        title: '任务完成率',
        dataIndex: 'CompletedRate',
        key: 'CompletedRate',
        ellipsis: true,
        width: 200,
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
          form={form}
          layout="inline"
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
          <Space>
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
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalOpen2(true);
                    setMode('record');
                  }}
                >
                  现场检查记录
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
      {// 现场检查记录
      isModalOpen2 && (
        <Modal
          title="现场检查记录"
          wrapClassName={`spreadOverModal`}
          open={isModalOpen2}
          destroyOnClose
          footer={null}
          onCancel={() => {
            setIsModalOpen2(false);
          }}
        >
          <SupervisionManager
            isRecord
            hideBreadcrumb
            match={props.match}
            queryApiName={API.DailyManagement.FieldCheckApi.GetSiteInspectionList}
            exportApiName={API.DailyManagement.FieldCheckApi.ExportSystemFacilityVerificationList}
          />
        </Modal>
      )}
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(OfficeCheck);
