/*
 * @Author: JiaQi
 * @Date: 2024-04-17 17:13:10
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-21 09:11:08
 * @Description:  服务响应及时率 - 基础数据
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Typography,
  Input,
  Button,
  Descriptions,
  Space,
  Tooltip,
  Modal,
  Row,
  Col,
  Select,
  Empty,
} from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { ProfileOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { Text, Link } = Typography;

const dvaPropsData = ({ loading, reportsAndViews, common }) => ({
  largeRegionList: common.CtLargeRegionList,
  basicsLoading: loading.effects[`reportsAndViews/GetTimelyRateInfoList`],
  exportLoading: loading.effects['reportsAndViews/ExportTimelyRateInfoList'],
});

const BasicData = props => {
  const [form] = Form.useForm();

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [tableTotal, setTableTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [detailsData, setDetailsData] = useState({});
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const {
    dispatch,
    basicsLoading,
    exportLoading,
    title,
    defaultTime,
    isModalOpen,
    onCancel,
    largeRegionList,
    type,
    wrapClassName,
  } = props;

  useEffect(() => {
    getBasicsData();
    getLargeRegion();
  }, []);

  // 获取一次解决率基础数据
  const getBasicsData = (_pageIndex, _pageSize) => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'reportsAndViews/GetTimelyRateInfoList',
      payload: {
        pageIndex: _pageIndex || pageIndex,
        pageSize: _pageSize || pageSize,
        userID: props.userID,
        ...values,
        beginTime: values.time && values.time[0].format('YYYY-MM-DD 00:00:00'),
        endTime: values.time && values.time[1].format('YYYY-MM-DD 23:59:59'),
        time: undefined,
      },
      callback: res => {
        setDataSource(res.Datas);
        setTableTotal(res.Total);
      },
    });
  };

  // 获取大区及省份
  const getLargeRegion = () => {
    dispatch({
      type: 'common/getCTLargeRegion',
      payload: {},
    });
  };

  // 导出
  const onExport = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'reportsAndViews/ExportTimelyRateInfoList',
      payload: {
        pageIndex: 0,
        pageSize: 0,
        ...values,
        beginTime: values.time && values.time[0].format('YYYY-MM-DD 00:00:00'),
        endTime: values.time && values.time[1].format('YYYY-MM-DD 23:59:59'),
        time: undefined,
      },
    });
  };

  //
  const getBasicsColumns = () => {
    let columns = [
      {
        title: '序号',
        align: 'center',
        ellipsis: true,
        render: (text, record, index) => {
          return index + 1 + (pageIndex - 1) * pageSize;
        },
      },
      {
        title: '派工单号',
        dataIndex: 'num',
        key: 'num',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '合同编号',
        dataIndex: 'projectCode',
        key: 'projectCode',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '立项号',
        dataIndex: 'itemCode',
        key: 'itemCode',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        key: 'projectName',
        align: 'center',
        ellipsis: true,
        width: 260,
      },
      {
        title: '服务大区',
        dataIndex: 'serviceAreaName',
        key: 'serviceAreaName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '项目所在省',
        dataIndex: 'provinceName',
        key: 'provinceName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '服务工程师',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '企业名称',
        dataIndex: 'customEnt',
        key: 'customEnt',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '离开现场时间',
        dataIndex: 'leaveDate',
        key: 'leaveDate',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '响应及时状态',
        dataIndex: 'timelyStatusName',
        key: 'timelyStatusName',
        align: 'center',
        ellipsis: true,
        render: (text, record) => {
          if (record.timelyStatus === 2) {
            return <Text type="danger">{text}</Text>;
          }
          return text;
        },
      },
      {
        title: <span>操作</span>,
        align: 'center',
        fixed: 'right',
        width: 60,
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip title="服务响应详情">
              <a
                onClick={() => {
                  setIsDetailsModalOpen(true);
                  setDetailsData(record);
                }}
              >
                <ProfileOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
          );
        },
      },
    ];

    return columns;
  };

  //分页
  const handleTableChange = (PageIndex, PageSize) => {
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    getBasicsData(PageIndex, PageSize);
  };

  const TitleComponents = props => {
    return (
      <div
        style={{
          display: 'inline-block',
          fontSize: 15,
          fontWeight: 'bold',
          marginTop: 4,
          padding: '2px 0',
          marginBottom: 12,
          borderBottom: '1px solid rgba(0,0,0,.1)',
          ...props.style,
        }}
      >
        {props.text}
      </div>
    );
  };
  return (
    <Modal
      title={title}
      wrapClassName={wrapClassName || `spreadOverModal`}
      visible={isModalOpen}
      destroyOnClose
      footer={null}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        id="searchForm"
        form={form}
        initialValues={{
          time: defaultTime || [moment().startOf('month'), moment()],
        }}
        autoComplete="off"
        style={{ marginTop: 10, marginBottom: 10 }}
        labelCol={{
          flex: '120px',
        }}
        wrapperCol={{
          flex: 1,
        }}
      >
        <Row gutter={8} align="middle">
          <Col span={8}>
            <Form.Item name="num" label="派工单号">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="projectCode" label="项目编号">
              <Input placeholder="请输入合同编号/立项号" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="projectName" label="项目名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          {type !== 'user' && (
            <Col span={8}>
              <Form.Item name="serviceAreaCode" label="服务大区">
                <Select placeholder="请选择服务大区" style={{ width: '100%' }} allowClear>
                  {largeRegionList.map(item => {
                    return (
                      <Option value={item.ID} key={item.ID} data-childList={item.ChildList}>
                        {item.LargeRegion}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          )}
          <Col span={8}>
            <Form.Item name="responseStatus" label="响应及时状态">
              <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                <Option value={1} key={1}>
                  及时
                </Option>
                <Option value={2} key={2}>
                  不及时
                </Option>
                <Option value={3} key={3}>
                  不参与统计
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="time" label="离开现场时间">
              <RangePicker_
                style={{ width: '100%' }}
                allowClear={false}
                showTime={false}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Space>
                <Button
                  loading={basicsLoading}
                  type="primary"
                  onClick={() => handleTableChange(1, 20)}
                >
                  查询
                </Button>
                <Button
                  loading={basicsLoading}
                  onClick={() => {
                    form.resetFields();
                    handleTableChange(1, 20);
                  }}
                >
                  重置
                </Button>
                <Button
                  loading={exportLoading}
                  icon={<ExportOutlined />}
                  onClick={() => onExport()}
                >
                  导出
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <SdlTable
        loading={basicsLoading}
        dataSource={dataSource}
        columns={getBasicsColumns()}
        align="center"
        pagination={{
          total: tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />

      <Modal
        title="服务响应详情"
        wrapClassName="spreadOverModal"
        visible={isDetailsModalOpen}
        destroyOnClose
        footer={null}
        onCancel={() => {
          setIsDetailsModalOpen(false);
        }}
      >
        <Descriptions
          className={styles.detailsWrapper}
          title={<TitleComponents text="服务时间" />}
          labelStyle={{ fontWeight: 500 }}
        >
          <Descriptions.Item label="服务需求时间">{detailsData.demandDate}</Descriptions.Item>
          <Descriptions.Item label="服务需求变更时间">
            {detailsData.serviceChangeDate}
          </Descriptions.Item>
          <Descriptions.Item label="区域接到服务时间">
            {detailsData.serviceDispatchTime}
          </Descriptions.Item>
          <Descriptions.Item label="到达现场时间">{detailsData.arriveDate}</Descriptions.Item>
          <Descriptions.Item label="联系客户时间">{detailsData.contactDate}</Descriptions.Item>
          <Descriptions.Item label="响应及时状态">
            {detailsData.timelyStatus === 2 ? (
              <Text type="danger">{detailsData.timelyStatusName}</Text>
            ) : (
              detailsData.timelyStatusName
            )}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          className={styles.detailsWrapper}
          title={<TitleComponents text="不及时登记" />}
          labelStyle={{ fontWeight: 500 }}
          style={{ marginTop: 20 }}
        >
          <Descriptions.Item label="备注" span={3}>
            {detailsData.timelyRemark}
          </Descriptions.Item>
          <Descriptions.Item label="登记人">{detailsData.timelyUser}</Descriptions.Item>
          <Descriptions.Item label="登记时间">{detailsData.timelyDate}</Descriptions.Item>
        </Descriptions>
        <Descriptions
          className={styles.detailsWrapper}
          title={<TitleComponents text="不参与统计登记" />}
          labelStyle={{ fontWeight: 500 }}
          style={{ marginTop: 20 }}
        >
          <Descriptions.Item label="备注" span={3}>
            {detailsData.noStatisticsRemark}
          </Descriptions.Item>
          <Descriptions.Item label="登记人">{detailsData.noStatisticsUser}</Descriptions.Item>
          <Descriptions.Item label="登记时间">{detailsData.noStatisticsDate}</Descriptions.Item>
        </Descriptions>
        <TitleComponents text="系统判断结果" style={{ marginTop: 20 }} />
        {detailsData.result ? (
          detailsData.result.map(item => {
            return <Row>{item}</Row>;
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        <TitleComponents
          text={<Text type="danger">响应及时判断标准</Text>}
          style={{ marginTop: 20 }}
        />
        <div style={{ fontWeight: 'bold' }}>
          <Row>
            <Text type="danger">
              1. 区域接到服务时间距离客户要求时间大于24小时，在客户要求时间之前到达，视为及时。
            </Text>
          </Row>
          <Row>
            <Text type="danger">
              2.
              区域接到服务时间距离客户要求时间小于等于24小时，区域接到服务派工时间距离到达现场时间在36小时内，视为及时。
            </Text>
          </Row>
          <Row>
            <Text type="danger">
              3. 无服务需求时间，区域接到服务派工时间与到达现场时间在72小时内视为及时。
            </Text>
          </Row>
          <Row>
            <Text type="danger">
              4. 区域接到服务派工时间后联系客户时间在4小时之内（内地：8:30 ~ 17:30，新疆：9:30 ~
              18:30 时间内有效，刨除非上班时间间隔）。
            </Text>
          </Row>
          <Row>
            <Text type="danger">5. 存在同一客户催促服务视为不及时。</Text>
          </Row>
          <Row>
            <Text type="danger">6. 因公司原因、不可抗力导致不及时的视为不及时。</Text>
          </Row>
          <Row>
            <Text type="danger">7. 因客户原因导致不及时的，不参与统计。</Text>
          </Row>
          <Row>
            <Text type="danger">7. 如客户变更需求服务时间，按第1点统计。</Text>
          </Row>
        </div>
      </Modal>
    </Modal>
  );
};

export default connect(dvaPropsData)(BasicData);
