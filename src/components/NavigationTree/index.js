/*
 * @Author: lzp
 * @Date: 2019-07-18 10:32:08
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:11:18
 * @Description: 导航树
 */
import React, { Component } from 'react'
import { Form, Select, Input, Button, Drawer, Radio, Collapse, Table, Badge, Icon, Divider, Row, Tree, Empty, Col, Tooltip, Spin } from 'antd';
import { connect } from 'dva';
import EnterprisePointCascadeMultiSelect from '../../components/EnterprisePointCascadeMultiSelect'
import Setting from '../../../config/defaultSettings'
import { EntIcon, GasIcon, WaterIcon, LegendIcon, PanelWaterIcon, PanelGasIcon, TreeIcon, PanelIcon, BellIcon, StationIcon, ReachIcon, SiteIcon, DustIcon, VocIcon, QCAIcon, IconConfig } from '@/utils/icon';
import Center from '@/pages/account/center';
import global from '@/global.less'
import config from '@/config'
import styles from './index.less'
import SelectPollutantType from '@/components/SelectPollutantType'
import CustomIcon from '@/components/CustomIcon'
import $ from 'jquery'

const RadioGroup = Radio.Group;
const { Panel } = Collapse;
const { Option } = Select;
const { Search } = Input;
const { TreeNode } = Tree;
const children = [];
const dataList = [];
let floats = Setting.layout
floats = floats === "sidemenu" ? "leftmenu" : floats;
const styleTrue = { border: "1px solid", borderRadius: 4, padding: 3, borderColor: "#1990fc", cursor: "pointer" }
const styleFalse = { border: "1px solid", borderRadius: 4, padding: 3, borderColor: "#fff", cursor: "pointer" }
const styleNor = { border: "1px solid", borderRadius: 4, padding: 3, borderColor: "#1990fc", cursor: "pointer", marginLeft: 5 }
const styleFor = { border: "1px solid", borderRadius: 4, padding: 3, borderColor: "#fff", cursor: "pointer", marginLeft: 5 }



