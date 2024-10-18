import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Button,
  Modal,
  Select,
  Space,
  Alert,
  Typography,
  Tooltip,
  Popconfirm,
  Divider,
} from 'antd';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { getCurrentUserId } from '@/utils/utils';
import { DelIcon, EditIcon } from '@/utils/icon';
import Training from '@/pages/workSupervision/Forms/Training';
import ImageLightboxView from '@/components/ImageLightboxView';

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, provinceAllList, common }) => ({
  loading: loading.effects[`wordSupervision/GetPersonTrainList`],
  exportLoading: loading.effects[`wordSupervision/ExportPersonTrainList`],
});

const ChecklistRecordAndManagement = props => {
  const [form] = Form.useForm();
  // 获取当前登录人id
  const currentUserId = getCurrentUserId();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [editData, setEditData] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [largeRegionList, setLargeRegionList] = useState([]);
  const [provinceAllList, setProvinceAllList] = useState([]);

  const { dispatch, loading, exportLoading, open, onCancel, mode, taskInfo, type } = props;

  useEffect(() => {
    type === 'ct' ? getCtLargeRegion() : getLargeRegion();
    getPageData();
  }, []);

  // 获取成套大区及省份
  const getCtLargeRegion = () => {
    dispatch({
      type: 'common/getCTLargeRegion',
      payload: {},
      callback: res => {
        setLargeRegionList(res.CtLargeRegionList);
      },
    });
  };

  // 获取运维大区及省份
  const getLargeRegion = () => {
    dispatch({
      type: 'common/getLargeRegion',
      payload: {},
      callback: res => {
        setProvinceAllList(res.provinceList);
      },
    });
  };

  // 获取请求参数
  const getParams = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      time: undefined,
      type: type === 'ct' ? '1' : undefined,
      isFlag: mode === 'management' ? 1 : undefined, // 区分管理
      beginTime: values.time
        ? values.time[0].startOf('months').format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: values.time
        ? values.time[1].endOf('months').format('YYYY-MM-DD HH:mm:ss')
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
      type: 'wordSupervision/GetPersonTrainList',
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
      type: 'wordSupervision/ExportPersonTrainList',
      payload: body,
    });
  };

  //
  const onEdit = record => {
    updateType();
    setEditData(record);
    // setTaskInfo({
    //   // TaskType: type ? 4 : 3,
    //   TaskType: 5,
    //   ID: record.DailyTaskID,
    // });
    setEditOpen(true);
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
        // width: 40,
        // dataIndex: 'index',
        // key: 'index',
        // render: (text, record, index) => {
        //   return index + 1;
        // },
      },
      {
        title: '大区',
        dataIndex: 'LargeRegion',
        key: 'LargeRegion',
        ellipsis: true,
        // width: 200,
        width:'auto',
      },
      {
        title: '省份',
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
        // width: 200,
        width:'auto',
      },
      {
        title: '培训人',
        dataIndex: 'UserName',
        key: 'UserName',
        width:'auto',
      },
      {
        title: '培训时间',
        dataIndex: 'TrainTime',
        key: 'TrainTime',
        // width: 200,
        width:'auto',
        sorter: (a, b) => moment(a.TrainTime).valueOf() - moment(b.TrainTime).valueOf(),
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD');
        },
      },
      {
        title: '附件',
        dataIndex: 'FileName',
        key: 'FileName',
        width:'auto',
        render: (text, record) => {
          // let fileList = getAttachmentDataSource(text);
          // console.log('fileList', fileList);
          // return <AttachmentView dataSource={fileList} />;
          let images = record.FilesList.ImgList;
          return <ImageLightboxView images={images} />;
        },
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
            // if (true) {
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
                {/* <Divider type="vertical" />
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
                </Tooltip> */}
              </>
            );
          }
          return '-';
        },
      });
    }

    if (type === 'ct') {
      // 成套不显示省份
      columns = columns.filter(item => item.dataIndex !== 'RegionName');
    }

    return columns;
  };

  // 搜索组件
  const SearchComponents = () => {
    let initialValues = {
      time: [
        moment()
          .startOf('month'),
        moment()
          .endOf('month'),
      ],
    };

    return (
      <div>
        <Form
          id="searchForm"
          form={form}
          layout="inline"
          initialValues={initialValues}
          autoComplete="off"
          // style={{ display: taskInfo.ID ? 'none' : 'block' }}
        >
          <Space wrap>
            {mode !== 'management' &&
              // 成套显示大区、运维显示省区
              (type === 'ct' ? (
                <Form.Item name="regionCode" label="大区">
                  <Select placeholder="请选择大区" style={{ width: 140 }} allowClear>
                    {largeRegionList.map(item => {
                      return (
                        <Option value={item.ID} key={item.ID}>
                          {item.LargeRegion}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item name="regionCode" label="省份">
                  <Select placeholder="请选择省份" style={{ width: 140 }} allowClear>
                    {provinceAllList.map(item => {
                      return (
                        <Option value={item.RegionCode} key={item.RegionCode}>
                          {item.RegionName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              ))}
            <Form.Item name="userName" label="培训人">
              <Input style={{ width: 200 }} placeholder="培训人" />
            </Form.Item>
            <Form.Item name="time" label="培训时间">
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
                  loading={loading}
                  onClick={() => {
                    getPageData(1, 20);
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    getPageData(1, 20);
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
          </Space>
        </Form>
      </div>
    );
  };

  const getPageContent = () => {
    return (
      <>
        <Card bordered={false} title={<SearchComponents />}>
          <SdlTable
            loading={loading}
            align="center"
            dataSource={dataSource}
            columns={getColumns()}
            scroll={{x:800}}
            pagination={{
              total: tableTotal,
              pageSize: pageSize,
              current: pageIndex,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange,
            }}
          />
        </Card>
        <Modal
          centered
          open={editOpen}
          footer={null}
          wrapClassName="spreadOverModal"
          mask={false}
          destroyOnClose
          onCancel={() => setEditOpen(false)}
        >
          <Training
            type={type === 'ct' ? 1 : ''}
            taskInfo={{
              ...editData,
              ID: editData.DailyTaskID,
            }}
            // editData={editData}
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

  return (
    <Modal
      title={mode === 'record' ? '人员培训记录' : '人员培训管理'}
      wrapClassName={`spreadOverModal`}
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

ChecklistRecordAndManagement.defaultProps = {
  taskInfo: {},
};

export default connect(dvaPropsData)(ChecklistRecordAndManagement);
