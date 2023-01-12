/*
 * @Author: jab
 * @Date: 2022.08.08
 * @LastEditors: jab
 * @Description: 检测调试 权限区域管理
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
  AuditOutlined
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
  Select
} from 'antd';
import MonitorContent from '@/components/MonitorContent';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import TextArea from 'antd/lib/input/TextArea';
import difference from 'lodash/difference';
import SelectPollutantType from '@/components/SelectPollutantType';
import AlarmPushRel from '@/components/AlarmPushRel';
import styles from './index.less';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import SdlTable from '@/components/SdlTable'
const { TreeNode } = Tree;
const { SHOW_PARENT } = TreeSelect;


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
    dragingIndex = props['data-row-key']
    return {
      'data-row-key': props['data-row-key']
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem()['data-row-key'];
    const hoverIndex = props['data-row-key'];
    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveRow(dragIndex, hoverIndex);
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
          scroll={{ y: 'calc(100vh - 550px)' }}
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
@connect(({ areaPermissManage, autoForm, loading, global, common }) => ({
  getTestGroupListLoading: loading.effects['areaPermissManage/getTestGroupList'],
  addOrUpdTestGroupLoading: loading.effects['areaPermissManage/addOrUpdTestGroup'],
  deleteTestGroupLoading: loading.effects['areaPermissManage/deleteTestGroup'],
  getAllUserLoading: loading.effects['areaPermissManage/getAllUser'],
  getTestMonitorUserListLoading: loading.effects['areaPermissManage/getTestMonitorUserList'],
  addTestMonitorUserLoading: loading.effects['areaPermissManage/addTestMonitorUser'] || false,
  regionInfoTreeLoading:loading.effects['autoForm/getRegions'],
  getRegionByDepIDLoading:loading.effects['areaPermissManage/getRegionByDepID'],
  insertRegionByUserLoading:loading.effects['areaPermissManage/insertRegionByUser'], 
  allUser: areaPermissManage.allUser,
  regionInfoTree:autoForm.regionList,
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departInfoTree: [],
      sortTitle: '开启排序',
      depVisible: false,
      depTitle: '添加部门',
      visibleUser: false,
      selectedRowKeys: null,
      targetUserKeys: [],
      visibleRegion: false,
      checkedRegKey:[],



      newEntAndPoint: [],
      visibleAlarm: false,
      value: undefined,
      IsEdit: false,
      FormDatas: [],
      selectedRowKeys: [],
      autoExpandParent: true,
      expandedKeys: [],
      expandedKey: [],
      allKeys: [],
      checkedKeys: [],
      checkedKey: [],
      checkedKeysSel: [],
      checkedKeySel: [],
      selectedKeys: [],
      selectedKey: [],
      disabled: false,
      showSearch: true,
     
      leafTreeDatas: [],
      visibleData: false,
      pollutantType: '',
      DataTreeValue: [],
      rolesID: '',
      alarmPushData: '',
      postRegCheckedKeys: '',
      updateOperationVal: '1',
      columns: [
        {
          title: '部门名称',
          dataIndex: 'GroupName',
          key: 'GroupName',
          width: 'auto',
        },
        {
          title: '部门描述',
          dataIndex: 'Remark',
          key: 'Remark',
          width: 'auto',
        },
        {
          title: '创建人',
          dataIndex: 'CreateUser',
          width: 'auto',
          key: 'CreateUser',
        },
        {
          title: '创建时间',
          dataIndex: 'CreateTime',
          width: 'auto',
          key: 'CreateTime',
        },
        {
          title: '操作',
          dataIndex: '',
          key: 'x',
          align: 'left',
          width: '180px',
          render: (text, record, index) => (
            <span>
              <Tooltip title="编辑">
                <a onClick={() => {
                  this.showModalEdit(record);
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
                      type: 'areaPermissManage/deleteTestGroup',
                      payload: {
                        ID: record.ID,
                      },
                      callback: res => {
                        if (res.IsSuccess) {
                          message.success('删除成功');
                          this.props.dispatch({
                            type: 'areaPermissManage/getTestGroupList',
                            payload: {},
                            callback: (res) => {
                              let data = this.handleData(res, 0)
                              this.setState({ departInfoTree: data })
                            }
                          });
                        } else {
                          message.error(res.Message);
                        }
                      },
                    });
                  }}
                  onCancel={this.cancel}
                  okText="是"
                  cancelText="否"
                >
                  <a >
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
                        this.showUserModal(record);
                      },
                    );
                  }}
                >
                  <UsergroupAddOutlined style={{ fontSize: 16 }} />
                </a>
              </Tooltip>
              <Divider type="vertical" />
              <>
                <Tooltip title="区域过滤">
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

            </span>
          ),
        },
      ],

    };
    this.depApproveColumns = [
      {
        title: <span>序号</span>,
        dataIndex: 'x',
        key: 'x',
        align: 'center',
        render: (text, record, index) => {
          return index + 1
        }
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
                    approvalProcessEditId: record.id
                  })
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
                    type: 'areaPermissManage/deleteUserDepApprove',
                    payload: {
                      id: record.id,
                    },
                  });
                  this.props.dispatch({
                    type: 'areaPermissManage/getUserDepApproveInfo',
                    payload: {
                      depID: record.depID,
                    },
                  })
                }}
                okText="是"
                cancelText="否"
              >
                <a >
                  <DeleteOutlined style={{ fontSize: 16 }} />
                </a>
              </Popconfirm>
            </Tooltip>
          </span>)
      }
    ]
  }
  //获取角色列表
  getAllUserList = () => {
    this.props.dispatch({
      type: 'areaPermissManage/getAllUser',
      payload: {}
    });
  }


  updateChange = (value) => {
    this.setState({
      updateOperationVal: value
    })
  }





  onExpands = expandedKey => {
    this.setState({
      expandedKey,
      autoExpandParent: false,
    });
  };

  onRegCheck = (checkedKeys,info) => {
    this.setState({checkedRegKey: checkedKeys,});

  };



  onSelectRegion = (selectedKey, info) => {
    this.setState({ selectedKey });
  };



  componentDidMount() {
    this.props.dispatch({
      type: 'areaPermissManage/getTestGroupList',
      payload: {},
      callback: (res) => {
        let data = this.handleData(res, 0)
        this.setState({
          departInfoTree: data
        })
      }
    });
    this.getAllUserList({})
  }
  handleData = (data, i) => {
    if (data && data.length > 0) {
      i++;
      return data.map(item => {
        return { ...item, title: item.GroupName, key: item.ID, value: item.ID, flag: i, children: item.Child.length > 0 ? this.handleData(item.Child, i) : [] }
      })
    }

  }
  showModal = () => {
    this.props.form.resetFields();
    this.setState({
      depVisible: true,
      IsEdit: false,
      depTitle: '添加部门',
    });
  };

  showUserModal = (row) => {
    if (row.length == 0) {
      message.warning('请选中一行');
      return;
    }
    this.setState({
      visibleUser: true,
    });
    const keys = row.key;
    this.props.dispatch({
      type: 'areaPermissManage/getTestMonitorUserList',
      payload: {
        groupID: keys,
      },
      callback: (res) => {
        const selectId = res.map(item => item.UserID);
        this.setState({
          targetUserKeys: selectId,
        });
      }

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
    this.props.dispatch({
      type: 'areaPermissManage/getRegionByDepID',
      payload: {
        UserGroup_ID: keys.toString(),
      },
      callback: res => {
        this.setState({ checkedRegKey: res.userList, })
      }
    });
  };


  componentWillReceiveProps(nextProps) {


  }

  showModalEdit = (record) => {

    this.setState({
      depVisible: true,
      IsEdit: true,
      depTitle: '编辑部门',
    }, () => {
      this.props.form.setFieldsValue({ ...record, })
    });
  };

  handleOk = e => {
    this.setState({
      depVisible: false,
    });
  };

  onChange = value => {
    this.setState({ value });
  };

  handleCancel = e => {
    this.setState({
      depVisible: false,
      IsEdit: false,
      visibleUser: false,
      visibleRegion: false,
    });
  };

  userChange = nextTargetKeys => {
    this.setState({ targetUserKeys: nextTargetKeys });
  }
  handleUserOK = e => {

    const { targetUserKeys } = this.state;
    const selectList = targetUserKeys.map(item => {
      return { UserID: item, }
    })
    this.props.dispatch({
      type: 'areaPermissManage/addTestMonitorUser',
      payload: {
        groupID: this.state.selectedRowKeys.key,
        list: selectList,
      },
    })
  }
  handleRegionOK = e => {
    this.props.dispatch({
      type: 'areaPermissManage/insertRegionByUser',
      payload: {
        RegionFlagCode: this.state.checkedRegKey,//用来回显的参数
        RegionCode: this.state.checkedRegKey,//真正的参数  带父节点
        UserGroup_ID: this.state.selectedRowKeys.key,
      },
      callback: res => {
        if (res.IsSuccess) {
          message.success(res.Message);
          this.handleCancel();
        } else {
          message.error(res.Message);
        }
      },
    });
  };






  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const type = 'areaPermissManage/addOrUpdTestGroup';
        const msg = this.state.IsEdit == true ? '修改成功' : '添加成功';
        this.props.dispatch({
          type,
          payload: { ...values, },
          callback: res => {
            if (res.IsSuccess) {
              message.success(msg);
              this.handleCancel();
              this.props.dispatch({
                type: 'areaPermissManage/getTestGroupList',
                payload: {},
                callback: (res) => {
                  let data = this.handleData(res, 0)
                  this.setState({
                    departInfoTree: data
                  })
                }
              });
            } else {
              message.error(res.Message);
            }
          },
        });
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




  dragaComponents = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => { //拖拽事件
    const { departInfoTree } = this.state;

    let data = [...departInfoTree]
    let lastData = this.recursion(data, dragIndex, hoverIndex);
    this.setState(
      update(this.state, {
        departInfoTree: {
          $splice: [[departInfoTree, lastData]],
        },
      }),
    );
  };
  recursion = (data, current, find) => {
    let totalData = [], currentData = null, currentIndexs = -1, findData = null, findIndexs = -1;
    if (data && data.length > 0) {
      for (var index in data) {
        let item = data[index]
        if (item.key === current) { currentData = item; currentIndexs = index };
        if (item.key === find) { findData = item; findIndexs = index };

        if (currentData && findData && currentData.flag === findData.flag) { //在同一个树下拖拽
          data[currentIndexs] = data.splice(findIndexs, 1, data[currentIndexs])[0]; //先删除替换  返回的删除元素再赋值到之前的位置  
          console.log(findIndexs, data[findIndexs])
          break; //拖拽完成后直接跳转循环 多次循环会导致错乱
        }
        totalData.push({
          ...item,
          children: item.Child && item.Child.length > 0 ? this.recursion(item.Child, current, find) : [],//必须在前面 第一次更新值

        })
      }
    }

    return totalData;
  }
  updateSort = () => {
    const { sortTitle } = this.state;
    sortTitle === '开启排序' ? this.setState({ sortTitle: '关闭排序' }) : this.setState({ sortTitle: '开启排序' })
  }
  saveSort = () => {

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { targetUserKeys, disabled, sortTitle, selectedRowKeys } = this.state;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const tProps = {
      treeData: this.props.RegionInfoTree,
      value: this.state.DataTreeValue,
      onChange: this.onChangeTree,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '行政区',
      treeDefaultExpandedKeys: ['0'],
      style: {
        width: 400,
        marginLeft: 16,
      },
      dropdownStyle: {
        maxHeight: '700px',
        overflowY: 'auto',
      },
    };

    return (
      <Fragment>
        {
          <BreadcrumbWrapper>
            <Card bordered={false}>
              <Button type="primary" style={{ marginRight: 8 }} onClick={this.showModal}>
                新增
              </Button>
              {/* <Button type="primary"  style={{marginRight:8}} onClick={this.updateSort}>
                {sortTitle}
              </Button> */}
              {sortTitle === '关闭排序' ? <Button onClick={() => { this.saveSort() }}
                style={{ marginRight: 8 }} loading={this.props.dragLoading}  >
                保存排序
                                       </Button> : null}
              <DndProvider backend={HTML5Backend}>
                <Table
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
                  size="small"
                  columns={this.state.columns}
                  defaultExpandAllRows
                  dataSource={this.state.departInfoTree}
                  loading={this.props.getTestGroupListLoading}
                />
              </DndProvider>
            </Card>
            <div>
              <Modal
                title={this.state.depTitle}
                visible={this.state.depVisible}
                onOk={this.handleSubmit}
                destroyOnClose="true"
                onCancel={this.handleCancel}
                confirmLoading={this.props.addOrUpdTestGroupLoading}
              >
                  <Spin spinning={this.props.getTestGroupListLoading }>
                    <Form className="login-form">
                      <Form.Item label="父节点" {...formItemLayout}>
                        {getFieldDecorator('ParentCode', {
                          rules: [{ required: true, message: '请选择父节点' }],
                        })(
                          <TreeSelect
                            style={{ width: 300 }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择父节点"
                            allowClear
                            treeDefaultExpandAll
                            onChange={this.onChange}
                            treeData={[{ title: "根节点", value: "0", key: "0", children: this.state.departInfoTree },]}
                            style={{ width: '100%' }}
                          ></TreeSelect>,
                        )}
                      </Form.Item>
                      <Form.Item label="部门名称" {...formItemLayout}>
                        {getFieldDecorator('GroupName', {
                          rules: [{ required: true, message: '请输入部门名称' }],
                        })(<Input placeholder="请输入部门名称" />)}
                      </Form.Item>
                      <Form.Item label="部门描述" {...formItemLayout}>
                        {getFieldDecorator('Remark', {})(<TextArea placeholder="请输入部门描述" />)}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('ID', {})(<Input type="ID" hidden />)}
                      </Form.Item>
                    </Form>
                    </Spin>
              </Modal>
              <Modal
                title={`分配用户-${this.state.selectedRowKeys.GroupName}`}
                visible={this.state.visibleUser}
                onOk={this.handleUserOK}
                destroyOnClose="true"
                onCancel={this.handleCancel}
                confirmLoading={this.props.addTestMonitorUserLoading}
                width={'70%'}
              >

                <Spin spinning={this.props.getTestMonitorUserListLoading || this.props.getAllUserLoading || this.props.addTestMonitorUserLoading}>
                  <TableTransfer
                    rowKey={record => record.User_ID}
                    titles={['待分配用户', '已分配用户']}
                    dataSource={this.props.allUser}
                    targetKeys={targetUserKeys}
                    showSearch
                    onChange={this.userChange}
                    filterOption={(inputValue, item) =>
                      (item.User_Name && item.User_Name.indexOf(inputValue) !== -1) ||
                      (item.User_Account && item.User_Account.indexOf(inputValue) !== -1) ||
                      (item.Phone && item.Phone.indexOf(inputValue) !== -1)
                    }
                    leftColumns={leftTableColumns}
                    rightColumns={rightTableColumns}
                    pagination={false}
                  />
                </Spin>

              </Modal>
              <Modal
                title={`区域过滤-${this.state.selectedRowKeys.GroupName}`}
                visible={this.state.visibleRegion}
                onOk={this.handleRegionOK}
                destroyOnClose="true"
                onCancel={this.handleCancel}
                width={900}
                confirmLoading={this.props.insertRegionByUserLoading}

              >

                  <Spin spinning={this.props.regionInfoTreeLoading || this.props.getRegionByDepIDLoading}>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                      <Tree
                        key="key"
                        checkable
                        // checkStrictly
                        onCheck={this.onRegCheck}
                        checkedKeys={this.state.checkedRegKey}
                        defaultExpandAll={false}
                      >
                        {this.renderTreeNodes(this.props.regionInfoTree)}
                      </Tree>
                    </div>
                    </Spin>
              </Modal>



            </div>

          </BreadcrumbWrapper>
        }
      </Fragment>
    );
  }
}

export default Index;