@connect(({ navigationtree, loading, global }) => ({
  ConfigInfo: global.configInfo,
  EntAndPoint: navigationtree.EntAndPoint,
  PollutantType: navigationtree.PollutantType,
  EntAndPointLoading: loading.effects['navigationtree/getentandpoint'],
  PollutantTypeLoading: loading.effects['navigationtree/getPollutantTypeList'],
  overallexpkeys: navigationtree.overallexpkeys,
  overallselkeys: navigationtree.overallselkeys,
  IsTree: navigationtree.IsTree,
  noticeList: global.notices,
  configInfo: global.configInfo,

}))
@Form.create()
class NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.defaultKey = 0;
    this.state = {
      visible: true,
      Name: "",
      PollutantTypes: this.props.checkpPol ? this.props.checkpPol : (this.props.defaultPollutant === "undefined" ? "undefined" : ""),
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
      zState: true,
      cState: true,
      screenList: this.props.QCAUse == undefined ? [0, 1, 2, 3] : [0, 1, 3, 4, 5],
      treeVis: this.props.IsTree,
      panelVis: "none",
      QCAUse: "",
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
            return <span>{this.props.QCAUse == undefined ? this.getPollutantIcon(record.Pollutant, 25) : <a><QCAIcon style={{ fontSize: 25 }}></QCAIcon></a>}</span>

          }
        },
        {
          title: 'Age',
          dataIndex: 'pointName',
          width: '40%',
          render: (text, record) => {
            return <div className={styles.tabletitleStyle}><b title={record.pointName} style={{ fontSize: 15 }}>{record.pointName}</b><br></br><span title={record.entName} style={{ fontSize: 7 }}>{record.entName}</span></div>
          }
        },
        {
          title: 'Age',
          dataIndex: 'Status',
          width: "20%",
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
          }
        },
      ]
    }
  }


  componentDidMount() {
    const dom = document.querySelector(this.props.domId);
    const tabsCardElement = document.querySelector(".ant-tabs-card-bar");
    if (dom) {
      if (floats === "topmenu") {
        dom.style.marginLeft = "320px";
        dom.style.marginRight = 0;
      } else {
        dom.style.marginRight = "320px";
        dom.style.marginLeft = 0;
        tabsCardElement ? tabsCardElement.style.marginLeft = 0 : undefined;
        tabsCardElement ? tabsCardElement.style.marginRight = "320px" : undefined;
      }
    }
    const { dispatch, EntAndPoint } = this.props;
    const { panelDataList, screenList } = this.state;
    var state = this.props.runState == undefined ? "" : this.props.runState
    var QCAUse = this.props.QCAUse == undefined ? "" : this.props.QCAUse
    this.setState({
      RunState: state,
      QCAUse: QCAUse
    })
    console.log('qca=', QCAUse)

    dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        Status: screenList,
        QCAUse: QCAUse,
        RunState: state,
        PollutantTypes: this.state.PollutantTypes,
        isFilter: this.props.isMap
      }
    })
    // panelDataList.splice(0, panelDataList.length)
    // console.log('list1=',EntAndPoint)
    // this.generateList(EntAndPoint)
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
      this.clearData()
      this.tilingData(nextProps.EntAndPoint)
      this.generateList(nextProps.EntAndPoint)
    }
    if (this.props.selKeys !== nextProps.selKeys) {
      this.defaultKey = 0
      if (!this.state.searchValue) {
        this.clearData()
        this.tilingData(nextProps.EntAndPoint)
      }
      this.generateList(nextProps.EntAndPoint, nextProps.selKeys, nextProps.overAll)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.EntAndPointLoading !== this.props.EntAndPointLoading && this.props.EntAndPointLoading === false) {
      // let offsetTop = $(".ant-tree-treenode-selected").offset().top;
      // let height = $(".ant-tree").height();
      // console.log("offsetTop=", offsetTop)
      // console.log("height=", height)
      // if (offsetTop > height) {
      //   const scrollTop = offsetTop - height;
      //   $(".ant-tree").scrollTop(scrollTop)
      // }
      this.controlsScrollBarOffsetTop()
    }

    if (prevState.treeVis !== this.state.treeVis) {
      this.state.treeVis === true ? this.controlsScrollBarOffsetTop() : this.controlsScrollBarOffsetTop2()
    }
  }


  // 控制节点滚动条位置
  controlsScrollBarOffsetTop = () => {
    if ($(".ant-tree-treenode-selected") && $(".ant-tree-treenode-selected").length) {
      // 选中元素的scrollTop
      let selEleOffsetTop = $(".ant-tree-treenode-selected").offset().top;
      let treeScrollTop = $(".ant-tree").scrollTop();
      // 树高度
      let treeHeight = $(".ant-tree").height();
      if (selEleOffsetTop - 176 > treeHeight) {
        const scrollTop = selEleOffsetTop - treeHeight + 176;
        $(".ant-tree").scrollTop(scrollTop)
      }
    }
  }

  // 控制面板滚动条位置
  controlsScrollBarOffsetTop2 = () => {
    // 选中元素的scrollTop
    let selEleOffsetTop = $(".clickRowStyl").offset().top;
    // table容器高度
    let tableHeight = $(".ant-table-wrapper").height();
    if (selEleOffsetTop - 176 > tableHeight) {
      const scrollTop = selEleOffsetTop - tableHeight + 176;
      $(".ant-table-wrapper").scrollTop(scrollTop)
    }
  }


  //清除面板数据
  clearData = () => {
    this.state.panelDataList.splice(0, this.state.panelDataList.length)
    dataList.splice(0, dataList.length)
  }
  //面板数据
  tilingData = (data = this.props.EntAndPoint) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, title: node.title, IsEnt: node.IsEnt, Type: node.PollutantType, EntCode: node.IsEnt ? node.key : node.EntCode, QCAType: node.Type, VideoNo: node.VideoNo });
      if (node.IsEnt == 0) {
        var pushItem = { key, pointName: node.title, entName: node.EntName, Status: node.Status, Pollutant: node.PollutantType, QCAType: node.Type };
        // var ddd=panelDataList.filter(item=>item.key==key);
        // if(panelDataList.filter(item=>item.key==key).length==0)
        // {
        this.state.panelDataList.push(pushItem)
        // }
      }
      if (node.children) {
        this.tilingData(node.children);
      }
    }
  }

  //处理接口返回的企业和排口数据
  generateList = (data = this.props.EntAndPoint, selKeys, overAll) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      // dataList.push({ key, title: node.title, IsEnt: node.IsEnt, Type: node.PollutantType });
      // if (node.IsEnt == 0) {
      //   var pushItem = { key, pointName: node.title, entName: node.EntName, Status: node.Status, Pollutant: node.PollutantType };
      //   // var ddd=panelDataList.filter(item=>item.key==key);
      //   // if(panelDataList.filter(item=>item.key==key).length==0)
      //   // {
      //   this.state.panelDataList.push(pushItem)
      //   // }
      // }
      // console.log('entandpoint=', data)
      let where;
      if (this.props.QCAUse) {
        where = this.defaultKey == 0 && node.IsEnt == 0 && node.Type == "2";
      } else {
        where = this.defaultKey == 0 && node.IsEnt == 0;
      }
      if (where) {
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
          var state = !!dataList.find(m => m.key == this.props.overallselkeys[0].toString())
          if (state) {
            nowKey = this.props.overallselkeys
            nowExpandKey = this.props.overallexpkeys
          }
        }
        console.log("nowkeyss", nowKey)
        this.setState({
          selectedKeys: nowKey,
          checkedKeys: nowKey,
          overAll: overAll,
          expandedKeys: nowExpandKey
        })
        var pollutantType = dataList.find(m => m.key == nowKey[0].toString()) ? dataList.find(m => m.key == nowKey[0].toString()).Type : "";
        var rtnKey = [{ key: nowKey[0], IsEnt: false, Type: pollutantType, EntCode: node.EntCode, QCAType: node.Type, VideoNo: node.VideoNo }]
        console.log('rtnKey=', rtnKey)
        this.props.onItemClick && this.props.onItemClick(rtnKey)
        return
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
  //显示抽屉
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  //关闭抽屉
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  //污染物筛选
  handleChange = (value) => {
    value = value.toString()
    if (value == "") {
      value = this.props.ConfigInfo.SystemPollutantType
    }
    console.log("values!!!=", this.props.choice)
    console.log("values222=", this.props.checkpPol)
    this.setState({
      PollutantTypes: this.props.checkpPol ? this.props.checkpPol : value,
    })
    value = this.props.checkpPol ? this.props.checkpPol : value;
    this.defaultKey = 0;
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        PollutantTypes: value,
        RegionCode: this.state.RegionCode,
        Name: this.state.Name,
        Status: this.state.screenList,
        QCAUse: this.state.QCAUse,
        RunState: this.state.RunState,
        isFilter: this.props.isMap
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
        QCAUse: this.state.QCAUse,
        Status: this.state.screenList,
        RunState: this.state.RunState,
        isFilter: this.props.isMap
      }
    })
  }
  //搜索框改变查询数据
  onChangeSearch = e => {
    this.state.panelDataList.splice(0, this.state.panelDataList.length)
    this.tilingData()
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
    const tabsElement = document.querySelector(".ant-tabs-card-bar");
    this.setState({
      visible: !this.state.visible,
      right: this.state.right === "caret-right" ? "caret-left" : "caret-right"
    }, () => {
      const dom = document.querySelector(domId)
      if (dom) {
        const left = this.state.visible ? "320px" : "0";
        dom.style.width = this.state.visible ? 'calc(100% - 320px)' : "100%"
        if (floats === "topmenu") {
          dom.style.marginLeft = left
        } else {
          dom.style.marginRight = left
          tabsElement ? tabsElement.style.marginRight = left : undefined
        }
        // floats === "topmenu" ? dom.style.marginLeft = left : dom.style.marginRight = left
        dom.style.transition = 'all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1)';
        tabsElement ? tabsElement.style.transition = 'all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1)' : undefined
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
        QCAUse: this.state.QCAUse,
        Status: this.state.screenList,
        RunState: this.state.RunState,
        isFilter: this.props.isMap

      }
    })
  }
  //展开节点
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
    console.log("checked", checkedKeys)
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
      case 4://质控中
        color = "#1E90FF"
        break;
      case 5://吹扫中
        color = "#FFC1C1"
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
    var zState = this.state.zState
    var cState = this.state.cState
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
      case 4://质控中
        zState = !zState
        break;
      case 5://吹扫中
        cState = !cState
        break;
    }
    var typeList = this.state.screenList;
    var index = typeList.indexOf(type)
    if (index == -1) {
      typeList.push(type)
    } else {
      typeList.splice(index, 1)
    }
    this.setState({ screenList: typeList, offState, normalState, overState, exceState, zState, cState })
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        Name: this.state.Name,
        PollutantTypes: this.state.PollutantTypes,
        RegionCode: this.state.RegionCode,
        Status: typeList,
        QCAUse: this.state.QCAUse,
        RunState: this.state.RunState,
        isFilter: this.props.isMap
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
    console.log('dataaaa', data)
    data.map(item => {
      var list = dataList.filter(m => m.key == item)
      if (list) {
        var isEnt = list[0].IsEnt == 1 ? true : false
        var type = list[0].Type
        rtnList.push({ key: item, IsEnt: isEnt, Type: type, EntCode: list[0].EntCode, QCAType: list[0].QCAType, VideoNo: list[0].VideoNo })
      }
    })
    //向外部返回选中的数据
    console.log('rtnlist=', rtnList)
    this.props.onItemClick && this.props.onItemClick(rtnList);
    this.props.onMapClick && this.props.onMapClick(rtnList);
    if (rtnList.length == 0) {
      //更新到model
      this.props.dispatch({
        type: "navigationtree/updateState",
        payload: {
          selectTreeKeys: rtnList,
          overallselkeys: this.state.selectedKeys,
          overallexpkeys: this.state.expandedKeys,
        }
      })
    } else {
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
  //根据企业类型获取icon
  getEntIcon = (type) => {
    switch (type) {
      case "1":
        return <a><EntIcon style={{ fontSize: 16 }} /></a>
      case "2":
        return <a><CustomIcon type='icon-kongqizhandian' style={{ fontSize: 20 }} /></a>
      case "3":
        return <a><CustomIcon type='icon-heliu' style={{ fontSize: 16 }} /></a>
      case "4":
        return <a><CustomIcon type='icon-tadiaobj' style={{ fontSize: 16 }} /></a>
    }
  }
  //根绝污染物类型获取icon
  getPollutantIcon = (type, size) => {
    switch (type) {
      case "1":
        return <a><WaterIcon style={{ fontSize: size }} /></a>
      case "2":
        return <a><GasIcon style={{ fontSize: size }} /></a>
      case "10":
        return <a><VocIcon style={{ fontSize: size }} /></a>
      case "12":
        return <a><CustomIcon type='icon-yangchen1' style={{ fontSize: size }} /></a>
      case "5":
        return <a><CustomIcon type='icon-fangwu' style={{ fontSize: size }} /></a>
      case "37":
        return <a><CustomIcon type='icon-dian2' style={{ fontSize: size }} /></a>
    }
  }

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const { configInfo } = this.props;
    //渲染数据及企业排口图标和运行状态
    const loop = data =>
      data.map((item, idx) => {
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
        if (item.Type == "0") {
          return (
            <TreeNode style={{ width: "100%" }} data-index={idx} title={
              <div style={{}}><div title={item.title} className={styles.titleStyle}>{this.getEntIcon(item.MonitorObjectType)}{title}</div>{item.IsEnt == 0 && item.Status != -1 ? <LegendIcon style={{ color: this.getColor(item.Status), width: 10, height: 10, float: 'right', marginTop: 7, marginRight: 10, position: "absolute", right: 10 }} /> : ""}</div>
            } key={item.key} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );

        } else if (item.Type == "1") {
          return <TreeNode style={{ width: "100%" }} title={
            <div style={{ width: "253px", position: "relative" }}>
              <div className={styles.titleStyle} title={item.title}>{this.getPollutantIcon(item.PollutantType, 16)}{title}</div>{item.IsEnt == 0 && item.Status != -1 ? <LegendIcon style={{ color: this.getColor(item.Status), height: 10, float: 'right', marginTop: 7, marginRight: 10, position: "absolute", right: 10 }} /> : ""}{!!this.props.noticeList.find(m => m.DGIMN === item.key) ?
                <div className={styles.bell}>
                  <BellIcon className={styles["bell-shake-delay"]} style={{ fontSize: 10, marginTop: 7, marginRight: -40, float: 'right', color: "red" }} />
                </div>
                : ""}
            </div>
          } key={item.key} dataRef={item}>
            {item.children == null ? "" : loop(item.children)}
          </TreeNode>
        } else {
          return <TreeNode style={{ width: "100%" }} title={
            <div style={{ width: "235px" }}>
              <div className={styles.titleStyle} title={item.title}><a><QCAIcon style={{ fontSize: 16 }}></QCAIcon></a>{title}</div><LegendIcon style={{ color: this.getColor(item.Status), marginLeft: -15 }} />

            </div>
          } key={item.key} dataRef={item}>
          </TreeNode>
        }


      });
    const SelectPollutantProps = this.props.defaultPollutant === "undefined" ? {} : { mode: "multiple" }
    return (
      <div >

        <Drawer
          // title="导航菜单"
          placement={floats == "leftmenu" ? "right" : "left"}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={320}
          mask={false}
          zIndex={1}
          getContainer={(Setting.layout === "sidemenu" && config.isShowTabs) ? false : 'body'}
          bodyStyle={{ padding: "18px 8px" }}
          style={{
            marginTop: 64
          }}
        >
          <div style={{ marginBottom: 15 }}>
            {this.props.QCAUse == undefined ? <Row style={{ textAlign: "center" }}>
              <Col span={5} style={this.state.normalState ? styleNor : styleFor} onClick={() => this.screenData(1)}><LegendIcon style={{ color: "#34c066" }} />正常</Col>
              <Col span={1}></Col>
              <Col span={5} style={this.state.offState ? styleTrue : styleFalse} onClick={() => this.screenData(0)}> <LegendIcon style={{ color: "#999999" }} />离线</Col>
              <Col span={1}></Col>
              <Col span={5} style={this.state.overState ? styleTrue : styleFalse} onClick={() => this.screenData(2)}><LegendIcon style={{ color: "#f04d4d" }} />超标</Col>
              <Col span={1}></Col>
              <Col span={5} style={this.state.exceState ? styleTrue : styleFalse} onClick={() => this.screenData(3)}><LegendIcon style={{ color: "#e94" }} />异常</Col>
            </Row> :
              <Row style={{ textAlign: "center" }} type="flex" justify="space-around">
                <Col span={6} style={this.state.normalState ? styleTrue : styleFalse} onClick={() => this.screenData(1)}><LegendIcon style={{ color: "#34c066", marginRight: 2 }} />正常</Col>
                <Col span={6} style={this.state.offState ? styleTrue : styleFalse} onClick={() => this.screenData(0)}> <LegendIcon style={{ color: "#999999", marginRight: 2 }} />离线</Col>
                <Col span={6} style={this.state.exceState ? styleTrue : styleFalse} onClick={() => this.screenData(3)}><LegendIcon style={{ color: "#e94", marginRight: 2 }} />异常</Col>
              </Row>
            }
          </div>

          {this.props.QCAUse == undefined && !this.props.polShow ? <SelectPollutantType
            // mode="multiple"
            {...SelectPollutantProps}
            showDefaultValue={this.props.defaultPollutant === "undefined"}
            style={{ width: '100%', marginBottom: 10 }}
            onChange={this.handleChange}
          />
            : ""}
          {/* {(this.props.QCAUse == undefined && configInfo.GroupRegionState === "1") ? <EnterprisePointCascadeMultiSelect */}
          {false ? <EnterprisePointCascadeMultiSelect
            searchRegion={true}
            onChange={this.regionChange}
            placeholder="请选择区域"
          /> : ""}
          <Search
            placeholder="请输入关键字查询"
            onChange={this.onChangeSearch}
            style={{ marginTop: 10, width: '60%' }}
          />
          <Radio.Group defaultValue={this.props.IsTree ? "tree" : "panel"} buttonStyle="solid" style={{ marginTop: 10, marginLeft: 15, cursor: "pointer", width: '35%' }} onChange={this.onRadioChange}>
            <Tooltip title="节点"><Radio.Button value="tree"> <TreeIcon></TreeIcon></Radio.Button></Tooltip>
            <Tooltip title="面板"><Radio.Button value="panel"><PanelIcon></PanelIcon></Radio.Button></Tooltip>
          </Radio.Group>
          <Divider />
          <div visible={true} style={{
            position: "absolute",
            top: "30%",
            right: floats == "leftmenu" ? "320px" : null,
            left: floats == "topmenu" ? "320px" : null,
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
                data-id="mytree"
                selectable={!this.props.choice}
                defaultExpandAll
                checkable={this.props.choice}
                defaultExpandAll={true}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
                style={this.props.QCAUse == undefined ? { marginTop: "5%", maxHeight: 'calc(100vh - 290px)', overflow: "hidden", overflowY: 'auto', width: "100%" } : { marginTop: "5%", maxHeight: 'calc(100vh - 240px)', overflow: 'auto', width: "100%" }}
                // onExpand={this.onExpand}
                // expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
              >
                {loop(this.props.EntAndPoint)}
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
                /> : <div> {this.props.EntAndPoint.length ? <Table id="treeTable" rowKey={"tabKey"} columns={this.state.panelColumn} dataSource={this.state.panelDataList} showHeader={false} pagination={false}
                  style={{ marginTop: "5%", maxHeight: 730, overflow: 'auto', cursor: "pointer", maxHeight: 'calc(100vh - 290px)', }}
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

