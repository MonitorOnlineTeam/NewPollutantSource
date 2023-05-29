/*
 * @Author: jab
 * @Date: 2020-12-1
 * @LastEditors: jab
 * @LastEditTime: 2020-12-1
 * @Description: 用户管理 新页面
 */
import React, { Component, Fragment } from 'react';

import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
  ProfileOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import Cookie from 'js-cookie';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Spin,
  Select,
  Modal,
  Tag,
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
  message,
  DatePicker,
  InputNumber,
  Tooltip,
  TreeSelect,
  Tree,
  Empty
} from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import AutoFormTable from '../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../AutoFormManager/SearchWrapper';
import { sdlMessage, downloadFile } from '@/utils/utils';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import SdlTable from '@/components/SdlTable';
import SelectPollutantType from '@/components/SelectPollutantType';
import TreeTransfer from '@/components/TreeTransfer'
import styles from './style.less';
const { confirm } = Modal;
const { TreeNode } = Tree;
const { SHOW_PARENT } = TreeSelect;
@connect(({ loading, autoForm, newuserinfo, usertree,global, }) => ({
  loading: newuserinfo.loading,
  autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  tableDatas: newuserinfo.tableDatas,
  depInfoList: usertree.DepartTree,
  rolesList: usertree.RolesTree,
  userPar: newuserinfo.userPar,
  RegionInfoTree: newuserinfo.RegionInfoTree,
  GetRegionInfoByTree: loading.effects['newuserinfo/getregioninfobytree'],
  CheckPointLoading: loading.effects['newuserinfo/getpointbydepid'],
  getentandpointLoading: loading.effects['newuserinfo/getentandpoint'],
  EntAndPoint: newuserinfo.EntAndPoint,
  RegionByDepID: newuserinfo.RegionByDepID,
  CheckPoint: newuserinfo.CheckPoint,
  userManagePageIndex: newuserinfo.userManagePageIndex,
  userManagePageSize: newuserinfo.userManagePageSize,
  queryPar: newuserinfo.queryPar,
  configInfo: global.configInfo,
}))
export default class UserInfoIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      visibleData: false,
      selectedRow: [],
      DataTreeValue: [],
      leafTreeDatas: [],
      newEntAndPoint: [],
      okLoading: false,
      pollutantType: 2,
    };

    this.columns = [
      {
        title: <span>登录名</span>,
        dataIndex: 'userAccount',
        key: 'userAccount',
        align: 'center',
      },
      {
        title: <span>真实姓名</span>,
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
      },
      {
        title: <span>部门</span>,
        dataIndex: 'groupName',
        key: 'groupName',
        align: 'center',
        render: (text, record) => {
          return <div style={{ textAlign: 'left', width: '100%' }}>{text}</div>
        },
      },
      {
        title: <span>角色</span>,
        dataIndex: 'roleName',
        key: 'roleName',
        align: 'center',
        width: 150,
        render: (text, record) => {
          return <div style={{ textAlign: 'left', width: '100%' }}>{text}</div>
        },
      },
      {
        title: <span>手机号</span>,
        dataIndex: 'userPhone',
        key: 'userPhone',
        align: 'center',
      },
      // {
      //   title: <span>推送类型</span>,
      //   dataIndex: 'defectCount',
      //   key: 'defectCount',
      //   align: 'center',
      // },
      // {
      //   title: <span>报警类别</span>,
      //   dataIndex: 'defectCount',
      //   key: 'defectCount',
      //   align: 'center',
      // },
      // {
      //   title: <span>报警时间</span>,
      //   dataIndex: 'defectCount',
      //   key: 'defectCount',
      //   align: 'center',
      // },
      {
        title: '业务属性',
        dataIndex: 'businessAttribute',
        key: 'businessAttribute',
        align: 'center',
      },
      {
        title: '行业属性',
        dataIndex: 'industryAttribute',
        key: 'industryAttribute',
        align: 'center',
      },
      {
        title: '拼音',
        dataIndex: 'nameCode',
        key: 'nameCode',
        align: 'center',
      },
      {
        title: '运维单位',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: <span>操作</span>,
        dataIndex: '',
        key: '',
        align: 'center',
        render: (text, row) => {
          return (
            <Fragment>
              <Tooltip title="设置点位访问权限">
                <a
                  onClick={() => {
                    this.setState(
                      {
                        selectedRow: row,
                      },
                      () => {
                        this.showDataModal();
                      },
                    );
                  }}
                >
                  <DatabaseOutlined style={{ fontSize: 16 }} />
                </a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="编辑">
                <a
                  onClick={() => {
                    this.props.dispatch({
                      type: 'newuserinfo/updateState',
                      payload: { goDetail: true, },
                    })
                    this.props.dispatch(
                      routerRedux.push(
                        '/rolesmanager/user/userinfoedit/' + row['ID'] + "?tabName=用户管理 - 编辑",
                      ),
                    );
                  }}
                >
                  <EditOutlined style={{ fontSize: 16 }} />
                </a>
              </Tooltip>

              <Divider type="vertical" />
              <Tooltip title="详情">
                <a
                  onClick={() => {
                    this.props.dispatch(
                      routerRedux.push(
                        '/rolesmanager/user/userinfoview/' + row['ID'] + "?tabName=用户管理 - 详情",
                      ),
                    );
                  }}
                >
                  <ProfileOutlined style={{ fontSize: 16 }} />
                </a>
              </Tooltip>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  title="确认要删除吗?"
                  onConfirm={() => {
                    this.confirm(row['ID']);
                  }}
                  onCancel={this.cancel}
                  okText="是"
                  cancelText="否"
                >
                  <a ><DeleteOutlined style={{ fontSize: 16 }} /></a>
                </Popconfirm>
              </Tooltip>
            </Fragment>
          );
        }
      },

    ];
  }

  componentDidMount() {
    const { match, userPar, dispatch, goDetail, depInfoList, rolesList,queryPar, } = this.props;
    if (depInfoList.length<=0) {
      this.getDepInfoByTree()
    }
    if (rolesList.length<=0) {
      this.getRolesTree()
    }
    if (goDetail) {
      this.restClick();
      this.getUserList();
    } else {
      this.getUserList(queryPar);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      if (nextProps.match.params.configId !== this.props.routerConfig) { this.reloadPage(nextProps.match.params.configId); }
    }
    if (this.props.RegionByDepID !== nextProps.RegionByDepID) {
      this.setState({
        visibleRegion: true,
        checkedKey: nextProps.RegionByDepID,
      });
    }
    if (this.props.CheckPoint !== nextProps.CheckPoint) {
      this.setState({
        visibleData: true,
        checkedKeys: nextProps.CheckPoint,
      });
    }

    if (this.props.EntAndPoint !== nextProps.EntAndPoint) {
      this.setState({
        newEntAndPoint: [
          {
            title: '全部',
            key: '0-0',
            children: nextProps.EntAndPoint,
          },
        ],
      });
    }
  }
  showDataModal = () => {

    if (this.state.selectedRow.length == 0) {
      message.error('请选中一行');
      return;
    }
    const keys = this.state.selectedRow.ID;
    this.props.dispatch({
      type: 'newuserinfo/getregioninfobytree',
      payload: {},
    });
    this.setState({
      visibleData: true,
      DataTreeValue: [],
      checkedKey: this.props.RegionByDepID,
    });
    this.props.dispatch({
      type: 'newuserinfo/getentandpoint',
      payload: {
        PollutantType: this.state.pollutantType,
        RegionCode: '',
      },
    });
    this.props.dispatch({
      type: 'newuserinfo/getpointbydepid',
      payload: {
        UserGroup_ID: keys.toString(),
        PollutantType: this.state.pollutantType,
        RegionCode: [],
      },
    });
  };
  renderDataTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        if (this.state.leafTreeDatas.indexOf(item.key) == -1 || item.key=='0-0') {
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
  reloadPage = configId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'autoForm/updateState',
      payload: {
        routerConfig: configId,
      },
    });
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId,
      },
    });
  };

  confirm(userid) {
    this.props.dispatch({
      type: 'newuserinfo/deluserandroledep',
      payload: {
        User_ID: userid,
      },
      callback: () => {
        this.queryClick();
      }
    });
  }

  showConfirm = (selectedRowKeys, selectedRows, types) => {
    if (selectedRowKeys.length == 0) {
      sdlMessage('请至少选中一行', 'error')
      return;
    }
    const { dispatch } = this.props;
    const _this = this;
    confirm({
      title: types === 'wechat' ? '是否确认重置微信注册信息' : '是否确认重置密码?',
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        let str = [];
        selectedRows.map(item => str.push(item['ID']));
        dispatch({
          type: types === 'wechat' ? 'newuserinfo/resetWechat' : 'newuserinfo/resetpwd',
          payload: {
            User_ID: str,
          },
          callback: () => {
            _this.queryClick();
            _this.setState({ selectedRowKeys: [], selectedRows: [] })
          }
        });
      },
      onCancel() {
        console.log('取消');
      },
    });
  };
  queryClick = () => {
    const { dispatch, userPar, } = this.props;
    this.getUserList(userPar, () => {
      this.props.dispatch({
        type: 'newuserinfo/updateState',
        payload: { userManagePageIndex: 1, },
      })
    })
  }
  restClick = () => {
    const { dispatch, userPar } = this.props;
    dispatch({
      type: 'newuserinfo/updateState',
      payload: { userPar: { roleListID: '', groupListID: '', userName: '', userAccount: '' },queryPar:null, },
    })
  }
  loginNameChange = (e) => {

    const { dispatch, userPar } = this.props;
    dispatch({
      type: 'newuserinfo/updateState',
      payload: { userPar: { ...userPar, userAccount: e.target.value } },
    })
  }
  realNameChange = (e) => {
    const { dispatch, userPar } = this.props;
    dispatch({
      type: 'newuserinfo/updateState',
      payload: { userPar: { ...userPar, userName: e.target.value } },
    })
  }
  /** 选中部门加载树 */
  onDepartChange = value => {
    const { dispatch, userPar } = this.props;
    dispatch({
      type: 'newuserinfo/updateState',
      payload: { userPar: { ...userPar, groupListID: value && value !== '0' ? value : '' } },
    })
  }
  /** 选中角色加载树 */
  onRolesChange = value => {
    const { dispatch, userPar } = this.props;
    dispatch({
      type: 'newuserinfo/updateState',
      payload: { userPar: { ...userPar, roleListID: value && value !== '0' ? value : '' } },
    })
  }
  //运维单位列表
  onOperationChange = e => {
    const { dispatch, userPar } = this.props;
    dispatch({
      type: 'newuserinfo/updateState',
      payload: { userPar: { ...userPar, companyName: e.target.value ? e.target.value : '' } },
    })
  }
  //获取角色列表
  getUserList = (params, callback) => {
    this.props.dispatch({
      type: 'newuserinfo/getUserList',
      payload: params ? params : { roleListID: '', groupListID: '', userName: '', userAccount: '' },
      callback: () => {
        callback && callback();
      }
    });
  }
  //获取部门列表
  getDepInfoByTree = (params) => {
    this.props.dispatch({
      type: 'usertree/getdeparttreeandobj',
      payload: params,
    });
  }
  //获取角色列表
  getRolesTree = (params) => {
    this.props.dispatch({
      type: 'usertree/getrolestreeandobj',
      payload: params,

    });
  }
  cancel(e) {
    console.log(e);
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };
  addClick = () => {

    const { dispatch } = this.props;
    this.props.dispatch({
      type: 'newuserinfo/updateState',
      payload: { goDetail: true, },
    })
    dispatch(routerRedux.push('/rolesmanager/user/userinfoadd?tabName=用户管理 - 添加'));
  }
  exports = () => {
    const { dispatch, userPar } = this.props;
    dispatch({
      type: 'newuserinfo/exportUserList',
      payload: { ...userPar },
    })
  }
  handleCancel = () => {
    this.setState({
      visibleData: false
    })
  }
  onChecks = checkedKeys => {
    console.log(this.state.leafTreeDatas)
    checkedKeys.map((item, index) => {
      if (this.state.leafTreeDatas.indexOf(item) != -1) {
        checkedKeys.splice(index, 1)
      }
    });
    this.setState({ checkedKeys });
    // const leafTree = [];
    // checkedKeys.map(item => {
    //   if (this.state.leafTreeDatas.indexOf(item) != -1) {
    //     leafTree.push(item);
    //   }
    // });
    // this.setState({ checkedKeySel: checkedKeys });
  };
  onSelectData = (selectedKey, info) => {
    this.setState({ selectedKey });
  };
  /** 设置点位访问权限切换污染物 */
  handleSizeChange = e => {
    const keys = this.state.selectedRow.ID;
    this.setState({ pollutantType: e.target.value });
    this.props.dispatch({
      type: 'newuserinfo/getpointbydepid',
      payload: {
        UserGroup_ID: keys.toString(),
        PollutantType: e.target.value,
        RegionCode: this.state.DataTreeValue.toString(),
      },
    });
    this.props.dispatch({
      type: 'newuserinfo/getentandpoint',
      payload: {
        RegionCode: this.state.DataTreeValue.toString(),
        PollutantType: e.target.value,
      },
    });
  };
  /** 设置点位访问权限切换行政区 */
  onChangeTree = value => {
    console.log('onChange================= ', value);
    const keys = this.state.selectedRow.ID;
    if (value == undefined) {
      this.setState({
        DataTreeValue: [],
      });
      this.props.dispatch({
        type: 'newuserinfo/getentandpoint',
        payload: {
          RegionCode: '',
          PollutantType: this.state.pollutantType,
        },
      });
      this.props.dispatch({
        type: 'newuserinfo/getpointbydepid',
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
        type: 'newuserinfo/getentandpoint',
        payload: {
          RegionCode: value.toString(),
          PollutantType: this.state.pollutantType,
        },
      });
      this.props.dispatch({
        type: 'newuserinfo/getpointbydepid',
        payload: {
          UserGroup_ID: keys.toString(),
          PollutantType: this.state.pollutantType,
          RegionCode: this.state.DataTreeValue.toString(),
        },
      });
    }
  };
  handleDataOK = e => {
    // console.log('regioncode=', this.state.DataTreeValue.toString());
    // console.log('DGIMN=', this.state.checkedKeys);
    // console.log('selectedRowKeys=', this.state.selectedRow.ID);
    // return;
    this.setState({ okLoading: true, })
    this.props.dispatch({
      type: 'newuserinfo/insertPointFilterByUser',
      payload: {
        Type: this.state.pollutantType,
        DGIMN: this.state.checkedKeys,
        User_ID: this.state.selectedRow.ID,
        RegionCode: this.state.DataTreeValue.toString(),
        callback: res => {
          if (res.IsSuccess) {
            message.success('操作成功');
            this.handleCancel();
          } else {
            message.error(res.Message);
          }
          setTimeout(() => {
            this.setState({ okLoading: false, })
          })
        },
      },
    });
  };

  onTableChange = (userManagePageIndex, userManagePageSize) => {
    this.props.dispatch({
      type: 'newuserinfo/updateState',
      payload: {
        userManagePageIndex,
        userManagePageSize,
      },
    })
  }
  render() {
    const {
      searchConfigItems,
      searchForm,
      tableInfo,
      match: {
        params: { configId },
      },
      dispatch,
      depInfoList,
      rolesList,
      userPar: { roleListID, groupListID, userName, userAccount },
    } = this.props;
    const searchConditions = searchConfigItems[configId] || [];
    const columns = tableInfo[configId] ? tableInfo[configId].columns : [];

    const { selectedRowKeys, selectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
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
      showSearch: true,
      filterOption: (input, option) => {
        if (option && option.props && option.props.title) {
          return option.props.title === input || option.props.title.indexOf(input) !== -1
        } else {
          return true
        }
      }
    };
    const provinceShow = this.props.configInfo&&this.props.configInfo.IsShowProjectRegion;
    return (
      <BreadcrumbWrapper title="用户管理">
        <Card>
          <Form layout="inline">
            <Form.Item label='登录名'>
              <Input allowClear placeholder='请输入登录名' value={userAccount} onChange={this.loginNameChange} />
            </Form.Item>
            <Form.Item label='真实姓名'>
              <Input allowClear value={userName} placeholder='请输入真实姓名' onChange={this.realNameChange} />
            </Form.Item>
            <Form.Item label='部门'>
              <TreeSelect
                placeholder="请选择部门"
                allowClear
                onChange={this.onDepartChange}
                treeData={depInfoList}
                value={groupListID ? groupListID : undefined}
                style={{ width: 200, marginLeft: 10 }}
                showSearch
                treeNodeFilterProp='title'
              />
            </Form.Item>
            <Form.Item label='角色'>
              <TreeSelect
                placeholder="请选择角色"
                allowClear
                treeData={rolesList}
                onChange={this.onRolesChange}
                value={roleListID ? roleListID : undefined}
                style={{ width: 200, marginLeft: 10 }}
                showSearch
                treeNodeFilterProp='title'
              />
            </Form.Item>
            {!provinceShow&&<Form.Item label='运维单位' >
              <Input onChange={this.onOperationChange} placeholder='请输入运维单位' allowClear />
            </Form.Item>}
            <Form.Item>
              <Button type='primary' onClick={this.queryClick} style={{ marginLeft: 8 }}> 查询</Button>
              <Button onClick={this.restClick} style={{ marginLeft: 8 }} > 重置</Button>
            </Form.Item>
          </Form>
          <Form layout="inline" style={{ padding: '10px 0' }}>
            <Form.Item>
              <Button
                style={{ marginRight: 8 }}
                icon={<PlusOutlined />}
                type="primary"
                onClick={this.addClick}>添加</Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="danger"
                onClick={this.showConfirm.bind(this, selectedRowKeys, selectedRows)}
                style={{ marginRight: 8 }}
              >
                重置密码
                  </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="danger"
                onClick={this.showConfirm.bind(this, selectedRowKeys, selectedRows, 'wechat')}
                style={{ marginRight: 8 }}
              >
                重置微信注册信息
                  </Button>
            </Form.Item>
            <Form.Item>
              <Dropdown overlay={() => <Menu>

                <Menu.Item>
                  <div onClick={this.exports}> <ExportOutlined />导出 </div>
                </Menu.Item>
              </Menu>}>
                <Button>
                  更多操作 <DownOutlined />
                </Button>
              </Dropdown>
              <span style={{ color: '#f5222d', paddingLeft: 10 }}>新增账户的默认密码及账户重置后的密码均是Password@123</span>
            </Form.Item>
          </Form>
          {/* <SearchWrapper
              onSubmitForm={form => this.loadReportList(form)}
              configId={configId}
            ></SearchWrapper> */}
          {/* <AutoFormTable
              style={{ marginTop: 10 }}
              configId={configId}
              onAdd={() => {
                dispatch(routerRedux.push('/rolesmanager/user/userinfoadd?tabName=用户管理 - 添加'));
              }}
              rowChange={(key, row) => {
                this.setState({
                  key,
                  row,
                });
              }}
              appendHandleButtons={(selectedRowKeys, selectedRows) => (
                  <Fragment>
                    <Button
                      type="danger"
                      onClick={() => {
                        this.showConfirm(selectedRowKeys, selectedRows);
                      }}
                      style={{marginRight:8}}
                    >
                      重置密码
                    </Button>
                  </Fragment>
                )}
              appendHandleRows={row => (
                  <Fragment>
                    <Tooltip title="编辑">
                      <a
                        onClick={() => {
                          dispatch(
                            routerRedux.push(
                              '/rolesmanager/user/userinfoedit/' + row['dbo.Base_UserInfo.User_ID'] + "?tabName=用户管理 - 编辑",
                            ),
                          );
                        }}
                      >
                        <Icon type="edit" style={{ fontSize: 16 }} />
                      </a>
                    </Tooltip>
                    <Divider type="vertical" />
                    <Tooltip title="详情">
                      <a
                        onClick={() => {
                          dispatch(
                            routerRedux.push(
                              '/rolesmanager/user/userinfoview/' + row['dbo.Base_UserInfo.User_ID'] + "?tabName=用户管理 - 详情",
                            ),
                          );
                        }}
                      >
                        <Icon type="profile" style={{ fontSize: 16 }} />
                      </a>
                    </Tooltip>
                    <Divider type="vertical" />
                    <Tooltip title="删除">
                      <Popconfirm
                        title="确认要删除吗?"
                        onConfirm={() => {
                          this.confirm(row['dbo.Base_UserInfo.User_ID']);
                        }}
                        onCancel={this.cancel}
                        okText="是"
                        cancelText="否"
                      >
                        <a ><Icon type="delete" style={{ fontSize: 16 }} /></a>
                      </Popconfirm>
                    </Tooltip>
                  </Fragment>
                )}
            /> */}
          <SdlTable
            rowKey={(record, index) => `complete${index}`}
            rowSelection={rowSelection}
            loading={this.props.loading}
            columns={provinceShow ? this.columns.filter(item=>item.title!='运维单位'&&item.title!='业务属性'&&item.title!='行业属性') : this.columns}
            dataSource={this.props.tableDatas}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              pageSize: this.props.userManagePageSize,
              current: this.props.userManagePageIndex,
              onChange: this.onTableChange,
              total: this.props.tableDatas.length,
            }}
          />

          <Modal
            title={`设置点位访问权限-${this.state.selectedRow.userName}`}
            visible={this.state.visibleData}
            onOk={this.handleDataOK}
            // destroyOnClose="true"
            onCancel={() => { this.setState({ visibleData: false }) }}
            width={'90%'}
            confirmLoading={this.state.okLoading}
          >
            {

              <div style={{ height: '600px', overflow: 'hidden' }}>
                <Row style={{ background: '#fff', paddingBottom: 10, zIndex: 1 }}>

                  <SelectPollutantType
                    showType="radio"
                    defaultPollutantCode={this.state.pollutantType}
                    mode="multiple"
                    onChange={this.handleSizeChange}
                    onlyShowEnt
                  />
                  <TreeSelect
                    className={styles.placeHolderClass}
                    {...tProps}
                    treeCheckable={false}
                    allowClear
                    placeholder='请选择行政区'
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
                  // <Tree
                  //   key="key"
                  //   style={{ overflow: 'auto' }}
                  //   checkable
                  //   onExpand={this.onExpands}
                  //   treeData={this.state.newEntAndPoint}
                  //   onCheck={this.onChecks}
                  //   checkedKeys={this.state.checkedKeys}
                  //   height={555}
                  //   defaultExpandAll
                  // >
                  //   {this.renderDataTreeNodes(this.state.newEntAndPoint)}
                  // </Tree>
                  <TreeTransfer  treeData={this.state.newEntAndPoint} checkStrictly={false} key="key" style={{ overflow: 'auto' }}   height={555} />
                ) : (
                      <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
              </div>
            }
          </Modal>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
