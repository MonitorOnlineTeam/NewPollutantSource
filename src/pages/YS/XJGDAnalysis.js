import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Button,
  Input,
  Tag,
  Select,
  Row,
  Col,
  Tooltip,
  Badge,
  Modal,
  Tabs,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import EntAtmoList from '@/components/EntAtmoList';
import RegionList from '@/components/RegionList';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import moment from 'moment';
import { DownOutlined, UpOutlined, ExportOutlined, ProfileOutlined } from '@ant-design/icons';
import TaskRecordDetails from '@/pages/EmergencyTodoList/EmergencyDetailInfoLayout';
import EntAbnormalMapModal from '@/pages/IntelligentAnalysis/abnormalWorkStatistics/components/EntAbnormalMapModal';

const { Option } = Select;
const FormItem = Form.Item;

const dvaPropsData = ({ loading, abnormalWorkStatistics }) => ({
  entAbnormalNumVisible: abnormalWorkStatistics.entAbnormalNumVisible,
});

const XJGDAnalysis = props => {
  const [form] = Form.useForm();
  const { taskInfo } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});
  const [title, setTitle] = useState('');
  const [dataSource, setDataSource] = useState(
    location.pathname === '/monitoring/XJGDAnalysis'
      ? [
          {
            ID: '711ffd28-fd2e-4eb9-b9f4-ffc7682d01d5',
            DGIMN: '41030002h02050',
            EntName: '********公司',
            PointName: '5#脱硫后',
            TaskCode: 'SDL_202402130842103360',
            TaskFrom: 1,
            TaskFromName: '手动创建',
            ExceptionType: null,
            ExceptionTypeName: '打卡异常',
            TaskStatus: 3,
            OperationsUserId: '2113a0a8-bffb-419a-942b-ec18f0a0f91e',
            OperationsUserName: '张建才',
            CompleteTime: '2024-02-13 08:47:45',
            CreateTime: '2024-02-13 08:42:10',
            CreateUserId: '2113a0a8-bffb-419a-942b-ec18f0a0f91e',
            CreateUserName: '张建才',
            RecordType: '30',
            RecordName: '标准物质更换',
            RegionName: '河南省',
            operationCompanyName: '雪迪龙',
            operationCompanyID: 'a19dabe3-308d-47cf-b3c5-2010836a359b',
            auditStatus: 2,
            auditStatusName: '审批通过',
            alarmType: '',
            IsForward: '0',
            nowDate: '2025-03-18 10:07:25',
            taskOver: null,
            taskOverName: '',
            modalType: 1,
            params: {
              TaskID: '711ffd28-fd2e-4eb9-b9f4-ffc7682d01d5',
              DGIMN: '41030002h02050',
            },
          },
          {
            ID: 'a6051759-5a06-4755-b5cd-610b4892a002',
            DGIMN: '120110voc16001',
            EntName: '*********限公司',
            PointName: '3T 55米',
            TaskCode: 'SDL_202502100510193904',
            TaskFrom: 4,
            TaskFromName: '自动派单',
            ExceptionType: null,
            ExceptionTypeName: '任务时间过短/过长',
            TaskStatus: 3,
            OperationsUserId: '3053cd14-9686-43d3-bf1f-24c2042dc860',
            OperationsUserName: '张学林',
            CompleteTime: '2025-02-10 08:59:39',
            CreateTime: '2025-02-10 05:10:14',
            CreateUserId: '48f3889c-af8d-401f-ada2-c383031af92d',
            CreateUserName: '超级管理员',
            RecordType: '3',
            RecordName: '校准',
            RegionName: '天津市',
            operationCompanyName: '雪迪龙',
            operationCompanyID: '8ddfb711-4036-4347-afaf-1e138c360542',
            auditStatus: 2,
            auditStatusName: '审批通过',
            alarmType: '',
            IsForward: '0',
            nowDate: '2025-03-18 10:08:03',
            taskOver: null,
            taskOverName: '',
            modalType: 2,
            params: {
              title: '任务时间过短/过长',
              TaskID: 'a6051759-5a06-4755-b5cd-610b4892a002',
              DGIMN: '120110voc16001',
            },
          },
        ]
      : [
          {
            ID: '711ffd28-fd2e-4eb9-b9f4-ffc7682d01d5',
            DGIMN: '41030002h02050',
            EntName: '********公司',
            PointName: '5#脱硫后',
            TaskCode: 'SDL_202402130842103360',
            TaskFrom: 1,
            TaskFromName: '手动创建',
            ExceptionType: null,
            ExceptionTypeName: '标气未按期更换',
            TaskStatus: 3,
            OperationsUserId: '2113a0a8-bffb-419a-942b-ec18f0a0f91e',
            OperationsUserName: '张建才',
            CompleteTime: '2024-02-13 08:47:45',
            CreateTime: '2024-02-13 08:42:10',
            CreateUserId: '2113a0a8-bffb-419a-942b-ec18f0a0f91e',
            CreateUserName: '张建才',
            RecordType: '30',
            RecordName: '标准物质更换',
            RegionName: '河南省',
            operationCompanyName: '雪迪龙',
            operationCompanyID: 'a19dabe3-308d-47cf-b3c5-2010836a359b',
            auditStatus: 2,
            auditStatusName: '审批通过',
            alarmType: '',
            IsForward: '0',
            nowDate: '2025-03-18 10:42:16',
            taskOver: null,
            taskOverName: '',
            modalType: 4,
            params: [
              {
                modalTitle: '标气未按期更换',
                title: '上次标气更换',
                TaskID: '711ffd28-fd2e-4eb9-b9f4-ffc7682d01d5',
                DGIMN: '41030002h02050',
                time: '2024-02-13 08:42:10',
              },
              {
                title: '本次标气更换',
                TaskID: '065924d8-e1ca-4d24-81e0-53e21e2a9b7d',
                DGIMN: '41030002h02050',
                time: '2025-02-07 08:14:24',
              },
            ],
          },
          {
            ID: '2a923514-162a-4b26-83d8-13c7afa297b4',
            DGIMN: '411403yglc0004',
            EntName: '********公司',
            PointName: '4#排放口',
            TaskCode: 'SDL_202501010316132166',
            TaskFrom: 1,
            TaskFromName: '手动创建',
            ExceptionType: null,
            ExceptionTypeName: '频繁校准',
            TaskStatus: 3,
            OperationsUserId: '85fc8ef1-f694-483a-bc45-ed60420ad722',
            OperationsUserName: '任广朋',
            CompleteTime: '2025-01-01 15:18:57',
            CreateTime: '2025-01-01 15:16:13',
            CreateUserId: '85fc8ef1-f694-483a-bc45-ed60420ad722',
            CreateUserName: '任广朋',
            RecordType: '3',
            RecordName: '校准',
            RegionName: '河南省',
            operationCompanyName: '雪迪龙',
            operationCompanyID: '38b1d54a-d1df-4884-a479-592827e0c23a',
            auditStatus: 2,
            auditStatusName: '审批通过',
            alarmType: '',
            IsForward: '0',
            nowDate: '2025-03-18 10:45:21',
            taskOver: null,
            taskOverName: '',
            modalType: 4,
            params: [
              {
                modalTitle: '频繁校准',
                title: '上次校准',
                TaskID: '2a923514-162a-4b26-83d8-13c7afa297b4',
                DGIMN: '411403yglc0004',
                time: '2025-01-01 15:16:13',
              },
              {
                title: '本次校准',
                TaskID: 'f8f996de-572f-4128-9138-612d6b69de94',
                DGIMN: '411403yglc0004',
                time: '2025-01-05 14:55:05',
              },
            ],
          },
          {
            ID: '10abbcc1-e700-47b1-8348-9c0768015f7e',
            DGIMN: 'noupload20221014155817',
            EntName: '**************司热电部',
            PointName: '4#脱硝出口',
            TaskCode: 'SDL_202501200511058031',
            TaskFrom: 4,
            TaskFromName: '自动派单',
            ExceptionType: null,
            ExceptionTypeName: '完成时间和水印时间不符',
            TaskStatus: 3,
            OperationsUserId: 'a54da7c6-562d-47de-9fb0-11a3e33b5bd4',
            OperationsUserName: '苏云龙',
            CompleteTime: '2025-01-25 16:27:30',
            CreateTime: '2025-01-20 05:10:56',
            CreateUserId: '48f3889c-af8d-401f-ada2-c383031af92d',
            CreateUserName: '超级管理员',
            RecordType: '3',
            RecordName: '校准',
            RegionName: '天津市',
            operationCompanyName: '雪迪龙',
            operationCompanyID: 'e34f5470-2bae-45ef-802e-f11239b18db5',
            auditStatus: 2,
            auditStatusName: '审批通过',
            alarmType: '',
            IsForward: '0',
            nowDate: '2025-03-18 10:46:34',
            taskOver: null,
            taskOverName: '',
            modalType: 2,
            params: {
              title: '完成时间和水印时间不符',
              TaskID: '10abbcc1-e700-47b1-8348-9c0768015f7e',
              DGIMN: 'noupload20221014155817',
            },
          },
        ],
  );
  const [expand, setExpand] = useState(true);
  const [loading, setLoading] = useState(false);
  const [taskRecordDetailVisible, setTaskRecordDetailVisible] = useState(false);

  const { dispatch } = props;

  useEffect(() => {
    initPageInfo();
  }, []);

  const initPageInfo = () => {};

  const columns = [
    {
      title: '行政区',
      dataIndex: 'RegionName',
      key: 'RegionName',
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
    // {
    //   title: '运维单位',
    //   dataIndex: 'operationCompanyName',
    //   key: 'operationCompanyName',
    // },
    {
      title: '任务单号',
      dataIndex: 'TaskCode',
      key: 'TaskCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '异常运维类型',
      dataIndex: 'ExceptionTypeName',
      key: 'ExceptionTypeName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '任务来源',
      dataIndex: 'TaskFrom',
      key: 'TaskFrom',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
          return (
            <span>
              <Tag color="pink">自动派单</Tag>
            </span>
          );
      },
    },
    // {
    //   title: '报警类型',
    //   dataIndex: 'alarmType',
    //   key: 'alarmType',
    //   align: 'center',
    //   ellipsis: true,
    // },
    {
      title: '任务状态',
      dataIndex: 'TaskStatus',
      key: 'TaskStatus',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        if (text === 11) {
          return (
            <span>
              <Badge status="warning" text="待领取" />
            </span>
          );
        }
        if (text === 1) {
          return (
            <span>
              <Badge status="default" text="待执行" />
            </span>
          );
        }
        if (text === 2) {
          return (
            <span>
              <Badge status="processing" text="进行中" />
            </span>
          );
        }
        if (text === 3) {
          return (
            <span>
              <Badge status="success" text="已完成" />
            </span>
          );
        }
        if (text === 10) {
          return (
            <span>
              <Badge status="error" text="系统关闭" />
            </span>
          );
        }
      },
    },
    {
      title: '审批状态',
      dataIndex: 'auditStatusName',
      key: 'auditStatusName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维人',
      dataIndex: 'OperationsUserName',
      key: 'OperationsUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '完成时间/系统关闭时间',
      dataIndex: 'CompleteTime',
      key: 'CompleteTime',
      width: 170,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'CreateUserName',
      key: 'CreateUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '任务类型',
      dataIndex: 'RecordName',
      key: 'RecordName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 200,
      ellipsis: true,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <Tooltip title="详情">
            <a>
              <ProfileOutlined
                style={{ fontSize: 16 }}
                // onClick={() =>isHomeModal?this.taskRecordDetails(TaskID,DGIMN) : this.props.dispatch(routerRedux.push(`/operations/taskRecord/details/${TaskID}/${DGIMN}`))}
                onClick={() => onOpenModal(record)}
              />
            </a>
          </Tooltip>
        );
      },
    },
  ];

  //首页详情弹框
  const [multipleTaskRecordDetailVisible, setMultipleTaskRecordDetailVisible] = useState(false);
  const [abnormalTitle, setAbnormalTitle] = useState('');
  const [modalParams, setModalParams] = useState();
  const onOpenModal = record => {
    const type = record.modalType;
    setModalParams(record.params);
    switch (type) {
      case 1:
        // 打卡异常
        setAbnormalTitle('***股份有限公司 - 固废炉排放口');
        dispatch({
          type: `abnormalWorkStatistics/getPointExceptionSignList`,
          payload: {
            beginTime: '2025-02-04 00:00:00',
            endTime: '2025-02-04 23:59:59',
            DGIMN: 'hb0712wzzy1010',
            taskID: 'b8cb31ec-543b-47d1-bdd5-acf75b48db00',
          },
        }).then(res => {
          dispatch({
            type: `abnormalWorkStatistics/updateState`,
            payload: { entAbnormalNumVisible: true },
          });
        });
        break;
      case 2:
        // 任务单弹出
        setTaskRecordDetailVisible(true);
        break;
      case 4:
        // 多个任务单弹窗
        setMultipleTaskRecordDetailVisible(true);
        break;
    }
  };

  const style = {};
  if (expand) {
    style.float = 'right';
  } else {
    style.marginLeft = 20;
  }
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  return (
    <BreadcrumbWrapper>
      <Card className={`contentContainer`}>
        <Form
          layout=""
          className="searchForm"
          style={{ marginBottom: '10' }}
          form={form}
          {...formLayout}
          initialValues={{
            CreateTime: [moment().subtract(1, 'year').startOf('year'), moment().endOf('day')],
          }}
        >
          <Row>
            <Col md={8} sm={24}>
              <FormItem label="企业" name="EntCode" style={{ width: '100%' }}>
                <EntAtmoList style={{ width: '100%' }} />
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="监测点" name="DGIMN" style={{ width: '100%' }}>
                <Select
                  mode="multiple"
                  placeholder="请选择"
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                >
                  {[].map(item => {
                    return (
                      <Option key={item.DGIMN} value={item.DGIMN}>
                        {item.PointName}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="创建时间" name="CreateTime" style={{ width: '100%' }}>
                <RangePicker_
                  isNoPanelChange
                  style={{ width: '100%' }}
                  allowClear={true}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            </Col>
            <Col md={8} sm={24} style={{ display: expand ? 'block' : 'none' }}>
              <FormItem label="运维状态" name="ExceptionType" style={{ width: '100%' }}>
                <Select
                  placeholder="请选择"
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option key="1" value="1">
                    打卡异常
                  </Option>
                  <Option key="2" value="2">
                    报警响应超时
                  </Option>
                  <Option key="3" value="3">
                    工作超时
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col md={8} sm={24} style={{ display: expand ? 'block' : 'none' }}>
              <FormItem label="任务来源" name="TaskFrom" style={{ width: '100%' }}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option key="1" value="1">
                    手动创建
                  </Option>
                  <Option key="2" value="2">
                    报警响应
                  </Option>
                  <Option key="3" value="3">
                    监管派单
                  </Option>
                  <Option key="4" value="4">
                    自动派单
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col md={8} sm={24} style={{ display: expand ? 'block' : 'none' }}>
              <FormItem label="任务状态" name="TaskStatusList" style={{ width: '100%' }}>
                <Select
                  mode="multiple"
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option key="11" value="11">
                    待领取
                  </Option>
                  <Option key="1" value="1">
                    待执行
                  </Option>
                  <Option key="2" value="2">
                    进行中
                  </Option>
                  <Option key="3" value="3">
                    已完成
                  </Option>
                  <Option key="10" value="10">
                    系统关闭
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col md={8} sm={24} style={{ display: expand ? 'block' : 'none' }}>
              <FormItem label="运维人" name="OperationsUserId" style={{ width: '100%' }}>
                <SearchSelect
                  style={{ width: '100%' }}
                  configId="View_OperationUser"
                  itemName="dbo.View_OperationUser.CreateUserName"
                  itemValue="dbo.View_OperationUser.CreateUserID"
                />
              </FormItem>
            </Col>
            <Col md={8} sm={24} style={{ display: expand ? 'block' : 'none' }}>
              <FormItem label="完成时间" name="CompleteTime" style={{ width: '100%' }}>
                <RangePicker_
                  isNoPanelChange
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  allowClear
                />
              </FormItem>
            </Col>
            <Col md={8} sm={24} style={{ display: expand ? 'block' : 'none' }}>
              <FormItem label="任务单号" name="TaskCode" style={{ width: '100%' }}>
                <Input placeholder="请输入" allowClear />
              </FormItem>
            </Col>
            <Col md={8} sm={24} style={{ display: expand ? 'block' : 'none' }}>
              <FormItem label="任务类型" name="TaskTypeList" style={{ width: '100%' }}>
                <SearchSelect
                  mode={'multiple'}
                  maxTagCount={3}
                  maxTagPlaceholder="..."
                  style={{ width: '100%' }}
                  configId="RecordTypes"
                  itemName="dbo.T_Cod_RecordTypes.PollutantTypeName"
                  itemValue="dbo.T_Cod_RecordTypes.ID"
                />
              </FormItem>
            </Col>
            <Col md={8} sm={24} style={{ display: expand ? 'block' : 'none' }}>
              <FormItem label="审批状态" name="ApproveStatus" style={{ width: '100%' }}>
                <Select
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option key="0" value="0">
                    待审批
                  </Option>
                  <Option key="1" value="1">
                    审批中
                  </Option>
                  <Option key="2" value="2">
                    审批通过
                  </Option>
                  <Option key="3" value="3">
                    审批未通过
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <div style={{ marginTop: 4, ...style, marginBottom: !expand && 12 }}>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                  }, 1000);
                }}
                type="primary"
              >
                查询
              </Button>
              <Button style={{ marginLeft: 8 }}>重置</Button>
              <Button icon={<ExportOutlined />} style={{ marginLeft: 8 }}>
                导出
              </Button>
              {expand ? (
                <a style={{ marginLeft: 8 }} onClick={() => setExpand(false)}>
                  收起 <UpOutlined />
                </a>
              ) : (
                <a style={{ marginLeft: 8 }} onClick={() => setExpand(true)}>
                  展开 <DownOutlined />
                </a>
              )}
            </div>
          </Row>
        </Form>
        <SdlTable
          resizable
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          columns={columns}
        />
      </Card>
      {
        // 打卡异常 弹框
        <Modal
          title={`打卡异常 - 详情`}
          visible={!!abnormalTitle}
          destroyOnClose
          wrapClassName="fullScreenModal"
          footer={null}
          mask={false}
          onCancel={() => {
            setAbnormalTitle();
          }}
        >
          <Tabs defaultActiveKey="1" style={{ height: '100%' }}>
            <Tabs.TabPane tab="任务单" key={1}>
              <TaskRecordDetails
                match={{
                  params: modalParams,
                }}
                isHomeModal
                hideBreadcrumb
                // forwardPermis={this.state.forwardPermis}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="打卡位置及时间" key={2} style={{ padding: 0 }}>
              <EntAbnormalMapModal
                abnormalTitle={abnormalTitle}
                displayMode="page"
                // onCancel={() => {
                //   setAbnormalTitle(undefined);
                // }}
              />
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      }
      {
        // 任务单弹窗
        <Modal
          title={`${modalParams?.title} - 任务详情`}
          visible={taskRecordDetailVisible}
          destroyOnClose
          wrapClassName="fullScreenModal"
          footer={null}
          mask={false}
          onCancel={() => {
            setTaskRecordDetailVisible(false);
          }}
        >
          <TaskRecordDetails
            match={{
              params: modalParams,
            }}
            isHomeModal
            hideBreadcrumb
            // forwardPermis={this.state.forwardPermis}
          />
        </Modal>
      }
      {
        // 多个任务单弹窗
        <Modal
          title={`${modalParams?.[0]?.modalTitle} - 任务详情`}
          visible={multipleTaskRecordDetailVisible}
          destroyOnClose
          wrapClassName="fullScreenModal"
          footer={null}
          mask={false}
          onCancel={() => {
            setMultipleTaskRecordDetailVisible(false);
          }}
        >
          <Tabs defaultActiveKey="1" style={{ height: '100%' }} destroyInactiveTabPane={true}>
            {modalParams?.length > 0 &&
              modalParams?.map(item => {
                return (
                  <Tabs.TabPane tab={item.title + ' - ' + item.time} key={item.TaskID}>
                    <TaskRecordDetails
                      match={{
                        params: { TaskID: item.TaskID, DGIMN: item.DGIMN },
                      }}
                      isHomeModal
                      hideBreadcrumb
                      // forwardPermis={this.state.forwardPermis}
                    />
                  </Tabs.TabPane>
                );
              })}
          </Tabs>
        </Modal>
      }
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(XJGDAnalysis);
