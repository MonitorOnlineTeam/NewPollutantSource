/*
 * @Author: outman0611
 * @Date: 2024-11-25 14:44:25
 * @LastEditors: outman0611
 * @LastEditTime: 2024-11-28 16:50:45
 * @Description: 管理部门拜访
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
  Divider,
  Tooltip,
  Progress,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import RecordModal from './components/RecordModal';
import { permissionButton } from '@/utils/utils';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RecordAndManagement from './components/RecordAndManagement';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`wordSupervision/GetVisitEnvironmentalForRegion`],
  exportLoading: loading.effects[`wordSupervision/ExportVisitEnvironmentalForRegion`],
});

const ReturnVisit = props => {
  const [form] = Form.useForm();

  const [date, setDate] = useState([moment().startOf('month'), moment().endOf('month')]);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [modalQueryParams, setModalQueryParams] = useState({});
  const [mode, setMode] = useState(); // 1: 管理 空：记录
  const [taskData, setTaskData] = useState({});


  const {
    queryLoading,
    dispatch,
    exportLoading,
    match: {
      params: { systemType },
    },
  } = props;
  const buttonList = permissionButton(`/workSupervision/dailyManagement/customerReturnVisit/${systemType}`);

  useEffect(() => {
    getTableDataSource();
    props.dispatch({
      type: 'wordSupervision/GetToDoDailyWorks',
      payload: {
        type: 1,
      },
      callback: (data) => {
        data = data.filter(item => item.TaskType == 4)?.[0]
        if (data) {
          setTaskData(data)
        }

      }
    });
  }, []);

  // 获取表格数据
  const getTableDataSource = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'wordSupervision/GetVisitEnvironmentalForRegion',
      payload: {
        beginTime: values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].endOf('months').format('YYYY-MM-DD 23:59:59'),
        timeType: 0,
        type: systemType,
      },
      callback: res => {
        setDataSource(res.Datas);
      },
    });
  };

  // 导出
  const onExport = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'wordSupervision/ExportVisitEnvironmentalForRegion',
      payload: {
        beginTime: values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].endOf('months').format('YYYY-MM-DD 23:59:59'),
        timeType: 0,
        type: systemType,
      },
    });
  };


  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
        ellipsis: true,
        width: 'auto',
        render: (text, record, index) => {
          if (systemType !== '1') {
            return text;
          }
          return {
            children: text,
            props: { colSpan:  record.LargeRegion === '合计'  ? 2 : 1 },
          };
        },
      },
      {
        title: '省份',
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
        width: 'auto',
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
        width: 'auto',
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                setIsModalOpen(true);
                setModalQueryParams({
                  time: form.getFieldValue('time'),
                  regionCode: record.RegionCode || undefined,
                  // LargeRegionCode:  record.LargeRegion === '合计' ? undefined : record.LargeRegionCode,
                });
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
        width: 'auto',
      },
      {
        title: '任务完成率',
        dataIndex: 'CompletedRate',
        key: 'CompletedRate',
        ellipsis: true,
        width: 'auto',
        sorter: (a, b) => {
          if (a.LargeRegion  !== '合计' && b.LargeRegion !== '合计') {
            return a.CompletedRate?.replace('%', '') - b.CompletedRate?.replace('%', '');
          }
        },
        render: (text, record) => {
          const percent = text?.replace('%', '') * 1
          const statusColor = percent  < 100 ? "#f5222d" : "#52c41a"
           return <span style={{color: statusColor}}>{text}</span>
        },
      },
    ];

    if (systemType === '2') {
      // 成套不显示省份
      columns = columns.filter(item => item.dataIndex !== 'CityName');
    }

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
                .startOf('month'),
              moment()
                .endOf('month'),
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
                    getTableDataSource();
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
                {buttonList.includes('customerSitefollowManagement') && (
                  <Button
                    type="primary"
                    onClick={() => {
                      setIsModalOpen2(true);
                      setMode('management');
                    }}
                  >
                    执法局拜访管理
                  </Button>
                )}
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalOpen2(true);
                    setMode('record');
                  }}
                >
                  执法局拜访记录
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
          scroll={{ x: 710 }}
          pagination={false}
        />
      </Card>

      {/* 应完成任务数量*/}
      {isModalOpen && (
        <RecordModal
          systemType={systemType}
          queryParams={modalQueryParams}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}
      {// 记录和管理
        isModalOpen2 && (
          <RecordAndManagement
            type={systemType}
            mode={mode}
            open={isModalOpen2}
            taskData={taskData}
            onCancel={() => {
              setIsModalOpen2(false);
            }}
          />
        )}
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(ReturnVisit);
