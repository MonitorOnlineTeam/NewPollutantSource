/*
 * @Author: JiaQi
 * @Date: 2024-03-29 10:00:32
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-24 14:50:23
 * @Description:  客户现场回访
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
  queryLoading: loading.effects[`wordSupervision/GetCustomerVisitList`],
  exportLoading: loading.effects[`wordSupervision/ExportCustomerVisitList`],
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
      callback:(data)=>{
         data = data.filter(item=>item.TaskType == 4)?.[0]
         if(data){
          setTaskData(data)
         }
        
      }
    });
  }, []);

  // 获取表格数据
  const getTableDataSource = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'wordSupervision/GetCustomerVisitList',
      payload: {
        beginTime: values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].endOf('months').format('YYYY-MM-DD 23:59:59'),
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
      type: 'wordSupervision/ExportCustomerVisitList',
      payload: {
        beginTime: values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].endOf('months').format('YYYY-MM-DD 23:59:59'),
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
        // width: 40,
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
        // width: 200,
        width:'auto',
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
        // width: 200,
        width:'auto',
        render: (text, record, index) => {
          return {
            children: text,
            props: { colSpan: record.RegionCode === 'All' ? 0 : 1 },
          };
        },
      },
      {
        title: '应完成任务数量',
        dataIndex: 'ShouldCheckCount',
        key: 'ShouldCheckCount',
        ellipsis: true,
        // width: 150,
        width:'auto',
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
        title: '实际完成任务数量',
        dataIndex: 'AlreadyCheckCount',
        key: 'AlreadyCheckCount',
        ellipsis: true,
        // width: 200,
        width:'auto',
      },
      {
        title: '任务完成率',
        dataIndex: 'CheckRate',
        key: 'CheckRate',
        ellipsis: true,
        // width: 300,
        width:'auto',
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
                  客户现场回访管理
                </Button>
                 )} 
                <Button
                  type="primary"
                  onClick={() => {
                    setIsModalOpen2(true);
                    setMode('record');
                  }}
                >
                  客户现场回访记录
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
          scroll={{x:710}}
          pagination={false}
        />
      </Card>

      {/* 客户现场回访弹窗 */}
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
          taskData = {taskData}
          onCancel={() => {
            setIsModalOpen2(false);
          }}
        />
      )}
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(ReturnVisit);
