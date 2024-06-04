/**
 * 功  能：设备安装审核 设备安装规范性
 * 创建人：jab
 * 创建时间：2024.03
 */
import React, { useState, useEffect, Fragment } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Upload,
  Popconfirm,
  Radio,
  Result,
  Steps,
  Image,
  Form,
  Tag,
  Skeleton,
  Typography,
  Card,
  Button,
  Select,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
  Spin,
  Empty,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  ProfileOutlined,
  AmazonCircleFilled,
  AuditOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon';
import moment from 'moment';
import Cookie from 'js-cookie';
import config from '@/config';
import ImageView from '@/components/ImageView';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import SetUserListBtn from '@/components/SetUserListBtn';
import LargeRegionList from '@/pages/ctDebuggAfterSaleServiceManage/components/largeRegionList';
import ViewPhotos from './components/ViewPhotos';
import HandlingSugges from './components/HandlingSugges';
import ExamineModal from './components/ExamineModal';
import { permissionButton } from '@/utils/utils';
import { API } from '@config/API';
import cuid from 'cuid';
import styles from './style.less';
const { Option } = Select;
const { Step } = Steps;
const namespace = 'installEquipment';

const dvaPropsData = ({ loading, installEquipment, global }) => ({
  tableLoading: loading.effects[`${namespace}/GetEquipmentAuditList`],
  tableDatas: installEquipment.installEquipmentTableDatas,
  tableTotal: installEquipment.installEquipmentTableTotal,
  queryPar: installEquipment.installEquipmentQueryPar,
  installPhotoData: installEquipment.installPhotoData,
  auditPhotoLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  addAuditInfoLoading: loading.effects[`${namespace}/AddAuditInfo`],
  exportLoading: loading.effects[`${namespace}/ExportEquipmentAudit`],
  exportLoading2: loading.effects[`${namespace}/ExportAuditPhoto`],
  configInfo: global.configInfo,
});

