import React, { Component } from 'react';
import {
  Table,
  Radio,
  Card,
  TimePicker,
  Icon,
  Button,
  Spin,
  Popover,
  Badge,
  Divider,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PdPopconfirm from './PdPopconfim';
import UrgentDispatch from './UrgentDispatch';

@connect(({ urgentdispatch, loading }) => ({
  operationUserInfo: urgentdispatch.operationUserInfo,
  existTask: urgentdispatch.existTask,
  loading: loading.effects['urgentdispatch/queryoperationInfo'],
  dgimn: urgentdispatch.dgimn,
  paloading: loading.effects['urgentdispatch/addtaskinfo'],
  superviseloading: loading.effects['urgentdispatch/queryurge'],
}))
class PdButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdvisible: false,
    };
  }

  //督办
  urge = () => {
    let { operationUserInfo, dgimn, existTask, DGIMN, dispatch, id } = this.props;
    if (!id && operationUserInfo && operationUserInfo.operationUserID) {
      id = operationUserInfo.operationUserID;
      DGIMN = dgimn;
    }
    if (id && DGIMN) {
      dispatch({
        type: 'urgentdispatch/queryurge',
        payload: {
          personId: id,
          DGIMN: DGIMN,
        },
      });
    }
  };

  //跳转到添加运维人员界面
  addoperationInfo = () => {
    const { DGIMN, dgimn, dispatch, viewtype, pollutantTypeCode } = this.props;

    if (!DGIMN) {
      DGIMN = dgimn;
    }
    dispatch(routerRedux.push(`/sysmanage/pointdetail/${DGIMN}/${pollutantTypeCode}/${viewtype}`));
  };

  //派单窗口关闭
  onCancel = () => {
    this.setState({
      pdvisible: false,
    });
  };

  pdshow = id => {
    if (id) {
      this.setState({
        pdvisible: true,
      });
    }
  };

  //判断是派单还是督办按钮
  getbutton = () => {
    let {
      operationUserInfo,
      existTask,
      DGIMN,
      dgimn,
      viewType,
      id,
      name,
      tel,
      exist,
      pollutantTypeCode,
      sendpush,
      superviseloading,
      paloading,
    } = this.props;
    if (sendpush) {
      if (operationUserInfo == null) {
        return '';
      } else {
        if (operationUserInfo.pollutantTypeCode == 1) {
          return '';
        }
      }
    }

    if (pollutantTypeCode == 1) {
      return '';
    }
    if (!DGIMN) {
      DGIMN = dgimn;
    }
    if (DGIMN) {
      const text = '没有关联运维人,是否前去关联?';
      //如果有传入值，则优先采取传入值
      if (!exist && exist !== 0) {
        exist = existTask;
      }
      // //如果有传入值，则优先采取传入值
      if (!id && operationUserInfo && operationUserInfo.operationUserID) {
        id = operationUserInfo.operationUserID;
      }
      if (exist && exist != 0) {
        if (superviseloading || paloading) {
          return (
            <Spin
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          );
        }
        //数据一览
        if (viewType == 'datalist') {
          return (
            <PdPopconfirm operationUserID={id} addoperationInfo={() => this.addoperationInfo()}>
              <li style={{ listStyle: 'none' }}>
                <Button onClick={() => this.urge()}>
                  <Icon type="phone" style={{ color: '#3C9FDA', marginRight: 5 }} theme="filled" />
                  督办
                </Button>
              </li>
            </PdPopconfirm>
          );
        }
        //地图一览
        if (viewType == 'mapview') {
          return (
            <PdPopconfirm operationUserID={id} addoperationInfo={() => this.addoperationInfo()}>
              <span onClick={() => this.urge()} style={{ cursor: 'pointer' }}>
                <img style={{ width: 15, marginRight: 6, marginBottom: 4 }} src="/alarm.png" />
                督办
              </span>
            </PdPopconfirm>
          );
        }
        //进入站房中
        else if (viewType.indexOf('pointInfo@') > -1) {
          return (
            <PdPopconfirm operationUserID={id} addoperationInfo={() => this.addoperationInfo()}>
              <Button
                onClick={() => this.urge()}
                type="primary"
                ghost={true}
                style={{ float: 'right', marginRight: 30, top: -5 }}
              >
                <Icon type="bell" />
                督办
              </Button>
            </PdPopconfirm>
          );
        }
        //工作台
        else if (viewType == 'workbench') {
          return (
            <PdPopconfirm operationUserID={id} addoperationInfo={() => this.addoperationInfo()}>
              <Button
                onClick={() => {
                  this.urge();
                }}
                style={{ width: 100, border: 'none', backgroundColor: 'rgb(74,210,187)' }}
                type="primary"
              >
                督办
              </Button>
            </PdPopconfirm>
          );
        }
      }
      //数据一览
      if (viewType == 'datalist') {
        return (
          <PdPopconfirm operationUserID={id} addoperationInfo={() => this.addoperationInfo()}>
            <li style={{ listStyle: 'none' }}>
              <Button onClick={() => this.pdshow(id)}>
                <Icon type="phone" style={{ color: '#3C9FDA', marginRight: 5 }} theme="filled" />
                派单
              </Button>
            </li>
          </PdPopconfirm>
        );
      }
      //地图一览
      if (viewType == 'mapview') {
        return (
          <PdPopconfirm operationUserID={id} addoperationInfo={() => this.addoperationInfo()}>
            <span onClick={() => this.pdshow(id)} style={{ cursor: 'pointer' }}>
              <img style={{ width: 15, marginRight: 6, marginBottom: 4 }} src="/alarm.png" />
              派单
            </span>
          </PdPopconfirm>
        );
      } else if (viewType.indexOf('pointInfo@') > -1) {
        return (
          <PdPopconfirm operationUserID={id} addoperationInfo={() => this.addoperationInfo()}>
            <Button
              onClick={() => this.pdshow(id)}
              type="primary"
              ghost={true}
              style={{ float: 'right', marginRight: 30, top: -5 }}
            >
              <Icon type="bell" />
              派单
            </Button>
          </PdPopconfirm>
        );
      }
      //工作台
      else if (viewType == 'workbench') {
        return (
          <PdPopconfirm operationUserID={id} addoperationInfo={() => this.addoperationInfo()}>
            <Button
              onClick={() => this.pdshow(id)}
              style={{ width: 100, border: 'none', backgroundColor: 'rgb(74,210,187)' }}
              type="primary"
            >
              派单
            </Button>
          </PdPopconfirm>
        );
      }
    }
  };

  render() {
    //如果没有值的话，会从后台加载数据
    const { operationUserInfo, dgimn, viewType, paloading, pointName } = this.props;
    //组件传值的话优先采用传入的值
    let { id, name, tel, pname, DGIMN } = this.props;
    //  debugger;
    if (!id && operationUserInfo) {
      id = operationUserInfo.operationUserID;
      name = operationUserInfo.operationUserName;
      tel = operationUserInfo.operationtel;
    }
    if (!pname) {
      pname = pointName;
    }
    if (!DGIMN) {
      DGIMN = dgimn;
    }
    if (paloading) {
      return (
        <Spin
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      );
    }

    return (
      <span>
        {this.getbutton()}
        <UrgentDispatch
          onCancel={this.onCancel}
          visible={this.state.pdvisible}
          operationUserID={id}
          DGIMN={DGIMN}
          pointName={pname}
          operationUserName={name}
          operationtel={tel}
          reloadData={() => this.props.reloadData()}
        />
      </span>
    );
  }
}

export default PdButton;
