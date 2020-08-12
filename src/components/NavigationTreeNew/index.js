/*
 * @Author: Jiaqi 
 * @Date: 2020-08-12 17:01:17 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-08-12 17:18:29
 * @Description: 导航树
 */
import React, { PureComponent } from 'react';
import { Drawer, Button, Radio, Row, Col, Badge, Tabs, Input, Tree, Spin, Tooltip } from 'antd';
import { CarryOutOutlined, FormOutlined } from "@ant-design/icons"
import styles from './index.less';
import { connect } from "dva"
import CustomIcon from '@/components/CustomIcon'
import { EntIcon, GasIcon, WaterIcon, LegendIcon, PanelWaterIcon, PanelGasIcon, TreeIcon, PanelIcon, BellIcon, StationIcon, ReachIcon, SiteIcon, DustIcon, VocIcon, QCAIcon, IconConfig } from '@/utils/icon';
import $ from 'jquery'


const { TabPane } = Tabs;
const { Search } = Input;

@connect(({ components, loading }) => ({
  treeRegionData: components.treeRegionData,
  treeIndustryData: components.treeIndustryData,
  selectTreeItem: components.selectTreeItem,
  loading: loading.effects["components/getTreeData"]
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      placement: "left",
      tabsCurrentKey: "region",
      selectedKeys: [props.selectTreeItem.value],
      expandedKeys: [props.selectTreeItem.value],
      filterStatus: [0, 1, 2, 3],
      searchValue: undefined,
      statusList: [
        { text: "正常", checked: true, color: "#b7eb8f", value: "0", count: 10, className: "green" },
        { text: "离线", checked: true, color: "#999999", value: 1, count: 1, className: "default" },
        { text: "超标", checked: true, color: "#f04d4d", value: 2, count: 2, className: "red" },
        { text: "异常", checked: true, color: "#e94", value: 3, count: 3, className: "orange" },
        { text: "备案不符", checked: true, color: "#fa541c", value: 4, count: 4, className: "volcano" },
        { text: "监测不合格", checked: true, color: "#eb2f96", value: 5, count: 14, className: "magenta" },
      ],
    };

    this._SELF_ = {

    }
    this.callAjax = _.debounce(this.callAjax, 1000);
    // this.onKeywordSearch = _.debounce(this.onKeywordSearch, 1000)
  }

  componentDidMount() {
    const dom = document.querySelector(".ant-pro-page-header-wrap");
    if (dom) {
      dom.style.margin = '-24px -24px 0 296px';
    }
    this.getTreeData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectTreeItem !== prevProps.selectTreeItem) {
      let selectedKeys = this.props.selectTreeItem.value;
      this.setState({
        selectedKeys: [selectedKeys],
        expandedKeys: [...this.state.expandedKeys, this.props.selectTreeItem.ParentCode]
      })
      this.props.onTreeSelect && this.props.onTreeSelect(selectedKeys, this.props.selectTreeItem)
    }
    if (prevProps.loading !== this.props.loading && this.props.loading === false) {
      this.controlsScrollBarOffsetTop()
    }
  }
  // 0: "62020131jhdp02"
  // 1: "140421000"
  // 2: "140400000"
  // 3: "140000000"

  // 获取导航树数据
  getTreeData = () => {
    // 过滤选择状态
    let Status = this.state.statusList.filter(item => {
      if (item.checked) {
        return item.value
      }
    }).map(item => item.value)
    console.log('Status=', Status)
    this.props.dispatch({
      type: "components/getTreeData",
      payload: {
        Status: Status,
        SearchValue: this.state.searchValue,
      }
    })
  }



  // 状态点击
  onClickStatus = (index) => {
    let statusList = [...this.state.statusList];
    statusList[index].checked = !statusList[index].checked;
    this.setState({
      statusList: statusList
    }, () => { this.getTreeData() })
  }

  filterEnt = (data, inputValue) => {
    data.map(item => {
      if ((item.NodeType === "ent" || item.NodeType === "region") && item.title.indexOf(inputValue) <= -1) {
        item.remove();
      }
      this.filterEnt(item.children, inputValue)
    })
    return data
  }

  // 条件搜索
  onKeywordSearch = (e) => {
    e.persist();
    this.callAjax(e)
    // const { value } = e.target;
    // let tempTreeData = [...this.props.treeRegionData];
    // let data = this.filterEnt(tempTreeData, value)
    // console.log('data=', value)
  };

  callAjax = (e) => {
    this.setState({
      searchValue: e.target.value
    }, () => {
      this.getTreeData()
    })
  }

  // onTabsChange
  onTabsChange = (key) => {
    this.setState({ tabsCurrentKey: key, autoExpandParent: true })
    this.controlsScrollBarOffsetTop()
  }

  // 树选择
  onTreeSelect = (selectedKeys, e) => {
    if (e.node.NodeType === "point") {
      this.setState({ selectedKeys })
      this.props.dispatch({
        type: "components/updateState",
        payload: {
          selectTreeItem: e.node
        }
      })
      this.props.onTreeSelect && this.props.onTreeSelect(selectedKeys, e.node)
    }
  }

  // 树展开收起
  onTreeExpand = (expandedKeys) => {
    console.log('expandedKeys=', expandedKeys)
    this.setState({ expandedKeys, autoExpandParent: false })
  }

  // 渲染区域树title
  regionTreeTitleRender = (nodeData) => {
    // 行政区
    if (nodeData.NodeType === "region") {
      return <div className={styles.treeTitleBox}>
        <CustomIcon type="icon-region" className={styles.icon} style={{ fontSize: 20 }} />
        {nodeData.title}
      </div>
    }
    // 企业
    if (nodeData.NodeType === "ent") {
      return <div className={styles.treeTitleBox}>
        <EntIcon className={styles.icon} style={{ fontSize: 18 }} />
        {/* <Tooltip title={nodeData.name}> */}
        <span className={styles.text} title={nodeData.name}>{nodeData.title}</span>
        {/* </Tooltip> */}
      </div>
    }

    // 排口
    if (nodeData.NodeType === "point") {
      return <div className={styles.treeTitleBox}>
        {
          nodeData.PointType === '1' ? <WaterIcon className={styles.icon} style={{ fontSize: 18 }} /> :
            <GasIcon className={styles.icon} style={{ fontSize: 18 }} />
        }
        {/* <WaterIcon className={styles.icon} style={{ fontSize: 18 }} /> */}
        <span className={styles.text}>{nodeData.title}</span>
      </div>
    }
  }

  // 渲染行业树title
  industryTreeTitleRender = (nodeData) => {
    // 企业
    if (nodeData.NodeType === "ent") {
      return <div className={styles.treeTitleBox}>
        <EntIcon className={styles.icon} style={{ fontSize: 18 }} />
        <span title={nodeData.name} className={styles.text}>{nodeData.title}</span>
      </div>
    }
    // 排口
    if (nodeData.NodeType === "point") {
      return <div className={styles.treeTitleBox}>
        {
          nodeData.PointType === '1' ? <WaterIcon className={styles.icon} style={{ fontSize: 18 }} /> :
            <GasIcon className={styles.icon} style={{ fontSize: 18 }} />
        }
        <span className={styles.text}>{nodeData.title}</span>
      </div>
    }
    return <div className={styles.treeTitleBox}>
      <span className={styles.industryIcon}>
        <CustomIcon type={this.getIndustryIcon(nodeData.key)} style={{ color: "#fff" }} />
      </span>
      <span className={styles.text}>{nodeData.title}</span>
    </div>
  }

  // 行业icon
  getIndustryIcon = (type) => {
    switch (type) {
      case "A": return "icon-dianlihangye";
      case "B": return "icon-jichuhuagong";
      case "C": return "icon-gangtiexingye";
      case "D": return "icon-shuinixingye";
    }
  }

  // 控制节点滚动条位置
  controlsScrollBarOffsetTop = () => {
    let selectedTreeNode = $('.ant-tabs-tabpane-active .ant-tree-treenode-selected');
    let treeElement = $('.ant-tabs-tabpane-active .ant-tree .ant-tree-list');
    if (selectedTreeNode && selectedTreeNode.length) {
      // 选中元素的scrollTop
      const selEleOffsetTop = selectedTreeNode.offset().top;
      const treeScrollTop = treeElement.scrollTop();
      // 树高度
      const treeHeight = treeElement.height();
      if (selEleOffsetTop - 184 > treeHeight) {
        // const scrollTop = selEleOffsetTop - treeHeight + (treeHeight / 4.5);
        const scrollTop = (selEleOffsetTop - 184) / 2;
        treeElement.scrollTop(scrollTop)

        console.log('treeHeight=', treeHeight)
        console.log('selEleOffsetTop=', selEleOffsetTop)
        console.log('treeScrollTop=', treeScrollTop)
      }

    }
  }

  render() {
    const { visible, placement, statusList, tabsCurrentKey, selectedKeys, expandedKeys, autoExpandParent } = this.state;
    const { treeRegionData, treeIndustryData, loading, selectTreeItem } = this.props;
    const { } = this._SELF_;
    console.log('selectTreeItem=', selectTreeItem)
    console.log('selectedKeys=', selectedKeys)
    return (
      <Drawer
        placement={placement}
        closable={false}
        width={320}
        keyboard={false}
        visible={visible}
        key={placement}
        mask={false}
        // getContainer={false}
        bodyStyle={{ padding: '20px 14px' }}
        style={{
          marginTop: 64,
        }}
      >
        <Row gutter={[8, 8]} className={styles.statusWrapper} style={{ marginBottom: 10 }}>
          {
            statusList.map((item, index) => {
              if (index < 4) {
                return <Col span={6}>
                  <div className={`${styles.status_box} ${item.checked ? styles[item.className] : ""}`} onClick={() => { this.onClickStatus(index) }}>
                    {/* <Badge color={item.color} text={item.text} /> */}
                    {item.text}{item.count}个
                  </div>
                </Col>
              } else {
                return <Col span={12}>
                  <div className={`${styles.status_box} ${item.checked ? styles[item.className] : ""}`} onClick={() => { this.onClickStatus(index) }}>
                    {/* <Badge color={item.color} text={item.text} /> */}
                    {item.text}{item.count}个
                  </div>
                </Col>
              }
            })
          }
        </Row>
        <Tabs defaultActiveKey={tabsCurrentKey} onChange={this.onTabsChange}>
          <TabPane tab="区域" key="region">
            <Search
              placeholder="请输入关键字查询"
              style={{ width: '100%', marginTop: 10 }}
              // onChange={_.debounce(this.onKeywordSearch, 1000)}
              onChange={this.onKeywordSearch}
            />
            {
              (loading || !selectedKeys) ? <Spin className={styles.treeSpin} /> :
                <Tree
                  style={{ marginTop: 14, maxHeight: 'calc(100vh - 276px)', overflow: 'auto', overflowY: 'auto', }}
                  showLine={true}
                  showIcon={true}
                  defaultExpandedKeys={[selectTreeItem.ParentCode]}
                  autoExpandParent={autoExpandParent}
                  expandedKeys={expandedKeys}
                  selectedKeys={[selectTreeItem.value]}
                  onSelect={this.onTreeSelect}
                  onExpand={this.onTreeExpand}
                  titleRender={(nodeData) => {
                    return this.regionTreeTitleRender(nodeData)
                  }}
                  treeData={treeRegionData}
                />
            }
          </TabPane>
          <TabPane tab="行业" key="industry">
            <Search
              placeholder="请输入关键字查询"
              style={{ width: '100%', marginTop: 10 }}
              onChange={this.onKeywordSearch}
            />
            {
              (loading || !selectedKeys) ? <Spin className={styles.treeSpin} /> :
                <Tree
                  style={{ marginTop: 14, maxHeight: 'calc(100vh - 276px)', overflow: 'hidden', overflowY: 'auto', }}
                  showLine={true}
                  showIcon={true}
                  defaultExpandedKeys={[selectTreeItem.ParentCode]}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  selectedKeys={[selectTreeItem.value]}
                  onSelect={this.onTreeSelect}
                  onExpand={this.onTreeExpand}
                  titleRender={(nodeData) => {
                    return this.industryTreeTitleRender(nodeData)
                  }}
                  treeData={treeIndustryData}

                />
            }
          </TabPane>
        </Tabs>
      </Drawer>
    );
  }
}

export default index;