/*
 * @Author: lzp
 * @Date: 2019-07-16 09:42:48
 * @LastEditors: outman0611
 * @LastEditTime: 2024-10-30 16:37:46
 * @Description: 角色管理
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

import {
  BellOutlined,
  DeleteOutlined,
  EditOutlined,
  MenuUnfoldOutlined,
  UserAddOutlined,
  AlertOutlined,
  DatabaseOutlined,
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
  Tooltip,
  Transfer,
  Switch,
  Tag,
  Select,
  Pagination,
  Empty,
  Space,
  Popover,
} from 'antd';
import MonitorContent from '@/components/MonitorContent';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import TextArea from 'antd/lib/input/TextArea';
import difference from 'lodash/difference';
// import AlarmPushRel from '@/components/AlarmPushRel';
import NewAlarmPushRel from '@/pages/authorized/departInfo/NewAlarmPushRel';
import { permissionButton } from '@/utils/utils';
import TreeTransferSingle from '@/components/TreeTransferSingle';
import styles from './style.less';
import { isSystem } from '@/utils/utils';

const { Search } = Input;
const { TreeNode } = TreeSelect;
// Customize Table Transfer
const TableTransfer = ({
  leftColumns,
  rightColumns,
  tableChange,
  pageNumber,
  pageSize,
  ...restProps
}) => (
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
            scroll={{ y: 'calc(100vh - 450px)' }}
            style={{ pointerEvents: listDisabled ? 'none' : null, paddingBottom: 10 }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
            pagination={{
              onChange: tableChange,
              pageNumber: pageNumber,
              pageSize: pageSize,
            }}
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
@connect(({ roleinfo, loading }) => ({
  RoleInfoTreeLoading: loading.effects['roleinfo/getroleinfobytree'],
  AllUserLoading: loading.effects['roleinfo/getalluser'],
  UserByRoleIDLoading: loading.effects['roleinfo/getuserbyroleid'],
  RoleInfoOneLoading: loading.effects['roleinfo/getroleinfobyid'],
  insertrolebyuserLoading: loading.effects['roleinfo/insertrolebyuser'] || false,
  RoleInfoTree: roleinfo.RoleInfoTree,
  RoleInfoOne: roleinfo.RoleInfoOne,
  RolesTreeData: roleinfo.RolesTree,
  AllUser: roleinfo.AllUser,
  UserByRoleID: roleinfo.UserByRoleID,
  MenuTree: roleinfo.MenuTree,
  MenuTreeLoading: loading.effects['roleinfo/getrolemenutree'],
  SelectMenu: roleinfo.SelectMenu,
  CheckMenu: roleinfo.CheckMenu,
  CheckMenuLoading: loading.effects['roleinfo/getmenubyroleid'],
  btnloading: loading.effects['roleinfo/insertroleinfo'],
  btnloading1: loading.effects['roleinfo/updroleinfo'],
  insertmenubyroleidLoading: loading.effects['roleinfo/insertmenubyroleid'],
  setRegOrAppRoleId: roleinfo.setRegOrAppRoleId,
  addSetRegOrAppRoleLoading: loading.effects['roleinfo/addSetRegOrAppRole'] || false,
  getSetRegOrAppRoleIdLoading: loading.effects['roleinfo/getSetRegOrAppRoleId'] || false,
  GetRolePushInfoLoading: loading.effects['roleinfo/GetRolePushInfo'],
  UpdPushInfoLoading: loading.effects['roleinfo/UpdPushInfo'],
}))
@Form.create()
class RoleIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleAlarm: false,
      visible: false,
      visibleUser: false,
      value: undefined,
      IsEdit: false,
      FormDatas: [],
      Tittle: '添加角色',
      selectedRowKeys: [],
      targetKeys: [],
      allKeys: [],
      disabled: false,
      showSearch: true,
      selectvalue: '0',
      visibleMenu: false,
      selectButton: [],
      buttonState: [],
      selectedRowKeysMenu: [],
      expandRows: false,
      alarmPushData: '',
      pageNumber: 1,
      pageSize: 10,
      settingRoleTitle: '',
      settingRoleVisible: false,
      settingType: 1,
      settingRolePermis: false,
      settingAppRolePermis: false,
      expandRowsLoading: false,
      alarmPushData: { AppPush: false, WeChartPush: false },
      mangerType: 1,
      settingEntAdmin: false,
      settingOperaAdmin: false,
      settingSystemAdmin: false,
      roleID:undefined,
    };
  }
  getColumns = () => {
    return [
      {
        title: '角色名称',
        dataIndex: 'Roles_Name',
        key: 'Roles_Name',
        width: 'auto',
      },
      {
        title: '角色描述',
        dataIndex: 'Roles_Remark',
        key: 'Roles_Remark',
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
        align: 'center',
        width: 260,
        render: (text, record, index) => (
          <span>
            <Tooltip title="编辑">
              <a
                href="javascript:;"
                onClick={() => {
                  // console.log(record.Roles_ID)
                  this.props.dispatch({
                    type: 'roleinfo/getroleinfobyid',
                    payload: {
                      Roles_ID: record.Roles_ID,
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
                    type: 'roleinfo/delroleinfo',
                    payload: {
                      Roles_ID: record.Roles_ID,
                      callback: res => {
                        if (res.IsSuccess) {
                          message.success('删除成功');
                          this.props.dispatch({
                            type: 'roleinfo/getroleinfobytree',
                            payload: {},
                          });
                        } else {
                          res.Message && message.error(res.Message);
                        }
                      },
                    },
                  });
                }}
                onCancel={this.cancel}
                okText="是"
                cancelText="否"
              >
                <a style={{ cursor: 'pointer' }}>
                  <DeleteOutlined style={{ fontSize: 16 }} />
                </a>
              </Popconfirm>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="分配用户">
              <a
                href="javascript:;"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  // console.log(record.Roles_ID)
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
                <UserAddOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="菜单权限">
              <a
                href="javascript:;"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  // console.log(record.Roles_ID)
                  this.setState(
                    {
                      selectedRowKeys: record,
                    },
                    () => {
                      this.showMenuModal();
                    },
                  );
                }}
              >
                <MenuUnfoldOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="报警关联">
              <a
                href="javascript:;"
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
            <Divider type="vertical" />
            <Tooltip title="预警推送设置">
              <Popover
                trigger="click"
                placement='left'
                overlayClassName={styles.alarmPushPopSty}
                title={record.Roles_Name}
                // getPopupContainer={trigger => trigger.parentNode}
                // open={this.state.alarmPushGroupId == record.Roles_ID}
                content={
                  <Table
                    bordered
                    size='middle'
                    loading={!!this.props.GetRolePushInfoLoading || !!this.props.UpdPushInfoLoading}
                    dataSource={[{ alarmType: '预警' }]}
                    columns={
                      [{
                        title: '报警类型',
                        dataIndex: 'alarmType',
                        align: 'center'
                      },
                      {
                        title: 'APP推送',
                        align: 'center',
                        render: (text) => {
                          return <Switch checkedChildren="是" unCheckedChildren="否" checked={this.state.alarmPushData?.AppPush}
                            onChange={(checked) => {
                              this.updPushInfoRequest(checked, record, 'AppPush')
                            }}
                          />
                        }
                      },
                      {

                        title: '微信推送',
                        align: 'center',
                        render: (text) => {
                          return <Switch checkedChildren="是" unCheckedChildren="否" checked={this.state.alarmPushData?.WeChartPush}
                            onChange={(checked) => {
                              this.updPushInfoRequest(checked, record, 'WeChartPush')
                            }}
                          />
                        }
                      },
                      ]
                    }
                    pagination={false}
                  />
                }
              >
                <a onClick={() => {
                  this.props.dispatch({
                    type: 'roleinfo/GetRolePushInfo',
                    payload: {
                      RoleID: record.Roles_ID,
                    },
                    callback: (res) => {
                      this.setState({
                        alarmPushData: { AppPush: res?.AppPush, WeChartPush: res?.WeChartPush }
                      })
                    }
                  });
                }}>
                  <AlertOutlined style={{ fontSize: 16 }} />
                </a>
              </Popover>
            </Tooltip>
            <Divider type="vertical" />
                <Tooltip title="设置角色访问角色权限">
                  <a
                    onClick={() => {
                      this.setState(
                        {
                          roleID: record.Roles_ID,
                        },
                        () => {
                          this.settingRole(7, `设置${record.Roles_Name}访问角色权限`)
                        },
                      );
                    }}
                  >
                    <DatabaseOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
          </span>
        ),
      },
    ]
  }
  updPushInfoRequest = (checked, record, name) => {
    this.setState({
      alarmPushData: { ...this.state.alarmPushData, [name]: checked }
    }, () => {
      setTimeout(() => {
        this.props.dispatch({
          type: 'roleinfo/UpdPushInfo',
          payload: {
            RoleID: record.Roles_ID,
            ...this.state.alarmPushData
          },
          callback: (isSuccess) => {
            if (!isSuccess) {
              this.setState({ ...this.state.alarmPushData, [name]: !checked })
            }
          }
        });
      })
    }, 300)
  }
  getMenuColumns = () => {
    return [
      {
        title: '菜单名称',
        dataIndex: 'Menu_Name',
        key: 'Menu_Name',
        width: 'auto',
      },
      {
        title: '图标',
        dataIndex: 'Menu_Img',
        key: 'Menu_Img',
        width: 'auto',
      },
      {
        title: '页面按钮',
        dataIndex: 'Menu_Button1',
        width: 'auto',
        key: 'Menu_Button1',
        render: (text, record) => {
          if (record.Menu_Button.length !== 0) {
            return (
              <span>
                {
                  record.Menu_Button.map(item => {
                    // if (this.state.buttonState.find(cc => cc.ID == item.ID) == undefined) {
                    //   this.state.buttonState.push({ ID: item.ID, State: item.State }); //将没有选中的也添加进去 之前就是这样写 导致展开保存其他按钮权限就会丢失 不懂为什么这么获取
                    // }
                    // 查找当前点击的权限按钮项
                    const findItemById = (id) => {
                      return this.state.buttonState.find(findtItem => findtItem.ID === id);
                    };
                    return (
                      <Tag
                        color={
                          findItemById(item.ID).State == '1'
                            ? '#2db7f5'
                            : '#DEDEDE'
                        }
                        key={item.ID}
                        onClick={e => {
                          // if (this.state.buttonState.length == 0) {
                          // this.state.selectButton.push(item.ID);//把菜单id和权限按钮id分开  这么写问题太多了
                          // this.state.buttonState.find(cc => cc.ID == item.ID).State = '1';
                          // } else 
                          if (findItemById(item.ID).State == '0') { //未选中
                            findItemById(item.ID).State = '1'; //改变被选中按钮的状态 改为选中 蓝色
                          } else { //之前选中了
                            findItemById(item.ID).State = '0';  //改变被选中按钮的状态 改为未选中 置灰
                          }
                          this.setState({
                            buttonState: this.state.buttonState,
                          });

                        }}
                      >
                        <a>{item.Name}</a>
                      </Tag>
                    );
                  })}
              </span>
            );
          }
        },
      },
    ];
  };

  onChanges = nextTargetKeys => {
    // if (nextTargetKeys.length == 0) {
    //     message.error("请至少保留一个角色")
    //     return
    // }
    this.props.dispatch({
      type: 'roleinfo/insertrolebyuser',
      payload: {
        User_ID: nextTargetKeys,
        Roles_ID: this.state.selectedRowKeys && this.state.selectedRowKeys.key,
      },
    });
    this.setState({ targetKeys: nextTargetKeys });
  };

  onMenuChange = value => {
    this.setState({
      selectvalue: value,
    });
    this.props.dispatch({
      type: 'roleinfo/getrolemenutree',
      payload: {
        Type: value,
        AuthorID: this.state.selectedRowKeys.key,
      },
      callback: (buttonData) => {
        this.setState({ buttonState: buttonData })
      }
    });
    // console.log(`selected ${value}`);
  };

  onSelect = (record, selected, selectedRows) => {
    // console.log('record=', record.key);
  };
  // rowSelection =()=> {

  //     onSelect: (record, selected, selectedRows) => {

  //     },
  //     onSelectAll: (selected, selectedRows, changeRows) => {
  //         console.log(selected, selectedRows, changeRows);
  //     },
  // };
  componentDidMount() {
    const buttonList = permissionButton(this.props.match.path);
    buttonList.map(item => {
      switch (item) {
        case 'SetRole':
          this.setState({ settingRolePermis: true });
          break;
        case 'SetAppRole':
          this.setState({ settingAppRolePermis: true });
          break;
        case 'setEntAdmin':
          this.setState({ settingEntAdmin: true });
          break;
        case 'setOperaAdmin':
          this.setState({ settingOperaAdmin: true });
          break;
        case 'setSystemAdmin':
          this.setState({ settingSystemAdmin: true });
          break;
      }
    });
    this.props.dispatch({
      type: 'roleinfo/getroleinfobytree',
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
      type: 'roleinfo/getrolestreeandobj',
      payload: {
        Type: '1',
      },
    });
    this.setState({
      visible: true,
      IsEdit: false,
      Tittle: '添加角色',
    });
  };

  showUserModal = () => {
    // if (this.state.selectedRowKeys.length == 0) {
    //     message.error("请选中一行")
    //     return
    // }
    // console.log(this.state.selectedRowKeys)
    const keys = this.state.selectedRowKeys.key;
    this.props.dispatch({
      type: 'roleinfo/getalluser',
      payload: {},
    });
    this.props.dispatch({
      type: 'roleinfo/getuserbyroleid',
      payload: {
        Roles_ID: keys?.toString(),
      },
    });
    // console.log("selectID=",this.props.UserByRoleID)
    // console.log("filterArr=",this.props.AllUser)
    const selectId = this.props.UserByRoleID.map(item => item.key);
    // console.log('selectId=', selectId)
    const filterArr = this.props.AllUser.filter(item => selectId.indexOf(item.key));
    // console.log('filterArr=', filterArr)
    this.setState({
      visibleUser: true,
      targetKeys: selectId,
      allKeys: filterArr,
    });
  };

  showMenuModal = () => {
    // if (this.state.selectedRowKeys.length == 0) {
    //     message.error("请选中一行")
    //     return
    // }
    const keys = this.state.selectedRowKeys.key;
    this.setState({
      visibleMenu: true,
    });
    this.props.dispatch({
      type: 'roleinfo/getparenttree',
      payload: {},
    });
    this.props.dispatch({
      type: 'roleinfo/getrolemenutree',
      payload: {
        Type: this.state.selectvalue,
        AuthorID: keys,
      },
      callback: (buttonData) => {
        this.setState({ buttonState: buttonData })
      }
    });
    this.props.dispatch({
      type: 'roleinfo/getmenubyroleid',
      payload: {
        Roles_ID: keys,
      },
    });

    // console.log("selectID=",this.props.UserByRoleID)
    // console.log("filterArr=",this.props.AllUser)
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.UserByRoleID !== nextProps.UserByRoleID) {
      const selectId = nextProps.UserByRoleID.map(item => item.key);
      // console.log('selectId=', selectId)
      const filterArr = nextProps.AllUser.filter(item => selectId.indexOf(item.key));
      // console.log('filterArr=', filterArr)
      this.setState({
        visibleUser: true,
        targetKeys: selectId,
        // allKeys: filterArr
      });
    }
    if (this.props.CheckMenu !== nextProps.CheckMenu) {
      this.setState({
        selectButton: nextProps.CheckMenu,
      });
    }
  }

  showModalEdit = () => {
    this.props.dispatch({
      type: 'roleinfo/getrolestreeandobj',
      payload: {},
    });
    this.setState({
      visible: true,
      IsEdit: true,
      Tittle: '编辑角色',
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
      visibleMenu: false,
    });
  };

  handleCancelMenu = e => {
    // this.state.selectButton.map(item=>{
    //     this.state.buttonState.find(cc=>cc.ID==item.ID).State="0"
    // })
    this.setState({
      visibleMenu: false,
      selectButton: [],
      buttonState: [],
      expandRows: false,
    });
  };

  addRight = () => {

    let buttonAuthority = this.state.buttonState.filter(item => item.State == 1); //按钮权限 选中的
    if (buttonAuthority?.[0]) {
      buttonAuthority = buttonAuthority.map(item => item.ID);
    }
    //  console.log('菜单id：', this.state.selectButton); //菜单权限列表
    //  console.log('权限按钮：',buttonAuthority); //菜单按钮权限列表
   
     let selectBtn = this.state.selectButton
     let buttonCancelAuthority = this.state.buttonState.filter(item => item.State == 0); //按钮权限 取消选中或者未选中的
     if(buttonCancelAuthority?.[0]){
      buttonCancelAuthority = buttonCancelAuthority.map(item => item.ID); //过滤编辑取消选中的按钮
      selectBtn = selectBtn.filter(item => !buttonCancelAuthority.includes(item))
      // console.log('权限取消按钮：',selectBtn)
     }
    let menuIDArr = [...selectBtn, ...buttonAuthority];
    menuIDArr = menuIDArr.filter((item, index) => menuIDArr.indexOf(item) === index); //数组去重 编辑只操作权限按钮会重复 获取的时候没处理 在这处理了 
    this.props.dispatch({
      type: 'roleinfo/insertmenubyroleid',
      payload: {
        Roles_ID: this.state.selectedRowKeys?.key,
        MenuID: menuIDArr,
        callback: res => {
          if (res.IsSuccess) {
            message.success('修改成功');
            this.handleCancelMenu();
            this.props.dispatch({
              type: 'user/fetchCurrent',
              payload: {},
            });
          } else {
            res.Message && message.error(res.Message);
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
        const type = this.state.IsEdit == true ? 'roleinfo/updroleinfo' : 'roleinfo/insertroleinfo';
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
                  type: 'roleinfo/getroleinfobytree',
                  payload: {},
                });
              }
            },
          },
        });
        // console.log('FormData=', FormData);
      }
    });
  };

  cancelAlarmModal = () => {
    this.setState({
      visibleAlarm: false,
    });
  };

  showAlarmModal = record => {
    this.setState(
      {
        alarmPushData: record,
      },
      () => {
        this.setState({
          visibleAlarm: true,
        });
      },
    );
  };
  tableChange = (pageNumber, pageSize) => {
    this.setState({ pageNumber, pageSize });
  };
  copyArrayTree(arr) {
    // 创建一个新的数组来存储复制后的元素
    const newArr = [];

    // 遍历原数组
    for (let i = 0; i < arr.length; i++) {
      // 如果当前元素是对象或数组，则递归复制
      if (typeof arr[i] === 'object' && arr[i] !== null) {
        newArr.push(copyArrayTree(arr[i]));
      } else {
        // 直接复制元素
        newArr.push(arr[i]);
      }
    }

    return newArr;
  }
  settingRole = (type, title, mangerType) => {
    this.setState({
      settingRoleVisible: true,
      settingRoleTitle: title,
      settingType: type,
      mangerType: mangerType,    
    });
    this.props.dispatch({
      type: 'roleinfo/getSetRegOrAppRoleId',
      payload: { type: type, mangerType: mangerType,roleID:this.state.roleID },
    });
  };

  settingRoleOk = (roleIdChecked, state, callback) => {
    this.props.dispatch({
      type: 'roleinfo/addSetRegOrAppRole',
      payload: { type: this.state.settingType, RoleIdList: roleIdChecked, State: state, mangerType: this.state.mangerType,roleID:this.state.roleID },
      callback: () => {
        callback();
      },
    });
  };
  findDifferentElements(array1, array2) {
    //找两个数组不同的元素
    var difference = [];

    // 找出在array1中但不在array2中的元素
    difference = difference.concat(
      array1.filter(function (value) {
        return array2.indexOf(value) === -1;
      }),
    );

    // 找出在array2中但不在array1中的元素
    difference = difference.concat(
      array2.filter(function (value) {
        return array1.indexOf(value) === -1;
      }),
    );

    return difference;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { targetKeys, disabled, showSearch } = this.state;
    const { CheckMenu, btnloading, btnloading1 } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };
    // const rowRadioSelection = {
    //     type: null,
    //     selectedRowKeys: this.state.rowKeys,
    //     onChange: (selectedRowKeys, selectedRows) => {
    //         this.setState({
    //             selectedRowKeys: selectedRows[0],
    //             rowKeys: selectedRowKeys,
    //         })
    //     },
    // }
    const rowMenuSelection = {
      selectedRowKeys: this.state.selectButton,
      // checkStrictly: false,
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        selectedRows = selectedRows.filter(
          value => value !== undefined && value !== null && value !== '',
        );
        let selectedRowsKey = selectedRows.map(item => item['Menu_ID']);
        this.setState({
          selectButton: selectedRowsKey,
        });
        // this.state.selectButton 是所有的返回来的id  包含菜单id和权限按钮id 我不懂 但我大受震撼
        // let btnState = this.findDifferentElements(this.state.selectButton, selectedRowsKey); //筛选出选中的权限按钮  因为返回来的菜单id和权限按钮id在一起   第一次操作的时候
        // if (btnState?.[0] && btnState.length > 1) {
        //   console.log(btnState, '00000')
        //   btnState = btnState.filter(item => item != record['Menu_ID']); //删除当前选中或取消的菜单节点meunId 因为筛选的btnState包含当前选中的菜单id
        //   btnState = btnState.map(item => ({ ID: item, State: '1' }));
        //   console.log(this.state.buttonState, btnState, '筛选出来的选中的权限按钮')
        //   this.setState({
        //     buttonState: [...this.state.buttonState, ...btnState],
        //   });
        // }
        // this.setState({
        //   buttonState: btnState,
        // });
      },
      onChange: (se, selectedRows) => {
        //当前版本无法获取 点击的当前行的菜单id
        // console.log(se)
        // this.setState({
        //     selectButton: se,
        // })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <Fragment>
        {
          <BreadcrumbWrapper>
            <Card bordered={false}>
              <Space>
                <Button type="primary" onClick={this.showModal}>
                  新增
                </Button>
                {this.state.settingRolePermis && (
                  <Button
                    type="primary"
                    onClick={() => this.settingRole(1, '设置行政区获取点位角色')}
                  >
                    设置行政区获取点位角色
                  </Button>
                )}
                {this.state.settingAppRolePermis && (
                  <Button
                    type="primary"
                    onClick={() => this.settingRole(2, '设置允许登录运维APP角色')}
                  >
                    设置允许登录运维APP角色
                  </Button>
                )}
                {// 超级管理员显示
                  isSystem() && (
                    <Button type="primary" onClick={() => this.settingRole(3, '设置业务专家角色')}>
                      设置业务专家角色
                    </Button>
                  )}
                {this.state.settingEntAdmin && (
                  <Button
                    type="primary"
                    onClick={() => this.settingRole(4, '设置企业管理员角色', 1)}
                  >
                    设置企业管理员角色
                  </Button>
                )}
                {this.state.settingOperaAdmin && (
                  <Button
                    type="primary"
                    onClick={() => this.settingRole(5, '设置运维单位管理员角色', 2)}
                  >
                    设置运维单位管理员角色
                  </Button>
                )}
                {this.state.settingSystemAdmin && (
                  <Button
                    type="primary"
                    onClick={() => this.settingRole(6, '设置系统管理员角色', 3)}
                  >
                    设置系统管理员角色
                  </Button>
                )}
              </Space>
              {/* <Button
                                onClick={this.showUserModal}
                                style={{ marginLeft: "10px" }}
                            >分配用户</Button>
                            <Button
                                onClick={this.showMenuModal}
                                style={{ marginLeft: "10px" }}
                            >分配权限</Button> */}
              {this.props.RoleInfoTreeLoading ? (
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
                  <Table
                    onRow={record => ({
                      onClick: event => {
                        // console.log('onClick=', record)
                        this.setState({
                          selectedRowKeys: record,
                          rowKeys: [record.key],
                        });
                      },
                    })}
                    size="small"
                    style={{ marginTop: '20px' }}
                    //rowSelection={rowRadioSelection}
                    defaultExpandAllRows
                    columns={this.getColumns()}
                    dataSource={this.props.RoleInfoTree}
                    pagination={false}
                  />
                )}
            </Card>
            <div>
              <Modal
                title={this.state.Tittle}
                visible={this.state.visible}
                onOk={this.handleSubmit}
                destroyOnClose="true"
                confirmLoading={this.state.IsEdit === true ? btnloading1 : btnloading}
                onCancel={this.handleCancel}
              >
                {this.props.RoleInfoOneLoading ? (
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
                            this.state.IsEdit == true ? this.props.RoleInfoOne.ParentId : [],
                        })(
                          <TreeSelect
                            type="ParentId"
                            // showSearch
                            style={{ width: 300 }}
                            //value={this.state.IsEdit==true?this.props.RoleInfoOne.ParentId:null}
                            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                            placeholder="请选择父节点"
                            allowClear
                            treeDefaultExpandAll
                            onChange={this.onChange}
                            treeData={this.props.RolesTreeData}
                            style={{ width: '100%' }}
                          ></TreeSelect>,
                        )}
                      </Form.Item>
                      <Form.Item label="角色名称" {...formItemLayout}>
                        {getFieldDecorator('Roles_Name', {
                          rules: [{ required: true, message: '请输入角色名称' }],
                          initialValue:
                            this.state.IsEdit == true ? this.props.RoleInfoOne.Roles_Name : '',
                        })(<Input type="Roles_Name" placeholder="请输入角色名称" />)}
                      </Form.Item>
                      <Form.Item label="角色描述" {...formItemLayout}>
                        {getFieldDecorator('Roles_Remark', {
                          initialValue:
                            this.state.IsEdit == true ? this.props.RoleInfoOne.Roles_Remark : '',
                        })(<TextArea type="Roles_Remark" placeholder="请输入角色描述" />)}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('Roles_ID', {
                          initialValue:
                            this.state.IsEdit == true ? this.props.RoleInfoOne.Roles_ID : '',
                        })(<Input type="Roles_ID" hidden />)}
                      </Form.Item>
                    </Form>
                  )}
              </Modal>
              <Modal
                title={`分配用户-${this.state.selectedRowKeys.Roles_Name}`}
                visible={this.state.visibleUser}
                destroyOnClose="true"
                onCancel={this.handleCancel}
                width={'70%'}
                footer={null}
              >
                {this.props.UserByRoleIDLoading ? (
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
                    <Spin spinning={this.props.insertrolebyuserLoading}>
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
                        style={{ width: '100%' }}
                        tableChange={this.tableChange}
                        pageNumber={this.state.pageNumber}
                        pageSize={this.state.pageSize}
                      />
                    </Spin>
                  )}
              </Modal>
              <Modal
                title={`菜单权限-${this.state.selectedRowKeys.Roles_Name}`}
                visible={this.state.visibleMenu}
                onOk={this.addRight}
                destroyOnClose="true"
                onCancel={this.handleCancelMenu}
                confirmLoading={this.props.insertmenubyroleidLoading}
                wrapClassName='spreadOverModal isFooterSty'
                mask={false}
              >
                <div style={{ width: '100%'}}>
                  {
                    <div style={{ marginBottom: 10 }}>
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="请选择系统"
                        optionFilterProp="children"
                        onChange={this.onMenuChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onSearch={this.onSearch}
                        value={this.state.selectvalue}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.props.SelectMenu.map((item, key) => (
                          <Option key={item.ID}>{item.Name}</Option>
                        ))}
                      </Select>
                      <Switch
                        style={{ marginLeft: 8 }}
                        checkedChildren="全部收起"
                        unCheckedChildren="全部展开"
                        checked={this.state.expandRows}
                        onChange={value => {
                          this.setState(
                            {
                              expandRows: value,
                            },
                            () => {
                              setTimeout(() => {
                                this.setState({ expandRowsLoading: true }, () => {
                                  this.setState({ expandRowsLoading: false });
                                });
                              }, 200);
                            },
                          );
                        }}
                      />
                    </div>
                  }
                  {this.props.MenuTreeLoading || this.state.expandRowsLoading ? (
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
                      <Table
                        // onRow={record => ({
                        //     onClick: event => {
                        //         console.log('onClick==', record)//返回的选中菜单已经按钮权限
                        //     },
                        // })}
                        size="small"
                        rowSelection={rowMenuSelection}
                        columns={this.getMenuColumns()}
                        dataSource={this.props.MenuTree}
                        defaultExpandAllRows={this.state.expandRows}
                        // scroll={{y:'auto'}}
                        pagination={false}
                      />
                    )}
                </div>
              </Modal>
              {this.state.visibleAlarm && (
                <NewAlarmPushRel
                  type="Role"
                  alarmPushData={this.state.alarmPushData}
                  visibleAlarm={this.state.visibleAlarm}
                  cancelAlarmModal={this.cancelAlarmModal}
                />
              )}
            </div>
            <Modal
              title={this.state.settingRoleTitle}
              visible={this.state.settingRoleVisible}
              destroyOnClose={true}
              onCancel={() => {
                this.setState({ settingRoleVisible: false });
              }}
              width={1100}
              footer={null}
              bodyStyle={{
                overflowY: 'auto',
                maxHeight: this.props.clientHeight - 240,
              }}
            >
              <Spin
                spinning={
                  this.props.RoleInfoTreeLoading ||
                  this.props.addSetRegOrAppRoleLoading ||
                  this.props.getSetRegOrAppRoleIdLoading
                }
              >
                {this.props.RoleInfoTree?.length > 0 &&
                  !this.props.RoleInfoTreeLoading &&
                  !this.props.getSetRegOrAppRoleIdLoading ? (
                    <TreeTransferSingle
                      key="key"
                      titles={['待设置角色', '已设置角色']}
                      treeData={this.props.RoleInfoTree}
                      fieldNames={{ title: 'Roles_Name' }}
                      checkedKeys={this.props.setRegOrAppRoleId}
                      targetKeysChange={(key, type, callback) => {
                        this.settingRoleOk(key, type == 1 ? 1 : 2, callback);
                      }}
                    />
                  ) : (
                    <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
              </Spin>
            </Modal>
          </BreadcrumbWrapper>
        }
      </Fragment>
    );
  }
}

export default RoleIndex;
