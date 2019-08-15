import React, { Component } from 'react'
import { Form, Select, Input, Button, Drawer, Radio, Collapse, Table, Badge, Icon, Divider, Row, Tree, Empty, Col, Tooltip } from 'antd';
import { connect } from 'dva';
import EnterprisePointCascadeMultiSelect from '../../components/EnterprisePointCascadeMultiSelect'
import Setting from '../../../config/defaultSettings'
import { EntIcon, GasIcon, WaterIcon, LegendIcon, PanelWaterIcon, PanelGasIcon, TreeIcon, PanelIcon, BellIcon, StationIcon, ReachIcon, SiteIcon, DustIcon, VocIcon } from '@/utils/icon';
import Center from '@/pages/account/center';
import global from '@/global.less'
import styles from './index.less'
import SelectPollutantType from '@/components/SelectPollutantType'

const RadioGroup = Radio.Group;
const { Panel } = Collapse;
const { Option } = Select;
const { Search } = Input;
const { TreeNode } = Tree;

const x = 3;
const y = 2;
const z = 1;
const gData = [];
const children = [];
const dataList = [];
const floats = Setting.layout
const styleTrue = { border: "1px solid", borderRadius: 4, padding: 3, borderColor: "#1990fc", cursor: "pointer" }
const styleFalse = { border: "1px solid", borderRadius: 4, padding: 3, borderColor: "#fff", cursor: "pointer" }
const styleNor = { border: "1px solid", borderRadius: 4, padding: 3, borderColor: "#1990fc", cursor: "pointer", marginLeft: 5 }
const styleFor = { border: "1px solid", borderRadius: 4, padding: 3, borderColor: "#fff", cursor: "pointer", marginLeft: 5 }


