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
      'data-row-key':props['data-row-key']
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
const TableTransfer = ({ leftColumns, rightColumns,pagination, ...restProps }) => (
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
          style={{ pointerEvents: listDisabled ? 'none' : null,paddingBottom:10 }}
          scroll={{y:'calc(100vh - 550px)'}}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
          pagination={{...pagination}}
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
@connect(({ areaPermissManage, autoForm,loading, global, common }) => ({
  // GetRegionInfoByTree: loading.effects['areaPermissManage/getregioninfobytree'],
  GetRegionInfoByTree: loading.effects['autoForm/getregioninfobytree'],
  GetRegionByDepID: loading.effects['areaPermissManage/getregionbydepid'],
  GetUserByDepID: loading.effects['areaPermissManage/getuserbydepid'],
  GetAllUser: loading.effects['areaPermissManage/getalluser'],
  GetDepartInfoByTree: loading.effects['areaPermissManage/getdepartinfobytree'],
  DepartInfoOneLoading: loading.effects['areaPermissManage/getdepartinfobyid'],
  CheckPointLoading: loading.effects['areaPermissManage/getpointbydepid'],
  getentandpointLoading: loading.effects['areaPermissManage/getentandpoint'],
  updateOperationAreaLoading: loading.effects['areaPermissManage/updateOperationArea'],
  DepartInfoTree: areaPermissManage.DepartInfoTree,
  DepartInfoOne: areaPermissManage.DepartInfoOne,
  DepartTree: areaPermissManage.DepartTree,
  AllUser: areaPermissManage.AllUser,
  UserByDepID: areaPermissManage.UserByDepID,
  RegionByDepID: areaPermissManage.RegionByDepID,
  // RegionInfoTree: areaPermissManage.RegionInfoTree,
  RegionInfoTree: autoForm.regionList,
  EntAndPoint: areaPermissManage.EntAndPoint,
  CheckPoint: areaPermissManage.CheckPoint,
  ConfigInfo: global.configInfo,
  pollutantType: common.defaultPollutantCode,
  showGroupRegionFilter: areaPermissManage.showGroupRegionFilter,
  btnloading: loading.effects['areaPermissManage/insertdepartinfo'],
  btnloading1: loading.effects['areaPermissManage/upddepartinfo'],
  insertregionbyuserLoading: loading.effects['areaPermissManage/insertregionbyuser'],
  userDepApproveInfoList: areaPermissManage.userDepApproveInfoList,
  getUserDepApproveInfoLoading: loading.effects['areaPermissManage/getUserDepApproveInfo'],
  addOrUpdateUserDepApproveLoading: loading.effects['areaPermissManage/addOrUpdateUserDepApprove'],
  userList:areaPermissManage.userList,
  deleteUserDepApproveLoading: loading.effects['areaPermissManage/deleteUserDepApprove'],
  insertdepartbyuserLoading :loading.effects['areaPermissManage/insertdepartbyuser'] || false,
}))
@Form.create()
class Index extends Component {
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
      pollutantType: '',
      DataTreeValue: [],
      rolesID:'',
      alarmPushData:'',
      postCheckedKeys:'',
      updateOperationVal:'1',
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
          width: '180px',
          render: (text, record,index) => (
            <span>
              <Tooltip title="编辑">
                <a
                  onClick={() => {
                    this.props.dispatch({
                      type: 'areaPermissManage/getdepartinfobyid',
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
                      type: 'areaPermissManage/deldepartinfo',
                      payload: {
                        UserGroup_ID: record.UserGroup_ID,
                        callback: res => {
                          if (res.IsSuccess) {
                            message.success('删除成功');
                            this.props.dispatch({
                              type: 'areaPermissManage/getdepartinfobytree',
                              payload: {},
                              callback:(res)=>{
                                let data = this.handleData(res,0)
                                this.setState({
                                  departInfoTree:data
                                })
                              }
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
                  <a href="#">
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
              )}
 
            </span>
          ),
        },
      ],
      departInfoTree:[],
      sortTitle:'开启排序',
      approvalProcessVisible:false, //审核流程
      approvalProcessEditorAddVisible:false,
      approvalUserID:undefined,
      approvalNode:undefined,
      depID:undefined,
    };
    this.depApproveColumns=[
      {
        title: <span>序号</span>,
        dataIndex: 'x',
        key: 'x',
        align: 'center',
        render:(text, record, index) => {
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
        render: (text, record,index) => (
          <span>
            <Tooltip title="编辑">
              <a
                onClick={() => {
                   this.setState({ 
                     approvalProcessEdit:false,
                     approvalProcessEditorAddVisible:true,
                     UserID: record.userID,
                     Node: record.node,
                     approvalProcessEditId:record.id
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
                <a href="#">
                  <DeleteOutlined style={{ fontSize: 16 }} />
                </a>
              </Popconfirm>
            </Tooltip>
          </span>)
      }
    ]
  }
  //获取角色列表
  getUserList=(params)=>{
    this.props.dispatch({
      type: 'areaPermissManage/getUserList',
      payload: params? params : { roleListID:'', groupListID:'', userName:'',	userAccount:''}
    });
  }
  approvalProcessClick = (row) =>{ //审核流程
    this.setState({
      approvalProcessVisible:true,
      depID:row.key,
    })
    this.props.dispatch({
      type: 'areaPermissManage/getUserDepApproveInfo',
      payload: {
        depID: row.key,
      },
    })                     ;
  }
  updateOperation=()=>{
    return <Form>
        <Row>
        <Select
       placeholder="更新类型"
       onChange={this.updateChange}
       value={this.state.updateOperationVal}
       style={{ width: '100%'}}
       allowClear
     >
       <Option value="1">一级</Option>
       <Option value="2">二级</Option>
       <Option value="3">其他</Option>
     </Select>
        </Row>
         <Row style={{paddingTop:10}} justify='end'>
         <Button type="primary"  loading={this.props.updateOperationAreaLoading} onClick={this.updateOperationSubmit}>
           确定
         </Button>  
         <Button style={{marginLeft:5}} onClick={() => {this.setState({operatioVisible:false,updateOperationGroupId:''})}}>
         取消
         </Button>  
         </Row>
      </Form>
  }

  updateChange=(value)=>{
    this.setState({
      updateOperationVal:value
    })
  }
  handleUpdateOperationData=(data,id,i)=>{
    if(data&&data.length>0){
       i++;

       return  data.map(item=>{
         return {...item,leve:item.UserGroup_ID===id? this.state.updateOperationVal : item.leve ,children:item.children.length>0 ? this.handleUpdateOperationData(item.children,id,i) : []}
      })
    }

  }
  updateOperationSubmit=()=>{
    this.props.dispatch({
      type: 'areaPermissManage/updateOperationArea',
      payload: {
        LevelType: this.state.updateOperationVal,
        GroupId: this.state.updateOperationGroupId,
      },
      callback:()=>{
        this.setState({operatioVisible:false},()=>{
         const data =  this.handleUpdateOperationData(this.state.departInfoTree,this.state.updateOperationGroupId,0)
         console.log(data)  
         this.setState({
             departInfoTree:data,
            })
        })
      }
    });
  }
  onChanges = nextTargetKeys => {
    // if (nextTargetKeys.length == 0) {
    //     message.error("请至少保留一个角色")
    //     return
    // }
    console.log('nextTargetKeys.length=', nextTargetKeys.length);
    console.log('this.props.AllUser.length=', this.props.AllUser.length);
    this.props.dispatch({
      type: 'areaPermissManage/insertdepartbyuser',
      payload: {
        User_ID: nextTargetKeys,
        UserGroup_ID: this.state.selectedRowKeys.key,
      },
      callback:(isSuccess)=>{
        if(!isSuccess){ //不成功
          this.showUserModal()
        }
      }
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

  onCheck = (checkedKey,info) => {
    // console.log(checkedKey)
    // console.log(info)
    this.setState({ checkedKey});
    let checkedKeys = [...checkedKey,...info.halfCheckedKeys]
    this.setState({ postCheckedKeys:checkedKeys});

  };

  onChecks = checkedKeys => {
    console.log('select=', checkedKeys);
    console.log('this.state.leafTreeDatas=', this.state.leafTreeDatas);
    this.setState({ checkedKeys });
    const leafTree = [];
    checkedKeys.map(item => {
      if (this.state.leafTreeDatas.indexOf(item) != -1) {
        leafTree.push(item);
      }
    });
    this.setState({ checkedKeySel: checkedKeys });
  };

  onSelect = (record, selected, selectedRows) => {
    console.log('record=', record.key);
  };

  onSelectRegion = (selectedKey, info) => {
    this.setState({ selectedKey });
  };

  onSelectData = (selectedKey, info) => {
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
    this.props.dispatch({
      type: 'areaPermissManage/getdepartinfobytree',
      payload: {},
      callback:(res)=>{
        let data = this.handleData(res,0)
        this.setState({
          departInfoTree:data
        })
      }
    });
    this.props.dispatch({
      type: 'areaPermissManage/getGroupRegionFilter',
      payload: {},
    });
    this.getUserList({})
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
  handleData=(data,i)=>{
    if(data&&data.length>0){
       i++;
       return  data.map(item=>{
         return {...item,flag:i,children:item.children.length>0 ? this.handleData(item.children,i) : []}
      })
    }

  }
  showModal = () => {
    this.props.dispatch({
      type: 'areaPermissManage/getdeparttreeandobj',
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
      type: 'areaPermissManage/getalluser',
      payload: {},
    });
    console.log('111=', keys);

    this.props.dispatch({
      type: 'areaPermissManage/getuserbydepid',
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
    //   type: 'areaPermissManage/getregioninfobytree',
    //   payload: {},
    // });
    this.props.dispatch({
      type: 'areaPermissManage/getregionbydepid',
      payload: {
        UserGroup_ID: keys.toString(),
      },
      callback:res=>{
        this.setState({checkedKey:res.userFlagList,postCheckedKeys:res.userList})
      }
    });
    // this.setState({
    //   visibleRegion: true,
    //   checkedKey: this.props.RegionByDepID,
    // });
  };

  showDataModal = () => {
    // console.log('this.state.pollutantType=', this.state.pollutantType);
    // if (this.state.selectedRowKeys.length == 0) {
    //   message.error('请选中一行');
    //   return;
    // }
    // const keys = this.state.selectedRowKeys.key;
    // this.props.dispatch({
    //   type: 'areaPermissManage/getregioninfobytree',
    //   payload: {},
    // });
    // this.setState({
    //   visibleData: true,
    //   DataTreeValue: [],
    //   checkedKey: this.props.RegionByDepID,
    // });
    // this.props.dispatch({
    //   type: 'areaPermissManage/getentandpoint',
    //   payload: {
    //     PollutantType: this.state.pollutantType,
    //     RegionCode: '',
    //   },
    // });
    // this.props.dispatch({
    //   type: 'areaPermissManage/getpointbydepid',
    //   payload: {
    //     UserGroup_ID: keys.toString(),
    //     PollutantType: this.state.pollutantType,
    //     RegionCode: [],
    //   },
    // });

    // console.log('pollutantType=', this.state.pollutantType);
  };

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
          {
            title: '全部',
            // key: '0-0',
            children: nextProps.EntAndPoint,
          },
        ],
      });
    }
    // if (this.props.ConfigInfo !== nextProps.ConfigInfo) {
    //     var list = nextProps.ConfigInfo.SystemPollutantType ? nextProps.ConfigInfo.SystemPollutantType.split(',') : []
    //     var type = list.length > 0 ? list[0] : "";
    //     this.setState({
    //         pollutantType: type,
    //     })
    //     // this.props.dispatch({
    //     //   type: 'navigationtree/getentandpoint',
    //     //   payload: {
    //     //     Status: this.state.screenList,
    //     //     PollutantType: nextProps.ConfigInfo.SystemPollutantType,
    //     //   }
    //     // })
    // }
  }

  showModalEdit = () => {
    this.props.dispatch({
      type: 'areaPermissManage/getdeparttreeandobj',
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
      type: 'areaPermissManage/insertregionbyuser',
      payload: {
        RegionFlagCode: this.state.checkedKey,//用来回显的参数
        RegionCode:this.state.postCheckedKeys,//真正的参数  带父节点
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

  handleDataOK = e => {
    // console.log('regioncode=', this.state.DataTreeValue.toString());
    // console.log('DGIMN=', this.state.checkedKeys);
    // console.log('selectedRowKeys=', this.state.selectedRowKeys.key);
    // this.props.dispatch({
    //   type: 'areaPermissManage/insertpointfilterbydepid',
    //   payload: {
    //     DGIMN: this.state.postCheckedKeys,
    //     RegionFlagCode:this.state.checkedKeys,
    //     UserGroup_ID: this.state.selectedRowKeys.key,
    //     Type: this.state.pollutantType,
    //     RegionCode: this.state.DataTreeValue.toString(),
    //     callback: res => {
    //       if (res.IsSuccess) {
    //         message.success('成功');
    //         this.handleCancel();
    //       } else {
    //         message.error(res.Message);
    //       }
    //     },
    //   },
    // });
  };

  /** 数据过滤切换污染物 */
  handleSizeChange = e => {
    const keys = this.state.selectedRowKeys.key;
    this.setState({ pollutantType: e.target.value });
    this.props.dispatch({
      type: 'areaPermissManage/getpointbydepid',
      payload: {
        UserGroup_ID: keys.toString(),
        PollutantType: e.target.value,
        RegionCode: this.state.DataTreeValue.toString(),
      },
    });
    this.props.dispatch({
      type: 'areaPermissManage/getentandpoint',
      payload: {
        RegionCode: this.state.DataTreeValue.toString(),
        PollutantType: e.target.value,
      },
    });
  };

  /** 数据过滤切换行政区 */
  onChangeTree = value => {
    console.log('onChange================= ', value);
    const keys = this.state.selectedRowKeys.key;
    if (value == undefined) {
      this.setState({
        DataTreeValue: '',
      });
      this.props.dispatch({
        type: 'areaPermissManage/getentandpoint',
        payload: {
          RegionCode: '',
          PollutantType: this.state.pollutantType,
        },
      });
      this.props.dispatch({
        type: 'areaPermissManage/getpointbydepid',
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
        type: 'areaPermissManage/getentandpoint',
        payload: {
          RegionCode: value.toString(),
          PollutantType: this.state.pollutantType,
        },
      });
      this.props.dispatch({
        type: 'areaPermissManage/getpointbydepid',
        payload: {
          UserGroup_ID: keys.toString(),
          PollutantType: this.state.pollutantType,
          RegionCode: this.state.DataTreeValue.toString(),
        },
      });
    }
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
          this.state.IsEdit == true ? 'areaPermissManage/upddepartinfo' : 'areaPermissManage/insertdepartinfo';
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
                  type: 'areaPermissManage/getdepartinfobytree',
                  payload: {},
                  callback:(res)=>{
                    let data = this.handleData(res,0)
                    this.setState({
                      departInfoTree:data
                    })
                  }
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
        if (this.state.leafTreeDatas.indexOf(item.key) == -1) {
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



  dragaComponents = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => { //拖拽事件
    const { departInfoTree } = this.state;
    
       let data = [...departInfoTree]
       let lastData = this.recursion(data,dragIndex, hoverIndex);
       this.setState(
        update(this.state, {
          departInfoTree: {
            $splice: [[departInfoTree, lastData]],
          },
        }),
      );
  };
 recursion= (data, current,find)=>{
      let totalData =[], currentData = null,currentIndexs=-1, findData = null,findIndexs=-1;
      if(data&&data.length>0){
      //  return  data.map((item,index)=>{
          for(var index in data){
            let item = data[index]
           if(item.key === current) {currentData = item ; currentIndexs = index };
           if(item.key === find){ findData = item ; findIndexs = index };
         
           if(currentData&&findData&&currentData.flag === findData.flag ){ //在同一个树下拖拽
              data[currentIndexs] = data.splice(findIndexs,1,data[currentIndexs])[0]; //先删除替换  返回的删除元素再赋值到之前的位置  
              console.log(findIndexs,data[findIndexs])
              break; //拖拽完成后直接跳转循环 多次循环会导致错乱
            }
            totalData.push({
              //  children: item.children&&item.children.length>0? this.recursion(item.children,current,find) : [],//必须在前面 第一次更新值
               ...item,
               children: item.children&&item.children.length>0? this.recursion(item.children,current,find) : [],//必须在前面 第一次更新值

           })
          }
        // })
      }

      return totalData;
    }
    updateSort=()=>{
      const { sortTitle } = this.state;
      sortTitle==='开启排序'? this.setState({  sortTitle:'关闭排序'   }) : this.setState({  sortTitle:'开启排序'   })
    }
    saveSort=()=>{

    }
    addOrUpdateUserDepApprove = () =>{ //添加修改审核流程
      const { approvalUserID,approvalNode,depID,approvalProcessEditId,approvalProcessEdit } = this.state;
      if(approvalUserID&&approvalNode){
      this.props.dispatch({
        type: 'areaPermissManage/addOrUpdateUserDepApprove',
        payload: {
          ID: approvalProcessEdit?'':approvalProcessEditId,
          UserID: approvalUserID,
          DepID: depID,
          Node: approvalNode
        },
        callback:()=>{
         this.setState({approvalProcessEditorAddVisible:false})
         this.props.dispatch({
          type: 'areaPermissManage/getUserDepApproveInfo',
          payload: {
            depID: depID,
          },
        })  
        }
      });
    }else{
      message.error('审核人和审核节点名不能为空')
    }
    }
    approvalProcessEditOk=(e)=>{
        const { approvalProcessEditId } = this.state;
        e.preventDefault();    
        this.addOrUpdateUserDepApprove()
    }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { btnloading, btnloading1,insertregionbyuserLoading,userDepApproveInfoList } = this.props;
    const { targetKeys, disabled, showSearch,sortTitle,selectedRowKeys } = this.state;
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
          <BreadcrumbWrapper>
            <Card bordered={false}>
              <Button type="primary" style={{marginRight:8}} onClick={this.showModal}>
                新增
              </Button>
              {/* <Button type="primary"  style={{marginRight:8}} onClick={this.updateSort}>
                {sortTitle}
              </Button> */}
              {sortTitle==='关闭排序'? <Button onClick={() => { this.saveSort()}} 
                                        style={{marginRight:8}}   loading={this.props.dragLoading}  >
                                       保存排序
                                       </Button>:null}
              <DndProvider backend={HTML5Backend}>
              <Table
                onRow={(record, index)  => ({
                  onClick: event => {
                    this.setState({
                      selectedRowKeys: record,
                      rowKeys: [record.key],
                    });
                  },
                  index,
                  moveRow: sortTitle==='关闭排序'? this.moveRow : null,
                })}
                components={sortTitle==='关闭排序'? this.dragaComponents : null}
                style={{ marginTop: '20px' }}
                size="small"
                columns={this.state.columns}
                defaultExpandAllRows
                dataSource={this.state.departInfoTree}
              />
              </DndProvider>
            </Card>
            <div>
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
              >

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
                    pagination={false}
                  />
                    </Spin>
              
              </Modal>
              <Modal
                title={`区域过滤-${this.state.selectedRowKeys.UserGroup_Name}`}
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
                      onExpand={this.onExpand}
                      onCheck={this.onCheck}
                      checkedKeys={this.state.checkedKey}
                      onSelect={this.onSelectRegion}
                      selectedKeys={this.state.selectedKey}
                      defaultExpandedKeys={['0']}
                      defaultExpandAll={false}
                    >
                      {this.renderTreeNodes(this.props.RegionInfoTree)}
                    </Tree>
                  </div>
                )}
              </Modal>

              <Modal
                title={`数据过滤-${this.state.selectedRowKeys.UserGroup_Name}`}
                visible={this.state.visibleData}
                onOk={this.handleDataOK}
                destroyOnClose={true}
                onCancel={this.handleCancel}
                width={900}
              >
                {

                  <div style={{ height: '600px', overflow: 'hidden' }}>
                    <Row style={{ background: '#fff', paddingBottom: 10, zIndex: 1 }}>
                      <SelectPollutantType
                        showType="radio"
                        defaultPollutantCode={this.state.pollutantType}
                        mode="multiple"
                        // showAll
                        onChange={this.handleSizeChange}
                      />
                      <TreeSelect
                        className={styles.placeHolderClass}
                        {...tProps}
                        treeCheckable={false}
                        allowClear
                      />
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
                    ) : this.props.EntAndPoint&&this.props.EntAndPoint.length > 0 ? (
                      <Tree
                        key="key"
                        style={{ height: '560px', overflow: 'auto' }}
                        checkable
                        onExpand={this.onExpands}
                        treeData={this.state.newEntAndPoint}
                        onCheck={this.onChecks}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelectData}
                        selectedKeys={this.state.selectedKeys}
                        defaultExpandAll
                      >
                        {this.renderDataTreeNodes(this.state.newEntAndPoint)}
                      </Tree>
                    ) : (
                      <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </div>
                }
              </Modal>

            </div>
           
          </BreadcrumbWrapper>
        }
      </Fragment>
    );
  }
}

export default Index;
