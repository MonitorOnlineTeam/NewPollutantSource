import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import {
  Card,
  Col,
  Row,
  Button,
  Space,
  Select,
  DatePicker,
  message,
  Tag,
  Radio,
  Empty,
  Timeline,
  Modal,
  Dropdown,
  Menu,
  Popconfirm,
  Spin,
  Pagination,
  Tree,
  Form,
  Popover,
  Input,
} from 'antd';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../styles.less';
import moment from 'moment';
import FromsModal from '../Forms/FromsModal';
import SuperviseRectification from '@/pages/operations/superviseRectification';
import SuperviseRectificationDetail from '@/pages/operations/superviseRectification/Detail';
import superviseRectificaSty from '@/pages/operations/superviseRectification/style.less';
import RemainProblems from '@/pages/ctDebuggAfterSaleServiceManage/projectExecuProgress/remainProblems';
import InstallEquipmentExamineModal from '@/pages/ctDebuggAfterSaleServiceManage/supervisionInspection/installEquipment/components/ExamineModal';
import InstallEquipmentViewPhotos from '@/pages/ctDebuggAfterSaleServiceManage/supervisionInspection/installEquipment/components/ViewPhotos';
import InstallEquipmentHandlingSugges from '@/pages/ctDebuggAfterSaleServiceManage/supervisionInspection/installEquipment/components/HandlingSugges';
import CustomerSatisfacHandleModal from '@/pages/ctDebuggAfterSaleServiceManage/customerSatisfaction/customerSatisfacQuery/components/HandleModal';
import CustomerSatisfaInvestigateModal from '@/pages/ctDebuggAfterSaleServiceManage/customerSatisfaction/customerSatisfacQuery/components/InvestigateModal';
import ReportAuditModal from '@/pages/ctDebuggAfterSaleServiceManage/projectExecuProgress/reportAudit/components/AuditModalPage';
import HandleComplaints from '@/pages/ctDebuggAfterSaleServiceManage/customerSatisfaction/handleComplaints/components/Dispose';
import ProjectQueryDetail from '@/pages/ctDebuggAfterSaleServiceManage/assetManagement/equipmentAccount/projectQuery/Detail';
import StandardGasValidityContent from '@/pages/ctDebuggAfterSaleServiceManage/assetManagement/equipmentAccount/standardGasValidity/components/StandardGasValidityContent';
import HandoverReportEditModal from '@/pages/platformManager/configurationInfo/handoverReport/EditModal';
import RemoteSupervisionEditModal from '@/pages/operations/remoteSupervision/checkUserEdit';
import RectificaDetailModal from '@/pages/operations/cruxParSupervisionRectifica3.0/RectificaDetailModal';

import router from 'umi/router';
import { PageLoading } from '@ant-design/pro-layout';
import Cookie from 'js-cookie';
import config from '@/config';
const { DirectoryTree } = Tree;
const manualList = [
  {
    label: '应收账款催收',
    value: 11,
    img: '/cuishou.png',
  },
  {
    label: '现场工作',
    value: 8,
    img: '/xianchang.png',
  },
  {
    label: '部门内其他工作事项',
    value: 9,
    img: '/nei.png',
  },
  {
    label: '支持其他部门工作',
    value: 10,
    img: '/qita.png',
  },
];
const CONFIGID = 'T_Bas_PortableInstrument';
const dvaPropsData = ({ loading, wordSupervision, global }) => ({
  todoList: wordSupervision.todoList,
  messageList: wordSupervision.messageList,
  managerList: wordSupervision.managerList,
  TYPE: wordSupervision.TYPE, // 成套：1
  todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'] || false,
  messageListLoading: loading.effects['wordSupervision/GetWorkBenchMsg'],
  supervisionVerificaList: wordSupervision.supervisionVerificaList,
  operaServiceLoading: loading.effects['wordSupervision/GetStagingInspectorRectificationList'],
  workAlarmPushLoading:
    loading.effects['wordSupervision/GetWorkAlarmPushList'] ||
    loading.effects['wordSupervision/UpdateWorkPushStatus'] ||
    loading.effects['wordSupervision/UpdateAllWorkPushStatus'] ||
    false,
  workAlarmPushList: wordSupervision.workAlarmPushList,
  workAlarmTotal: wordSupervision.workAlarmTotal,
  // contractLoading: wordSupervision.contractLoading  || loading.effects['wordSupervision/DelAllWorkbenchMsg'] || false, //旧
  contractLoading: wordSupervision.contractLoading,
  contractList: wordSupervision.contractList,
  standgaswaringList: wordSupervision.standgaswaringList,
  standgaswaringLoading: wordSupervision.standgaswaringLoading,
  configInfo: global.configInfo,
  menuList: wordSupervision.menuList,
  allMenuList: wordSupervision.allMenuList,
  userMenuListLoading: loading.effects['wordSupervision/GetUserMenuList'],
  addUserMenuLoading: loading.effects['wordSupervision/AddUserMenu'],
  clientHeight: global.clientHeight,
  workbenchesModuleLoading: loading.effects['wordSupervision/GetWorkbenchesModuleList'] || false,
  projectExecutionLoading: wordSupervision.projectExecutionLoading || false,
  projectExecutionList: wordSupervision.projectExecutionList,
  updateprojectExecutionLoading:
    loading.effects['wordSupervision/UpdateImplementationStatus'] || false,
  customeSatisfactLoading: wordSupervision.customeSatisfactLoading,
  customeSatisfactList: wordSupervision.customeSatisfactList,
  elseLoading: wordSupervision.elseLoading,
  elseList: wordSupervision.elseList,
  addOrUpdProjectReportInfoLoading: loading.effects[`handoverReport/addOrUpdProjectReportInfo`],
  photoExportAuditPhotoLoading: loading.effects[`installEquipment/ExportAuditPhoto`],
});

