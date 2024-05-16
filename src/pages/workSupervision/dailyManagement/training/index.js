/*
 * @Author: JiaQi
 * @Date: 2024-05-10 14:18:41
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-15 20:01:11
 * @Description:  人员培训
 */
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

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`wordSupervision/GetPersonTrainForRegion`],
  exportLoading: loading.effects[`wordSupervision/ExportPersonTrainForRegion`],
});

const Training = props => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [regionCode, setRegionCode] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [mode, setMode] = useState(); // 1: 办事处检查管理 空：办事处检查纪律

  const buttonList = permissionButton(props.match.path);
  const {
    dispatch,
    queryLoading,
    exportLoading,
    match: {
      params: { type }, // 区分成套还是运维 ct: 成套 、operation: 运维
    },
  } = props;

  useEffect(() => {
    getPageData();
  }, []);

  // 获取页面数据
  const getPageData = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'wordSupervision/GetPersonTrainForRegion',
      payload: {
        type: type === 'ct' ? '1' : undefined,
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
      type: 'wordSupervision/ExportPersonTrainForRegion',
      payload: {
        type: type === 'ct' ? '1' : undefined,
        beginTime: values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].endOf('months').format('YYYY-MM-DD HH:mm:ss'),
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
          if (type === 'ct') {
            return text;
          }
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
          // if (type === 'ct') {
          //   return text;
          // }
          return {
            children: text,
            // <a
            //   onClick={() => {
            //     setIsModalOpen(true);
            //     setRegionCode(record.RegionCode);
            //   }}
            // >
            //   {text}
            // </a>
            props: { colSpan: record.LargeRegion === '合计' ? 0 : 1 },
          };
        },
      },
      {
        title: '应完成任务数量',
        dataIndex: 'CompletedCount',
        key: 'CompletedCount',
        ellipsis: true,
        render: (text, record) => {
          // if (type === 'ct') {
          return (
            <a
              onClick={() => {
                setIsModalOpen(true);
                setRegionCode(
                  type === 'ct'
                    ? record.LargeRegionCode || undefined
                    : record.RegionCode || undefined,
                );
              }}
            >
              {text}
            </a>
          );
          // }
          // return text;
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

    if (type === 'ct') {
      // 成套不显示省份
      columns = columns.filter(item => item.dataIndex !== 'RegionName');
    }

    return columns;
  };

  // 搜索组件
  const SearchComponents = () => {
    return (
      <div>
        <Form
          // id="searchForm"
          form={form}
          layout="inline"
          initialValues={{
            time: [
              moment()
                .subtract(1, 'month')
                .startOf('months'),
              moment()
                .subtract(1, 'month')
                .endOf('months'),
            ],
          }}
          autoComplete="off"
        >
          <Space>
            <Form.Item name="time" label="任务派发时间">
              <RangePicker_
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
                {/* {buttonList.includes('officeManagement') && ( */}
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalOpen2(true);
                    setMode('management');
                  }}
                >
                  人员培训管理
                </Button>
                {/* )} */}
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalOpen2(true);
                    setMode('record');
                  }}
                >
                  人员培训记录
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
          type={type}
          time={form.getFieldValue('time')}
          regionCode={regionCode}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}
      {// 记录和管理
      isModalOpen2 && (
        <ChecklistRecordAndManagement
          type={type}
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

export default connect(dvaPropsData)(Training);
