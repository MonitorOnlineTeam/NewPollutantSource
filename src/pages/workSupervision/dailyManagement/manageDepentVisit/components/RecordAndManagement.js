import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Modal,
  Alert,
  Space,
  InputNumber,
  Typography,
  Tooltip,
  Popconfirm,
  Divider,
  Select,
  message,
} from 'antd';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { getCurrentUserId } from '@/utils/utils';
import { DelIcon, EditIcon } from '@/utils/icon';
import LawEnforceBureauVisit from '@/pages/workSupervision/Forms/LawEnforceBureauVisit';
import styles from "../../siteInspecTempSet/style.less"

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, provinceAllList, common }) => ({
  loading: loading.effects[`wordSupervision/GetVisitEnvironmentalList`],
  exportLoading: loading.effects[`wordSupervision/ExportVisitEnvironmentalList`],
  delLoading: loading.effects[`wordSupervision/DeleteVisitEnvironmental`],
  addFlagLoading: loading.effects[`wordSupervision/GetVisitEnvironmentalDailyWorks`],

});

const RecordAndManagement = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [editData, setEditData] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [addData, setAddData] = useState({});

  const [visitEnvironDailyWorksData, setVisitEnvironDailyWorksData] = useState({});

  const { dispatch, loading, exportLoading, delLoading, open, onCancel, mode, taskInfo, type, addFlagLoading} = props;

  useEffect(() => {
    getPageData();
    mode === 'management' && (!taskInfo.ID) &&  getVisitEnvironmentalDailyWorksData();
  }, []);

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      dailyTaskID: taskInfo?.ID,
      // systemType: type, // 1：运维 2：成套
      isFlag: mode === 'management' ? true : false, // 区分管理
      beginTime: values.time
        ? values.time[0]?.startOf('month').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: values.time
        ? values.time[1]?.endOf('month').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
    };
  };

  //分页
  const handleTableChange = async (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getPageData(PageIndex, PageSize);
  };

  
  // 获取页面数据
  const getPageData = (_pageIndex, _pageSize) => {
    const body = getParams();
    dispatch({
      type: 'wordSupervision/GetVisitEnvironmentalList',
      payload: {
        ...body,
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 导出
  const onExport = () => {
    const body = getParams();
    dispatch({
      type: 'wordSupervision/ExportVisitEnvironmentalList',
      payload: body,
    });
  };


  const getVisitEnvironmentalDailyWorksData = () => { //获取管理部门当月拜访的任务
    dispatch({
      type: 'wordSupervision/GetVisitEnvironmentalDailyWorks',
      payload: {},
      callback: res => {
        setAddData(res.Datas || {});
      },
    });
  }

  const onEdit = record => {
    // updateType();
    setEditData(record);
    setEditOpen(true);
  };

  // 删除
  const onDelete = ID => {
    props.dispatch({
      type: 'wordSupervision/DeleteVisitEnvironmental',
      payload: { ID },
      callback: res => {
        handleTableChange(1, 20);
      },
    });
  };

  const updateType = () => {
    dispatch({
      type: 'wordSupervision/updateState',
      payload: {
        TYPE: type === 'ct' ? 1 : '',
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
      },
      {
        title: '省份',
        dataIndex: 'RegionName',
        key: 'RegionName',
      },
      {
        title: '城市',
        dataIndex: 'CityName',
        key: 'CityName',
      },
      {
        title: '拜访日期',
        dataIndex: 'VisitData',
        key: 'VisitData',
        sorter: (a, b) => moment(a.ReturnTime).valueOf() - moment(b.ReturnTime).valueOf(),
        render: text => {
          return text && moment(text).format('YYYY-MM-DD');
        },
      },
      {
        title: '拜访人',
        dataIndex: 'UserName',
        key: 'UserName',
      },
      {
        title: '管理部门名称',
        dataIndex: 'ManagementDepName',
        key: 'ManagementDepName',
      },
      {
        title: '会谈人姓名',
        dataIndex: 'CustomerName',
        key: 'CustomerName',
      },
      {
        title: '职位',
        dataIndex: 'CustomerPosition',
        key: 'CustomerPosition',
        width: 100,
        align: 'center',
      },
      {
        title: '手机',
        dataIndex: 'CustomerPhone',
        key: 'CustomerPhone',
        width: 100,
        align: 'center',
      },
      {
        title: '拜访目的',
        dataIndex: 'VisitPurposeName',
        key: 'VisitPurposeName',
        width: 120,
        align: 'center',
      },
      {
        title: '取得效果',
        dataIndex: 'EvaluateName',
        key: 'EvaluateName',
        width: 100,
        align: 'center',
      },
      {
        title: '具体成果',
        dataIndex: 'VisitPurposeName',
        key: 'VisitPurposeName',
        width: 120,
        align: 'center',
      },
      {
        title: '拜访部门人员建议',
        dataIndex: 'Suggestion',
        key: 'Suggestion',
        width: 200,
        align: 'center',
      },
      {
        title: '当地是有有运维',
        dataIndex: 'IsOperationsName',
        key: 'IsOperationsName',
      },
      {
        title: '拜访分类',
        dataIndex: 'VisitTypeName',
        key: 'VisitTypeName',
        ellipsis: true,
      },

      {
        title: '备注',
        dataIndex: 'Remark',
        key: 'Remark',
        ellipsis: true,
      },
    ];
    if (mode !== 'record') {
      columns.push({
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        fixed: 'right',
        render: (text, record) => {
          if (record.IsEdit) {
            return (
              <>
                <Tooltip title="编辑">
                  <a
                    onClick={() => {
                      onEdit(record);
                    }}
                  >
                    <EditIcon />
                  </a>
                </Tooltip>
                {taskInfo.ID && [
                  <Divider type="vertical" />,
                  <Tooltip title="删除">
                    <Popconfirm
                      placement="left"
                      title="确认是否删除?"
                      onConfirm={() => {
                        onDelete(record.ID);
                      }}
                      okText="是"
                      cancelText="否"
                    >
                      <a>
                        <DelIcon />
                      </a>
                    </Popconfirm>
                  </Tooltip>,
                ]}
              </>
            );
          }
          return '-';
        },
      });
    }

    return columns;
  };
  const data = taskInfo.ID ? taskInfo :  addData
  const getPageContent = () => {
    let initialValues = {
      time: [
        moment()
          .startOf('months'),
        moment()
          .endOf('months'),
      ],
    };
    if (data.ID) {
      initialValues.time = [moment(data.BeginTime), moment(data.EndTime)];
      // initialValues.regionCode = taskInfo.RegionCode;
    }
    return (
      <>
        {taskInfo.ID && (
          <Alert
            message={`任务类型：管理部门拜访任务单，派发时间：${data.BeginTime} ，有效期：${data.EndTime} ，任务单派发频次1次/月，每个任务单最少有（${data.standVisitNum || 0}次/月）记录。`}
            type="info"
            showIcon
            style={{marginRight:30}}
          />
        )}
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          headStyle={{ display: data.ID ? 'none' : 'block', padding: 0 }}
          className={styles.manageRecordCardWrapper}
          title={
            mode === 'record' && <Form
              form={form}
              layout="inline"
              initialValues={initialValues}
              autoComplete="off"
            >
              <Form.Item name="userName" label="拜访人">
                <Input style={{ width: 200 }} placeholder="拜访人" allowClear />
              </Form.Item>
              <Form.Item name="time" label="拜访时间">
                <RangePicker_
                  style={{ width: 200 }}
                  picker="month"
                  format="YYYY-MM"
                  allowClear={false}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    onClick={() => {
                      handleTableChange(1, 20);
                    }}
                  >
                    查询
                    </Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      handleTableChange(1, 20);
                    }}
                  >
                    重置
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
                </Space>
              </Form.Item>
            </Form>
          }
        >
          {mode !== 'record'  && <Button
            type="primary"
            style={{ margin: '8px 0' }}
            loading={addFlagLoading}
            onClick={() => {
              if(data.ID){
                setEditOpen(true);
                setEditData({DailyTaskID: data.ID,RegionalArea:data.largeCode });
              }else{
                message.error('本月没有派工单，不允许添加！');
                
              }

            }}
          >
            添加
            </Button>}
          <SdlTable
            loading={loading || delLoading}
            align="center"
            dataSource={dataSource}
            columns={getColumns()}
            // resizable
            pagination={
              !taskInfo.ID
                ? {
                  total: tableTotal,
                  pageSize: pageSize,
                  current: pageIndex,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handleTableChange,
                }
                : false
            }
          />
        </Card>
        <Modal
          centered
          open={editOpen}
          footer={null}
          wrapClassName="spreadOverModal noTitleSty"
          mask={false}
          destroyOnClose
          onCancel={() => setEditOpen(false)}
        >
          <LawEnforceBureauVisit
            type={type === 'ct' ? 1 : ''}
            taskInfo={taskInfo}
            editData={editData}
            onCancel={() => {
              setEditOpen(false);
            }}
            onSubmitCallback={() => {
              getPageData();
            }}
          />
        </Modal>
      </>
    );
  };

  if (taskInfo.ID) {
    return getPageContent();
  }

  return (
    <Modal
      title={mode === 'record' ? '管理部门拜访记录' : '管理部门拜访管理'}
      wrapClassName={`spreadOverModal`}
      bodyStyle={{
        // padding: mode === 'record' || data.ID ? '12px' : '0 12px',
        padding: '0 12px'
      }}
      mask={false}
      open={open}
      destroyOnClose
      footer={null}
      onCancel={() => {
        onCancel();
      }}
    >
      {getPageContent()}
    </Modal>
  );
};

RecordAndManagement.defaultProps = {
  taskInfo: {},
};

export default connect(dvaPropsData)(RecordAndManagement);
