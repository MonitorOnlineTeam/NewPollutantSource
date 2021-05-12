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
} from 'antd';
import MonitorContent from '@/components/MonitorContent';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import TextArea from 'antd/lib/input/TextArea';
import difference from 'lodash/difference';
import SelectPollutantType from '@/components/SelectPollutantType';
import AlarmPushRel from '@/components/AlarmPushRel';
import NewAlarmPushRel from '@/pages/authorized/departInfo/NewAlarmPushRel'
import styles from './index.less';

const { TreeNode } = Tree;
const { SHOW_PARENT } = TreeSelect;
// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
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
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
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
@connect(({ departinfo, loading, global, common }) => ({
  GetRegionInfoByTree: loading.effects['departinfo/getregioninfobytree'],
  GetRegionByDepID: loading.effects['departinfo/getregionbydepid'],
  GetUserByDepID: loading.effects['departinfo/getuserbydepid'],
  GetAllUser: loading.effects['departinfo/getalluser'],
  GetDepartInfoByTree: loading.effects['departinfo/getdepartinfobytree'],
  DepartInfoOneLoading: loading.effects['departinfo/getdepartinfobyid'],
  CheckPointLoading: loading.effects['departinfo/getpointbydepid'],
  getentandpointLoading: loading.effects['departinfo/getentandpoint'],
  DepartInfoTree: departinfo.DepartInfoTree,
  DepartInfoOne: departinfo.DepartInfoOne,
  DepartTree: departinfo.DepartTree,
  AllUser: departinfo.AllUser,
  UserByDepID: departinfo.UserByDepID,
  RegionByDepID: departinfo.RegionByDepID,
  RegionInfoTree: departinfo.RegionInfoTree,
  EntAndPoint: departinfo.EntAndPoint,
  CheckPoint: departinfo.CheckPoint,
  ConfigInfo: global.configInfo,
  pollutantType: common.defaultPollutantCode,
  showGroupRegionFilter: departinfo.showGroupRegionFilter,
  btnloading: loading.effects['departinfo/insertdepartinfo'],
  btnloading1: loading.effects['departinfo/upddepartinfo'],
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
      pollutantType: '',
      DataTreeValue: [],
      rolesID:'',
      alarmPushData:'',
      postCheckedKeys:'',
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
          render: (text, record) => (
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
                  <Divider type="vertical" />
                </>
              )}
              {/* <Tooltip title="数据过滤">
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
              </Tooltip> */}
              {/* <Divider type="vertical" /> */}
              <Tooltip title="报警关联">
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    console.log(record.Roles_ID);
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
            </span>
          ),
        },
      ],
    };
  }

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
      type: 'departinfo/getdepartinfobytree',
      payload: {},
    });
    this.props.dispatch({
      type: 'departinfo/getGroupRegionFilter',
      payload: {},
    });
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
    this.props.dispatch({
      type: 'departinfo/getregioninfobytree',
      payload: {},
    });
    this.props.dispatch({
      type: 'departinfo/getregionbydepid',
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
    //   type: 'departinfo/getregioninfobytree',
    //   payload: {},
    // });
    // this.setState({
    //   visibleData: true,
    //   DataTreeValue: [],
    //   checkedKey: this.props.RegionByDepID,
    // });
    // this.props.dispatch({
    //   type: 'departinfo/getentandpoint',
    //   payload: {
    //     PollutantType: this.state.pollutantType,
    //     RegionCode: '',
    //   },
    // });
    // this.props.dispatch({
    //   type: 'departinfo/getpointbydepid',
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
    //   type: 'departinfo/insertpointfilterbydepid',
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
      type: 'departinfo/getpointbydepid',
      payload: {
        UserGroup_ID: keys.toString(),
        PollutantType: e.target.value,
        RegionCode: this.state.DataTreeValue.toString(),
      },
    });
    this.props.dispatch({
      type: 'departinfo/getentandpoint',
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
          <TreeNode title={item.title} key={item.key} dataRef={item}>
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

  cancelAlarmModal = () => {
    this.setState({
      visibleAlarm: false,
    });
  };

  showAlarmModal = record => {
    this.setState({
      alarmPushData:record
    },()=>{
      this.setState({
        visibleAlarm: true
      });
    })

  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { btnloading, btnloading1 } = this.props;
    const { targetKeys, disabled, showSearch } = this.state;
    console.log(this.state.checkedKey)
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
              <Button type="primary" onClick={this.showModal}>
                新增
              </Button>
              {/* <Button
                                onClick={this.showUserModal}
                                style={{ marginLeft: "10px" }}
                            >分配用户</Button>
                            <Button
                                onClick={this.showRegionModal}
                                style={{ marginLeft: "10px" }}
                            >区域过滤</Button>
                            <Button
                                onClick={this.showDataModal}
                                style={{ marginLeft: "10px" }}
                            >数据过滤</Button> */}

              <Table
                // rowKey={}
                onRow={record => ({
                  onClick: event => {
                    this.setState({
                      selectedRowKeys: record,
                      rowKeys: [record.key],
                    });
                  },
                })}
                style={{ marginTop: '20px' }}
                //rowSelection={rowRadioSelection}
                size="small"
                columns={this.state.columns}
                defaultExpandAllRows
                dataSource={this.props.DepartInfoTree}
              />
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
                          this.state.IsEdit == true ? this.props.DepartInfoOne.ParentId : '',
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
                width={900}
              >
                {this.props.GetUserByDepID ? (
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
                    style={{ width: '100%', height: '600px' }}
                  />
                )}
              </Modal>
              <Modal
                title={`区域过滤-${this.state.selectedRowKeys.UserGroup_Name}`}
                visible={this.state.visibleRegion}
                onOk={this.handleRegionOK}
                destroyOnClose="true"
                onCancel={this.handleCancel}
                width={900}
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
                title={`数据过滤-${this.state.selectedRowKeys.UserGroup_Name}`}
                visible={this.state.visibleData}
                onOk={this.handleDataOK}
                destroyOnClose={true}
                onCancel={this.handleCancel}
                width={900}
                // destroyOnClose
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
                  <div style={{ height: '600px', overflow: 'hidden' }}>
                    <Row style={{ background: '#fff', paddingBottom: 10, zIndex: 1 }}>
                      {/* <Radio.Group value={this.state.pollutantType} onChange={this.handleSizeChange}>
                                                    <Radio.Button value="1">废水</Radio.Button>
                                                    <Radio.Button value="2">废气</Radio.Button>
                                                </Radio.Group> */}
                      <SelectPollutantType
                        // style={{ marginLeft: 50, float: 'left' }}
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
                    ) : this.props.EntAndPoint.length > 0 ? (
                      <Tree
                        key="key"
                        style={{ height: '560px', overflow: 'auto' }}
                        checkable
                        // checkStrictly={false}
                        onExpand={this.onExpands}
                        treeData={this.state.newEntAndPoint}
                        // expandedKeys={this.state.expandedKey}
                        // autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onChecks}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelectData}
                        selectedKeys={this.state.selectedKeys}
                        defaultExpandAll
                        // autoExpandParent={true}
                        // defaultExpandAll
                      >
                        {this.renderDataTreeNodes(this.state.newEntAndPoint)}
                      </Tree>
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
             {this.state.visibleAlarm&&<NewAlarmPushRel type='Dept'  alarmPushData={this.state.alarmPushData} visibleAlarm={this.state.visibleAlarm} cancelAlarmModal={this.cancelAlarmModal}/>}

            </div>
            {/* </MonitorContent> */}
            
          </BreadcrumbWrapper>
        }
      </Fragment>
    );
  }
}

export default DepartIndex;
