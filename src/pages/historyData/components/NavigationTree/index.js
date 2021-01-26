
import React, { Component } from 'react';
import {
  Select,
  Input,
  Button,
  Drawer,
  Radio,
  Collapse,
  Table,
  Badge,
  Divider,
  Row,
  Tree,
  Empty,
  Col,
  Tooltip,
  Spin,
  Tag,
} from 'antd';
import {
  EntIcon,
  GasIcon,
  WaterIcon,
  LegendIcon,
  PanelWaterIcon,
  PanelGasIcon,
  TreeIcon,
  PanelIcon,
  BellIcon,
  StationIcon,
  ReachIcon,
  SiteIcon,
  DustIcon,
  VocIcon,
  QCAIcon,
  IconConfig,
} from '@/utils/icon';
const RadioGroup = Radio.Group;
const { Panel } = Collapse;
const { Option } = Select;
const { Search } = Input;
const { TreeNode } = Tree;
const styleTrue = {
  border: '1px solid',
  borderRadius: 4,
  padding: 3,
  borderColor: '#1990fc',
  cursor: 'pointer',
};
const styleFalse = {
  border: '1px solid',
  borderRadius: 4,
  padding: 3,
  borderColor: '#fff',
  cursor: 'pointer',
};
const styleNor = {
  border: '1px solid',
  borderRadius: 4,
  padding: 3,
  borderColor: '#1990fc',
  cursor: 'pointer',
  // marginLeft: 5,
};
const styleFor = {
  border: '1px solid',
  borderRadius: 4,
  padding: 3,
  borderColor: '#fff',
  cursor: 'pointer',
  // marginLeft: 5,
};

  class NavigationTree extends Component {
  state = { 
    visible: true,
     childrenDrawer: false,
     normalState: true,
     offState: true,
     overState: true,
     exceState: true,
     zState: true,
     cState: true,
     screenList: [0, 1, 2, 3],
     treeVis:true
     };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  };
  // 筛选运行状态
  screenData = type => {
    let { offState } = this.state;
    let { normalState } = this.state;
    let { overState } = this.state;
    let { exceState } = this.state;
    let { zState } = this.state;
    let { cState } = this.state;
    switch (type) {
      case 0: // 离线
        offState = !offState;
        break;
      case 1: // 正常
        normalState = !normalState;
        break;
      case 2: // 超标
        overState = !overState;
        break;
      case 3: // 异常
        exceState = !exceState;
        break;
    }
    const typeList = this.state.screenList;
    const index = typeList.indexOf(type);
    if (index == -1) {
      typeList.push(type);
    } else {
      typeList.splice(index, 1);
    }
    this.setState({
      screenList: typeList,
      offState,
      normalState,
      overState,
      exceState,
      zState,
      cState,
    });
  }

  onRadioChange = e => {
    if (e.target.value == 'tree') {
      this.setState({
        treeVis: true,
      });
    } else {
      this.setState({
        treeVis: false,
      })
    }
  };
  render() {
    return (
      <>
         <Drawer
           placement='left'
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={320}
          mask={false}
          zIndex={1}
          bodyStyle={{ padding: '18px 8px' }}
          style={{
            marginTop: 64,
          }}
        >
                    <div style={{ marginBottom: 15 }}>
            <Row justify="space-between" style={{ textAlign: 'center' }}>
              <Col
                span={5}
                style={this.state.normalState ? styleNor : styleFor}
                onClick={() => this.screenData(1)}
              >
                <LegendIcon style={{ color: '#34c066' }} />
                正常
              </Col>
              <Col span={1}></Col>
              <Col
                span={5}
                style={this.state.offState ? styleTrue : styleFalse}
                onClick={() => this.screenData(0)}
              >
                {' '}
                <LegendIcon style={{ color: '#999999' }} />
                离线
              </Col>
              <Col span={1}></Col>
              <Col
                span={5}
                style={this.state.overState ? styleTrue : styleFalse}
                onClick={() => this.screenData(2)}
              >
                <LegendIcon style={{ color: '#f04d4d' }} />
                超标
              </Col>
              <Col span={1}></Col>
              <Col
                span={5}
                style={this.state.exceState ? styleTrue : styleFalse}
                onClick={() => this.screenData(3)}
              >
                <LegendIcon style={{ color: '#e94' }} />
                异常
              </Col>
            </Row>
            <Row justify="space-between" style={{ textAlign: 'center' }}>
            <Search
            placeholder="请输入关键字查询"
            onChange={this.onChangeSearch}
            style={{ marginTop: 15, width: '60%' }}
          />
          <Radio.Group
            defaultValue={ 'tree'}
            buttonStyle="solid"
            style={{ marginTop: 15, marginLeft: 15, cursor: 'pointer', width: '35%' }}
            onChange={this.onRadioChange}
          >
            <Tooltip title="区域">
              <Radio.Button value="tree">
                {' '}
                <TreeIcon></TreeIcon>
              </Radio.Button>
            </Tooltip>
            <Tooltip title="类型">
              <Radio.Button value="panel">
                <PanelIcon></PanelIcon>
              </Radio.Button>
            </Tooltip>
          </Radio.Group>
              </Row>
            
          </div>
        </Drawer>
      </>
    );
  }
}
export default NavigationTree;