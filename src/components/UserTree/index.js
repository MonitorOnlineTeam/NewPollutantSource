import React, { Component } from 'react'
import {
  Form,
  Select,
  Input,
  Button,
  Drawer,
  Radio,
  Collapse,
  Table,
  Badge,
  Icon,
  Divider,
  Row,
  Spin,
  Empty,
  Col,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import EnterprisePointCascadeMultiSelect from '../EnterprisePointCascadeMultiSelect'
import Setting from '../../../config/defaultSettings'
import { EntIcon, GasIcon, WaterIcon, LegendIcon, PanelWaterIcon, PanelGasIcon, TreeIcon, PanelIcon, BellIcon, StationIcon, ReachIcon, SiteIcon, DustIcon, VocIcon } from '@/utils/icon';
import global from '@/global.less'
import SelectPollutantType from '@/components/SelectPollutantType'

const { Option } = Select;
const { Search } = Input;
const floats = Setting.layout


@connect(({ usertree, loading }) => ({
  UserList: usertree.UserList,
  IsLoading: loading.effects['usertree/GetUserList'],
}))
@Form.create()
class UserTree extends Component {
  constructor(props) {
    super(props);
    this.defaultKey = 0;
    this.state = {
      visible: true,
      right: floats === 'topmenu' ? 'caret-left' : 'caret-right',
      selectedKeys: [],
    }
  }


  componentDidMount() {
    const dom = document.querySelector(this.props.domId);
    if (dom) {
      floats === 'topmenu' ? dom.style.marginLeft = '400px' : dom.style.marginRight = '400px'
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'usertree/GetUserList',
      payload: {
      },
    })
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

  onChange = e => {
    this.setState({
      placement: e.target.value,
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

  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
    this.props.dispatch({
      type: 'navigationtree/updateState',
      payload: {
        overallexpkeys: expandedKeys,
      },
    })
  };


  /** table 选中行 */
  onClickRow = record => ({
      onClick: () => {
        this.setState({
          selectedKeys: [record.UserID],
        }, () => { this.returnData([record]) });
      },
    })

    /** 向外部返回当前选中行的方法 */
   returnData = record => {
     // 处理选中的数据格式
     const rtnList = [];
      rtnList.push({
         UserID: record.UserID,
         RolesID: record.RolesID,
         UserGroupID: record.UserGroupID,
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
        render: (text, record) => (record.UserSex === 1 ? < a > < PanelWaterIcon style = {
            {
              fontSize: 25,
            }
          }
          /></a > : < a > < PanelGasIcon style = {
            {
              fontSize: 25,
            }
          }
          /></a >),
      },
      {
        title: 'UserName',
        dataIndex: 'UserName',
        width: '20%',
        render: (text, record) => <span> <b style = {
          {
            fontSize: 15,
          }
        } > {
          record.UserName
        } </b></span>,
      },
      {
        title: 'UserGroupName',
        dataIndex: 'UserGroupName',
        width: '70%',
        render: (text, record) => <span > <b style = {
            {
              fontSize: 10,
            }
          } > {
            record.RolesName
          } </b><br></br > < span style = {
            {
              fontSize: 10,
            }
          } > {
            record.UserGroupName
          } </span></span >,
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
          <SelectPollutantType
            mode="multiple"
            style={{ width: '100%', marginBottom: 10 }}
            onChange={this.handleChange}
          />
          <EnterprisePointCascadeMultiSelect
            searchRegion
            onChange={this.regionChange}
            placeholder="请选择区域"
          />
          <Search
            placeholder="请输入关键字查询"
            onChange={this.onChangeSearch}
            style={{ marginTop: 10, width: '67%' }}
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
                /> : <div> {this.props.UserList.length ? <Table rowKey="tabKey" columns={Column} dataSource={this.props.UserList} showHeader={false} pagination={false}
                  style={{ marginTop: '5%', maxHeight: 730, overflow: 'auto', width: '100%', cursor: 'pointer' }}
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
