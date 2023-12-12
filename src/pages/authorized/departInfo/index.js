/*
 * @Author: lzp
 * @Date: 2019-07-16 09:42:48
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 10:55:12
 * @Description: 部门管理
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

import {
  BellOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  UsergroupAddOutlined,
  UndoOutlined,
  ConsoleSqlOutlined,
  AuditOutlined,
  ContactsOutlined,
} from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import {
  Input,
  Button,
  Card,
  Spin,
  Row,
  Col,
  Table,
  Modal,
  Checkbox,
  TreeSelect,
  message,
  Divider,
  Popconfirm,
  Empty,
  Transfer,
  Switch,
  Tag,
  Tree,
  Radio,
  Tooltip,
  Popover,
  Select,
} from 'antd';
import MonitorContent from '@/components/MonitorContent';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import TextArea from 'antd/lib/input/TextArea';
import difference from 'lodash/difference';
import SelectPollutantType from '@/components/SelectPollutantType';
// import AlarmPushRel from '@/components/AlarmPushRel';
import NewAlarmPushRel from '@/pages/authorized/departInfo/NewAlarmPushRel'
import styles from './index.less';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import SdlTable from '@/components/SdlTable';
import SupervisionConfigModal from './SupervisionConfigModal';
import TreeTransfer from '@/components/TreeTransfer'
const { TreeNode } = Tree;
const { SHOW_PARENT } = TreeSelect;
import TreeTransferSingle from '@/components/TreeTransferSingle'
import { copyObjectArrayTreeAndRenameProperty, permissionButton, deepCloneTree, } from '@/utils/utils';

let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    // dragingIndex = props.index;
    dragingIndex = props['data-row-key'];
    return {
      // index: props.index,
      'data-row-key': props['data-row-key'],
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    // const dragIndex = monitor.getItem().index;
    // const hoverIndex = props.index;
    const dragIndex = monitor.getItem()['data-row-key'];
    const hoverIndex = props['data-row-key'];
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // monitor.getItem().index = hoverIndex;
    monitor.getItem()['data-row-key'] = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, pagination, ...restProps }) => (
  <Transfer {...restProps} showSelectAll={false}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? 'none' : null, paddingBottom: 10 }}
          scroll={{ y: 'calc(100vh - 430px)' }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
          pagination={{ ...pagination }}
        />
      );
    }}
  </Transfer>
);

// const mockTags = ['cat', 'dog', 'bird'];

// const mockData = [];
// for (let i = 0; i < 20; i++) {
//     mockData.push({
//         key: i.toString(),
//         title: `content${i + 1}`,
//         description: `description of content${i + 1}`,
//         disabled: i % 4 === 0,
//         tag: mockTags[i % 3],
//     });
// }

// const originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

const leftTableColumns = [
  {
    dataIndex: 'User_Account',
    title: '账号',
    ellipsis: true,
  },
  {
    dataIndex: 'User_Name',
    title: '名称',
    ellipsis: true,
  },
  {
    dataIndex: 'Phone',
    title: '手机',
    ellipsis: true,
  },
];
const rightTableColumns = [
  {
    dataIndex: 'User_Account',
    title: '账号',
    ellipsis: true,
  },
  {
    dataIndex: 'User_Name',
    title: '名称',
    ellipsis: true,
  },
  {
    dataIndex: 'Phone',
    title: '手机',
    ellipsis: true,
  },
];
@connect(({ departinfo, autoForm, loading, global, common }) => ({
  // GetRegionInfoByTree: loading.effects['departinfo/getregioninfobytree'],
  GetRegionInfoByTree: loading.effects['autoForm/getregioninfobytree'],
  GetRegionByDepID: loading.effects['departinfo/getregionbydepid'],
  GetUserByDepID: loading.effects['departinfo/getuserbydepid'],
  GetAllUser: loading.effects['departinfo/getalluser'],
  GetDepartInfoByTree: loading.effects['departinfo/getdepartinfobytree'],
  DepartInfoOneLoading: loading.effects['departinfo/getdepartinfobyid'],
  CheckPointLoading: loading.effects['departinfo/getpointbydepid'],
  getentandpointLoading: loading.effects['departinfo/getentandpoint'],
  updateOperationAreaLoading: loading.effects['departinfo/updateOperationArea'],
  dataLoading: loading.effects['departinfo/insertpointfilterbydepid'] || false,
  DepartInfoTree: departinfo.DepartInfoTree,
  DepartInfoOne: departinfo.DepartInfoOne,
  DepartTree: departinfo.DepartTree,
  AllUser: departinfo.AllUser,
  UserByDepID: departinfo.UserByDepID,
  RegionByDepID: departinfo.RegionByDepID,
  // RegionInfoTree: departinfo.RegionInfoTree,
  RegionInfoTree: autoForm.regionList,
  EntAndPoint: departinfo.EntAndPoint,
  CheckPoint: departinfo.CheckPoint,
  configInfo: global.configInfo,
  pollutantType: common.defaultPollutantCode,
  showGroupRegionFilter: departinfo.showGroupRegionFilter,
  btnloading: loading.effects['departinfo/insertdepartinfo'],
  btnloading1: loading.effects['departinfo/upddepartinfo'],
  insertregionbyuserLoading: loading.effects['departinfo/insertregionbyuser'],
  userDepApproveInfoList: departinfo.userDepApproveInfoList,
  getUserDepApproveInfoLoading: loading.effects['departinfo/getUserDepApproveInfo'],
  addOrUpdateUserDepApproveLoading: loading.effects['departinfo/addOrUpdateUserDepApprove'],
  userList: departinfo.userList,
  deleteUserDepApproveLoading: loading.effects['departinfo/deleteUserDepApprove'],
  insertdepartbyuserLoading: loading.effects['departinfo/insertdepartbyuser'] || false,
  clientHeight: global.clientHeight,
  testRegionByDepIDLoading: loading.effects['departinfo/getTestRegionByDepID'],
  insertTestRegionByUserLoading: loading.effects['departinfo/insertTestRegionByUser'],
  setOperationGroupId: departinfo.setOperationGroupId,
  addSetOperationGroupLoading: loading.effects['departinfo/addSetOperationGroup'] || false,
  getSetOperationGroupLoading: loading.effects['departinfo/getSetOperationGroup'] || false,
  groupSortLoading: loading.effects['departinfo/groupSort'] || false,


}))
@Form.create()
class DepartIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newEntAndPoint: [],
      visibleAlarm: false,
      visible: false,
      visibleUser: false,
      value: undefined,
      IsEdit: false,
      FormDatas: [],
      Tittle: '添加部门',
      selectedRowKeys: [],
      autoExpandParent: true,
      expandedKeys: [],
      expandedKey: [],
      targetKeys: [],
      allKeys: [],
      checkedKeys: [],
      checkedKey: [],
      checkedKeysSel: [],
      checkedKeySel: [],
      selectedKeys: [],
      selectedKey: [],
      disabled: false,
      showSearch: true,
      visibleRegion: false,
      leafTreeDatas: [],
      visibleData: false,
      pollutantType: 2,
      DataTreeValue: [],
      dataSelectedKeys: [],
      rolesID: '',
      alarmPushData: '',
      postCheckedKeys: '',
      updateOperationVal: '1',
      selectedTestRowKeys: '',
      testVisibleRegion: false,
      testCheckedKey: [],
      columns: [
        {
          title: '部门名称',
          dataIndex: 'UserGroup_Name',
          key: 'UserGroup_Name',
          width: 'auto',
        },
        {
          title: '部门描述',
          dataIndex: 'UserGroup_Remark',
          key: 'UserGroup_Remark',
          width: 'auto',
        },
        {
          title: '创建人',
          dataIndex: 'CreateUserName',
          width: 'auto',
          key: 'CreateUserName',
        },
        {
          title: '创建时间',
          dataIndex: 'CreateDate',
          width: 'auto',
          key: 'CreateDate',
        },
        {
          title: '操作',
          dataIndex: '',
          key: 'x',
          align: 'left',
          width: '280px',
          render: (text, record, index) => (
            <span>
              <Tooltip title="编辑">
                <a
                  onClick={() => {
                    this.props.dispatch({
                      type: 'departinfo/getdepartinfobyid',
                      payload: {
                        UserGroup_ID: record.UserGroup_ID,
                      },
                    });
                    this.showModalEdit();
                  }}
                >
                  <EditOutlined style={{ fontSize: 16 }} />
                </a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  title="确认要删除吗?"
                  onConfirm={() => {
                    this.props.dispatch({
                      type: 'departinfo/deldepartinfo',
                      payload: {
                        UserGroup_ID: record.UserGroup_ID,
                        callback: res => {
                          if (res.IsSuccess) {
                            message.success('删除成功');
                            this.props.dispatch({
                              type: 'departinfo/getdepartinfobytree',
                              payload: {},
                              callback: res => {
                                let data = this.handleData(res, 0);
                                this.setState({
                                  departInfoTree: data,
                                });
                              },
                            });
                          } else {
                            message.error(res.Message);
                          }
                        },
                      },
                    });
                  }}
                  onCancel={this.cancel}
                  okText="是"
                  cancelText="否"
                >
                  <a>
                    <DeleteOutlined style={{ fontSize: 16 }} />
                  </a>
                </Popconfirm>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="分配用户">
                <a
                  onClick={() => {
                    this.setState(
                      {
                        selectedRowKeys: record,
                      },
                      () => {
                        this.showUserModal();
                      },
                    );
                  }}
                >
                  <UsergroupAddOutlined style={{ fontSize: 16 }} />
                </a>
              </Tooltip>
              <Divider type="vertical" />
              {// 控制显示隐藏区域过滤
                this.props.showGroupRegionFilter && (
                  <>
                    <Tooltip title="运维区域过滤">
                      <a
                        onClick={() => {
                          this.setState(
                            {
                              selectedRowKeys: record,
                            },
                            () => {
                              this.showRegionModal();
                            },
                          );
                        }}
                      >
                        <FilterOutlined style={{ fontSize: 16 }} />
                      </a>
                    </Tooltip>
                  </>
                )}

              {this.props.configInfo && !this.props.configInfo.IsShowProjectRegion && this.state.testRegionPermis && <>
                <Divider type="vertical" />
                <Tooltip title="成套区域过滤">
                  <a
                    onClick={() => {
                      this.setState(
                        {
                          selectedTestRowKeys: record,
                        },
                        () => {
                          this.showTestRegionModal();
                        },
                      );
                    }}
                  >
                    <FilterOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip></>}
              {this.props.configInfo && this.props.configInfo.IsShowProjectRegion && <><Divider type="vertical" /><Tooltip title="设置点位访问权限">
                <a
                  onClick={() => {
                    this.setState(
                      {
                        selectedRowKeys: record,
                      },
                      () => {
                        this.showDataModal();
                      },
                    );
                  }}
                >
                  <DatabaseOutlined style={{ fontSize: 16 }} />
                </a>
              </Tooltip></>}
              <Divider type="vertical" />
              <Tooltip title="报警关联">
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.setState(
                      {
                        selectedRowKeys: record,
                      },
                      () => {
                        this.showAlarmModal(record);
                      },
                    );
                  }}
                >
                  <BellOutlined style={{ fontSize: 16 }} />
                </a>
              </Tooltip>
              {this.props.configInfo && !this.props.configInfo.IsShowProjectRegion && <> <Divider type="vertical" />
                <Tooltip title="更新运维区域">
                  <Popover
                    trigger="click"
                    visible={
                      this.state.operatioVisible &&
                      record.UserGroup_ID === this.state.updateOperationGroupId
                    }
                    content={this.updateOperation}
                    title="更新运维区域"
                  >
                    <a
                      onClick={() => {
                        this.setState({
                          updateOperationGroupId: record.UserGroup_ID,
                          operatioVisible: true,
                          updateOperationVal: record.leve,
                        });
                      }}
                    >
                      <UndoOutlined style={{ fontSize: 16 }} />
                    </a>
                  </Popover>
                </Tooltip></>}



              {/* {record.leve === '1' && (
                <>
                  <Divider type="vertical" />
                  <Tooltip title="省区/大区日常监管配置">
                    <a
                      onClick={() => {
                        this.setState({
                          superVisionConfigVisible: true,
                          UserGroup_ID: record.UserGroup_ID,
                          UserGroup_Name: record.UserGroup_Name,
                        });
                      }}
                    >
                      <ContactsOutlined style={{ fontSize: 16 }} />
                    </a>
                  </Tooltip>
                </>
              )}  */}
              {/* <Divider type="vertical" />
              <Tooltip title="设置审批流程">
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                     this.approvalProcessClick(record)
                  }}
                >
                  <AuditOutlined  style={{ fontSize: 16 }} />
                </a>
              </Tooltip> */}
            </span>
          ),
        },
      ],
      departInfoTree: [],
      sortTitle: '开启排序',
      approvalProcessVisible: false, //审核流程
      approvalProcessEditorAddVisible: false,
      approvalUserID: undefined,
      approvalNode: undefined,
      depID: undefined,
      settingOperationGroupVisible: false,
      settingOperationGrouptitle: '设置运维小组',
      settingOperationGroupPermis: false,
      testRegionPermis: false,
    };
    this.depApproveColumns = [
      {
        title: '序号',
        align: 'center',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '审核人',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '审核节点',
        dataIndex: 'nodeName',
        key: 'nodeName',
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        align: 'center',
        render: (text, record, index) => (
          <span>
            <Tooltip title="编辑">
              <a
                onClick={() => {
                  this.setState({
                    approvalProcessEdit: false,
                    approvalProcessEditorAddVisible: true,
                    UserID: record.userID,
                    Node: record.node,
                    approvalProcessEditId: record.id,
                  });
                }}
              >
                <EditOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="删除">
              <Popconfirm
                title="确认要删除吗?"
                onConfirm={() => {
                  this.props.dispatch({
                    type: 'departinfo/deleteUserDepApprove',
                    payload: {
                      id: record.id,
                    },
                  });
                  this.props.dispatch({
                    type: 'departinfo/getUserDepApproveInfo',
                    payload: {
                      depID: record.depID,
                    },
                  });
                }}
                okText="是"
                cancelText="否"
              >
                <a>
                  <DeleteOutlined style={{ fontSize: 16 }} />
                </a>
              </Popconfirm>
            </Tooltip>
          </span>
        ),
      },
    ];
  }
  //获取角色列表
  getUserList = params => {
    this.props.dispatch({
      type: 'departinfo/getUserList',
      payload: params ? params : { roleListID: '', groupListID: '', userName: '', userAccount: '' },
    });
  };
  approvalProcessClick = row => {
    //审核流程
    this.setState({
      approvalProcessVisible: true,
      depID: row.key,
    });
    this.props.dispatch({
      type: 'departinfo/getUserDepApproveInfo',
      payload: {
        depID: row.key,
      },
    });
  };
  updateOperation = () => {
    return (
      <Form>
        <Row>
          <Select
            placeholder="更新类型"
            onChange={this.updateChange}
            value={this.state.updateOperationVal}
            style={{ width: '100%' }}
            allowClear
          >
            <Option value="1">一级</Option>
            <Option value="2">二级</Option>
            <Option value="3">其他</Option>
          </Select>
        </Row>
        <Row style={{ paddingTop: 10 }} justify="end">
          <Button
            type="primary"
            loading={this.props.updateOperationAreaLoading}
            onClick={this.updateOperationSubmit}
          >
            确定
          </Button>
          <Button
            style={{ marginLeft: 5 }}
            onClick={() => {
              this.setState({ operatioVisible: false, updateOperationGroupId: '' });
            }}
          >
            取消
          </Button>
        </Row>
      </Form>
    );
  };

  updateChange = value => {
    this.setState({
      updateOperationVal: value,
    });
  };
  handleUpdateOperationData = (data, id, i) => {
    if (data && data.length > 0) {
      i++;

      return data.map(item => {
        return {
          ...item,
          leve: item.UserGroup_ID === id ? this.state.updateOperationVal : item.leve,
          children:
            item.children.length > 0 ? this.handleUpdateOperationData(item.children, id, i) : [],
        };
      });
    }
  };
  updateOperationSubmit = () => {
    this.props.dispatch({
      type: 'departinfo/updateOperationArea',
      payload: {
        LevelType: this.state.updateOperationVal,
        GroupId: this.state.updateOperationGroupId,
      },
      callback: () => {
        this.setState({ operatioVisible: false }, () => {
          const data = this.handleUpdateOperationData(
            this.state.departInfoTree,
            this.state.updateOperationGroupId,
            0,
          );
          console.log(data);
          this.setState({
            departInfoTree: data,
          });
        });
      },
    });
  };
  onChanges = nextTargetKeys => {
    // if (nextTargetKeys.length == 0) {
    //     message.error("请至少保留一个角色")
    //     return
    // }
    console.log('nextTargetKeys.length=', nextTargetKeys.length);
    console.log('this.props.AllUser.length=', this.props.AllUser.length);
    this.props.dispatch({
      type: 'departinfo/insertdepartbyuser',
      payload: {
        User_ID: nextTargetKeys,
        UserGroup_ID: this.state.selectedRowKeys.key,
      },
      callback: isSuccess => {
        if (!isSuccess) {
          //不成功
          this.showUserModal();
        }
      },
    });
    this.setState({ targetKeys: nextTargetKeys });
  };

  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onExpands = expandedKey => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKey,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKey, info) => {
    // console.log(checkedKey)
    // console.log(info)
    this.setState({ checkedKey });
    let checkedKeys = [...checkedKey, ...info.halfCheckedKeys];
    this.setState({ postCheckedKeys: checkedKeys });
  };
  /*** 设置点位访问权限 **/
  showDataModal = () => {
    // console.log('this.state.pollutantType=', this.state.pollutantType);
    if (this.state.selectedRowKeys.length == 0) {
      message.error('请选中一行');
      return;
    }
    const keys = this.state.selectedRowKeys.key;
    this.props.dispatch({
      type: 'departinfo/getregioninfobytree',
      payload: {},
    });
    this.setState({
      visibleData: true,
      pollutantType: 2,
      DataTreeValue: [],
      checkedKeys: this.props.RegionByDepID,
      entPointName: '',
    });
    this.props.dispatch({
      type: 'departinfo/getentandpoint',
      payload: {
        PollutantType: 2,
        RegionCode: '',
      },
    });
    this.props.dispatch({
      type: 'departinfo/getpointbydepid',
      payload: {
        UserGroup_ID: keys.toString(),
        PollutantType: 2,
        RegionCode: [],
      },
    });

    // console.log('pollutantType=', this.state.pollutantType);
  };
  onChecks = checkedKeys => {
    console.log(this.state.leafTreeDatas);
    // console.log('this.state.leafTreeDatas=', this.state.leafTreeDatas);
    checkedKeys.map((item, index) => {
      if (this.state.leafTreeDatas.indexOf(item) != -1) {
        checkedKeys.splice(index, 1);
      }
    });
    // console.log(checkedKeys)

    this.setState({ checkedKeys });

    // this.setState({ checkedKeySel: checkedKeys });
  };
  // onSelectData = (selectedKey, info) => { //选择监测点
  //   console.log(selectedKey)
  //   this.setState({ dataSelectedKeys:selectedKey });
  // };
  handleSizeChange = e => {
    //切换污染物
    const keys = this.state.selectedRowKeys.key;
    this.setState({ pollutantType: e.target.value });
    this.props.dispatch({
      type: 'departinfo/getpointbydepid',
      payload: {
        UserGroup_ID: keys.toString(),
        PollutantType: e.target.value,
        RegionCode: this.state.DataTreeValue && this.state.DataTreeValue.toString(),
      },
    });
    this.props.dispatch({
      type: 'departinfo/getentandpoint',
      payload: {
        RegionCode: this.state.DataTreeValue && this.state.DataTreeValue.toString(),
        PollutantType: e.target.value,
      },
    });
  };

  onChangeTree = value => {
    //切换行政区
    console.log('onChange================= ', value);
    const keys = this.state.selectedRowKeys.key;
    if (value == undefined) {
      this.setState({
        DataTreeValue: [],
      });
      this.props.dispatch({
        type: 'departinfo/getentandpoint',
        payload: {
          RegionCode: '',
          PollutantType: this.state.pollutantType,
        },
      });
      this.props.dispatch({
        type: 'departinfo/getpointbydepid',
        payload: {
          UserGroup_ID: keys.toString(),
          PollutantType: this.state.pollutantType,
          RegionCode: [],
        },
      });
    } else {
      this.setState({
        DataTreeValue: value,
      });
      this.props.dispatch({
        type: 'departinfo/getentandpoint',
        payload: {
          RegionCode: value.toString(),
          PollutantType: this.state.pollutantType,
        },
      });
      this.props.dispatch({
        type: 'departinfo/getpointbydepid',
        payload: {
          UserGroup_ID: keys.toString(),
          PollutantType: this.state.pollutantType,
          RegionCode: this.state.DataTreeValue.toString(),
        },
      });
    }
  };
  pointAccessClick = () => {
    const dataTreeValue = this.state.DataTreeValue
    const { pollutantType } = this.state;
    this.props.dispatch({
      type: 'newuserinfo/getentandpoint',
      payload: {
        RegionCode: dataTreeValue && dataTreeValue.toString(),
        PollutantType: pollutantType,
        Name: this.state.entPointName,
      },
    });
    const keys = this.state.selectedRowKeys.key;
    this.props.dispatch({
      type: 'newuserinfo/getpointbydepid',
      payload: {
        UserGroup_ID: keys && keys.toString(),
        PollutantType: pollutantType,
        RegionCode: dataTreeValue && dataTreeValue.toString(),
      },
    });
  }
  handleDataOK = (state, callback) => {
    //提交
    // console.log('regioncode=', this.state.DataTreeValue.toString());
    // console.log('DGIMN=', this.state.checkedKeys);
    // console.log('selectedRowKeys=', this.state.selectedRowKeys.key);
    this.props.dispatch({
      type: 'departinfo/insertpointfilterbydepid',
      payload: {
        Type: this.state.pollutantType,
        DGIMN: this.state.checkedKeys,
        UserGroup_ID: this.state.selectedRowKeys.key,
        RegionCode: this.state.DataTreeValue.toString(),
        state: state,
        callback: res => {
          if (res.IsSuccess) {
            message.success('成功');
            callback()
            // this.handleCancel();
          } else {
            message.error(res.Message);
          }
        },
      },
    });
  };
  /*** **/

  onSelect = (record, selected, selectedRows) => {
    console.log('record=', record.key);
  };

  onSelectRegion = (selectedKey, info) => {
    this.setState({ selectedKey });
  };

  // rowSelection =()=> {

  //     onSelect: (record, selected, selectedRows) => {

  //     },
  //     onSelectAll: (selected, selectedRows, changeRows) => {
  //         console.log(selected, selectedRows, changeRows);
  //     },
  // };

  componentDidMount() {
    const buttonList = permissionButton(this.props.match.path)
    buttonList.map(item => {
      switch (item) {
        case 'testRegion': this.setState({ testRegionPermis: true }); break;
        case 'SetOperationGroup': this.setState({ settingOperationGroupPermis: true }); break;
      }
    })
    this.props.dispatch({
      type: 'departinfo/getdepartinfobytree',
      payload: {},
      callback: res => {
        let data = this.handleData(res, 0);
        this.setState({
          departInfoTree: data,
        });
      },
    });
    this.props.dispatch({
      type: 'departinfo/getGroupRegionFilter',
      payload: {},
    });
    this.getUserList({});
    // this.props.dispatch({
    //     type: 'roleinfo/getrolestreeandobj',
    //     payload: {}
    // })

    // this.props.dispatch({
    //     type: 'roleinfo/getdepbyuserid',
    //     payload: {
    //         User_ID: this.props.match.params.userid,
    //     }
    // })
  }
  handleData = (data, i) => {
    if (data && data.length > 0) {
      i++;
      return data.map(item => {
        return {
          ...item,
          flag: i,
          children: item?.children?.length > 0 ? this.handleData(item.children, i) : [],
        };
      });
    }
  };
  showModal = () => {
    this.props.dispatch({
      type: 'departinfo/getdeparttreeandobj',
      payload: {
        Type: '1',
      },
    });
    this.setState({
      visible: true,
      IsEdit: false,
      Tittle: '添加部门',
    });
  };

  showUserModal = () => {
    if (this.state.selectedRowKeys.length == 0) {
      message.error('请选中一行');
      return;
    }
    const keys = this.state.selectedRowKeys.key;
    this.props.dispatch({
      type: 'departinfo/getalluser',
      payload: {},
    });
    console.log('111=', keys);

    this.props.dispatch({
      type: 'departinfo/getuserbydepid',
      payload: {
        UserGroup_ID: keys.toString(),
      },
    });
    // console.log("selectID=",this.props.UserByRoleID)
    // console.log("filterArr=",this.props.AllUser)
    const selectId = this.props.UserByDepID.map(item => item.key);

    const filterArr = this.props.AllUser.filter(item => selectId.indexOf(item.key));
    console.log('filterArr=', filterArr);
    this.setState({
      visibleUser: true,
      targetKeys: selectId,
      allKeys: filterArr,
    });
  };

  showRegionModal = () => {
    if (this.state.selectedRowKeys.length == 0) {
      message.error('请选中一行');
      return;
    }
    this.setState({
      visibleRegion: true,
    });
    const keys = this.state.selectedRowKeys.key;
    // this.props.dispatch({
    //   type: 'departinfo/getregioninfobytree',
    //   payload: {},
    // });
    this.props.dispatch({
      type: 'departinfo/getregionbydepid',
      payload: {
        UserGroup_ID: keys && keys.toString(),
      },
      callback: res => {
        this.setState({ checkedKey: res.userFlagList, postCheckedKeys: res.userList });
      },
    });
    // this.setState({
    //   visibleRegion: true,
    //   checkedKey: this.props.RegionByDepID,
    // });
  };
  renderTestTreeNodes = data =>
    data.map(item => {
      return <TreeNode title={item.label} key={item.value} dataRef={item}></TreeNode>;
    });
  showTestRegionModal = () => {
    if (this.state.selectedTestRowKeys?.length == 0) {
      message.error('请选中一行');
      return;
    }
    this.setState({
      testVisibleRegion: true,
    }, () => {
      const keys = this.state.selectedTestRowKeys.key;
      this.props.dispatch({
        type: 'departinfo/getTestRegionByDepID',
        payload: {
          UserGroup_ID: keys && keys.toString(),
        },
        callback: res => {
          this.setState({ testCheckedKey: res, });
        },
      });
    });

  }

  onTestCheck = (checkedKey, info) => {
    this.setState({ testCheckedKey: checkedKey });
  };

  handleTestRegionOK = (e) => {
    this.props.dispatch({
      type: 'departinfo/insertTestRegionByUser',
      payload: {
        RegionCode: this.state.testCheckedKey,
        UserGroup_ID: this.state.selectedTestRowKeys?.key,
      },
      callback: res => {
        this.setState({ testVisibleRegion: false })
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.UserByDepID !== nextProps.UserByDepID) {
      const selectId = nextProps.UserByDepID.map(item => item.key);
      console.log('selectId=', selectId);
      const filterArr = nextProps.AllUser.filter(item => selectId.indexOf(item.key));
      console.log('filterArr=', filterArr);
      this.setState({
        visibleUser: true,
        targetKeys: selectId,
        // allKeys: filterArr
      });
    }
    // if (this.props.RegionByDepID !== nextProps.RegionByDepID) { //用回调  这个用不上了
    //   this.setState({
    //     visibleRegion: true,
    //     checkedKey: nextProps.RegionByDepID,
    //   });
    // }
    if (this.props.CheckPoint !== nextProps.CheckPoint) {
      this.setState({
        visibleData: true,
        checkedKeys: nextProps.CheckPoint,
        // allKeys: filterArr
      });
    }

    if (this.props.EntAndPoint !== nextProps.EntAndPoint) {
      this.setState({
        newEntAndPoint: [
          // {
          //   title: '全部',
          //   key: '0-0',
          //   children: nextProps.EntAndPoint,
          // },
          ...nextProps.EntAndPoint,
        ],
      });
    }
    // if (this.props.configInfo !== nextProps.configInfo) {
    //     var list = nextProps.configInfo.SystemPollutantType ? nextProps.configInfo.SystemPollutantType.split(',') : []
    //     var type = list.length > 0 ? list[0] : "";
    //     this.setState({
    //         pollutantType: type,
    //     })
    //     // this.props.dispatch({
    //     //   type: 'navigationtree/getentandpoint',
    //     //   payload: {
    //     //     Status: this.state.screenList,
    //     //     PollutantType: nextProps.configInfo.SystemPollutantType,
    //     //   }
    //     // })
    // }
  }

  showModalEdit = () => {
    this.props.dispatch({
      type: 'departinfo/getdeparttreeandobj',
      payload: {},
    });
    this.setState({
      visible: true,
      IsEdit: true,
      Tittle: '编辑部门',
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  onChange = value => {
    this.setState({ value });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      IsEdit: false,
      visibleUser: false,
      visibleRegion: false,
      visibleData: false,
    });
  };

  handleRegionOK = e => {
    console.log('regioncode=', this.state.checkedKey);
    console.log('selectedRowKeys=', this.state.selectedRowKeys.key);
    this.props.dispatch({
      type: 'departinfo/insertregionbyuser',
      payload: {
        RegionFlagCode: this.state.checkedKey, //用来回显的参数
        RegionCode: this.state.postCheckedKeys, //真正的参数  带父节点
        UserGroup_ID: this.state.selectedRowKeys.key,
        callback: res => {
          if (res.IsSuccess) {
            message.success('成功');
            this.handleCancel();
          } else {
            message.error(res.Message);
          }
        },
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const FormData = {};
        for (const key in values) {
          if (values[key] && values[key].fileList) {
            FormData[key] = uid;
          } else {
            FormData[key] = values[key] && values[key].toString();
          }
        }
        const type =
          this.state.IsEdit == true ? 'departinfo/upddepartinfo' : 'departinfo/insertdepartinfo';
        const msg = this.state.IsEdit == true ? '修改成功' : '添加成功';

        this.props.dispatch({
          type,
          payload: {
            ...FormData,
            callback: res => {
              if (res.IsSuccess) {
                message.success(msg);
                this.handleCancel();
                this.props.dispatch({
                  type: 'departinfo/getdepartinfobytree',
                  payload: {},
                  callback: res => {
                    let data = this.handleData(res, 0);
                    this.setState({
                      departInfoTree: data,
                    });
                  },
                });
              } else {
                message.error(res.Message);
              }
            },
          },
        });
        console.log('FormData=', FormData);
      }
    });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.label} key={item.value} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  renderDataTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        if (this.state.leafTreeDatas.indexOf(item.key) == -1 || item.key == '0-0') {
          this.state.leafTreeDatas.push(item.key);
        }
      }
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderDataTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  cancelAlarmModal = () => {
    this.setState({
      visibleAlarm: false,
    });
  };

  showAlarmModal = record => {
    this.setState({
      visibleAlarm: true,
      alarmPushData: record,
    });
  };
  dragaComponents = {
    body: {
      row: DragableBodyRow,
    },
  };
  recursion = (data, current, find) => {
    let totalData = [],
      currentData = null,
      currentIndexs = -1,
      findData = null,
      findIndexs = -1;
    if (data && data.length > 0) {
      //  return  data.map((item,index)=>{
      for (var index in data) {
        let item = data[index];
        if (item.key === current) {
          currentData = item;
          currentIndexs = index;
        }
        if (item.key === find) {
          findData = item;
          findIndexs = index;
        }

        if (currentData && findData && currentData.flag === findData.flag) {
          //在同一个树下拖拽
          data[currentIndexs] = data.splice(findIndexs, 1, data[currentIndexs])[0]; //先删除替换  返回的删除元素再赋值到之前的位置
          // console.log(findIndexs, data[findIndexs]);
          break; //拖拽完成后直接跳转循环 多次循环会导致错乱
        }
        totalData.push({
          //  children: item.children&&item.children.length>0? this.recursion(item.children,current,find) : [],//必须在前面 第一次更新值
          ...item,
          children:
            item.children && item.children.length > 0
              ? this.recursion(item.children, current, find)
              : [], //必须在前面 第一次更新值
        });
      }
      // })
    }

    return totalData;
  };
  moveRow = (dragIndex, hoverIndex) => {
    //拖拽事件
    const { departInfoTree } = this.state;

    let data = departInfoTree;
    let lastData = this.recursion(departInfoTree, dragIndex, hoverIndex);
    this.setState(
      update(this.state, {
        departInfoTree: {
          $splice: [[departInfoTree, lastData]],
        },
      }),
    );
    // let lastDatas = update(data, {$splice:[[departInfoTree , lastData]]});
    // console.log(lastDatas)
    //  this.setState({
    //   departInfoTree:lastDatas
    //  })
  };

  updateSort = () => {
    const { sortTitle } = this.state;
    sortTitle === '开启排序'
      ? this.setState({ sortTitle: '关闭排序' })
      : this.setState({ sortTitle: '开启排序' });
  };
  saveSort = () => { //保存排序
    const { departInfoTree } = this.state;
    function extractKeysFromTree(treeArray) {
      let keys = [];
      // 递归函数，用于遍历树形结构并提取key属性  
      function traverseTree(node) {
        if (node && typeof node === 'object') {
          if (node.key) {
            keys.push(node.key); // 提取节点的key属性并添加到数组中  
          }
          // 如果节点具有子节点，则递归遍历子节点  
          if (Array.isArray(node.children)) {
            node.children.forEach(traverseTree);
          }
        }
      }

      // 遍历数组中的每个树形结构，并提取key属性  
      treeArray.forEach(traverseTree);

      return keys; // 返回提取的key属性数组  
    }
    const data = extractKeysFromTree(departInfoTree)?.[0]? extractKeysFromTree(departInfoTree) : []
    this.props.dispatch({
      type: 'departinfo/groupSort',
      payload: {
        IDList: data,
      },
      callback: () => {
        this.setState({sortTitle:'开启排序'})
      },
    });
  };
  addOrUpdateUserDepApprove = () => {
    //添加修改审核流程
    const {
      approvalUserID,
      approvalNode,
      depID,
      approvalProcessEditId,
      approvalProcessEdit,
    } = this.state;
    if (approvalUserID && approvalNode) {
      this.props.dispatch({
        type: 'departinfo/addOrUpdateUserDepApprove',
        payload: {
          ID: approvalProcessEdit ? '' : approvalProcessEditId,
          UserID: approvalUserID,
          DepID: depID,
          Node: approvalNode,
        },
        callback: () => {
          this.setState({ approvalProcessEditorAddVisible: false });
          this.props.dispatch({
            type: 'departinfo/getUserDepApproveInfo',
            payload: {
              depID: depID,
            },
          });
        },
      });
    } else {
      message.error('审核人和审核节点名不能为空');
    }
  };
  approvalProcessEditOk = e => {
    const { approvalProcessEditId } = this.state;
    e.preventDefault();
    this.addOrUpdateUserDepApprove();
  };
  settingOperationGroup = () => {
    this.setState({
      settingOperationGroupVisible: true,
    })
    this.props.dispatch({
      type: 'departinfo/getSetOperationGroup',
      payload: {},
    })
  }
  settingOperationGroupOk = (operationGroupChecked, state, callback) => {
    this.props.dispatch({
      type: 'departinfo/addSetOperationGroup',
      payload: { GroupIdList: operationGroupChecked, State: state },
      callback: () => {
        callback()
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      btnloading,
      btnloading1,
      insertregionbyuserLoading,
      userDepApproveInfoList,
      testRegionByDepIDLoading,
      insertTestRegionByUserLoading,
      groupSortLoading,
    } = this.props;
    const {
      targetKeys,
      disabled,
      showSearch,
      sortTitle,
      selectedRowKeys,
      superVisionConfigVisible,
      UserGroup_ID,
      UserGroup_Name,
    } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const rowRadioSelection = {
      type: 'radio',
      columnTitle: '选择',
      selectedRowKeys: this.state.rowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRows[0],
          rowKeys: selectedRowKeys,
        });
      },
    };
    const tProps = {
      treeData: this.props.RegionInfoTree,
      value: this.state.DataTreeValue,
      onChange: this.onChangeTree,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: '行政区',
      treeDefaultExpandedKeys: ['0'],
      style: {
        width: 200,
        marginLeft: 16,
      },
      dropdownStyle: {
        maxHeight: '700px',
        overflowY: 'auto',
      },
    };
    if (this.props.GetDepartInfoByTree) {
      return (
        <Spin
          style={{
            width: '100%',
            height: 'calc(100vh/2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          size="large"
        />
      );
    }
    return (
      <Fragment>
        {
          // <MonitorContent breadCrumbList={
          //     [
          //         { Name: '首页', Url: '/' },
          //         { Name: '权限管理', Url: '' },
          //         { Name: '部门管理', Url: '' },
          //     ]
          // }
          // >
          <BreadcrumbWrapper>
            <Card bordered={false}>
              <Button type="primary" style={{ marginRight: 8 }} onClick={this.showModal}>
                新增
              </Button>
              {this.state.settingOperationGroupPermis && <Button type="primary"
                onClick={() => this.settingOperationGroup()}
                style={{ margin: '0 8px' }}
              >设置运维小组</Button>}
              <Button type="primary" style={{ marginRight: 8 }} onClick={this.updateSort}>
                {sortTitle}
              </Button>
              {sortTitle === '关闭排序' ? (
                <Button
                  onClick={() => {
                    this.saveSort();
                  }}
                  style={{ marginRight: 8 }}
                  loading={groupSortLoading}
                >
                  保存排序
                </Button>
              ) : null}
              {/* <Button
                                onClick={this.showUserModal}
                                style={{ marginLeft: "10px" }}
                            >分配用户</Button>
                            <Button
                                onClick={this.showRegionModal}
                                style={{ marginLeft: "10px" }}
                            >运维区域过滤</Button>
                            <Button
                                onClick={this.showDataModal}
                                style={{ marginLeft: "10px" }}
                            >设置点位访问权限</Button> */}
              <DndProvider backend={HTML5Backend}>
                <Table
                  // rowKey={}
                  onRow={(record, index) => ({
                    onClick: event => {
                      this.setState({
                        selectedRowKeys: record,
                        rowKeys: [record.key],
                      });
                    },
                    index,
                    moveRow: sortTitle === '关闭排序' ? this.moveRow : null,
                  })}
                  components={sortTitle === '关闭排序' ? this.dragaComponents : null}
                  style={{ marginTop: '20px' }}
                  //rowSelection={rowRadioSelection}
                  size="small"
                  columns={this.state.columns}
                  defaultExpandAllRows
                  // dataSource={this.props.DepartInfoTree}
                  dataSource={this.state.departInfoTree}
                  loading={groupSortLoading}
                />
              </DndProvider>
            </Card>
            <div>
              {superVisionConfigVisible && (
                <SupervisionConfigModal
                  visible={superVisionConfigVisible}
                  UserGroup_ID={UserGroup_ID}
                  UserGroup_Name={UserGroup_Name}
                  onCancel={() => this.setState({ superVisionConfigVisible: false })}
                />
              )}
              <Modal
                title={this.state.Tittle}
                visible={this.state.visible}
                confirmLoading={this.state.IsEdit === true ? btnloading1 : btnloading}
                onOk={this.handleSubmit}
                destroyOnClose="true"
                onCancel={this.handleCancel}
              >
                {this.props.DepartInfoOneLoading ? (
                  <Spin
                    style={{
                      width: '100%',
                      height: 'calc(100vh/2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    size="large"
                  />
                ) : (
                    <Form onSubmit={this.handleSubmit} className="login-form">
                      <Form.Item label="父节点" {...formItemLayout}>
                        {getFieldDecorator('ParentId', {
                          rules: [{ required: true, message: '请选择父节点' }],
                          initialValue:
                            this.state.IsEdit == true ? this.props.DepartInfoOne.ParentId : undefined,
                        })(
                          <TreeSelect
                            type="ParentId"
                            // showSearch
                            style={{ width: 300 }}
                            //value={this.state.IsEdit==true?this.props.RoleInfoOne.ParentId:null}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择父节点"
                            allowClear
                            treeDefaultExpandAll
                            onChange={this.onChange}
                            treeData={this.props.DepartTree}
                            style={{ width: '100%' }}
                          ></TreeSelect>,
                        )}
                      </Form.Item>
                      <Form.Item label="部门名称" {...formItemLayout}>
                        {getFieldDecorator('UserGroup_Name', {
                          rules: [{ required: true, message: '请输入部门名称' }],
                          initialValue:
                            this.state.IsEdit == true ? this.props.DepartInfoOne.UserGroup_Name : '',
                        })(<Input type="UserGroup_Name" placeholder="请输入部门名称" />)}
                      </Form.Item>
                      <Form.Item label="部门描述" {...formItemLayout}>
                        {getFieldDecorator('UserGroup_Remark', {
                          initialValue:
                            this.state.IsEdit == true
                              ? this.props.DepartInfoOne.UserGroup_Remark
                              : '',
                        })(<TextArea type="UserGroup_Remark" placeholder="请输入部门描述" />)}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('UserGroup_ID', {
                          initialValue:
                            this.state.IsEdit == true ? this.props.DepartInfoOne.UserGroup_ID : '',
                        })(<Input type="UserGroup_ID" hidden />)}
                      </Form.Item>
                    </Form>
                  )}
              </Modal>
              <Modal
                title={`分配用户-${this.state.selectedRowKeys.UserGroup_Name}`}
                visible={this.state.visibleUser}
                onOk={this.handleCancel}
                destroyOnClose="true"
                onCancel={this.handleCancel}
                width={'70%'}
                footer={null}
              >
                {/* {this.props.GetUserByDepID ? (
                  <Spin
                    style={{
                      width: '100%',
                      height: 'calc(100vh/2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    size="large"
                  />
                ) : ( */}

                <Spin spinning={this.props.insertdepartbyuserLoading || this.props.GetUserByDepID}>
                  <TableTransfer
                    rowKey={record => record.User_ID}
                    titles={['待分配用户', '已分配用户']}
                    dataSource={this.props.AllUser}
                    targetKeys={targetKeys}
                    disabled={disabled}
                    showSearch={showSearch}
                    onChange={this.onChanges}
                    filterOption={(inputValue, item) =>
                      (item.User_Name && item.User_Name.indexOf(inputValue) !== -1) ||
                      (item.User_Account && item.User_Account.indexOf(inputValue) !== -1) ||
                      (item.Phone && item.Phone.indexOf(inputValue) !== -1)
                    }
                    leftColumns={leftTableColumns}
                    rightColumns={rightTableColumns}
                    // style={{ width: '100%', height: '600px' }}
                    pagination={false}
                  />
                </Spin>
                {/* )} */}
              </Modal>
              <Modal
                title={`运维区域过滤-${this.state.selectedRowKeys.UserGroup_Name}`}
                visible={this.state.visibleRegion}
                onOk={this.handleRegionOK}
                destroyOnClose="true"
                onCancel={this.handleCancel}
                width={900}
                confirmLoading={insertregionbyuserLoading}
              >
                {this.props.GetRegionByDepID ? (
                  <Spin
                    style={{
                      width: '100%',
                      height: 'calc(100vh/2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    size="large"
                  />
                ) : (
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                      <Tree
                        key="key"
                        checkable
                        // checkStrictly={false}
                        onExpand={this.onExpand}
                        // expandedKeys={this.state.expandedKeys}
                        // autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKey}
                        onSelect={this.onSelectRegion}
                        selectedKeys={this.state.selectedKey}
                        defaultExpandedKeys={['0']}
                        // autoExpandParent={true}
                        defaultExpandAll={false}
                      // defaultExpandParent
                      >
                        {this.renderTreeNodes(this.props.RegionInfoTree)}
                      </Tree>
                    </div>
                  )}
              </Modal>

              <Modal
                title={`设置点位访问权限-${this.state.selectedRowKeys.UserGroup_Name}`}
                visible={this.state.visibleData}
                destroyOnClose
                onCancel={this.handleCancel}
                width={1100}
                footer={null}
                bodyStyle={{
                  overflowY: 'auto',
                  maxHeight: this.props.clientHeight - 240,
                }}
              // confirmLoading={this.props.dataLoading}
              // onOk={this.handleDataOK}

              >
                {
                  // (this.props.GetRegionInfoByTree && this.props.CheckPointLoading) ? <Spin
                  // this.props.CheckPointLoading ? <Spin
                  //     style={{
                  //         width: '100%',
                  //         height: 'calc(100vh/2)',
                  //         display: 'flex',
                  //         alignItems: 'center',
                  //         justifyContent: 'center'
                  //     }}r
                  //     size="large"
                  // /> :
                  <div>
                    <Row style={{ background: '#fff', paddingBottom: 10, zIndex: 1 }}>
                      {/* <Radio.Group value={this.state.pollutantType} onChange={this.handleSizeChange}>
                                                    <Radio.Button value="1">废水</Radio.Button>
                                                    <Radio.Button value="2">废气</Radio.Button>
                                                </Radio.Group> */}
                      <SelectPollutantType
                        // style={{ marginLeft: 50, float: 'left' }}
                        showType="radio"
                        value={this.state.pollutantType}
                        mode="multiple"
                        onlyShowEnt
                        onChange={this.handleSizeChange}
                      />
                      <TreeSelect
                        className={styles.placeHolderClass}
                        {...tProps}
                        treeCheckable={false}
                        allowClear
                      />
                      <Input.Group compact style={{ width: 290, marginLeft: 16, display: 'inline-block' }}>
                        <Input style={{ width: 200 }} allowClear placeholder='请输入企业名称' onBlur={(e) => this.setState({ entPointName: e.target.value })} />
                        <Button type="primary" loading={this.props.CheckPointLoading} onClick={this.pointAccessClick}>查询</Button>
                      </Input.Group>
                    </Row>
                    {this.props.CheckPointLoading || this.props.getentandpointLoading ? (
                      <Spin
                        style={{
                          width: '100%',
                          height: 'calc(100vh/2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        size="large"
                      />
                    ) : this.props.EntAndPoint && this.props.EntAndPoint.length > 0 ? (
                      <Spin spinning={this.props.dataLoading}>
                        <TreeTransfer
                          key="key"
                          treeData={this.state.newEntAndPoint}
                          checkedKeys={this.state.checkedKeys}
                          targetKeysChange={(key, type, callback) => this.setState({ checkedKeys: key }, () => {
                            this.handleDataOK(type == 1 ? 1 : 2, callback)
                          })} />
                      </Spin>
                    ) : (
                          <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                  </div>
                }
              </Modal>
              {/* <Modal
                title="报警关联"
                visible={this.state.visibleAlarm}
                footer={null}
                onOk={this.handleOk}
                onCancel={this.cancelAlarmModal}
                destroyOnClose
                width="70%"
              >
                 <AlarmPushRel
                  RoleIdOrDepId={this.state.selectedRowKeys.key}
                  FlagType="Dept"
                  cancelModal={this.cancelAlarmModal}
                />
              </Modal>   */}
              {this.state.visibleAlarm && (
                <NewAlarmPushRel
                  type="Dept"
                  alarmPushData={this.state.alarmPushData}
                  visibleAlarm={this.state.visibleAlarm}
                  cancelAlarmModal={this.cancelAlarmModal}
                />
              )}
            </div>
            {/* </MonitorContent> */}
            <Modal //审核流程弹框
              title={selectedRowKeys && selectedRowKeys.UserGroup_Name}
              visible={this.state.approvalProcessVisible}
              onCancel={() => {
                this.setState({ approvalProcessVisible: false });
              }}
              width={'70%'}
              destroyOnClose
              footer={null}
            >
              <Button
                type="primary"
                style={{ marginBottom: 15 }}
                onClick={() => {
                  this.setState({
                    approvalProcessEdit: true,
                    approvalProcessEditorAddVisible: true,
                  });
                }}
              >
                新增
              </Button>
              <SdlTable
                rowKey={(record, index) => `complete${index}`}
                bordered={false}
                loading={this.props.getUserDepApproveInfoLoading}
                columns={this.depApproveColumns}
                dataSource={userDepApproveInfoList}
                onCancel={() => {
                  this.setState({ approvalProcessVisible: false });
                }}
                pagination={false}
              />
            </Modal>
            <Modal //审核流程弹框 添加or修改
              title={this.state.approvalProcessEdit ? '添加' : '编辑'}
              visible={this.state.approvalProcessEditorAddVisible}
              onCancel={() => {
                this.setState({
                  approvalProcessEditorAddVisible: false,
                  approvalUserID: undefined,
                  approvalNode: undefined,
                });
              }}
              width={'50%'}
              destroyOnClose
              okText="保存"
              wrapClassName={styles.approvalProcessEditSty}
              onOk={this.approvalProcessEditOk}
              confirmLoading={this.props.addOrUpdateUserDepApproveLoading}
            >
              <Form name="advanced_search" className={styles['ant-advanced-search-form']}>
                <Form.Item label="审核人">
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder="请选择审核人"
                    value={this.state.approvalUserID}
                    onChange={val => {
                      this.setState({ approvalUserID: val });
                    }}
                  >
                    {this.props.userList[0] &&
                      this.props.userList.map(item => {
                        return (
                          <Option
                            value={item.ID}
                          >{`${item.UserAccount} - ${item.UserName}`}</Option>
                        );
                      })}
                  </Select>
                </Form.Item>
                <Form.Item label="审批节点">
                  <Select
                    placeholder="请选择审核节点"
                    value={this.state.approvalNode}
                    onChange={val => {
                      this.setState({ approvalNode: val });
                    }}
                  >
                    <Option value="1">一级节点</Option>
                    <Option value="2">二级节点</Option>
                    <Option value="3">三级节点</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title={`成套区域过滤-${this.state.selectedTestRowKeys?.UserGroup_Name}`}
              visible={this.state.testVisibleRegion}
              onOk={this.handleTestRegionOK}
              destroyOnClose="true"
              onCancel={() => { this.setState({ testVisibleRegion: false }) }}
              width={900}
              confirmLoading={insertTestRegionByUserLoading}
            >
              {this.props.testRegionByDepIDLoading ? (
                <Spin
                  style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  size="large"
                />
              ) : (
                  <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <Tree
                      key="key"
                      checkable
                      onCheck={this.onTestCheck}
                      checkedKeys={this.state.testCheckedKey}
                    >
                      {this.renderTestTreeNodes(this.props.RegionInfoTree)}
                    </Tree>
                  </div>
                )}
            </Modal>
            <Modal
              title={this.state.settingOperationGrouptitle}
              visible={this.state.settingOperationGroupVisible}
              destroyOnClose={true}
              onCancel={() => { this.setState({ settingOperationGroupVisible: false }) }}
              width={1100}
              footer={null}
              bodyStyle={{
                overflowY: 'auto',
                maxHeight: this.props.clientHeight - 240,
              }}

            >
              <Spin spinning={this.props.GetDepartInfoByTree || this.props.addSetOperationGroupLoading || this.props.getSetOperationGroupLoading}>
                {this.state.departInfoTree?.length > 0 && !this.props.GetDepartInfoByTree && !this.props.getSetOperationGroupLoading ?
                  <TreeTransferSingle
                    key="key"
                    titles={['待设置运维小组', '已设置运维小组']}
                    treeData={copyObjectArrayTreeAndRenameProperty(this.state.departInfoTree, 'UserGroup_Name', 'title')}
                    checkedKeys={this.props.setOperationGroupId}
                    targetKeysChange={(key, type, callback) => {
                      this.settingOperationGroupOk(key, type == 1 ? 1 : 2, callback)
                    }
                    }
                  />
                  :
                  <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
              </Spin>
            </Modal>
          </BreadcrumbWrapper>
        }
      </Fragment>
    );
  }
}

export default DepartIndex;
