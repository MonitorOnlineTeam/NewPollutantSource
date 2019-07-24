import React, { Component } from 'react'
import { Form, Select, Input, Button, Drawer, Radio, Collapse, Table, Badge, Icon, Divider, Row, Tree, Empty } from 'antd';
import { connect } from 'dva';
import EnterprisePointCascadeMultiSelect from '../../components/EnterprisePointCascadeMultiSelect'
import Setting from '../../../config/defaultSettings'
import { EntIcon,GasIcon,WaterIcon } from '@/utils/icon';

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

@connect(({ navigationtree, loading }) => ({
  EntAndPoint: navigationtree.EntAndPoint,
  PollutantType: navigationtree.PollutantType,
  EntAndPointLoading: loading.effects['navigationTree/getentandpoint'],
  PollutantTypeLoading: loading.effects['navigationTree/getPollutantTypeList'],
}))
@Form.create()
class NavigationTree extends Component {
  state = {
    columns: [
      {
        title: 'Name',
        dataIndex: 'Name',
        key: 'Name',
      },
      {
        title: 'Status',
        dataIndex: 'Status',
        key: 'Status',
        width: '12%',
        render: (text, record) => {
          let sta = "success";
          let title = "正常"
          if (record.IsEnt == 1) {
            return record.Status;
          } else {
            if (record.Status == -1)//没有状态
            {
              return "";
            } else {
              if (record.Status == 0)//离线
              {
                sta = "default";
                title = "离线";
              }
              if (record.Status == 1)//正常
              {
                sta = "success";
                title = "正常";
              }
              if (record.Status == 2)//超标
              {
                sta = "error";
                title = "超标";
              }
              if (record.Status == 3)//异常
              {
                sta = "warning";
                title = "异常";
              }
              return <Badge status={sta} dot={true} showZero={true} title={title} />
            }
          }
        }

      },
    ],
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
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
      }
    })
    this.props.dispatch({
      type: 'navigationtree/getPollutantTypeList',
      payload: {
      }

    })
  }

  componentWillReceiveProps(nextProps) {
    console.log("next=", nextProps.PollutantType);
    console.log("this=", this.props.PollutantType);
    if (this.props.PollutantType !== nextProps.PollutantType) {

      nextProps.PollutantType.map(m => children.push(<Option key={m.pollutantTypeCode}>{m.pollutantTypeName}</Option>));
    }


  }
  generateList = (data = this.props.EntAndPoint) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, title: node.title });
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
        RegionCode: this.state.RegionCode
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
    this.setState({
      visible: !this.state.visible,
      right: this.state.right === "caret-right" ? "caret-left" : "caret-right"
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
        RegionCode: value
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
  GetColor = (item) => {
    if (item.Status == 0) {
      return "/gisunline.png"
    }
    if (item.Status == 1) {
      return "/gisnormal.png"
    }
    if (item.Status == 2) {
      return "/gisover.png"
    }
    if (item.Status == 3) {
      return "/gisexception.png"
    }
  }
  onSelect = (selectedKeys, info) => {
    if (!this.props.choice) {
      this.setState({ selectedKeys });
      this.returnData(selectedKeys)
      return
    }
    var list = this.state.checkedKeys;
    var children = info.node.props.children ? info.node.props.children.map(m => m.key) : selectedKeys;
    children = info.node.props.children ? children.concat(selectedKeys) : selectedKeys;

    var state = info.node.props.checked;
    debugger
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
          if(index!=-1)
          list.splice(index, 1);
        })
      } else {
        var parentKey = this.getParentKey(selectedKeys[0], this.props.EntAndPoint)
        children = children.concat(parentKey)
        children.map(item => {
          var index = list.indexOf(item)
          if(index!=-1)
          list.splice(index, 1);
        })
      }
    }
    this.setState({ checkedKeys: list });
    this.returnData(list)
  };

  returnData = (data) => {
    this.props.onItemClick(data)
    this.props.dispatch({
      type: "navigationtree/updateState",
      payload: {
        selectTreeKeys: data
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
            <span style={{marginLeft:8}}>
              {beforeStr}
              <span style={{ color: '#FF3030' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
              <span style={{marginLeft:3}}>{item.title}</span>
            );
        if (item.children) {
          return (
            <TreeNode style={{ width: "100%" }} title={
              <div style={{ width: "271px" }}>{item.IsEnt==1?<a><EntIcon /></a>:""}{title}{item.IsEnt == 0 && item.Status != -1 ? <img src={this.GetColor(item)} style={{ width: 10, height: 10, float: 'right', marginTop: 7 }} /> : ""}</div>
            } key={item.key} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );

        }
        return <TreeNode style={{ width: "100%" }} title={
          <div style={{ width: "253px" }}>{item.PollutantType==1?<a><WaterIcon /></a>:<a><GasIcon /></a>}
            {title}{item.IsEnt == 0 && item.Status != -1 ? <img src={this.GetColor(item)} style={{ width: 10, height: 10, float: 'right', marginTop: 7 }} /> : ""}
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
          style={{
            marginTop: 64
          }}
        >
          <div style={{ marginBottom: 15 }}>
            <img style={{  width: 11, height: 11 }} src="/gisnormal.png" />&nbsp;正常
          <img style={{ marginLeft: 20, width: 11, height: 11 }} src="/gisunline.png" />&nbsp;离线
          <img style={{ marginLeft: 20, width: 11, height: 11 }} src="/gisover.png" />&nbsp;超标
          <img style={{ marginLeft: 20, width: 11, height: 11 }} src="/gisexception.png" />&nbsp;异常
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

          {/* <Table  rowKey={(record,index) => record.ID} columns={this.state.columns} rowSelection={rowSelection} dataSource={this.props.EntAndPoint} size="middle" showHeader={false} pagination={false} style={{ marginTop: 20 }} 
          style={{ marginTop: "5%",maxHeight: 750, overflow: 'auto' }}
          /> */}
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

export default NavigationTree