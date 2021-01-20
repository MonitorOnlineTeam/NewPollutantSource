import React, { Component, Fragment } from 'react'
import {
  Form,
  Select,
  Input,
  Button,
  Drawer,
  Popover,
  Collapse,
  Table,
  Col,
  Icon,
  Divider,
  Row,
  Spin,
  Empty,
  Tag,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import Setting from '../../../config/defaultSettings'
import {
  ManIcon,
  WomanIcon,
} from '@/utils/icon';
import global from '@/global.less'
import SelectPollutantType from '@/components/SelectPollutantType'
import styles from './index.less'

const { Option } = Select;
const { Search } = Input;
const floats = Setting.layout


@connect(({
      usertree,
      loading,
    }) => ({
  UserList: usertree.UserList,
  IsLoading: loading.effects['usertree/GetUserList'],
  selectedKeys: usertree.selectedKeys,
  RolesTreeData: usertree.RolesTree,
  DepartTree: usertree.DepartTree,
}))
@Form.create()
class UserTree extends Component {
  constructor(props) {
    super(props);
    this.defaultKey = 0;
    this.state = {
      visible: true,
      right: floats === 'topmenu' ? 'caret-left' : 'caret-right',
      selectedKeys: this.props.selectedKeys,
      Roles: '',
      Depart: '',
      UserName: '',
    }
  }


  /** 初始化加载 */
  componentDidMount() {
    const dom = document.querySelector(this.props.domId);
    if (dom) {
      floats === 'topmenu' ? dom.style.marginLeft = '400px' : dom.style.marginRight = '400px'
    }
    this.getroles();
    this.getdepart();
    const { dispatch, RoleID } = this.props;
    dispatch({
      type: 'usertree/GetUserList',
      payload: {
        RolesID: RoleID || null,
        callback: model => {
            if (model.length > 0) {
              this.generateList();
            }
        },
      },
    })
    // this.generateList();
  }

  /** props改变 */
  componentWillReceiveProps(nextProps) {
          if (this.props.selKeys !== nextProps.selKeys) {
            this.defaultKey = 0;
            this.generateList(nextProps.selKeys)
          }
        }

  /** 加載角色 */
  getroles = () => {
    this.props.dispatch({
      type: 'usertree/getrolestreeandobj',
      payload: {
        Type: '0',
        RoleID: this.props.RoleID ? this.props.RoleID : null,
      },
    })
  }

  /** 选中角色加载树 */
  onRolesChange=value => {
    const { dispatch, RoleID } = this.props;
    this.setState({
      Roles: value,
    }, () => {
    dispatch({
        type: 'usertree/GetUserList',
        payload: {
          RolesID: this.state.Roles ? this.state.Roles : (RoleID || null),
          UserGroupID: this.state.Depart,
          UserName: this.state.UserName,
          callback: model => {
            if (model.length > 0) {
            this.generateList();
          }
          },
        },
      })
    })
  }

  /** 加载部门 */
  getdepart = () => {
    this.props.dispatch({
      type: 'usertree/getdeparttreeandobj',
      payload: {
        Type: '0',
      },
    })
  }

  /** 选中部门加载树 */
  onDepartChange = value => {
    const { dispatch, RoleID } = this.props;
    this.setState({
      Depart: value,
    }, () => {
      dispatch({
        type: 'usertree/GetUserList',
        payload: {
          RolesID: this.state.Roles ? this.state.Roles : (RoleID || null),
          UserGroupID: this.state.Depart,
          UserName: this.state.UserName,
          callback: model => {
            if (model.length > 0) {
              this.generateList();
            }
          },
        },
      })
    })
  }

  /** 文本框搜索 */
  onChangeSearch=value => {
    const { dispatch } = this.props;
    this.setState({
      UserName: value,
    }, () => {
      dispatch({
        type: 'usertree/GetUserList',
        payload: {
          RolesID: this.state.Roles,
          UserGroupID: this.state.Depart,
          UserName: this.state.UserName,
          callback: model => {
            if (model.length > 0) {
              this.generateList();
            }
          },
        },
      })
    })
  }

  /** 默认选中 */
  generateList=selKeys => {
   const { UserList } = this.props;
   const node = UserList[0];
   const { UserID } = node;
   let nowKey = [UserID];
   if (selKeys || this.props.selKeys) {
     nowKey = [selKeys || this.props.selKeys];
      this.props.dispatch({
        type: 'usertree/updateState',
        payload: {
          selectedKeys: nowKey,
        },
      })
   } else if (this.props.selectedKeys.length !== 0) {
        nowKey = this.props.selectedKeys
      }
   this.setState({
          selectedKeys: nowKey,
        })
        const rtnKey = [{ UserID: nowKey[0] }]
        this.props.onItemClick && this.props.onItemClick(rtnKey)
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };


  // 污染物筛选
  handleChange = value => {
    value = value.toString()
    if (value == '') {
      value = this.props.ConfigInfo.SystemPollutantType
    }
    this.setState({
      PollutantTypes: value,
    })
    this.defaultKey = 0;
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        PollutantTypes: value,
        RegionCode: this.state.RegionCode,
        Name: this.state.Name,
        Status: this.state.screenList,
        RunState: this.state.RunState,
      },
    })
  }

  // 搜索框改变查询数据
  onTextChange = value => {
    this.setState({
      Name: value,
    })
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        Name: value,
        PollutantTypes: this.state.PollutantTypes,
        RegionCode: this.state.RegionCode,
        Status: this.state.screenList,
        RunState: this.state.RunState,
      },
    })
  }

  // 配置抽屉及动画效果左右区分
  changeState = () => {
    const { domId } = this.props;
    this.setState({
      visible: !this.state.visible,
      right: this.state.right === 'caret-right' ? 'caret-left' : 'caret-right',
    }, () => {
      const dom = document.querySelector(domId)
      if (dom) {
        if (this.state.visible) {
          dom.style.width = 'calc(100% - 400px)'
          floats === 'topmenu' ? dom.style.marginLeft = '400px' : dom.style.marginRight = '400px'
          dom.style.transition = 'all .5s ease-in-out, box-shadow .5s ease-in-out'
        } else {
          dom.style.width = 'calc(100%)'
          floats === 'topmenu' ? dom.style.marginLeft = '0' : dom.style.marginRight = '0'
          dom.style.transition = 'all .5s ease-in-out, box-shadow .5s ease-in-out'
        }
      }
    });
  };


  /** table 选中行 */
  onClickRow = record => ({
      onClick: () => {
        this.setState({
          selectedKeys: [record.UserID],
        }, () => { this.returnData(record) });
      },
    })

    /** 向外部返回当前选中行的方法 */
   returnData = record => {
     // 处理选中的数据格式
     const rtnList = [];
      rtnList.push({
         UserID: record.UserID,
       })
       this.props.dispatch({
         type: 'usertree/updateState',
         payload: {
           selectedKeys: [record.UserID],
         },
       })
     // 向外部返回选中的数据
     this.props.onItemClick && this.props.onItemClick(rtnList);
   }

  /** 选中行的样式 */
   setRowClassName = record => (record.UserID === this.state.selectedKeys[0] ? global.clickRowStyl : '')

  render() {
    const Column = [{
        title: 'UserSex',
        dataIndex: 'UserSex',
        width: '10%',
        render: (text, record) => (record.UserSex === 1 ? <a title="男"> <ManIcon style = {
            {
              fontSize: '35px',
            }
          }
          /></a > : < a title="女"> <WomanIcon style = {
            {
              fontSize: 35,
            }
          }
          /></a >),
      },
      {
        title: 'UserName',
        dataIndex: 'UserName',
        render: (text, record) => {
          const itemlist = [];
          itemlist.push(<div style={{ fontSize: '14px', fontWeight: 'bolder' }}>
          <div style={{ float: 'left' }}>{record.UserName.length > 0 ? record.UserName.substring(0, 10) : `${record.UserName}...`}</div>
          {record.Phone && <div style={{ float: 'right', marginRight: '10px' }}><Icon type="mobile" theme="twoTone"style={{ marginRight: '5px' }} />{record.Phone}</div>}
          </div>)
          record.UserGroupName && itemlist.push(<br></br>);
            record.RolesName && itemlist.push(<br></br>);

            record.RolesName &&
            record.RolesName.split(',').map((m, index) => {
              if (index < 2) {
                itemlist.push(<Tag title={m} color="orange" styles={{ fontSize: 5 }}>{m.length > 5 ? `${m.substring(0, 5)}...` : m}</Tag>);
              }
              if (index === 2) {
                itemlist.push(<Tag title={record.RolesName} color="orange" styles={{ fontSize: 5 }}>...</Tag>);
              }
            })
          return itemlist;
        },
      },

    ]
    return (
      <div >
        <Drawer
          placement={floats === 'leftmenu' ? 'right' : 'left'}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={400}
          mask={false}
          zIndex={1}
          style={{
            marginTop: 64,
          }}
        >
         <TreeSelect
          // showSearch
          style={{ width: 300 }}
          // value={this.state.IsEdit==true?this.props.RoleInfoOne.ParentId:null}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择部门"
          allowClear
          treeDefaultExpandAll
          onChange={this.onDepartChange}
          treeData={this.props.DepartTree}
          style={{ width: '100%' }}
        >
        </TreeSelect>
        <div style={{ marginTop: '10px' }}>
          <TreeSelect
          // showSearch
          style={{ marginTop: '10px', width: 300 }}
          // value={this.state.IsEdit==true?this.props.RoleInfoOne.ParentId:null}
          dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
          placeholder="请选择角色"
          allowClear
          treeDefaultExpandAll
          onChange={this.onRolesChange}
          treeData={this.props.RolesTreeData}
          style={{ width: '100%' }}
      >
      </TreeSelect>
      </div>
          <Search
            placeholder="请输入关键字查询"
            onSearch={this.onChangeSearch}
            style={{ marginTop: 10, width: '100%' }}
          />
          <Divider />
          <div visible style={{
            position: 'absolute',
            top: '30%',
            right: floats == 'leftmenu' ? '400px' : null,
            left: floats == 'topmenu' ? '400px' : null,
            display: 'flex',
            width: '18px',
            height: '48px',
            size: '16px',
            align: 'center',
            textAlign: 'center',
            background: '#1890FF',
            borderRadius: floats === 'topmenu' ? '0 4px 4px 0' : '4px 0 0 4px',
            cursor: 'pointer',
          }} onClick={this.changeState}><a href="#"><Icon style={{ marginTop: '110%', color: '#FFFFFF', marginLeft: '15%' }} type={this.state.right} /></a></div>
              {
                this.props.IsLoading ? <Spin
                  style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  size="large"
                /> : <div className={styles.dataTable}> {this.props.UserList.length ? <Table rowKey="tabKey" columns={Column} dataSource={this.props.UserList} showHeader={false} pagination={false}
                  style={{ marginTop: '5%', maxHeight: 730, overflow: 'auto', width: '100%', cursor: 'pointer', maxHeight: 'calc(100vh - 330px)' }}
                  onRow={this.onClickRow}
                  rowKey="UserID"
                  rowClassName={this.setRowClassName}
                ></Table> : <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                  </div>
                }

        </Drawer>

      </div>


    );
  }
}
// 如果传入的domId为空则默认使用以下id
UserTree.defaultProps = {
  domId: '#contentWrapper',
}

export default UserTree
