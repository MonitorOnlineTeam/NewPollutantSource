/*
 * @Author: JiaQi
 * @Date: 2024-03-27 11:11:18
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-03-28 13:39:04
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
import { permissionButton } from '@/utils/utils';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects[`disciplineCheck/GetDisciplineCheckList`],
  exportLoading: loading.effects[`disciplineCheck/ExportDisciplineCheckList`],
});

const DisciplineCheck = props => {
  const [form] = Form.useForm();

  const [date, setDate] = useState([
    moment()
      .add(-1, 'week')
      .startOf('week')
      .add(1, 'day'),
    moment().startOf('week'),
    // .add(-1, 'day'),
  ]);
  const [dataSource, setDataSource] = useState([]);
  const [modalTitle, setModalTitle] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDataType, setModalDataType] = useState(1); // 0: 一级列表  1: 纪律检查任务完成记录  2:纪律检查记录/纪律检查管理
  const [modalQueryParams, setModalQueryParams] = useState({});

  const buttonList = permissionButton(props.match.path);
  const { queryLoading, dispatch, exportLoading } = props;

  useEffect(() => {
    getLargeRegion();
    getTableDataSource();
  }, []);

  // 获取表格数据
  const getTableDataSource = () => {
    dispatch({
      type: 'disciplineCheck/GetDisciplineCheckList',
      payload: {
        beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: date[1].format('YYYY-MM-DD 23:59:59'),
        taskType: '7',
        dataType: 0,
        systemType: '2',
        pageIndex: 1,
        pageSize: 999,
      },
      callback: res => {
        setDataSource(res.Datas);
      },
    });
  };

  // 获取大区列表
  const getLargeRegion = () => {
    dispatch({
      type: 'disciplineCheck/getLargeRegion',
      payload: {},
    });
  };

  // 导出
  const onExport = () => {
    dispatch({
      type: 'disciplineCheck/ExportDisciplineCheckList',
      payload: {
        beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: date[1].format('YYYY-MM-DD 23:59:59'),
        taskType: '7',
        dataType: 0,
        systemType: '2',
        pageIndex: 0,
        pageSize: 0,
      },
    });
  };

  // 时间改变
  const onDateChange = (date, dateString) => {
    setDate(date);
  };

  // 打开记录弹窗
  const openRecordModal = (title, dataType, queryParams) => {
    setModalTitle(title);
    setModalDataType(dataType);
    setIsModalOpen(true);
    setModalQueryParams(queryParams);
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        width: 40,
        // ellipsis: true,
        // render: (text, record, index) => {
        //   return index + 1 + (pageIndex - 1) * pageSize;
        // },
      },
      {
        title: '大区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                openRecordModal('纪律检查记录', 2, {
                  time: date,
                  regionCode: record.RegionCode === 'All' ? undefined : record.RegionCode,
                });
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: '应检查次数',
        dataIndex: 'ShouldCheckCount',
        key: 'ShouldCheckCount',
        ellipsis: true,
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                openRecordModal('纪律检查任务完成记录', 1, {
                  time: date,
                  regionCode: record.RegionCode === 'All' ? undefined : record.RegionCode,
                });
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: '实际检查次数',
        dataIndex: 'AlreadyCheckCount',
        key: 'AlreadyCheckCount',
        ellipsis: true,
      },
      {
        title: '检查完成率',
        dataIndex: 'CheckRate',
        key: 'CheckRate',
        ellipsis: true,
        width: 200,
        sorter: (a, b) => a.CheckRate - b.CheckRate,
        render: (text, record) => {
          let percent = Number(text).toFixed(2);
          return (
            // <Progress
            //   percent={percent}
            //   size="small"
            //   style={{ width: '80%' }}
            //   format={percent => <span style={{ color: 'black' }}>{percent}%</span>}
            // />

            <Progress
              percent={text == '-' ? 0 : text}
              size="small"
              style={{ width: '80%' }}
              status="normal"
              format={percent => (
                <span style={{ color: 'rgba(0,0,0,.8)' }}>{text == '-' ? text : text + '%'}</span>
              )}
            />
          );
        },
      },
    ];

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

  return (
    <BreadcrumbWrapper>
      <Card
        title={
          <Row align="middle">
            <Space>
              <span style={{ fontSize: 14 }}>
                检查时间：
                <RangePicker
                  picker="week"
                  allowClear={false}
                  disabledDate={disabledDate}
                  defaultValue={date}
                  onChange={onDateChange}
                />
              </span>
              <Button type="primary" onClick={getTableDataSource}>
                查询
              </Button>
              <Button icon={<ExportOutlined />} type="primary" onClick={onExport}>
                导出
              </Button>
              {buttonList.includes('disciplineCheck') && (
                <Button
                  type="primary"
                  onClick={() => {
                    openRecordModal('纪律检查管理', 2, {
                      time: date,
                    });
                  }}
                >
                  纪律检查管理
                </Button>
              )}
            </Space>
          </Row>
        }
      >
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
          title={modalTitle}
          dataType={modalDataType}
          queryParams={modalQueryParams}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          reloadPage={() => {
            getTableDataSource();
          }}
        />
      )}
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(DisciplineCheck);