@connect(({ navigationtree, loading, global }) => ({
  ConfigInfo: global.configInfo,
  EntAndPoint: navigationtree.EntAndPoint,
  PollutantType: navigationtree.PollutantType,
  EntAndPointLoading: loading.effects['navigationTree/getentandpoint'],
  PollutantTypeLoading: loading.effects['navigationTree/getPollutantTypeList'],
  overallexpkeys: navigationtree.overallexpkeys,
  overallselkeys: navigationtree.overallselkeys,
  IsTree: navigationtree.IsTree,
  BellList: navigationtree.BellList,
  noticeList: global.notices
}))
@Form.create()
class NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.defaultKey = 0;
    this.state = {
      visible: true,
      Name: "",
      PollutantTypes: "",
      Status: "",
      RegionCode: "",
      right: floats == "topmenu" ? "caret-left" : "caret-right",
      expandedKeys: this.props.overallexpkeys,
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: this.props.overallselkeys,
      searchValue: '',
      placement: 'right',
      normalState: true,
      offState: true,
      overState: true,
      exceState: true,
      screenList: [0, 1, 2, 3],
      treeVis: this.props.IsTree,
      panelVis: "none",
      panelData: [],
      panelDataList: [],
      RunState: "",
      // panelSelKey:"",
      panelColumn: [
        {
          title: 'Name',
          dataIndex: 'Pollutant',
          width: '10%',
          render: (text, record) => {
            return record.Pollutant == 1 ? <a><PanelWaterIcon style={{ fontSize: 25 }} /></a> : <a><PanelGasIcon style={{ fontSize: 25 }} /></a>
          }
        },
        {
          title: 'Age',
          dataIndex: 'pointName',
          width: '60%',
          render: (text, record) => {
            return <span><b style={{ fontSize: 15 }}>{record.pointName}</b><br></br><span style={{ fontSize: 7 }}>{record.entName}</span></span>
          }
        },
        {
          title: 'Age',
          dataIndex: 'Status',
          width: 100,
          align: "left",
          render: (text, record) => {
            return (
              <>
                {
                  record.Status != -1 ? <LegendIcon style={{ color: this.getColor(record.Status), height: 10, margin: "0 10px" }} /> : ""
                }
                {
                  !!props.noticeList.find(m => m.DGIMN === record.key) && <div className={styles.bell}><BellIcon className={styles["bell-shake-delay"]} style={{ fontSize: 10, color: "red", marginTop: 8 }} /></div>
                }
              </>
            )
            return
          }
        },
        // {
        //   title: 'Bell',
        //   dataIndex: 'key',
        //   width: '10%',
        //   render: (text, record) => {
        //     return !!props.noticeList.find(m => m.DGIMN === record.key) && <div className={styles.bell}><BellIcon  className={styles["bell-shake-delay"]} style={{ fontSize: 10, color: "red", marginTop: 8 }} /></div>;
        //   }
        // },
      ]
    }
  }


  componentDidMount() {
    const dom = document.querySelector(this.props.domId);
    if (dom) {
      floats === "topmenu" ? dom.style.marginLeft = "400px" : dom.style.marginRight = "400px"
    }
    const { dispatch, EntAndPoint } = this.props;
    const { panelDataList, screenList } = this.state;
    var state = this.props.runState == undefined ? "" : this.props.runState
    this.setState({
      RunState: state
    })
    dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        Status: screenList,
        RunState: state
      }
    })
    panelDataList.splice(0, panelDataList.length)
    this.generateList(EntAndPoint)

    // // this.props.dispatch({
    // //   type: 'navigationtree/getPollutantTypeList',
    // //   payload: {
    // //   }

    // })

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.PollutantType !== nextProps.PollutantType) {
      nextProps.PollutantType.map(m => children.push(<Option key={m.pollutantTypeCode}>{m.pollutantTypeName}</Option>));
    }
    if (this.props.EntAndPoint !== nextProps.EntAndPoint) {
      this.state.panelDataList.splice(0, this.state.panelDataList.length)
      this.generateList(nextProps.EntAndPoint)
    }
    if (this.props.selKeys !== nextProps.selKeys) {
      this.state.panelDataList.splice(0, this.state.panelDataList.length)
      this.defaultKey = 0
      this.generateList(nextProps.EntAndPoint, nextProps.selKeys, nextProps.overAll)
    }

  }
  //处理接口返回的企业和排口数据
  generateList = (data = this.props.EntAndPoint, selKeys, overAll) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, title: node.title, IsEnt: node.IsEnt });
      if (node.IsEnt == 0) {
        var pushItem = { key, pointName: node.title, entName: node.EntName, Status: node.Status, Pollutant: node.PollutantType };
        // var ddd=panelDataList.filter(item=>item.key==key);
        // if(panelDataList.filter(item=>item.key==key).length==0)
        // {
        this.state.panelDataList.push(pushItem)
        // }
      }
      if (this.defaultKey == 0 && node.IsEnt == 0) {
        this.defaultKey = 1;
        var nowKey = [key]
        var nowExpandKey = [node.EntCode]
        if (selKeys || this.props.selKeys) {
          nowKey = [selKeys || this.props.selKeys];
          nowExpandKey = [this.getParentKey(nowKey[0], this.props.EntAndPoint)]
          if (overAll || this.props.overAll) {
            this.props.dispatch({
              type: "navigationtree/updateState",
              payload: {
                overallselkeys: nowKey,
                overallexpkeys: [nowExpandKey],
              }
            })//根据传入的状态判断是否更新全局
          }
        } else if (this.props.overallselkeys.length != 0) {
          nowKey = this.props.overallselkeys
          nowExpandKey = this.props.overallexpkeys
        }
        this.setState({
          selectedKeys: nowKey,
          overAll: overAll,
          expandedKeys: nowExpandKey
        })
        var rtnKey = [{ key: nowKey[0], IsEnt: false }]
        this.props.onItemClick && this.props.onItemClick(rtnKey)
      }

      if (node.children) {
        this.generateList(node.children, selKeys, overAll);
      }
    }
  };
  // generateList(this.props.EntAndPoint);
  //获取当前传入的key的父节点
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
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
  //污染物筛选
  handleChange = (value) => {
    value = value.toString()
    if (value == "") {
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
        RunState: this.state.RunState
      }
    })
  }
  //搜索框改变查询数据
  onTextChange = (value) => {
    this.setState({
      Name: value
    })
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        Name: value,
        PollutantTypes: this.state.PollutantTypes,
        RegionCode: this.state.RegionCode,
        Status: this.state.screenList,
        RunState: this.state.RunState
      }
    })
  }
  //搜索框改变查询数据
  onChangeSearch = e => {
    this.state.panelDataList.splice(0, this.state.panelDataList.length)
    this.generateList()
    // debugger
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return this.getParentKey(item.key, this.props.EntAndPoint);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    var filterList = this.state.panelDataList.filter(item => item.pointName.indexOf(value) > -1 || item.entName.indexOf(value) > -1);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
      panelDataList: filterList
    });
  };
  //配置抽屉及动画效果左右区分
  changeState = () => {
    const { domId } = this.props;
    this.setState({
      visible: !this.state.visible,
      right: this.state.right === "caret-right" ? "caret-left" : "caret-right"
    }, () => {
      const dom = document.querySelector(domId)
      if (dom) {
        if (this.state.visible) {
          dom.style.width = 'calc(100% - 400px)'
          floats === "topmenu" ? dom.style.marginLeft = '400px' : dom.style.marginRight = '400px'
          dom.style.transition = 'all .5s ease-in-out, box-shadow .5s ease-in-out'
        } else {
          dom.style.width = 'calc(100%)'
          floats === "topmenu" ? dom.style.marginLeft = '0' : dom.style.marginRight = '0'
          dom.style.transition = 'all .5s ease-in-out, box-shadow .5s ease-in-out'
        }
      }
    });
  };
  //行政区筛选
  regionChange = (value) => {
    value = value.toString()
    this.setState({
      RegionCode: value
    })
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        Name: this.state.Name,
        PollutantTypes: this.state.PollutantTypes,
        RegionCode: value,
        Status: this.state.screenList,
        RunState: this.state.RunState
      }
    })
  }
  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
    this.props.dispatch({
      type: "navigationtree/updateState",
      payload: {
        overallexpkeys: expandedKeys,
      }
    })
  };
  //复选框选中
  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
    this.returnData(checkedKeys)
  };
  //获取筛选状态图标颜色
  getColor = (status) => {
    var color = ""
    switch (status) {
      case 0://离线
        color = "#999999"
        break;
      case 1://正常
        color = "#34c066"
        break;
      case 2://超标
        color = "#f04d4d"
        break;
      case 3://异常
        color = "#e94"
        break;
    }
    return color
  }
  //筛选运行状态
  screenData = (type) => {
    var offState = this.state.offState
    var normalState = this.state.normalState
    var overState = this.state.overState
    var exceState = this.state.exceState
    switch (type) {
      case 0://离线
        offState = !offState
        break;
      case 1://正常
        normalState = !normalState
        break;
      case 2://超标
        overState = !overState
        break;
      case 3://异常
        exceState = !exceState
        break;
    }
    var typeList = this.state.screenList;
    var index = typeList.indexOf(type)
    if (index == -1) {
      typeList.push(type)
    } else {
      typeList.splice(index, 1)
    }
    this.setState({ screenList: typeList, offState, normalState, overState, exceState })
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        Name: this.state.Name,
        PollutantTypes: this.state.PollutantTypes,
        RegionCode: this.state.RegionCode,
        Status: typeList,
        RunState: this.state.RunState
      }
    })
  }
  //树节点点击事件
  onSelect = (selectedKeys, info) => {
    // // 展开关闭节点
    // var expand = this.state.expandedKeys
    // var expandIndex = expand.indexOf(selectedKeys[0])
    //单选返回单个KEY
    if (!this.props.choice) {
      // if (selectedKeys.length == 0) {
      //   expandIndex = expand.indexOf(info.node.props.dataRef.key)
      // }
      // if (expandIndex == -1) {
      //   expand = expand.concat(selectedKeys)
      // } else {
      //   expand = expand.filter((item, index) => index !== expandIndex)
      // }
      var eventKey = info.node.props.eventKey
      var event = this.state.selectedKeys
      var eventIndex = event.indexOf(eventKey)
      if (eventIndex == -1) {
        this.setState({ selectedKeys }, () => { this.returnData(selectedKeys) });//, expandedKeys: expand
      }
      else {
        this.returnData([eventKey])
      }
      return
    }
    // if (expandIndex == -1) {
    //   expand = expand.concat(selectedKeys)
    // } else {
    //   expand = expand.filter((item, index) => index !== expandIndex)
    // }
    var list = this.state.checkedKeys;
    var children = info.node.props.children ? info.node.props.children.map(m => m.key) : selectedKeys;
    children = info.node.props.children ? children.concat(selectedKeys) : selectedKeys;
    var state = info.node.props.checked;
    if (state == false)//增加
    {
      children.map(item => {
        var index = list.indexOf(item)
        if (index == -1) {
          list.push(item)
        }
      })
    } else//删除
    {
      if (info.node.props.children) {
        children.map(item => {
          var index = list.indexOf(item)
          if (index != -1)
            list.splice(index, 1);
        })
      } else {
        var parentKey = this.getParentKey(selectedKeys[0], this.props.EntAndPoint)
        children = children.concat(parentKey)
        children.map(item => {
          var index = list.indexOf(item)
          if (index != -1)
            list.splice(index, 1);
        })
      }
    }
    this.setState({ checkedKeys: list }); //, expandedKeys: expand
    this.returnData(list)
  };
  //向外部返回选中的数据并且更新到model全局使用
  returnData = (data) => {
    //处理选中的数据格式
    const rtnList = [];
    data.map(item => {
      var isEnt = dataList.filter(m => m.key == item)[0].IsEnt == 1 ? true : false
      rtnList.push({ key: item, IsEnt: isEnt })
    })
    //向外部返回选中的数据
    this.props.onItemClick && this.props.onItemClick(rtnList);
    this.props.onMapClick && this.props.onMapClick(rtnList);
    if (this.props.isMap === true && rtnList[0].IsEnt) {
    } else {
      //更新到model
      this.props.dispatch({
        type: "navigationtree/updateState",
        payload: {
          selectTreeKeys: rtnList,
          overallselkeys: this.state.selectedKeys,
          overallexpkeys: this.state.expandedKeys,
        }
      })
    }


  }
  onRadioChange = (e) => {
    if (e.target.value == "tree") {
      this.setState({
        treeVis: true,
      })
      this.props.dispatch({
        type: "navigationtree/updateState",
        payload: {
          IsTree: true
        }
      })
    } else {
      //

      this.setState({
        treeVis: false,
      })
      this.props.dispatch({
        type: "navigationtree/updateState",
        payload: {
          IsTree: false
        }
      })
    }
  }
  // 选中行
  onClickRow = (record) => {
    return {
      onClick: () => {
        this.setState({
          selectedKeys: [record.key],
        }, () => { this.returnData([record.key]) });

      },
    };
  }
  setRowClassName = (record) => {
    return record.key === this.state.selectedKeys[0] ? global.clickRowStyl : '';
  }

  getEntIcon = (type) => {
    switch (type) {
      case "1":
        return <a><EntIcon /></a>
      case "2":
        return <a><StationIcon /></a>
      case "3":
        return <a><ReachIcon /></a>
      case "4":
        return <a><SiteIcon /></a>
    }
  }
  getPollutantIcon = (type) => {
    switch (type) {
      case "1":
        return <a><WaterIcon /></a>
      case "2":
        return <a><GasIcon /></a>
      case "10":
        return <a><VocIcon /></a>
      case "12":
        return <a><DustIcon /></a>
    }
  }

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    //渲染数据及企业排口图标和运行状态
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span style={{ marginLeft: 8 }}>
              {beforeStr}
              <span style={{ color: '#FF3030' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
              <span style={{ marginLeft: 3 }}>{item.title}</span>
            );
        if (item.children) {
          return (
            <TreeNode style={{ width: "100%" }} title={
              <div style={{ width: "271px" }}>{this.getEntIcon(item.MonitorObjectType)}{title}{item.IsEnt == 0 && item.Status != -1 ? <LegendIcon style={{ color: this.getColor(item.Status), width: 10, height: 10, float: 'right', marginTop: 7 }} /> : ""}</div>
            } key={item.key} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );

        }
        return <TreeNode style={{ width: "100%" }} title={
          <div style={{ width: "253px" }}>{this.getPollutantIcon(item.PollutantType)}
            {title}{item.IsEnt == 0 && item.Status != -1 ? <LegendIcon style={{ color: this.getColor(item.Status), height: 10, float: 'right', marginTop: 7 }} /> : ""}{!!this.props.noticeList.find(m => m.DGIMN === item.key) ?
              <div className={styles.bell}>
                <BellIcon className={styles["bell-shake-delay"]} style={{ fontSize: 10, marginTop: 7, marginRight: -40, float: 'right', color: "red" }} />
              </div>
              : ""}
          </div>
        }
          key={item.key} dataRef={item}>
        </TreeNode>
      });

    return (
      <div >

        <Drawer
          // title="导航菜单"
          placement={floats == "leftmenu" ? "right" : "left"}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={400}
          mask={false}
          zIndex={1}
          style={{
            marginTop: 64
          }}
        >
          <div style={{ marginBottom: 15 }}>
            <Row style={{ textAlign: "center" }}>
              <Col span={5} style={this.state.normalState ? styleNor : styleFor} onClick={() => this.screenData(1)}><LegendIcon style={{ color: "#34c066" }} />正常</Col>
              <Col span={1}></Col>
              <Col span={5} style={this.state.offState ? styleTrue : styleFalse} onClick={() => this.screenData(0)}> <LegendIcon style={{ color: "#999999" }} />离线</Col>
              <Col span={1}></Col>
              <Col span={5} style={this.state.overState ? styleTrue : styleFalse} onClick={() => this.screenData(2)}><LegendIcon style={{ color: "#f04d4d" }} />超标</Col>
              <Col span={1}></Col>
              <Col span={5} style={this.state.exceState ? styleTrue : styleFalse} onClick={() => this.screenData(3)}><LegendIcon style={{ color: "#e94" }} />异常</Col>
            </Row>
          </div>
          {/* <Select
            mode="multiple"
            style={{ width: '100%', marginBottom: 10 }}
            placeholder="请选择污染物类型"
            // defaultValue={['a10', 'c12']}
            onChange={this.handleChange}
          >
            {children}
          </Select> */}
          <SelectPollutantType
            // style={{ marginLeft: 50, float: 'left' }}
            mode="multiple"
            style={{ width: '100%', marginBottom: 10 }}
            onChange={this.handleChange}
          />
          <EnterprisePointCascadeMultiSelect
            // searchEnterprise={true}
            searchRegion={true}
            onChange={this.regionChange}
            placeholder="请选择区域"
          />
          <Search
            placeholder="请输入关键字查询"
            onChange={this.onChangeSearch}
            // onChange={console.log("111")}
            style={{ marginTop: 10, width: '67%' }}
          />
          <Radio.Group defaultValue={this.props.IsTree ? "tree" : "panel"} buttonStyle="solid" style={{ marginTop: 10, marginLeft: 15, cursor: "pointer", width: '28%' }} onChange={this.onRadioChange}>
            <Tooltip title="节点"><Radio.Button value="tree"> <TreeIcon></TreeIcon></Radio.Button></Tooltip>
            <Tooltip title="面板"><Radio.Button value="panel"><PanelIcon></PanelIcon></Radio.Button></Tooltip>
          </Radio.Group>
          <Divider />
          {/* <Collapse defaultActiveKey={['1']} bordered={false} width="100%">
            <Panel key='1' header="搜索条件" width="100%">

            </Panel>
          </Collapse> */}
          <div visible={true} style={{
            position: "absolute",
            top: "30%",
            right: floats == "leftmenu" ? "400px" : null,
            left: floats == "topmenu" ? "400px" : null,
            display: "flex",
            width: "18px",
            height: "48px",
            size: "16px",
            align: "center",
            textAlign: "center",
            background: "#1890FF",
            borderRadius: floats == "topmenu" ? "0 4px 4px 0" : "4px 0 0 4px",
            cursor: "pointer",
          }} onClick={this.changeState}><a href="#"><Icon style={{ marginTop: '110%', color: "#FFFFFF", marginLeft: "15%" }} type={this.state.right} /></a></div>



          {this.state.treeVis ? <div >
            {
              this.props.EntAndPointLoading ? <Spin
                style={{
                  width: '100%',
                  height: 'calc(100vh/2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                size="large"
              /> : <div>{this.props.EntAndPoint.length ? <Tree
                checkable={this.props.choice}
                // onExpand={this.onExpand}
                defaultExpandAll={true}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
                style={{ marginTop: "5%", maxHeight: 'calc(100vh - 330px)', overflow: 'auto', width: "100%" }}

                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
              >
                {/* {this.renderTreeNodes(this.props.EntAndPoint)} */}
                {loop(this.props.EntAndPoint)}
                {/* {loop(gData)} */}
              </Tree> : <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                </div>
            }

          </div> : <div >
              {
                this.props.EntAndPointLoading ? <Spin
                  style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  size="large"
                /> : <div> {this.props.EntAndPoint.length ? <Table rowKey={"tabKey"} columns={this.state.panelColumn} dataSource={this.state.panelDataList} showHeader={false} pagination={false}
                  style={{ marginTop: "5%", maxHeight: 730, overflow: 'auto', width: "100%", cursor: "pointer" }}
                  onRow={this.onClickRow}
                  rowClassName={this.setRowClassName}

                ></Table> : <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                  </div>}</div>
          }

        </Drawer>

      </div>


    );
  }
}
//如果传入的domId为空则默认使用以下id
NavigationTree.defaultProps = {
  domId: "#contentWrapper"
}

export default NavigationTree

