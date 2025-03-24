/*
 * @Author: JiaQi
 * @Date: 2023-04-23 09:38:17
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-03-24 11:12:05
 * @Description：现场工作质量检查
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Tooltip,
  Popconfirm,
  Radio,
  Tag,
  Divider,
  Select,
  Modal,
  Row,
  Col,
  Progress,
} from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { DelIcon, EditIcon } from '@/utils/icon';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import LargeRegionList from '@/components/largeRegionList';
import RecordMangerTable from './RecordMangerTable';

const dvaPropsData = ({ loading, siteQualityInspection }) => ({
  queryLoading: loading.effects['siteQualityInspection/GetOnsiteInspectionRecordForRegion'],
  exportLoading: loading.effects['siteQualityInspection/ExportOnsiteInspectionRecordForRegion'],
  recordLoading: loading.effects['siteQualityInspection/GetOnsiteInspectionRecordForRegionInfo'],
  recordExportLoading:
    loading.effects['siteQualityInspection/ExportOnsiteInspectionRecordForRegionInfo'],
});

const Index = props => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const { queryLoading, exportLoading, recordLoading, recordExportLoading } = props;
  const [dataSource, setDataSource] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null); // 当前点击行数据

  const [completRecordOpen, setCompletRecordOpen] = useState(false); // 完成记录弹窗
  const [completRecordDataSource, setCompletRecordDataSource] = useState([]); // 完成记录数据
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [siteInspectionOpen, setSiteInspectionOpen] = useState(false); // 现场检查弹窗
  const [modalType, setModalType] = useState(1); // 弹窗类型

  useEffect(() => {
    onFinish();
  }, []);

  // 获取请求参数
  const getParams = values => {
    const beginTime = values.date
      ? moment(values.date[0]).format('YYYY-MM-DD 00:00:00')
      : undefined;
    const endTime = values.date ? moment(values.date[1]).format('YYYY-MM-DD 23:59:59') : undefined;

    return {
      BeginTime: beginTime,
      EndTime: endTime,
    };
  };

  // 查询数据
  const onFinish = async (_pageIndex, _pageSize) => {
    const values = await form.validateFields();
    const body = getParams(values);

    props.dispatch({
      type: 'siteQualityInspection/GetOnsiteInspectionRecordForRegion',
      payload: {
        ...body,
        // pageIndex: _pageIndex || pageIndex,
        // pageSize: _pageSize || pageSize,
      },
      callback: res => {
        console.log('res', res);
        setDataSource(res.Datas);
      },
    });
  };

  // 导出
  const onExport = async () => {
    const values = await form.validateFields();
    const body = getParams(values);
    props.dispatch({
      type: 'siteQualityInspection/ExportOnsiteInspectionRecordForRegion',
      payload: body,
    });
  };

  // 获取省区详情
  const getRegionInfo = async (_pageIndex, _pageSize) => {
    try {
      const values = await form2.validateFields();
      console.log('form2 values:', values);

      const beginTime = values.date
        ? moment(values.date[0]).format('YYYY-MM-DD 00:00:00')
        : undefined;
      const endTime = values.date
        ? moment(values.date[1]).format('YYYY-MM-DD 23:59:59')
        : undefined;

      props.dispatch({
        type: 'siteQualityInspection/GetOnsiteInspectionRecordForRegionInfo',
        payload: {
          status: values.status,
          regionCode: values.regionCode,
          BeginTime: beginTime,
          EndTime: endTime,
          pageIndex: _pageIndex || pageIndex,
          pageSize: _pageSize || pageSize,
        },
        callback: res => {
          if (res?.IsSuccess) {
            setCompletRecordDataSource(res.Datas);
            setTotalCount(res.Total);
          }
        },
      });
    } catch (error) {
      console.error('Get region info error:', error);
    }
  };

  // 省区详情完成记录导出
  const onCompletRecordExport = async () => {
    const values = await form2.validateFields();
    const beginTime = values.date
      ? moment(values.date[0]).format('YYYY-MM-DD 00:00:00')
      : undefined;
    const endTime = values.date ? moment(values.date[1]).format('YYYY-MM-DD 23:59:59') : undefined;
    props.dispatch({
      type: 'siteQualityInspection/ExportOnsiteInspectionRecordForRegionInfo',
      payload: {
        status: values.status,
        regionCode: values.regionCode,
        BeginTime: beginTime,
        EndTime: endTime,
      },
    });
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteOtherWork',
      payload: { ID },
      callback: res => {
        onFinish();
      },
    });
  };

  const columns = [
    {
      title: '序号',
    },
    {
      title: '大区',
      dataIndex: 'LargeRegion',
      key: 'LargeRegion',
    },
    {
      title: '应完成任务数量',
      dataIndex: 'CompletedCount',
      key: 'CompletedCount',
      render: (text, record) => {
        return (
          <a
            onClick={async () => {
              setCompletRecordOpen(true);
              setCurrentRecord(record);
              await form2.setFieldsValue({
                regionCode: record.LargeRegionCode,
                date: form.getFieldValue('date'),
              });
              setTimeout(() => {
                getRegionInfo(1, 20);
              }, 0);
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
    },
    {
      title: '任务完成率',
      dataIndex: 'CompletedRate',
      key: 'CompletedRate',
      ellipsis: true,
      sorter: (a, b) => {
        if (a.RegionCode !== 'All' && b.RegionCode !== 'All') {
          return a.CompletedRate - b.CompletedRate;
        }
      },
      render: (text, record) => {
        let _text = text == '-' ? 0 : text.toString().replace('%', '');
        return (
          <Progress
            percent={_text == '-' ? 0 : _text}
            size="small"
            style={{ width: '80%' }}
            status={_text * 1 < 100 ? 'exception' : 'normal'}
            format={percent => <span style={{ color: 'rgba(0,0,0,.8)' }}>{text}</span>}
          />
        );
      },
    },
  ];
  const columns2 = [
    {
      title: '序号',
    },
    {
      title: '大区',
      dataIndex: 'LargeRegion',
      key: 'LargeRegion',
    },
    {
      title: '任务派发时间',
      dataIndex: 'BeginTime',
      key: 'BeginTime',
      render: (text, record) => {
        return moment(text).format('YYYY-MM-DD');
      },
    },
    {
      title: '是否完成',
      dataIndex: 'StatusName',
      key: 'StatusName',
      render: (text, record) => {
        if (text === '是') {
          return <Tag color="success">{text}</Tag>;
        }
        return <Tag color="error">{text}</Tag>;
      },
    },
    {
      title: '检查人',
      dataIndex: 'UserName',
      key: 'UserName',
      ellipsis: true,
    },
    {
      title: '任务结束时间',
      dataIndex: 'EndTime',
      key: 'EndTime',
      ellipsis: true,
      render: (text, record) => {
        return text ? moment(text).format('YYYY-MM-DD') : '-';
      },
    },
  ];

  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex);
    setPageSize(PageSize);
    getRegionInfo(PageIndex, PageSize);
  };

  return (
    <Card
      className="queryCriterTitleSty"
      title={
        <Form
          name="basic"
          form={form}
          layout="inline"
          initialValues={{
            // date: [
            //   moment()
            //     .subtract(1, 'month')
            //     .startOf('month'),
            //   moment()
            //     .subtract(1, 'month')
            //     .endOf('month'),
            // ],
            date: [moment().startOf('month'), moment().endOf('month')],
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Space wrap>
            <Form.Item label="任务派发时间" name="date">
              <RangePicker_ picker="day" format="YYYY-MM-DD" />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={() => onFinish(1, 20)} loading={queryLoading}>
                查询
              </Button>

              <Button loading={exportLoading} onClick={() => onExport()}>
                导出
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setSiteInspectionOpen(true);
                  setModalType(1);
                }}
              >
                现场检查管理
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setSiteInspectionOpen(true);
                  setModalType(2);
                }}
              >
                现场检查记录
              </Button>
            </Space>
          </Space>
        </Form>
      }
    >
      <SdlTable
        loading={queryLoading}
        align="center"
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 840 }}
        pagination={false}
      />
      <Modal
        title={'现场检查完成记录'}
        wrapClassName={`spreadOverModal`}
        mask={false}
        open={completRecordOpen}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setCompletRecordOpen(false);
        }}
      >
        <Form
          name="basic2"
          form={form2}
          layout="inline"
          initialValues={{
            status: null,
          }}
          autoComplete="off"
          style={{ paddingBottom: 8 }}
        >
          <LargeRegionList name="regionCode" label="大区" />
          <Form.Item label="任务派发时间" name="date">
            <RangePicker_ picker="day" format="YYYY-MM-DD" allowClear={false} />
          </Form.Item>
          <Form.Item name="status" label="是否完成">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Space>
            <Button type="primary" onClick={() => handleTableChange(1, 20)} loading={recordLoading}>
              查询
            </Button>
            <Button
              onClick={() => {
                form2.setFieldsValue({
                  status: null,
                  regionCode: currentRecord.LargeRegionCode,
                  date: form.getFieldValue('date'),
                });
                handleTableChange(1, 20);
              }}
              loading={recordLoading}
            >
              重置
            </Button>
            <Button loading={recordExportLoading} onClick={() => onCompletRecordExport()}>
              导出
            </Button>
          </Space>
        </Form>
        <SdlTable
          loading={recordLoading}
          align="center"
          columns={columns2}
          dataSource={completRecordDataSource}
          // scroll={{ x: 840 }}
          pagination={{
            total: totalCount,
            pageSize: pageSize,
            current: pageIndex,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handleTableChange,
          }}
        />
      </Modal>
      {/* 现场检查记录和现场检查管理 */}
      <Modal
        title={modalType == 1 ? '现场检查管理' : modalType == 2 ? '现场检查记录' : ''}
        wrapClassName={`spreadOverModal`}
        mask={false}
        footer={false}
        destroyOnClose
        open={siteInspectionOpen}
        onCancel={() => {
          setSiteInspectionOpen(false);
        }}
      >
        {siteInspectionOpen && <RecordMangerTable modalType={modalType} />}
      </Modal>
    </Card>
  );
};

export default connect(dvaPropsData)(Index);