const Index = props => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const {
    location: { pathname },
    queryPar,
    tableDatas,
    tableTotal,
    tableLoading,
    auditPhotoLoading,
    installPhotoData,
    addAuditInfoLoading,
    exportLoading,
    hideBreadcrumb,
    defaultStatus, // 默认的审核状态
    auditResultList, // 审核状态列表
    exportLoading2,
  } = props;

  const type = pathname == '/ctManage/supervisionInspection/installEquipmentReview' ? 1 : 2;
  const [exportIndex, setExportIndex] = useState(-1);

  const [reviewersListBtn, setReviewersBtn] = useState(false);

  useEffect(() => {
    const buttonList = permissionButton(props.match.path);
    buttonList.map(item => {
      switch (item) {
        case 'reviewersList':
          setReviewersBtn(true);
          break;
      }
    });
    onFinish(pageIndex, pageSize);
  }, []);
  const columns = [
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
      dataIndex: 'Num',
      key: 'Num',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '合同编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '立项号',
      dataIndex: 'ItemCode',
      key: 'ItemCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务大区',
      dataIndex: 'ServiceAreaName',
      key: 'ServiceAreaName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目所在省',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务工程师',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '设备型号',
      dataIndex: 'SystemModelName',
      key: 'SystemModelName',
      align: 'center',
      ellipsis: true,
    },

    {
      title: '离开现场时间',
      dataIndex: 'LeaveDate',
      key: 'LeaveDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '安装照片',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return <a onClick={() => viewPhotos(record)}>查看照片</a>;
      },
    },
    {
      title: '照片上传时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: type == 1 ? '审核状态' : '审核结果',
      dataIndex: type == 1 ? 'StatusName' : 'AuditResultsName',
      key: type == 1 ? 'StatusName' : 'AuditResultsName',
      align: 'center',
      ellipsis: true,
      render: text => {
        if (type == 1) {
          return (
            <span style={{ color: text == '审核未通过' ? '#f5222d' : 'rgba(0, 0, 0, 0.85)' }}>
              {text}
            </span>
          );
        } else {
          return (
            <span style={{ color: text == '优秀' ? '#52c41a' : 'rgba(0, 0, 0, 0.85)' }}>
              {text}
            </span>
          );
        }
      },
    },
    {
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: 60,
      ellipsis: true,
      fixed: 'right',
      render: (text, record, index) => {
        const disabledFlag = !record.SystemModelName;
        return type == 1 ? (
          record.StatusName == '待审核' && (
            <Tooltip
              placement={disabledFlag ? 'left' : 'top'}
              title={disabledFlag ? '无设备型号，暂不支持审核' : '审核'}
            >
              <a
                style={{
                  cursor: disabledFlag && 'not-allowed',
                  color: disabledFlag && 'rgba(0, 0, 0, 0.25)',
                }}
                onClick={() => {
                  if (disabledFlag) {
                    return;
                  }
                  examinePhotos(record);
                }}
              >
                <AuditOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
          )
        ) : (
          <Tooltip title="导出">
            <a
              onClick={() => {
                setExportIndex(index);
                exports2({
                  systemModelId: record.Col1,
                  dispatchId: record.DispatchId,
                  pointId: record.PointId,
                  equipmentAuditId: record.EquipmentAuditId,
                  entName: record.EntName,
                  pointName: record.PointName,
                  systemModelName: record.SystemModelName,
                  projectCode: record.ProjectCode,
                });
              }}
            >
              {index == exportIndex && exportLoading2 ? (
                <Spin size="small" />
              ) : (
                <ExportOutlined style={{ fontSize: 16 }} />
              )}
            </a>
          </Tooltip>
        );
      },
    },
  ];
  const [viewPhotosVisible, setViewPhotosVisible] = useState(false);
  const viewPhotos = row => {
    setViewPhotosVisible(true);
    props.dispatch({
      type: `${namespace}/GetAuditPhoto`,
      payload: {
        systemModelId: row.Col1,
        dispatchId: row.DispatchId,
        pointId: row.PointId,
        equipmentAuditId: row.EquipmentAuditId,
      },
    });
  };

  const onFinish = async (PageIndex, PageSize, queryPar) => {
    //查询
    console.log('defaultStatus', defaultStatus);
    try {
      const values = await form.validateFields();
      const par = queryPar
        ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize }
        : {
            ...values,
            status: values.status
              ? values.status
              : type == 1
              ? '1,2'
              : defaultStatus !== undefined
              ? defaultStatus
              : '3',
            bTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
            eTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
            time: undefined,
            pageIndex: PageIndex,
            pageSize: PageSize,
          };
      props.dispatch({
        type: `${namespace}/GetEquipmentAuditList`,
        payload: {
          ...par,
        },
      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const handleTableChange = async (PageIndex, PageSize) => {
    //分页
    setPageSize(PageSize);
    setPageIndex(PageIndex);
    onFinish(PageIndex, PageSize, queryPar);
  };
  const exports = record => {
    props.dispatch({
      type: `${namespace}/ExportEquipmentAudit`,
      payload: {
        ...queryPar,
        ...record,
      },
    });
  };
  const exports2 = record => {
    props.dispatch({
      type: `${namespace}/ExportAuditPhoto`,
      payload: {
        ...record,
      },
    });
  };
  const searchComponents = () => {
    return (
      <Form
        form={form}
        name="advanced_search"
        className={'ant-advanced-search-form'}
        onFinish={() => {
          setPageIndex(1);
          setPageSize(20);
          onFinish(1, 20);
        }}
        initialValues={{
          time: props.defaultTime || [moment().startOf('month'), moment()],
        }}
      >
        <Row align="middle">
          <Col span={8}>
            <Form.Item name="num" label="派工单号">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="projectCode" label="项目编号">
              <Input placeholder="合同编号、立项号" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="projectName" label="项目名称" className={type == 2 && 'minWidth'}>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          {type == 2 && (
            <Col span={8}>
              <LargeRegionList />
            </Col>
          )}
          <Col span={8}>
            {type == 1 ? (
              <Form.Item name="status" label="审核状态">
                <Select placeholder="请选择" allowClear>
                  <Option value={1}>待审核</Option>
                  <Option value={2}>审核未通过</Option>
                </Select>
              </Form.Item>
            ) : (
              <Form.Item name="auditResults" label="审核状态">
                <Select placeholder="请选择" allowClear>
                  {auditResultList.includes(1) && <Option value={1}>优秀</Option>}
                  {auditResultList.includes(2) && <Option value={2}>合格</Option>}
                  {auditResultList.includes(3) && <Option value={3}>不合格</Option>}
                  {auditResultList.includes(4) && <Option value={4}>无照片</Option>}
                  {auditResultList.includes(5) && <Option value={5}>/</Option>}
                </Select>
              </Form.Item>
            )}
          </Col>
          {type == 2 && (
            <Col span={8}>
              <Form.Item name="time" label="离开现场时间">
                <RangePicker_ format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          )}
          <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={tableLoading}>
                查询
              </Button>
              <Button
                style={{ margin: '0 8px' }}
                loading={tableLoading}
                onClick={() => {
                  form.resetFields();
                  setPageIndex(1);
                  setPageSize(20);
                  onFinish(1, 20);
                }}
              >
                重置
              </Button>
              <Button
                style={{ marginRight: 8 }}
                icon={<ExportOutlined />}
                loading={exportIndex == -1 && exportLoading}
                onClick={() => {
                  setExportIndex(-1);
                  exports();
                }}
              >
                导出
              </Button>
              {/* {reviewersListBtn && <SetUserListBtn type={4} text="审核人员清单" />} */}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  const [examineVisible, setExamineVisible] = useState(false);
  const [examineTitle, setExamineTitle] = useState('');
  const [examineData, setExamineData] = useState();

  const examinePhotos = row => {
    setExamineVisible(true);
    setExamineTitle(`审核安装照片（${row.EntName} - ${row.PointName} - ${row.SystemModelName} ）`);
    setExamineData(row);
  };

  return (
    <div className={styles.installEquipmentSty}>
      <BreadcrumbWrapper hideBreadcrumb={hideBreadcrumb}>
        <Card title={searchComponents()} bordered={!hideBreadcrumb}>
          <SdlTable
            style={{ marginTop: 6 }}
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
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
            visible={viewPhotosVisible}
            title={'安装照片'}
            onCancel={() => {
              setViewPhotosVisible(false);
            }}
            footer={null}
            destroyOnClose
            wrapClassName={`spreadOverModal ${styles.modalSty}`}
            mask={false}
          >
            <ViewPhotos />

            <HandlingSugges type={1} />
          </Modal>
          <ExamineModal
            visible={examineVisible}
            title={examineTitle}
            data={examineData}
            onCancel={() => {
              setExamineVisible(false);
            }}
            onFinish={() => {
              onFinish(pageIndex, pageSize);
            }}
          />
        </Card>
      </BreadcrumbWrapper>
    </div>
  );
};

Index.defaultProps = {
  auditResultList: [1, 2, 5],
};

export default connect(dvaPropsData)(Index);
