import React, { Component } from 'react'
import { Form, Select, Input, Button, Drawer, Radio, Collapse, Table, Badge, Icon, Divider, Row, Tree, Empty, Col } from 'antd';
import { connect } from 'dva';
import EnterprisePointCascadeMultiSelect from '../../components/EnterprisePointCascadeMultiSelect'
import Setting from '../../../config/defaultSettings'
import { EntIcon, GasIcon, WaterIcon, LegendIcon } from '@/utils/icon';
import Center from '@/pages/account/center';

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


@connect(({ navigationtree, loading }) => ({
  EntAndPoint: navigationtree.EntAndPoint,
  PollutantType: navigationtree.PollutantType,
  EntAndPointLoading: loading.effects['navigationTree/getentandpoint'],
  PollutantTypeLoading: loading.effects['navigationTree/getPollutantTypeList'],
}))
@Form.create()
class NavigationTree extends Component {
  state = {
    visible: true,
    Name: "",
    Status: "",
    RegionCode: "",
    right: floats == "topmenu" ? "caret-left" : "caret-right",
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    searchValue: '',
    placement: 'right',
    normalState: true,
    offState: true,
    overState: true,
    exceState: true,
    screenList: [0, 1, 2, 3]
  }

  componentDidMount() {
    const dom  = document.querySelector(this.props.domId);
    if(dom){
      floats === "topmenu" ? dom.style.marginLeft = "400px" : dom.style.marginRight = "400px"
    }
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        Status: this.state.screenList
      }
    })
    this.props.dispatch({
      type: 'navigationtree/getPollutantTypeList',
      payload: {
      }

    })
    this.generateList(this.props.EntAndPoint)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.PollutantType !== nextProps.PollutantType) {
      nextProps.PollutantType.map(m => children.push(<Option key={m.pollutantTypeCode}>{m.pollutantTypeName}</Option>));
    }
    if (this.props.EntAndPoint !== nextProps.EntAndPoint) {
      this.generateList(nextProps.EntAndPoint)
    }

  }
  generateList = (data = this.props.EntAndPoint) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, title: node.title, IsEnt: node.IsEnt });
      if (node.children) {
        this.generateList(node.children);
      }
    }
  };
  // generateList(this.props.EntAndPoint);

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

  handleChange = (value) => {
    console.log(`selected ${value}`);
    value = value.toString()
    this.setState({
      PollutantTypes: value,
    })
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        PollutantTypes: value,
        RegionCode: this.state.RegionCode,
        Name: this.state.Name,
        Status: this.state.screenList,
      }
    })
    console.log("list=", this.props.EntAndPoint)
  }
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
        Status: this.state.screenList
      }
    })
    console.log("list=", this.props.EntAndPoint)
  }
  onChangeSearch = e => {
    this.generateList()
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        debugger
        if (item.title.indexOf(value) > -1) {
          return this.getParentKey(item.key, this.props.EntAndPoint);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    console.log("expandkey=", expandedKeys)
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

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
          dom.style.transition = 'all .7s ease-in-out, box-shadow .7s ease-in-out'
        } else {
          dom.style.width = 'calc(100%)'
          floats === "topmenu" ? dom.style.marginLeft = '0' : dom.style.marginRight = '0' 
          dom.style.transition = 'all .7s ease-in-out, box-shadow .7s ease-in-out'
        }
      }
    });
  };
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
        Status: this.state.screenList
      }
    })
    console.log("list=", this.props.EntAndPoint)
  }
  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);

    this.setState({ checkedKeys });
    this.returnData(checkedKeys)
  };
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
    debugger
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
        Status: typeList
      }
    })
  }
  onSelect = (selectedKeys, info) => {
    // 展开关闭节点
    var expand = this.state.expandedKeys
    var expandIndex = expand.indexOf(selectedKeys[0])
    //单选返回单个KEY
    if (!this.props.choice) {
      if (selectedKeys.length == 0) {
        expandIndex = expand.indexOf(info.node.props.dataRef.key)
      }
      if (expandIndex == -1) {
        expand = expand.concat(selectedKeys)
      } else {
        expand = expand.filter((item, index) => index !== expandIndex)
      }
      this.setState({ selectedKeys, expandedKeys: expand });
      this.returnData(selectedKeys)
      return
    }
    if (expandIndex == -1) {
      expand = expand.concat(selectedKeys)
    } else {
      expand = expand.filter((item, index) => index !== expandIndex)
    }
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
    this.setState({ checkedKeys: list, expandedKeys: expand });
    this.returnData(list)
  };

  returnData = (data) => {
    const rtnList = [];
    data.map(item => {
      var isEnt = dataList.filter(m => m.key == item)[0].IsEnt == 1 ? true : false
      rtnList.push({ key: item, IsEnt: isEnt })
    })
    this.props.onItemClick && this.props.onItemClick(rtnList)
    this.props.dispatch({
      type: "navigationtree/updateState",
      payload: {
        selectTreeKeys: rtnList
      }
    })
  }
  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
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
              <div style={{ width: "271px" }}>{item.IsEnt == 1 ? <a><EntIcon /></a> : ""}{title}{item.IsEnt == 0 && item.Status != -1 ? <LegendIcon style={{ color: this.getColor(item.Status), width: 10, height: 10, float: 'right', marginTop: 7 }} /> : ""}</div>
            } key={item.key} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );

        }
        return <TreeNode style={{ width: "100%" }} title={
          <div style={{ width: "253px" }}>{item.PollutantType == 1 ? <a><WaterIcon /></a> : <a><GasIcon /></a>}
            {title}{item.IsEnt == 0 && item.Status != -1 ? <LegendIcon style={{ color: this.getColor(item.Status), height: 10, float: 'right', marginTop: 7 }} /> : ""}
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
          <Select
            mode="multiple"
            style={{ width: '100%', marginBottom: 10 }}
            placeholder="请选择污染物类型"
            // defaultValue={['a10', 'c12']}
            onChange={this.handleChange}
          >
            {children}
          </Select>
          <EnterprisePointCascadeMultiSelect
            // searchEnterprise={true}
            searchRegion={true}
            onChange={this.regionChange}
          />
          <Search
            placeholder="查询企业排口"
            onChange={this.onChangeSearch}
            // onChange={console.log("111")}
            style={{ marginTop: 10 }}
          />

          <Divider />
          {/* <Collapse defaultActiveKey={['1']} bordered={false} width="100%">
            <Panel key='1' header="搜索条件" width="100%">
             
            </Panel>
          </Collapse> */}
          <div visible={true} style={{
            position: "absolute",
            top: "40%",
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

          {this.props.EntAndPoint.length ? <Tree
            checkable={this.props.choice}
            // onExpand={this.onExpand}
            defaultExpandAll={true}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
            style={{ marginTop: "5%", maxHeight: 750, overflow: 'auto', width: "100%" }}

            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
          >
            {/* {this.renderTreeNodes(this.props.EntAndPoint)} */}
            {loop(this.props.EntAndPoint)}
            {/* {loop(gData)} */}
          </Tree> : <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}

        </Drawer>

      </div>


    );
  }
}

NavigationTree.defaultProps = {
  domId: "#contentWrapper"
}

export default NavigationTree