const Workbench = props => {
  const {
    TYPE,
    todoList,
    messageList,
    managerList,
    todoListLoading,
    messageListLoading,
    operaServiceLoading,
    supervisionVerificaList,
    configInfo,
    workAlarmPushLoading,
    workAlarmPushList,
    workAlarmTotal,
    contractList,
    contractLoading,
    menuList,
    allMenuList,
    userMenuListLoading,
    addUserMenuLoading,
    clientHeight,
    workbenchesModuleLoading,
    projectExecutionLoading,
    projectExecutionList,
    updateprojectExecutionLoading,
    customeSatisfactList,
    customeSatisfactLoading,
    standgaswaringList,
    standgaswaringLoading,
    elseList,
    elseLoading,
    addOrUpdProjectReportInfoLoading,
  } = props;
  const [currentTodoItem, setCurrentTodoItem] = useState({});
  const [formsModalVisible, setFormsModalVisible] = useState(false);
  const [forwardingTaskVisible, setForwardingTaskVisible] = useState(false);
  const [forwardingUserId, setForwardingUserId] = useState('');

  const [daily, setDaily] = useState(false);
  const [opera, setOpera] = useState(false);
  const [operaSupervisionCheck, setOperaSupervisionCheck] = useState(false); //监督核查
  const [projectExecution, setProjectExecution] = useState(false); //项目执行
  const [customSatisfact, setCustomSatisfact] = useState(false); //客户满意度
  const [customSatisfactVisible, setCustomSatisfactVisible] = useState(false);
  const [customSatisfactData, setCustomSatisfactData] = useState({});
  const [customSatisfactVisible2, setCustomSatisfactVisible2] = useState(false);
  const [customSatisfactData2, setCustomSatisfactData2] = useState({});

  const [remainProblemsVisible, setRemainProblemsVisible] = useState(false);
  const [remind, setRemind] = useState(false);
  const [remindDataAlarm, setRemindDataAlarm] = useState(false);
  const [remindExpire, setRemindExpire] = useState(false);
  const [standardgasAlarm, setStandardgasAlarm] = useState(false);

  const [popForm] = Form.useForm(); //项目执行-解决问题
  const [remainProblemsData, setRemainProblemsData] = useState();

  const [installEquipmentVisible, setInstallEquipmentVisible] = useState(false);
  const [installEquipmentTitle, setInstallEquipmentTitle] = useState();
  const [installEquipmentData, setInstallEquipmentData] = useState({});

  const [reportAuditVisible, setReportAuditVisible] = useState(false);
  const [reportAuditData, setReportAuditData] = useState({});

  // 投诉处理
  const [handleComplaintsModalOpen, setHandleComplaintsModalOpen] = useState(false);
  const [handleComplaintsData, setHandleComplaintsData] = useState({});

  const [projectQueryDetailVisible, setProjectQueryDetailVisible] = useState(false);
  const [projectQueryDetailTitle, setProjectQueryDetailTitle] = useState('详情');
  const [projectQueryDetailCode, setProjectQueryDetailCode] = useState();

  const [standardGasValidityVisible, setStandardGasValidityVisible] = useState(false);
  const [standardGasValidityId, setStandardGasValidityId] = useState();

  //上传运维交接报告
  const [handoverReportVisible, setHandoverReportVisible] = useState(false);
  const [handoverReportId, setHandoverReportId] = useState();

  // 安装照片下拉菜单
  const [photoMenuVisible, setPhotoMenuVisible] = useState(false);
  const [photoMenuSelectIndex, setPhotoMenuSelectIndex] = useState(-1);
  //安装照片 助理查看安装照片
  const [viewPhotosVisible, setViewPhotosVisible] = useState(false);
  const [viewPhotosTitle, setViewPhotosTitle] = useState();

  const type = props.location.pathname === '/ctManage/workbench' ? 1 : '';
  const paddingBottomVal = 10;
  useEffect(() => {
    // loadData();
  }, []);

  useEffect(() => {
    // if (type ) {
    props.dispatch({
      type: 'wordSupervision/updateState',
      payload: {
        TYPE: type,
      },
    });
    loadData();
    // }
  }, [type]);

  const [userAllMenuListLoading, setAllUserMenuLoading] = useState(true);

  // 加载工作台和我的消息数据 待办中心列表 根据权限
  const loadData = () => {
    // let flag = false; //判断项目执行和合同到期合并接口请求
    props.dispatch({
      type: 'wordSupervision/GetWorkbenchesModuleList',
      payload: {},
      callback: res => {
        res.map(item => {
          switch (item.PName) {
            case '日常监督':
              setDaily(true);
              // GetToDoDailyWorks()
              // if(item?.CList[0]){
              //   setDaily(true)
              //  }else{
              //    setDaily(false)
              //  }
              break;
            case '待办中心':
              if (item?.CList[0]) {
                setOpera(true);
                let btnArr = [];
                item.CList.map(clItem => {
                  let btnObj = {};
                  btnObj.title = clItem.CName;
                  btnObj.name = clItem.CName;
                  if (clItem.CName == '监督核查') {
                    btnObj.value = 1;
                    setOperaSupervisionCheck(true);
                    GetStagingInspectorRectificationList();
                  }
                  if (clItem.CName == '项目执行') {
                    btnObj.value = 2;
                    setProjectExecution(true);
                    getCtWorkbenchMsg(2);
                  }
                  if (clItem.CName == '客户满意度') {
                    btnObj.value = 3;
                    setCustomSatisfact(true);
                    getCtWorkbenchMsg(3);
                  }
                  if (clItem.CName === '经理日常管理任务') {
                    btnObj.value = 4;
                    GetToDoDailyWorks();
                  }
                  if (clItem.CName === '其他') {
                    btnObj.value = 5;
                    getCtWorkbenchMsg(5);
                  }
                  btnArr.push(btnObj);
                });
                setSelectOperaVal(btnArr?.[0]?.value);
                setOperaServiceBtnList(btnArr);
              } else {
                setOpera(false);
              }
              break;
            case '我的提醒':
              if (item?.CList[0]) {
                setRemind(true);
                let btnArr = [];
                item.CList.map(clItem => {
                  let btnObj = {};
                  btnObj.title = clItem.CName;
                  btnObj.name = clItem.CName;
                  if (clItem.CName == '数据报警') {
                    btnObj.value = 10;
                    setRemindDataAlarm(true);
                    GetWorkAlarmPushList(dataAlarmVal, alarmPageIndex, alarmPageSize); //我的提醒 数据报警
                  }
                  if (clItem.CName == '合同到期') {
                    btnObj.value = 11;
                    setRemindExpire(true);
                    getCtWorkbenchMsg(11);
                  }
                  if (clItem.CName == '标气有效期报警') {
                    btnObj.value = 12;
                    setStandardgasAlarm(true);
                    getCtWorkbenchMsg(12);
                  }
                  btnArr.push(btnObj);
                });
                setSelectMyVal(btnArr?.[0]?.value);
                setMyRemindBtnList(btnArr);
              } else {
                setRemind(false);
              }
              break;
          }
        });
      },
    });
    GetUserMenuList(() => {
      setAllUserMenuLoading(false);
    }); //快捷菜单
    GetWorkBenchMsg(); //我的消息
  };

  // 获取工作台待办
  const GetToDoDailyWorks = () => {
    props.dispatch({
      type: 'wordSupervision/GetToDoDailyWorks',
      payload: {
        type: type,
      },
      // callback: res => {
      //   debugger
      //   filterData(operaServiceBtnList,4,res.length)
      // }
    });
  };

  // 获取工作台消息
  const GetWorkBenchMsg = () => {
    props.dispatch({
      type: 'wordSupervision/GetWorkBenchMsg',
      payload: {
        // type: TYPE,
      },
    });
  };
  // 结束任务
  const endTask = todoItem => {
    if (todoItem.qualify !== 1) {
      if (todoItem.TaskType === 1 || todoItem.TaskType === 4) {
        // 现场检查，客户回访
        onInspectionInfo(todoItem);
        return;
      }
      message.error('完成任务后，才能结束此任务！');
      return;
    }
    props.dispatch({
      type: 'wordSupervision/endTask',
      payload: {
        id: todoItem.ID,
        taskType: todoItem.TaskType,
      },
      callback: () => {
        // loadData();
        GetToDoDailyWorks();
      },
    });
  };

  // 手动申请任务
  const manualTask = value => {
    props.dispatch({
      type: 'wordSupervision/manualTask',
      payload: {
        taskType: value,
        type: TYPE,
      },
      callback: () => {
        loadData();
      },
    });
  };

  //获取待办中心列表 监督核查
  const GetStagingInspectorRectificationList = () => {
    props.dispatch({
      type: 'wordSupervision/GetStagingInspectorRectificationList',
      payload: { pageIndex: 1, pageSize: 9999 },
    });
  };
  const [popVisible, setPopVisible] = useState(false);
  const [popSelectIndex, setSelectPopIndex] = useState(-1);

  const solveProblem = async row => {
    //待办中心 项目执行-解决遗留问题
    try {
      const values = await popForm.validateFields();
      props.dispatch({
        type: 'wordSupervision/UpdateImplementationStatus',
        payload: {
          ...values,
          problemTime: values.problemTime && values.problemTime.format('YYYY-MM-DD HH:mm:ss'),
          id: row.MsgID,
        },
        callback: () => {
          setPopVisible(false);
          getCtWorkbenchMsg(2);
        },
      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  //获取菜单列表
  const GetUserMenuList = callback => {
    props.dispatch({
      type: 'wordSupervision/GetUserMenuList',
      payload: { systemMenuID: Cookie.get('sysMenuId') },
      callback: callback && callback(),
    });
  };

  // 任务点击
  const onTodoItemClick = todoItem => {
    // 运维现场检查弹窗
    if (todoItem.TaskType === 1 && TYPE === 2) {
      onInspectionInfo(todoItem);
    } else {
      setCurrentTodoItem(todoItem);
      setFormsModalVisible(true);
    }

    // switch (todoItem.TaskType) {
    //   // 现场检查
    //   case 1:
    //   case 2:
    //     onInspectionInfo(todoItem);
    //     break;
    //   default:

    //     // props.dispatch({
    //     //   type: 'wordSupervision/updateState',
    //     //   payload: {
    //     //     formsModalVisible: true,
    //     //   },
    //     // });
    //     break;
    // }
  };

  // 现场检查弹窗说明
  const onInspectionInfo = todoItem => {
    const {
      standMNNum,
      overMNNum,
      standPersonNum,
      overPersonNum,
      BeginTime,
      EndTime,
      qualify,
      TaskType,
      standNum,
      overReturnPersonNum,
    } = todoItem;

    let taskName = TaskType === 1 ? '现场检查' : '回访客户';
    let content = (
      <div>
        {/* <Tag color="error">未达标</Tag> */}
        <ul className={styles.inspectionInfo}>
          <li>
            <span>任务类型：</span>
            {taskName}任务。
          </li>
          <li>
            <span>任务有效期：</span>
            {moment(BeginTime).format('YYYY-MM-DD')} 至 {moment(EndTime).format('YYYY-MM-DD')}。
          </li>

          {TaskType === 1
            ? [
                <li>
                  <span>任务要求：</span>需覆盖{standMNNum}个监测点，{standPersonNum}名运维人员。
                </li>,
                <li>
                  <span>完成情况：</span>已覆盖{overMNNum}个监测点，{overPersonNum}名运维人员。
                </li>,
                // 成套不显示
                <li style={{ display: TYPE === 1 ? 'none' : 'block' }}>
                  <span>填写位置：</span>请跳转到
                  <a
                    onClick={() => {
                      Modal.destroyAll();
                      router.push('/operations/siteInspector');
                    }}
                  >
                    “监督核查/现场监督核查/系统设施核查”
                  </a>
                  页面中填写。
                </li>,
              ]
            : [
                <li>
                  <span>任务要求：</span>需回访客户{standNum}次。
                </li>,
                <li>
                  <span>完成情况：</span>已回访客户{overReturnPersonNum}次。
                </li>,
              ]}
        </ul>
      </div>
    );
    Modal.info({
      title: (
        <div>
          {taskName}任务
          {qualify === 1 ? (
            <Tag style={{ marginLeft: 10 }} color="success">
              达标
            </Tag>
          ) : (
            <Tag style={{ marginLeft: 10 }} color="error">
              未达标
            </Tag>
          )}
        </div>
      ),
      content: content,
      onOk() {
        console.log('OK');
      },
    });
  };

  // 显示转发弹窗，获取可转发的经理列表
  const onShowForwardingModal = item => {
    //     regional：大区经理
    // province：省区经理
    props.dispatch({
      type: 'wordSupervision/GetManagerByType',
      payload: {
        type: TYPE ? 'regional' : 'province',
      },
      callback: res => {
        setCurrentTodoItem(item);
        setForwardingTaskVisible(true);
      },
    });
  };

  // 转发任务
  const onForwardingTask = () => {
    if (!forwardingUserId) {
      message.error('请选择要转发的经理！');
      return;
    }
    props.dispatch({
      type: 'wordSupervision/RetransmissionTasks',
      payload: {
        ID: currentTodoItem.ID,
        User_ID: forwardingUserId,
      },
      callback: res => {
        setForwardingTaskVisible(false);
      },
    });
  };

  // 渲染待办列表
  const renderTodoList = () => {
    if (todoList?.length <= 0) {
      return <Empty style={{ marginTop: '30px' }} />;
    }
    return todoList.map(item => {
      const menu = (
        <Menu
          onClick={e => {
            if (e.key === '1') {
              // 转发任务
              onShowForwardingModal(item);
            } else {
              // 结束任务
              endTask(item);
            }
          }}
        >
          {/* {item.TaskFrom === 2 && <Menu.Item key="1">转发任务</Menu.Item>} */}
          <Menu.Item key="2">结束任务</Menu.Item>
        </Menu>
      );
      return (
        <Row key={item.ID} className={styles.listItem}>
          <Col flex="1" className={styles.taskName} onClick={() => onTodoItemClick(item)}>
            {item.TaskContent}
          </Col>
          {/* <Col flex="200px">
            <span className={styles.ellipsis} title={item.CreateUser}>
              {item.CreateUser}
            </span>
          </Col> */}
          <Col flex="140px">
            {item.CreateTime && moment(item.CreateTime).format('YYYY-MM-DD HH:mm')}
          </Col>
          <Col flex="40px" style={{ textAlign: 'right', cursor: 'pointer' }}>
            <Dropdown placement="bottomLeft" overlay={menu}>
              <EllipsisOutlined />
            </Dropdown>
          </Col>
        </Row>
      );
    });
  };

  // 渲染消息时间轴
  const renderMessageTimeLine = () => {
    return messageList.map(item => {
      const date = moment(item.CreateTime).format('MM月DD日 HH:mm');
      return <Timeline.Item label={date}>{item.Title}</Timeline.Item>;
    });
  };
  const [superviseRectificaVisible, setSuperviseRectificaVisible] = useState(false);
  const [superviseRectificaDetailVisible, setSuperviseRectificaDetailVisible] = useState(false);
  const [superviseRectificaDetailId, setSuperviseRectificaDetailId] = useState();

  const [remoteSupervisionModalVisible, setRemoteSupervisionModalVisible] = useState(false);
  const [rectificaDetailModalVisible, setRectificaDetailModalVisible] = useState(false);

  const operaServiceClick = (id, type) => {
    setSuperviseRectificaDetailId(id);
    switch (type) {
      case '1':
        setSuperviseRectificaDetailVisible(true);
        break;
      case '2':
        setRemoteSupervisionModalVisible(true);
        break;
      case '3':
        setRectificaDetailModalVisible(true);
        break;
    }
  };

  const dataAlarmTypeChange = val => {
    setDataAlarmVal(val);
    setAlarmPageIndex(1);
    setAlarmPageSize(10);
    GetWorkAlarmPushList(val, 1, 10);
  };
  const [selectOperaVal, setSelectOperaVal] = useState();
  const [selectMyVal, setSelectMyVal] = useState();

  const [operaServiceBtnList, setOperaServiceBtnList] = useState([]);

  const [myRemindBtnList, setMyRemindBtnList] = useState([]); //我的提醒

  const BtnComponents = ({ data, val, callback }) => {
    return (
      <div className={styles.selectBtnSty}>
        {data.map(item => {
          return (
            <div
              className={item.value && item.value === val ? 'btnItemActive' : 'btnItem'}
              onClick={() => callback(item.value)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    );
  };

  const [dataAlarmTypeList, setDataAlarmTypeList] = useState([
    { name: '全部', value: '' },
    { name: '待处理', value: 1 },
    { name: '已处理', value: 3 },
  ]);
  const [dataAlarmVal, setDataAlarmVal] = useState('');
  const [allClose, setAllClose] = useState(1);

  const btnSquareComponents = (data, val, callBack) => {
    return (
      <div className={styles.selectSquareBtnSty}>
        {data.map(item => {
          return (
            <div
              className={item.value == val ? 'btnItemActive' : 'btnItem'}
              onClick={() => callBack(item.value)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    );
  };
  //获取数据报警
  const [workAlarmPushTotal, setWorkAlarmPushTotal] = useState(0);
  const GetWorkAlarmPushList = (status, pageIndex, pageSize, callback) => {
    props.dispatch({
      type: 'wordSupervision/GetWorkAlarmPushList',
      payload: {
        status: status,
        pageIndex: pageIndex ? pageIndex : alarmPageIndex,
        pageSize: pageSize ? pageSize : alarmPageSize,
      },
      callback: total => {
        setWorkAlarmPushTotal(total);
      },
    });
  };
  const delAlarm = item => {
    //删除报警
    props.dispatch({
      type: 'wordSupervision/UpdateWorkPushStatus',
      payload: {
        alarmID: item.ID,
      },
      callback: () => {
        GetWorkAlarmPushList(dataAlarmVal);
      },
    });
  };
  const closeAllAlarmChange = () => {
    //关闭全部报警
    props.dispatch({
      type: 'wordSupervision/UpdateAllWorkPushStatus',
      payload: {},
      callback: () => {
        setAlarmPageIndex(1);
        setAlarmPageSize(10);
        GetWorkAlarmPushList(dataAlarmVal, 1, 10);
      },
    });
  };
  const [alarmPageIndex, setAlarmPageIndex] = useState(1);
  const [alarmPageSize, setAlarmPageSize] = useState(10);
  const alarmPageChange = (pageIndex, pageSize) => {
    setAlarmPageIndex(pageIndex);
    setAlarmPageSize(pageSize);
    GetWorkAlarmPushList(dataAlarmVal, pageIndex, pageSize);
  };

  //获取项目执行、合同到期等
  const getCtWorkbenchMsg = type => {
    props.dispatch({
      type: 'wordSupervision/CtGetWorkbenchMsg',
      payload: { type: type },
      callback: ({
        ctListTotal,
        customerListTotal,
        projectListTotal,
        standgaswaringListTotal,
        elseListTotal,
      }) => {
        switch (type) {
          case 2:
            filterData(operaServiceBtnList, type, ctListTotal);
            break; //项目执行
          case 3:
            filterData(operaServiceBtnList, type, customerListTotal);
            break; //客户满意度
          case 5:
            filterData(operaServiceBtnList, type, elseListTotal);
            break; //其他
          case 11:
            filterData(myRemindBtnList, type, projectListTotal);
            break; //合同到期
          case 12:
            filterData(myRemindBtnList, type, standgaswaringListTotal);
            break; //标气报警
        }
      },
    });
  };
  const filterData = (data, value, total) => {
    const filterIndex = data.findIndex(item => item.value == value);
    if (filterIndex != -1) {
      data[filterIndex]['name'] = `${data[filterIndex]?.title}（${total}）`;
    }
  };

  useEffect(() => {
    //初始加载 按钮显示总数
    if (supervisionVerificaList?.length >= 0) {
      //监督核查
      filterData(operaServiceBtnList, 1, supervisionVerificaList?.length);
    }
    if (projectExecutionList?.length >= 0) {
      //项目执行
      filterData(operaServiceBtnList, 2, projectExecutionList?.length);
    }
    if (customeSatisfactList?.length >= 0) {
      //客户满意度
      filterData(operaServiceBtnList, 3, customeSatisfactList?.length);
    }
    if (todoList?.length >= 0) {
      //经理日常管理任务
      filterData(operaServiceBtnList, 4, todoList?.length);
    }
    if (elseList?.length >= 0) {
      //其他
      filterData(operaServiceBtnList, 5, elseList?.length);
    }
    if (workAlarmPushList?.length >= 0) {
      //数据报警
      filterData(myRemindBtnList, 10, workAlarmPushTotal);
    }
    if (contractList?.length >= 0) {
      //合同到期
      filterData(myRemindBtnList, 11, contractList?.length);
    }
    if (standgaswaringList?.length >= 0) {
      //标气报警
      filterData(myRemindBtnList, 12, standgaswaringList?.length);
    }
  }, [
    supervisionVerificaList,
    projectExecutionList,
    customeSatisfactList,
    workAlarmPushList,
    contractList,
    standgaswaringList,
    todoList,
    elseList,
  ]);

  const [delContractLoading, setDelContractLoading] = useState(false);

  const delContract = item => {
    //删除合同到期
    setDelContractLoading(true);
    props.dispatch({
      type: 'wordSupervision/DelWorkbenchMsg',
      payload: {
        ID: item.ID,
      },
      callback: () => {
        setDelContractLoading(false);
        getCtWorkbenchMsg(11);
      },
    });
  };

  const [contractPageIndex, setContractPageIndex] = useState(1);
  const [contractPageSize, setContractPageSize] = useState(10);
  const contractPageChange = (pageIndex, pageSize) => {
    setContractPageIndex(pageIndex);
    setContractPageSize(pageSize);
  };
  const [delStandgaswaringLoading, setDelStandgaswaringLoading] = useState(false);

  const delStandgaswaring = item => {
    //删除标气有效期报警
    setDelStandgaswaringLoading(true);
    props.dispatch({
      type: 'wordSupervision/DelWorkbenchMsg',
      payload: {
        ID: item.ID,
      },
      callback: () => {
        setDelStandgaswaringLoading(false);
        getCtWorkbenchMsg(12);
      },
    });
  };

  const [delInstallPhotosLoading, setDelInstallPhotosLoading] = useState(false);
  const delInstallPhotos = item => {
    setDelInstallPhotosLoading(true);
    setPhotoMenuVisible(false);
    props.dispatch({
      type: 'wordSupervision/DelWorkbenchMsg',
      payload: {
        ID: item.ID,
      },
      callback: () => {
        setDelInstallPhotosLoading(false);
        getCtWorkbenchMsg(2);
      },
    });
  };
  const [delCustomSatisfactLoading, setDelCustomSatisfactLoading] = useState(false);
  const delCustomSatisfact = item => {
    setDelInstallPhotosLoading(true);
    props.dispatch({
      type: 'wordSupervision/DelWorkbenchMsg',
      payload: {
        ID: item.ID,
      },
      callback: () => {
        setDelCustomSatisfactLoading(false);
        getCtWorkbenchMsg(3);
      },
    });
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const addMeun = () => {
    //添加快捷菜单
    setMenuVisible(true);
  };

  const [menuID, setMenuID] = useState();
  const onMeunSelect = (keys, info) => {
    setMenuID(keys?.[0]);
  };

  const menuOK = () => {
    props.dispatch({
      type: 'wordSupervision/AddUserMenu',
      payload: { menuID: menuID },
      callback: () => {
        setMenuVisible(false);
        GetUserMenuList();
      },
    });
  };
  const meunClick = url => {
    router.push(url);
  };

  const [delAllContractLoading, setAllDelContractLoading] = useState(false);
  const [delAllStandgaswaringLoading, setDelAllStandgaswaringLoading] = useState(false);

  const delAll = type => {
    //删除全部

    const delAllloading = flag => {
      switch (type) {
        case 11:
          setDelContractLoading(flag);
          break;
        case 12:
          setDelAllStandgaswaringLoading(flag);
          break;
      }
    };
    const delAllPar = {
      '11': 1, //合同到期
      '12': 5, //标气有效期报警
    };
    delAllloading(true);
    props.dispatch({
      type: 'wordSupervision/DelAllWorkbenchMsg',
      payload: { type: delAllPar[type] },
      callback: () => {
        delAllloading(false);
        if (type == 11) {
          //合同到期
          setContractPageIndex(1);
          setContractPageSize(10);
        }
        getCtWorkbenchMsg(type);
      },
    });
  };
  const DelAllBtnComponents = ({ title, type }) => {
    return (
      <Row style={{ paddingTop: 8 }}>
        <Popconfirm
          placement="topLeft"
          title={`确定要删除全部${title}吗？`}
          onConfirm={() => delAll(type)}
          okText="是"
          cancelText="否"
        >
          <div>{btnSquareComponents([{ name: '删除全部', value: 1 }], allClose, () => {})}</div>
        </Popconfirm>
      </Row>
    );
  };

  const msgTypeTitle = {
    '2': '（遗留问题）',
    '3': '（客户投诉）',
    '4': '（照片审核）',
    '6': '（满意度调查）',
    '7': '（验收服务报告）',
  };
  const [projectReportList, setProjectReportList] = useState(); //交接和报告
  const ListComponents = ({ list, loading }) => {
    return (
      <Spin spinning={loading}>
        {list?.length ? (
          list.map((item, index) => (
            <Row style={{ paddingBottom: paddingBottomVal, cursor: 'pointer' }}>
              <Col
                flex="auto"
                className="textOverflow"
                style={{ width: 'calc(100% - 127px - 12px)' }}
                title={item.Msg}
                onClick={() => {
                  setHandoverReportVisible(true);
                  props.dispatch({
                    type: 'handoverReport/getProjectReportList',
                    payload: {
                      MsgID: item.MsgID,
                    },
                    callback: res => {
                      res?.Datas?.[0] && setProjectReportList(res.Datas[0]);
                    },
                  });
                }}
              >
                {item.Msg}
              </Col>
              <Col flex="12px" />
              <Col flex="110px">
                {item.CreateTime && moment(item.CreateTime).format('YYYY-MM-DD HH:mm')}
              </Col>
            </Row>
          ))
        ) : (
          <Empty style={{ marginTop: '30px' }} />
        )}
      </Spin>
    );
  };
  return (
    <div className={styles.workbenchBreadSty}>
      <BreadcrumbWrapper>
        <div className={styles.workbench}>
          {workbenchesModuleLoading ? (
            <div className={styles.leftWrapper} style={{ background: '#fff' }}>
              <PageLoading size="default" />
            </div>
          ) : (
            <>
              <div className={styles.leftWrapper}>
                {daily && (
                  <div className={styles.topWrapper}>
                    <div className={styles.taskListWrapper}>
                      <Card
                        style={{ height: '100%' }}
                        bodyStyle={{
                          padding: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          paddingTop: 8,
                        }}
                      >
                        {/* 手工申请 */}
                        <div className={styles.title}>日常监督</div>
                        <div className={styles.manualList}>
                          {/* <Row
                          gutter={32}
                          className={styles.content}
                        >
                          {manualList.map(item => {
                            return (
                              <Col span={6}>
                                <Popconfirm
                                  title={`确认申请${item.label}任务单？`}
                                  onConfirm={e => {
                                    manualTask(item.value);
                                  }}
                                  okText="是"
                                  cancelText="否"
                                >
                                  <div className={styles.manualItem} style={{ backgroundImage: `url(${item.img})` }}>
                                    <p>{item.label}</p>
                                  </div>
                                </Popconfirm>
                              </Col>
                            );
                          })}
                        </Row> */}
                        </div>
                        <div className={styles.taskList}>
                          <div className={styles.content} style={{ textAlign: 'center' }}>
                            {/* <Spin spinning={todoListLoading}>{renderTodoList()}</Spin> */}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}
                <Row className={`${styles.bottomWrapper}`}>
                  {opera && (
                    <Col flex="1" span={24} style={{ height: 360 }}>
                      <Card
                        style={{ height: '100%' }}
                        bodyStyle={{
                          padding: 0,
                          height: '100%',
                          paddingTop: 8,
                        }}
                      >
                        {/* 待办中心 */}
                        {(operaSupervisionCheck || projectExecution || customSatisfact) && (
                          <>
                            <Row justify="space-between">
                              <div className={styles.title}>待办中心</div>
                              {operaSupervisionCheck && selectOperaVal == 1 && (
                                <img
                                  title="更多"
                                  style={{ height: '100%', paddingRight: 16, cursor: 'pointer' }}
                                  src="/more.png"
                                  onClick={() => setSuperviseRectificaVisible(true)}
                                />
                              )}
                              {/**监督核查 */}
                            </Row>
                            <BtnComponents
                              data={operaServiceBtnList}
                              val={selectOperaVal}
                              callback={val => {
                                setSelectOperaVal(val);
                              }}
                            />
                            <div className={styles.operaServiceSty} style={{ padding: '0 16px' }}>
                              {selectOperaVal == 1 && (
                                <Spin spinning={operaServiceLoading}>
                                  {supervisionVerificaList?.length ? (
                                    supervisionVerificaList.map(item => (
                                      <Row
                                        justify="space-between"
                                        style={{
                                          paddingBottom: paddingBottomVal,
                                          cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                          operaServiceClick(item.ID, item.Type);
                                        }}
                                      >
                                        <Col
                                          style={{ width: 'calc(100% - 146px)' }}
                                          className="textOverflow"
                                          title={item.EntNamePointName}
                                        >
                                          {item.EntNamePointName}
                                        </Col>
                                        <Col>{item.Time}</Col>
                                      </Row>
                                    ))
                                  ) : (
                                    <Empty style={{ marginTop: '30px' }} />
                                  )}
                                </Spin>
                              )}
                              {selectOperaVal == 2 && (
                                <Spin
                                  spinning={!!projectExecutionLoading || !!delInstallPhotosLoading}
                                >
                                  {projectExecutionList?.length ? (
                                    projectExecutionList.map((item, index) => (
                                      <Row
                                        justify="space-between"
                                        style={{
                                          paddingBottom: paddingBottomVal,
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <Col
                                          onClick={() => {
                                            if (item.Type == 2) {
                                              //遗留问题
                                              // setRemainProblemsVisible(true);
                                              setPopVisible(true);
                                              popForm.resetFields();
                                              setRemainProblemsData(item);
                                            } else if (item.Type == 4) {
                                              //安装照片审核
                                              const row = item.MsgID && JSON.parse(item.MsgID);
                                              if (item.Col1 == 2) {
                                                setInstallEquipmentVisible(true);
                                                setInstallEquipmentTitle(
                                                  `${row.EntName} - ${row.PointName}${
                                                    row.SystemModelName
                                                      ? ` - ${row.SystemModelName}`
                                                      : ''
                                                  } `,
                                                );
                                                //Col1代表systemModelId
                                                setInstallEquipmentData({
                                                  ...row,
                                                });
                                              } else if (item.Col1 == 3) {
                                                //安装照片 助理
                                                setViewPhotosVisible(true);
                                                setViewPhotosTitle(
                                                  `查看安装照片（${row.ProjectCode} - ${
                                                    row.EntName
                                                  } - ${row.PointName}${
                                                    row.SystemModelName
                                                      ? ` - ${row.SystemModelName}`
                                                      : ''
                                                  } ）`,
                                                );
                                                props.dispatch({
                                                  type: `installEquipment/GetAuditPhoto`,
                                                  payload: {
                                                    systemModelId: row.Col1,
                                                    dispatchId: row.DispatchId,
                                                    pointId: row.PointId,
                                                    equipmentAuditId: row.EquipmentAuditId,
                                                  },
                                                });
                                              }
                                            } else if (item.Type == 7) {
                                              //验收服务报告
                                              setReportAuditVisible(true);
                                              const dataObj = item.Col2
                                                ? JSON.parse(item.Col2)
                                                : {};
                                              setReportAuditData({
                                                ...dataObj,
                                              });
                                            }
                                          }}
                                          style={{
                                            width: 'calc(100% - 134px)',
                                          }}
                                          className="textOverflow"
                                          title={item.Msg}
                                        >
                                          {msgTypeTitle[item.Type]}
                                          {item.Msg}
                                        </Col>
                                        <Col>
                                          {item.CreateTime &&
                                            moment(item.CreateTime).format('YYYY-MM-DD HH:mm')}
                                        </Col>

                                        {item.Type == 4 && (item.Col1 == 1 || item.Col1 == 3) ? (
                                          <Col
                                            flex="14px"
                                            style={{ textAlign: 'right', cursor: 'pointer' }}
                                          >
                                            <Dropdown //item.Col1 == 3   助理
                                              placement="bottomLeft"
                                              trigger={['click']}
                                              visible={
                                                photoMenuVisible && index == photoMenuSelectIndex
                                              }
                                              onVisibleChange={flag => {
                                                setPhotoMenuVisible(flag);
                                                setPhotoMenuSelectIndex(index);
                                              }}
                                              overlay={
                                                <Menu
                                                  onClick={e => {
                                                    if (e.key === '1') {
                                                      const record =
                                                        item.MsgID && JSON.parse(item.MsgID);
                                                      // 导出
                                                      props.dispatch({
                                                        type: 'installEquipment/ExportAuditPhoto',
                                                        payload: {
                                                          projectCode: record?.ProjectCode,
                                                          dispatchId: record?.DispatchId,
                                                          systemModelId: record?.Col1,
                                                          pointId: record?.PointId,
                                                          equipmentAuditId:
                                                            record?.EquipmentAuditId,
                                                          entName: record?.EntName,
                                                          pointName: record?.PointName,
                                                        },
                                                        callback: () => {
                                                          setPhotoMenuVisible(false);
                                                        },
                                                      });
                                                    }
                                                  }}
                                                >
                                                  {item.Col1 == 3 && (
                                                    <Menu.Item key="1">
                                                      <Spin
                                                        size="small"
                                                        spinning={
                                                          !!props.photoExportAuditPhotoLoading
                                                        }
                                                      >
                                                        导出
                                                      </Spin>
                                                    </Menu.Item>
                                                  )}
                                                  <Menu.Item key="2">
                                                    <Popconfirm
                                                      placement="left"
                                                      title={'确定要删除这条安装照片信息吗？'}
                                                      onConfirm={() => {
                                                        delInstallPhotos(item);
                                                      }}
                                                      okText="是"
                                                      cancelText="否"
                                                    >
                                                      <a>删除</a>
                                                    </Popconfirm>
                                                  </Menu.Item>
                                                </Menu>
                                              }
                                            >
                                              <EllipsisOutlined />
                                            </Dropdown>
                                          </Col>
                                        ) : (
                                          <Col flex="14px" />
                                        )}
                                      </Row>
                                    ))
                                  ) : (
                                    <Empty style={{ marginTop: '30px' }} />
                                  )}
                                </Spin>
                              )}
                              {selectOperaVal == 3 && (
                                <Spin
                                  spinning={customeSatisfactLoading || delCustomSatisfactLoading}
                                >
                                  {customeSatisfactList?.length ? (
                                    customeSatisfactList.map((item, index) => (
                                      <Row
                                        justify="space-between"
                                        style={{
                                          paddingBottom: paddingBottomVal,
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <Col
                                          onClick={() => {
                                            if (item.Type == 6) {
                                              if (item.Col1 == 2) {
                                                //客户满意度 调查
                                                setCustomSatisfactVisible(true);
                                                setCustomSatisfactData({
                                                  id: item.MsgID,
                                                  msgid: item.ID,
                                                });
                                              } else if (item.Col1 == 3) {
                                                //客户满意度 处理
                                                setCustomSatisfactVisible2(true);
                                                setCustomSatisfactData2({
                                                  id: item.MsgID,
                                                  msgid: item.ID,
                                                });
                                              }
                                            } else if (item.Type === '3') {
                                              // 投诉处理
                                              debugger;
                                              setHandleComplaintsModalOpen(true);
                                              setHandleComplaintsData({
                                                ID: item.MsgID,
                                              });
                                            }
                                          }}
                                          style={{
                                            width:
                                              item.Col1 == 1
                                                ? 'calc(100% - 166px)'
                                                : 'calc(100% - 126px)',
                                          }}
                                          className="textOverflow"
                                          title={item.Msg}
                                        >
                                          {msgTypeTitle[item.Type]} {item.Msg}{' '}
                                        </Col>
                                        <Col></Col>
                                        <Col>
                                          {item.CreateTime &&
                                            moment(item.CreateTime).format('YYYY-MM-DD HH:mm')}
                                        </Col>
                                        {item.Col1 == 1 && (
                                          <Popconfirm
                                            placement="left"
                                            title={'确定要删除这条满意度调查信息吗？'}
                                            onConfirm={() => delCustomSatisfact(item)}
                                            okText="是"
                                            cancelText="否"
                                          >
                                            <a>删除</a>
                                          </Popconfirm>
                                        )}
                                      </Row>
                                    ))
                                  ) : (
                                    <Empty style={{ marginTop: '30px' }} />
                                  )}
                                </Spin>
                              )}
                              {selectOperaVal == 4 && (
                                <div className={styles.taskList}>
                                  <div className={styles.content} style={{ textAlign: 'center' }}>
                                    <Spin spinning={todoListLoading}>{renderTodoList()}</Spin>
                                    {/* <Spin spinning={true}>{renderTodoList()}</Spin> */}
                                  </div>
                                </div>
                              )}
                              {selectOperaVal == 5 && (
                                <ListComponents
                                  list={elseList}
                                  loading={elseLoading || !!addOrUpdProjectReportInfoLoading}
                                />
                              )}
                            </div>
                          </>
                        )}
                      </Card>
                    </Col>
                  )}
                </Row>
                {/* 我的提醒 */}
                {remind && (
                  <Row className={`${styles.myRemindSty}`}>
                    <Col flex="1" span={24} style={{ height: 380 }}>
                      <Card
                        style={{ height: '100%' }}
                        bodyStyle={{
                          padding: 0,
                          height: '100%',
                          paddingTop: 8,
                        }}
                      >
                        <div className={styles.title}>我的提醒</div>
                        <Row justify="space-between">
                          <BtnComponents
                            data={myRemindBtnList}
                            val={selectMyVal}
                            callback={val => {
                              setSelectMyVal(val);
                            }}
                          />
                          {selectMyVal == 10 && workAlarmPushList?.length > 0
                            ? btnSquareComponents(dataAlarmTypeList, dataAlarmVal, val => {
                                dataAlarmTypeChange(val);
                              })
                            : null}
                        </Row>
                        <div className={'myRemindContentSty'} style={{ padding: '0 24px 0 16px' }}>
                          {remindDataAlarm && (
                            <>
                              {selectMyVal == 10 && (
                                <Spin spinning={workAlarmPushLoading}>
                                  {' '}
                                  {/*数据报警 */}
                                  {workAlarmPushList?.length ? (
                                    workAlarmPushList.map(item => (
                                      <Row
                                        justify="space-between"
                                        style={{ paddingBottom: paddingBottomVal }}
                                      >
                                        <Col style={{ paddingTop: 4 }}>
                                          <img src="/work_alarm.png" />
                                        </Col>
                                        <Col style={{ width: 'calc(100% - 128px)' }}>
                                          <div>{item.message}</div>
                                          <div
                                            className="statusSty"
                                            style={{ color: '#666', fontSize: 13, paddingTop: 4 }}
                                          >
                                            <span>
                                              报警生成时间：
                                              {item.alarmCreateTime &&
                                                moment(item.alarmCreateTime).format(
                                                  'YYYY-MM-DD HH:mm',
                                                )}
                                            </span>
                                            {item.alarmType == 0 || item.alarmType == 12 ? (
                                              <>
                                                <Tag
                                                  color={item.status == 3 ? 'success' : 'warning'}
                                                >
                                                  {item.status == 3 ? '已响应' : '待响应'}
                                                </Tag>
                                                {item.status == 3 && (
                                                  <>
                                                    <span>响应人：{item.userName}</span>{' '}
                                                    <span>
                                                      响应时间：
                                                      {item.responseTime &&
                                                        moment(item.responseTime).format(
                                                          'YYYY-MM-DD HH:mm',
                                                        )}
                                                    </span>
                                                  </>
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                <Tag
                                                  color={item.status == 3 ? 'success' : 'warning'}
                                                >
                                                  {item.status == 3 ? '已响应' : '待响应'}
                                                </Tag>
                                                {item.status == 3 && (
                                                  <>
                                                    <span>核实人：{item.userName}</span>{' '}
                                                    <span>
                                                      核实时间：
                                                      {item.responseTime &&
                                                        moment(item.responseTime).format(
                                                          'YYYY-MM-DD HH:mm',
                                                        )}
                                                    </span>
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </Col>
                                        <Col>
                                          <Popconfirm
                                            placement="left"
                                            title={'确定要删除这条报警吗？'}
                                            onConfirm={() => delAlarm(item)}
                                            okText="是"
                                            cancelText="否"
                                          >
                                            <a>删除</a>
                                          </Popconfirm>
                                        </Col>
                                      </Row>
                                    ))
                                  ) : (
                                    <Empty style={{ marginTop: '30px' }} />
                                  )}
                                </Spin>
                              )}
                            </>
                          )}
                          {remindExpire && (
                            <>
                              {selectMyVal == 11 && (
                                <Spin
                                  spinning={
                                    contractLoading ||
                                    !!delContractLoading ||
                                    !!delAllContractLoading
                                  }
                                >
                                  {/*合同到期 */}
                                  {contractList?.length ? (
                                    contractList.map(item => (
                                      <Row
                                        justify="space-between"
                                        style={{
                                          paddingBottom: paddingBottomVal,
                                          transition: '0.5s all ease-in',
                                        }}
                                      >
                                        <Col style={{ paddingTop: 4 }}>
                                          <img src="/work_contract.png" />
                                        </Col>
                                        <Col style={{ width: 'calc(100% - 100px)' }}>
                                          <div>{item.Msg}</div>
                                          <div>如合同不再续签请参考以下注意事项：</div>
                                          <div>
                                            1、如涉及物联网卡销号请及时提交CIS申请《物联网卡新增或销号申请》
                                          </div>
                                          <div>
                                            2、办事处、备件库、车辆等如有变动请同服务管理部对应同事沟通
                                          </div>
                                          <div>
                                            3、如有人员跨行业调整请记得考取对应行业运营上岗证
                                          </div>
                                        </Col>
                                        <Col>
                                          <Popconfirm
                                            placement="left"
                                            title={'确定要删除这条合同到期吗？'}
                                            onConfirm={() => delContract(item)}
                                            okText="是"
                                            cancelText="否"
                                          >
                                            <a>删除</a>
                                          </Popconfirm>
                                        </Col>
                                      </Row>
                                    ))
                                  ) : (
                                    <Empty style={{ marginTop: '30px' }} />
                                  )}
                                </Spin>
                              )}
                            </>
                          )}

                          {standardgasAlarm && (
                            <>
                              {selectMyVal == 12 && (
                                <Spin
                                  spinning={
                                    standgaswaringLoading ||
                                    !!delStandgaswaringLoading ||
                                    !!delAllStandgaswaringLoading
                                  }
                                >
                                  {/*标气报警 */}
                                  {standgaswaringList?.length ? (
                                    standgaswaringList.map(item => {
                                      const dataArr = item.Col2?.split(',');
                                      return (
                                        <Row
                                          justify="space-between"
                                          style={{
                                            paddingBottom: paddingBottomVal,
                                            transition: '0.5s all ease-in',
                                          }}
                                        >
                                          <Col
                                            style={{ width: 'calc(100% - 186px)' }}
                                            className="textOverflow"
                                          >
                                            {item.Msg}
                                          </Col>
                                          <Col style={{ cursor: 'pointer' }}>
                                            <Space>
                                              <a
                                                onClick={() => {
                                                  setProjectQueryDetailVisible(true);
                                                  setProjectQueryDetailCode(dataArr?.[0]);
                                                  setProjectQueryDetailTitle(
                                                    `${
                                                      dataArr && dataArr[0]
                                                        ? `${dataArr[0]}-详情`
                                                        : '详情'
                                                    }`,
                                                  );
                                                }}
                                              >
                                                项目详情
                                              </a>
                                              <a
                                                onClick={() => {
                                                  setStandardGasValidityVisible(true);
                                                  setStandardGasValidityId(dataArr?.[1]);
                                                }}
                                              >
                                                标气详情
                                              </a>
                                              <Popconfirm
                                                placement="left"
                                                title={'确定要删除这条标气有效期报警吗？'}
                                                onConfirm={() => delStandgaswaring(item)}
                                                okText="是"
                                                cancelText="否"
                                              >
                                                <Tag style={{ marginRight: 0 }} color="#4090FF">
                                                  删除
                                                </Tag>
                                              </Popconfirm>
                                            </Space>
                                          </Col>
                                        </Row>
                                      );
                                    })
                                  ) : (
                                    <Empty style={{ marginTop: '30px' }} />
                                  )}
                                </Spin>
                              )}
                            </>
                          )}
                        </div>

                        {selectMyVal == 10 && (
                          <>
                            {workAlarmPushList?.length > 0 ? (
                              <Row justify="space-between" style={{ paddingTop: 12 }}>
                                <Popconfirm
                                  placement="topLeft"
                                  title={'确定要关闭全部报警吗？'}
                                  onConfirm={() => closeAllAlarmChange()}
                                  okText="是"
                                  cancelText="否"
                                >
                                  <div>
                                    {btnSquareComponents(
                                      [{ name: '关闭全部', value: 1 }],
                                      allClose,
                                      () => {},
                                    )}
                                  </div>
                                </Popconfirm>
                                <Pagination
                                  size="small"
                                  style={{ paddingRight: 12 }}
                                  showSizeChanger
                                  showQuickJumper
                                  total={workAlarmTotal}
                                  current={alarmPageIndex}
                                  pageSize={alarmPageSize}
                                  onChange={alarmPageChange}
                                />
                              </Row>
                            ) : null}
                          </>
                        )}
                        {selectMyVal == 11 && (
                          <>
                            {contractList?.length > 0 ? (
                              <Row justify="space-between" style={{ paddingTop: 8 }}>
                                <Popconfirm
                                  placement="topLeft"
                                  title={'确定要删除全部合同到期吗？'}
                                  onConfirm={() => delAll(11)}
                                  okText="是"
                                  cancelText="否"
                                >
                                  <div>
                                    {btnSquareComponents(
                                      [{ name: '删除全部', value: 1 }],
                                      allClose,
                                      () => {},
                                    )}
                                  </div>
                                </Popconfirm>
                                <Pagination
                                  size="small"
                                  style={{ paddingRight: 12 }}
                                  showSizeChanger
                                  showQuickJumper
                                  total={contractList.length}
                                  current={contractPageIndex}
                                  pageSize={contractPageSize}
                                  onChange={contractPageChange}
                                />
                              </Row>
                            ) : null}
                          </>
                        )}
                        {selectMyVal == 12 && standgaswaringList?.length > 0 && (
                          <DelAllBtnComponents title="标气有效期报警" type={12} />
                        )}
                      </Card>
                    </Col>
                  </Row>
                )}
              </div>
            </>
          )}
          <div className={styles.rightWrapper}>
            <div className={styles.quickNavWrapper}>
              <Card
                style={{ height: '100%' }}
                bodyStyle={{ padding: 0, height: '100%', paddingTop: 8 }}
              >
                <Row justify="space-between">
                  <div className={styles.title}>快捷导航</div>
                  {/* <img title='更多' style={{ height: '100%', paddingRight: 16, cursor: 'pointer' }} src="/more.png" onClick={() => { }} /> */}
                </Row>
                <div className={styles.menuSty} style={{ padding: '0 24px 16px 16px' }}>
                  {/* <Empty style={{ marginTop: '30px' }} /> */}
                  <Spin spinning={userMenuListLoading}>
                    <Row>
                      {menuList.map((item, index) => (
                        <Col
                          span={6}
                          style={{
                            paddingTop: index <= 3 ? 6 : 12,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <img src="/work_meun.png" style={{ paddingRight: 8 }} />
                          <span
                            title={item.name}
                            className="meunTitle textOverflow"
                            onClick={() => meunClick(item.path)}
                          >
                            {item.name}
                          </span>
                        </Col>
                      ))}
                      <Col
                        span={6}
                        style={{
                          paddingTop: menuList?.length <= 3 ? 6 : 12,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onClick={addMeun}
                        className="meunAddWrap"
                      >
                        <img
                          src="/work_meun_add.png"
                          style={{ paddingRight: 8, cursor: 'pointer' }}
                        />
                        <span className="meunAdd">添加</span>
                      </Col>
                    </Row>
                  </Spin>
                </div>
              </Card>
            </div>
            <div className={styles.infoWrapper}>
              <Card
                bodyStyle={{ padding: 0, height: '100%', paddingTop: 8 }}
                style={{ height: '100%' }}
              >
                <div className={styles.title}>我的消息</div>
                <div
                  className={styles.content}
                  style={{ height: 'calc(100% - 44px)', overflowY: 'auto' }}
                >
                  <Spin spinning={messageListLoading}>
                    {messageList.length ? (
                      <Timeline mode={'left'} className={styles.messageTimeLine}>
                        {renderMessageTimeLine()}
                      </Timeline>
                    ) : (
                      <Empty style={{ marginTop: '30px' }} />
                    )}
                  </Spin>
                </div>
              </Card>
            </div>
          </div>

          {/* <Row gutter={[16, 16]}></Row> */}
        </div>
        {/* 转发任务 */}
        <Modal
          title="转发任务单"
          visible={forwardingTaskVisible}
          onOk={() => onForwardingTask()}
          onCancel={() => setForwardingTaskVisible(false)}
        >
          <label style={{ fontSize: 14 }}>
            将任务单转发至：
            <Select
              style={{ marginLeft: 10, width: 200 }}
              placeholder="请选择转发人"
              onChange={value => {
                setForwardingUserId(value);
              }}
            >
              {managerList.map(item => {
                return (
                  <Option value={item.User_ID} key={item.User_ID}>
                    {item.User_Name}
                  </Option>
                );
              })}
            </Select>
          </label>
        </Modal>
        <FromsModal
          visible={formsModalVisible}
          onCancel={() => {
            setFormsModalVisible(false);
          }}
          taskInfo={currentTodoItem}
          type={type}
        />
        <Modal
          centered
          visible={superviseRectificaVisible}
          title={'监督核查'}
          footer={null}
          wrapClassName="spreadOverModal"
          mask={false}
          destroyOnClose
          onCancel={() => setSuperviseRectificaVisible(false)}
        >
          <SuperviseRectification
            hideBreadcrumb
            match={{ path: '/operations/superviseRectification' }}
          />
        </Modal>
        <Modal //监督核查详情
          visible={superviseRectificaDetailVisible}
          title={'监督核查-详情'}
          footer={null}
          wrapClassName="spreadOverModal"
          mask={false}
          className={superviseRectificaSty.fromModal}
          onCancel={() => {
            setSuperviseRectificaDetailVisible(false);
          }}
          onFinish={() => {
            GetStagingInspectorRectificationList();
          }}
          destroyOnClose
        >
          <SuperviseRectificationDetail ID={superviseRectificaDetailId} />
        </Modal>
        <Modal //添加快捷导航
          visible={menuVisible}
          title={'添加快捷导航'}
          // wrapClassName='spreadOverModal'
          width={700}
          className={styles.menuModal}
          onCancel={() => {
            setMenuVisible(false);
          }}
          destroyOnClose
          onOk={menuOK}
          confirmLoading={addUserMenuLoading}
        >
          <Spin spinning={userAllMenuListLoading}>
            <DirectoryTree
              showIcon={false}
              defaultExpandAll
              onSelect={onMeunSelect}
              treeData={allMenuList}
              height={clientHeight - 300}
            />
          </Spin>
        </Modal>
        {/* <Modal
          visible={remainProblemsVisible}
          title={'遗留问题'}
          footer={null}
          wrapClassName="spreadOverModal"
          onCancel={() => {
            setRemainProblemsVisible(false);
          }}
          destroyOnClose
          bodyStyle={{ padding: '8px 0 0 0' }}
        >
          <RemainProblems hideBreadcrumb match={{ path: '/operations/superviseRectification' }} />
        </Modal> */}
        <Modal //遗留问题  解决问题
          visible={popVisible}
          title={'解决问题'}
          onCancel={() => {
            setPopVisible(false);
          }}
          destroyOnClose
          confirmLoading={updateprojectExecutionLoading}
          onOk={() => solveProblem(remainProblemsData)}
        >
          <Form name="basicPop" form={popForm} labelCol={{ flex: '80px' }}>
            <Form.Item
              label="解决人"
              name="solveUserName"
              rules={[{ required: true, message: '请输入解决人！' }]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              label="解决时间"
              name="problemTime"
              rules={[
                {
                  required: true,
                  message: '请选择解决时间！',
                },
              ]}
            >
              <DatePicker
                disabledDate={current => current && current > moment()}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Form>
        </Modal>
        <InstallEquipmentExamineModal
          visible={installEquipmentVisible}
          title={installEquipmentTitle}
          onCancel={() => {
            setInstallEquipmentVisible(false);
          }}
          data={installEquipmentData}
          onFinish={() => {
            getCtWorkbenchMsg(2);
          }}
        />
        <Modal
          visible={viewPhotosVisible}
          title={viewPhotosTitle}
          onCancel={() => {
            setViewPhotosVisible(false);
          }}
          footer={null}
          destroyOnClose
          wrapClassName={`spreadOverModal ${styles.modalSty}`}
          mask={false}
        >
          <InstallEquipmentViewPhotos />

          <InstallEquipmentHandlingSugges type={1} />
        </Modal>

        <CustomerSatisfaInvestigateModal
          visible={customSatisfactVisible}
          onCancel={() => {
            setCustomSatisfactVisible(false);
          }}
          parData={customSatisfactData}
          completeFinish={() => {
            getCtWorkbenchMsg(3);
          }}
        />
        <CustomerSatisfacHandleModal
          visible={customSatisfactVisible2}
          onCancel={() => {
            setCustomSatisfactVisible2(false);
          }}
          parData={customSatisfactData2}
          completeFinish={() => {
            getCtWorkbenchMsg(3);
          }}
        />

        <ReportAuditModal
          id={reportAuditData?.DispatchId}
          CheckStatus={reportAuditData?.CheckStatus}
          WorkJLID={reportAuditData?.WorkJLID}
          AssistantID={reportAuditData?.AssistantID}
          isModalOpen={reportAuditVisible}
          onCancel={() => {
            setReportAuditVisible(false);
          }}
          reloadPageData={() => {
            getCtWorkbenchMsg(2);
          }}
        />

        {/* 投诉处理 */}
        {handleComplaintsModalOpen && (
          <HandleComplaints
            id={handleComplaintsData.ID}
            isModalOpen={handleComplaintsModalOpen}
            onCancel={() => {
              setHandleComplaintsModalOpen(false);
            }}
            reloadPageData={() => {
              getCtWorkbenchMsg(3);
            }}
          />
        )}

        <Modal //标气有效期预警  项目详情
          visible={projectQueryDetailVisible}
          title={projectQueryDetailTitle}
          onCancel={() => {
            setProjectQueryDetailVisible(false);
          }}
          footer={null}
          destroyOnClose
          wrapClassName="spreadOverModal"
          mask={false}
        >
          <ProjectQueryDetail code={projectQueryDetailCode} />
        </Modal>
        <Modal //标气有效期预警  标气详情
          visible={standardGasValidityVisible}
          title={'标气到期清单'}
          onCancel={() => {
            setStandardGasValidityVisible(false);
          }}
          footer={null}
          destroyOnClose
          wrapClassName="spreadOverModal"
          mask={false}
          bodyStyle={{ padding: 0 }}
        >
          <StandardGasValidityContent id={standardGasValidityId} isAll isWorkBench />
        </Modal>
        <HandoverReportEditModal
          record={projectReportList}
          visible={handoverReportVisible}
          title={
            projectReportList?.ProjectCode
              ? `${projectReportList.ProjectCode} - ${projectReportList?.ProjectName}`
              : ''
          }
          onCancel={() => setHandoverReportVisible(false)}
          onFinish={() => {
            getCtWorkbenchMsg(5);
          }}
        />
        <RemoteSupervisionEditModal
          title={'编辑'}
          visible={remoteSupervisionModalVisible}
          id={superviseRectificaDetailId}
          roleType={1}
          onCancel={() => {
            setRemoteSupervisionModalVisible(false);
          }}
          onFinish={() => GetStagingInspectorRectificationList()}
        />
        <RectificaDetailModal
          visible={rectificaDetailModalVisible}
          id={superviseRectificaDetailId}
          rectificaDetailType={1}
          title="核查整改"
          onCancel={() => {
            setRectificaDetailModalVisible(false);
          }}
          onFinish={() => GetStagingInspectorRectificationList()}
        />
      </BreadcrumbWrapper>
    </div>
  );
};

export default connect(dvaPropsData)(Workbench);
