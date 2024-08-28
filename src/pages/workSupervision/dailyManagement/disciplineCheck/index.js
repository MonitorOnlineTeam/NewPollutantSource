/*
 * @Author: JiaQi
 * @Date: 2024-03-27 11:11:18
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-07-11 17:02:50
 * @Description:  纪律检查
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
import RecordAndManagement from './components/RecordAndManagement';
import { permissionButton } from '@/utils/utils';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const { RangePicker } = DatePicker;
moment.locale('en', {
  week: { dow: 1 } // Monday is the first day of the week
});

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`wordSupervision/GetDisciplineCheckList`],
  exportLoading: loading.effects[`wordSupervision/ExportDisciplineCheckList`],
});

const DisciplineCheck = props => {
  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [modalDataType, setModalDataType] = useState(1); // 0: 一级列表  1: 纪律检查任务完成记录  2:纪律检查记录/纪律检查管理
  const [modalQueryParams, setModalQueryParams] = useState({});
  const [mode, setMode] = useState(); // 1: 管理 空：记录


 
  const {
    queryLoading,
    dispatch,
    exportLoading,
    match: {
      params: { systemType },
    },
  } = props;

  let buttonList = [];

   buttonList = permissionButton(`/workSupervision/dailyManagement/disciplineCheck/${systemType}`);

  useEffect(() => {
    getTableDataSource();
  }, []);

  // 获取表格数据
  const getTableDataSource = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'wordSupervision/GetDisciplineCheckList',
      payload: {
        beginTime: moment(values.time[0])
          .startOf('weeks')
          .format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(values.time[1])
          .endOf('weeks')
          // .add(1, 'day')
          .format('YYYY-MM-DD 23:59:59'),
        dataType: 0,
        systemType: systemType,
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
      type: 'wordSupervision/ExportDisciplineCheckList',
      payload: {
        beginTime: moment(values.time[0])
          .startOf('weeks')
          .format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(values.time[1])
          .endOf('weeks')
          .add(1, 'day')
          .format('YYYY-MM-DD 23:59:59'),
        dataType: 0,
        systemType: systemType,
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        width: 40,
      },
      {
        title: '大区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
        width: 200,
        render: (text, record, index) => {
          if (systemType !== '1') {
            return text;
          }
          return {
            children: text,
            props: { colSpan: record.RegionCode === 'All' ? 2 : 1 },
          };
        },
      },
      {
        title: '省份',
        dataIndex: 'CityName',
        key: 'CityName',
        ellipsis: true,
        width: 200,
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: record.RegionCode === 'All' ? 0 : 1 },
          };
        },
      },
      {
        title: '应完成检查任务数量',
        dataIndex: 'ShouldCheckCount',
        key: 'ShouldCheckCount',
        ellipsis: true,
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                setIsModalOpen(true);
                setModalQueryParams({
                  time: form.getFieldValue('time'),
                  RegionCode: record.CityCode || undefined,
                  LargeRegionCode: record.RegionCode === 'All' ? undefined : record.RegionCode,
                });
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: '实际完成数量',
        dataIndex: 'AlreadyCheckCount',
        key: 'AlreadyCheckCount',
        ellipsis: true,
      },
      {
        title: '任务完成率',
        dataIndex: 'CheckRate',
        key: 'CheckRate',
        ellipsis: true,
        width: 200,
        sorter: (a, b) => {
          if (a.RegionCode !== 'All' && b.RegionCode !== 'All') {
            return a.CheckRate - b.CheckRate;
          }
        },
        render: (text, record) => {
          // let percent = Number(text).toFixed(2);
          return (
            <Progress
              percent={text == '-' ? 0 : text}
              size="small"
              style={{ width: '80%' }}
              status={text * 1 < 100 ? 'exception' : 'normal'}
              format={percent => (
                <span style={{ color: 'rgba(0,0,0,.8)' }}>{text == '-' ? text : text + '%'}</span>
              )}
            />
          );
        },
      },
    ];

    if (systemType === '2') {
      // 成套不显示省份
      columns = columns.filter(item => item.dataIndex !== 'CityName');
    }

    return columns;
  };

  const disabledDate = current => {
    // Can not select days before today and today
    return (
      current &&
      current >
        moment()
          .add(-1, 'week')
          .endOf('week')
          .add(1, 'day')
    );
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
                .subtract(1, 'weeks')
                .startOf('week'),
              moment()
                .subtract(1, 'weeks')
                .endOf('week'),
            ],
          }}
          autoComplete="off"
        >
          <Space>
            <Form.Item name="time" label="任务派发时间">
              <RangePicker picker="week" allowClear={false} />
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
                {buttonList.includes('disciplineCheck') && (
                  <Button
                    type="primary"
                    onClick={() => {
                      setIsModalOpen2(true);
                      setMode('management');
                    }}
                  >
                    纪律检查管理
                  </Button>
                )}
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalOpen2(true);
                    setMode('record');
                  }}
                >
                  纪律检查记录
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

      {/* 纪律检查管理弹窗 */}
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
          onCancel={() => {
            setIsModalOpen2(false);
          }}
        />
      )}
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(DisciplineCheck);
