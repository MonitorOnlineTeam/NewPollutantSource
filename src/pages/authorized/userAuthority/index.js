/*
 * @Author: 贾安波
 * @Date: 2021-05-11
 * @LastEditors: 贾安波
 * @LastEditTime:  2021-05-11
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
import { sdlMessage,downloadFile } from '@/utils/utils';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import SdlTable from '@/components/SdlTable';
import SelectPollutantType from '@/components/SelectPollutantType';

import styles from './style.less';
const { confirm } = Modal;
const { TreeNode } = Tree;
const { SHOW_PARENT } = TreeSelect;
@connect(({ loading, autoForm,newuserinfo,usertree }) => ({
  loading: newuserinfo.loading,
  autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  tableDatas:newuserinfo.tableDatas,
  depInfoList:usertree.DepartTree,
  rolesList:usertree.RolesTree,
  userPar:newuserinfo.userPar,
  RegionInfoTree: newuserinfo.RegionInfoTree,
  GetRegionInfoByTree: loading.effects['newuserinfo/getregioninfobytree'],
  CheckPointLoading: loading.effects['newuserinfo/getpointbydepid'],
  getentandpointLoading: loading.effects['newuserinfo/getentandpoint'],
  EntAndPoint: newuserinfo.EntAndPoint,
  RegionByDepID: newuserinfo.RegionByDepID,
  CheckPoint:newuserinfo.CheckPoint

}))
export default class UserAuthority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys:[],
      selectedRows:[],
      visibleData:false,
      selectedRow:[],
      DataTreeValue:[],
      leafTreeDatas: [],
      newEntAndPoint:[]
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
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>角色</span>,
        dataIndex: 'roleName',
        key: 'roleName',
        align: 'center',
        width:150,
        render: (text, record) => {
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
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
        title: <span>拼音</span>,
        dataIndex: 'nameCode',
        key: 'nameCode',
        align: 'center',
      },
      {
        title: <span>操作</span>,
        dataIndex: '',
        key: '',
        align: 'center',
        render:(text,row)=>{
          return (
            <Fragment>
               <Tooltip title="数据过滤">
                <a
                  onClick={() => {
                    this.setState(
                      {
                        selectedRow:row,
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
            {/*  <Divider type="vertical" />
             <Tooltip title="编辑">
              <a
                onClick={() => {
                  this.props.dispatch(
                    routerRedux.push(
                      '/rolesmanager/user/userinfoedit/' + row['ID'] + "?tabName=用户管理 - 编辑",
                    ),
                  );
                }}
              >
                <EditOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip> */}

            {/* <Divider type="vertical" />
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
            </Tooltip> */}
            {/* <Divider type="vertical" />
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
                <a href="#"><DeleteOutlined style={{ fontSize: 16 }} /></a>
              </Popconfirm>
            </Tooltip> */}
          </Fragment>
          );
        }
      },

    ];
  }

  componentDidMount() {
    const { match,userPar } = this.props;

    this.getDepInfoByTree()
    this.getRolesTree();
    this.getUserList(userPar);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      if (nextProps.match.params.configId !== this.props.routerConfig) {this.reloadPage(nextProps.match.params.configId);}
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
      console.log('DGIMN=', nextProps.CheckPoint);
    }

    if (this.props.EntAndPoint !== nextProps.EntAndPoint) {
      this.setState({
        newEntAndPoint: [
          {
            title: '全部',
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
      callback:()=>{
        this.queryClick();
      }
    });
  }

  showConfirm = (selectedRowKeys, selectedRows) => {
    if (selectedRowKeys.length == 0) {
      sdlMessage('请至少选中一行','error')
      return;
    }
    const { dispatch } = this.props;
    confirm({
      title: '是否确认重置密码?',
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        let str = [];
        selectedRows.map(item => str.push(item['ID']));
        dispatch({
          type: 'newuserinfo/resetpwd',
          payload: {
            User_ID: str,
          },
          callback:()=>{
            // this.setState({selectedRowKeys:[],selectedRows:[]})
          }
        });
      },
      onCancel() {
        console.log('取消');
      },
    });
  };
  queryClick=()=>{
   const {dispatch,userPar } = this.props;
   this.getUserList(userPar)
  }
  restClick=()=>{
    const {dispatch,userPar } = this.props;
    dispatch({
      type: 'newuserinfo/updateState',
      payload: {userPar:{ roleListID:'', groupListID:'', userName:'',	userAccount:''}},
  })
  }
  loginNameChange=(e)=>{

    const {dispatch,userPar } = this.props;
    dispatch({
      type: 'newuserinfo/updateState',
      payload: {userPar:{...userPar,userAccount:e.target.value}},
   })
  }
  realNameChange=(e)=>{
    const {dispatch,userPar } = this.props;
    dispatch({
      type: 'newuserinfo/updateState',
      payload: {userPar:{...userPar,userName:e.target.value}},
   })
  }
    /** 选中部门加载树 */
    onDepartChange = value => {
      const {dispatch,userPar } = this.props;
      dispatch({
        type: 'newuserinfo/updateState',
        payload: {userPar:{...userPar,groupListID:value&&value!=='0'?value.split():''}},
     })
    }
      /** 选中角色加载树 */
 onRolesChange = value => {
  const {dispatch,userPar } = this.props;
  dispatch({
    type: 'newuserinfo/updateState',
    payload: {userPar:{...userPar,roleListID:value&&value!=='0'?value.split():''}},
     })
 }
  //获取角色列表
  getUserList=(params)=>{
    this.props.dispatch({
      type: 'newuserinfo/getUserList',
      payload: params? params : { roleListID:'', groupListID:'', userName:'',	userAccount:''}
    });
  }
  //获取部门列表
  getDepInfoByTree =(params)=> {
    this.props.dispatch({
      type: 'usertree/getdeparttreeandobj',
      payload: params,
    });
  }
  //获取角色列表
  getRolesTree=(params)=>{
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
  addClick=()=>{

    const {dispatch } = this.props;

    dispatch(routerRedux.push('/rolesmanager/user/userinfoadd?tabName=用户管理 - 添加'));
  }
  exports = ()=>{
    const { dispatch, userPar } = this.props;
    dispatch({
      type: 'newuserinfo/exportUserList',
      payload: {...userPar},
    })
   }
   handleCancel=()=>{
     this.setState({
       visibleData:false
     })
   }
   onChecks = checkedKeys => {
    checkedKeys.map((item,index) => {
      if (this.state.leafTreeDatas.indexOf(item) != -1) {
        checkedKeys.splice(index,1)
        
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
     /** 数据过滤切换污染物 */
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
  /** 数据过滤切换行政区 */
  onChangeTree = value => {
    console.log('onChange================= ', value);
    const keys = this.state.selectedRow.ID;
    if (value == undefined) {
      this.setState({
        DataTreeValue: '',
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
    console.log('regioncode=', this.state.DataTreeValue.toString());
    console.log('DGIMN=', this.state.checkedKeys);
    console.log('selectedRowKeys=', this.state.selectedRow.ID);
    // return;
    this.props.dispatch({
      type: 'newuserinfo/insertPointFilterByUser',
      payload: {
        DGIMN: this.state.checkedKeys,
        User_ID: this.state.selectedRow.ID,
        Type: this.state.pollutantType,
        RegionCode: this.state.DataTreeValue.toString(),
        callback: res => {
          if (res.IsSuccess) {
            message.success('操作成功');
            this.handleCancel();
          } else {
            message.error(res.Message);
          }
        },
      },
    });
  };
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
      userPar:{ roleListID, groupListID, userName,userAccount},
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
    };
    return (
      <BreadcrumbWrapper title="用户管理">
          <Card>
          <Form layout="inline">
                <Form.Item label='登录名'>
                  <Input allowClear placeholder='请输入登录名' value={userAccount} onChange={this.loginNameChange}/>
                </Form.Item>
                <Form.Item label='真实姓名'>
                  <Input allowClear  value={userName}  placeholder='请输入真实姓名'   onChange={this.realNameChange}/>
                </Form.Item>
                <Form.Item label='部门'>
                <TreeSelect
                    placeholder="请选择部门"
                    allowClear
                    onChange={this.onDepartChange}
                    treeData={depInfoList}
                    value={groupListID?groupListID:undefined}
                    style={{ width: 200, marginLeft: 10 }}
                  />
                </Form.Item>
                <Form.Item label='角色'>
                  <TreeSelect
                    placeholder="请选择角色"
                    allowClear
                    treeData={rolesList}
                    onChange={this.onRolesChange}
                    value={roleListID?roleListID:undefined}
                    style={{ width: 200, marginLeft: 10 }}
                  />
                </Form.Item>
                <Form.Item>
                <Button type='primary' onClick={this.queryClick} style={{ marginLeft: 8 }}> 查询</Button>
                <Button onClick={this.restClick} style={{ marginLeft: 8 }} > 重置</Button>
                </Form.Item>
                </Form>
                <Form layout="inline"  style={{padding:'10px 0'}}>
                {/* <Form.Item>
              <Button
              style={{ marginRight: 8 }}
               icon={<PlusOutlined />}
               type="primary"
                onClick={this.addClick}>添加</Button> 
                </Form.Item>*/}
                <Form.Item>
                   <Button
                    type="danger"
                    onClick={this.showConfirm.bind(this,selectedRowKeys, selectedRows)}
                    style={{marginRight:8}}
                  >
                    重置密码
                  </Button>
                </Form.Item>

                <Form.Item>
                <Dropdown overlay={() => <Menu>

                    <Menu.Item>
                    <div  onClick={this.exports}> <ExportOutlined />导出 </div>
                  </Menu.Item>
            </Menu>}>
              <Button>
                更多操作 <DownOutlined />
              </Button>
            </Dropdown>
            <span style={{color:'#f5222d',paddingLeft:10}}>新增账户的默认密码及账户重置后的密码均是Password@123</span>
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
                        <a href="#"><Icon type="delete" style={{ fontSize: 16 }} /></a>
                      </Popconfirm>
                    </Tooltip>
                  </Fragment>
                )}
            /> */}
            <SdlTable
              rowKey={(record, index) => `complete${index}`}
              rowSelection={rowSelection}
              loading={this.props.loading}
              columns={this.columns}
              dataSource={this.props.tableDatas}
              // pagination={{
              //   showSizeChanger: true,
              //   showQuickJumper: true,
              //   //defaultPageSize:20
              // }}
            />

            <Modal
                title={`数据过滤-${this.state.selectedRow.userName}`}
                visible={this.state.visibleData}
                onOk={this.handleDataOK}
                // destroyOnClose="true"
                onCancel={()=>{this.setState({visibleData:false})}}
                width={900}
              >
                {

                  <div style={{ height: '600px', overflow: 'hidden' }}>
                    <Row style={{ background: '#fff', paddingBottom: 10, zIndex: 1 }}>

                      <SelectPollutantType
                        showType="radio"
                        defaultPollutantCode={this.state.pollutantType}
                        mode="multiple"
                        onChange={this.handleSizeChange}
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
                      <Tree
                        key="key"
                        style={{ height: '560px', overflow: 'auto' }}
                        checkable
                        onExpand={this.onExpands}
                        treeData={this.state.newEntAndPoint}
                        onCheck={this.onChecks}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelectData}
                        // selectedKeys={this.state.selectedKeys}
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
          </Card>
      </BreadcrumbWrapper>
    );
  }
}