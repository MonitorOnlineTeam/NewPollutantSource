import React, { Component } from 'react';
import SdlTable from "@/components/SdlTable"
import { connect } from "dva"
import { Space, Button, Select, message, Popconfirm } from "antd";

const Option = Select.Option;


@connect(({ loading, autoForm, common, entManage, global }) => ({
  pointInstrumentList: entManage.pointInstrumentList,
  instrumentSelectList: entManage.instrumentSelectList,
  factorySelectList: entManage.factorySelectList,
  methodSelectList: entManage.methodSelectList,
  monitorItem: entManage.monitorItem,
}))
class InstrumentInfo extends Component {
  state = {
    dataSource: [],
  }

  componentDidMount() {
    this.getInstrumentInfoTableDataSource();
    this.getInstrumentSelectList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.pointInstrumentList !== prevProps.pointInstrumentList) {
      this.setState({
        dataSource: this.props.pointInstrumentList
      })
    }
    if (this.props.monitorItem !== prevProps.monitorItem) {
      this.setState({
        monitorItem: this.props.monitorItem
      })
    }
  }

  // 获取仪器信息列表
  getInstrumentInfoTableDataSource = () => {
    this.props.dispatch({
      type: "entManage/getPointInstrument",
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
  }

  // 获取仪器下拉列表
  getInstrumentSelectList = () => {
    this.props.dispatch({
      type: "entManage/getInstrumentSelectList",
      payload: {
        DGIMN: this.props.DGIMN
      }
    })
  }

  // 根据仪器获取厂商列表
  getFactorySelectList = () => {
    this.props.dispatch({
      type: "entManage/getFactorySelectList",
      payload: {
        DGIMN: this.props.DGIMN,
        Name: this.state.name
      }
    })
  }

  // 根据仪器、厂商获取分析方法
  getMethodSelectList = () => {
    this.props.dispatch({
      type: "entManage/getMethodSelectList",
      payload: {
        DGIMN: this.props.DGIMN,
        Name: this.state.Name,
        Factory: this.state.Factory
      }
    })
  }

  // 根据仪器、厂商、分析方法获取监测项目
  getMonitorItem = () => {
    this.props.dispatch({
      type: "entManage/getMonitorItem",
      payload: {
        DGIMN: this.props.DGIMN,
        Name: this.state.Name,
        Factory: this.state.Factory,
        Method: this.state.Method
      }
    })
  }

  // 保存
  onSave = () => {
    this.props.dispatch({
      type: "entManage/saveInstrument",
      payload: {
        DGIMN: this.props.DGIMN,
        Name: this.state.Name,
        Factory: this.state.Factory,
        Method: this.state.Method
      },
      callback: () => {
        this.setState({
          handleType: undefined,
          Name: undefined,
          Factory: undefined,
          Method: undefined,
          monitorItem: undefined,
        })
      }
    })
  }

  // 取消
  onCancel = (index) => {
    let tempDataSource = [...this.state.dataSource];
    tempDataSource.splice(index, 1);
    this.setState({
      dataSource: tempDataSource,
      Name: undefined,
      Factory: undefined,
      Method: undefined,
      monitorItem: undefined,
    });
  }

  // 删除
  onDetete = (id) => {
    this.props.dispatch({
      type: "entManage/deleteInstrument",
      payload: {
        ID: id,
        DGIMN: this.props.DGIMN,
      }
    })
  }

  // 添加行
  handleAdd = () => {
    let tempDataSource = [...this.state.dataSource];
    if (tempDataSource.find(item => item.handleType === "add")) {
      message.warning("请保存上一次编辑！")
      return;
    }
    tempDataSource.push({
      // Name: undefined,
      // Factory: undefined,
      // Method: undefined,
      handleType: "add",
    })
    this.setState({
      dataSource: tempDataSource
    })
  }


  render() {
    const { dataSource, monitorItem } = this.state;
    console.log("this.props.factorySelectList=", this.props.factorySelectList)

    let columns = [
      {
        title: '仪器名称',
        dataIndex: 'Name',
        key: 'Name',
        render: (text, record, index) => {
          if (record.handleType === "add") {
            return <Select
              style={{ width: '80%' }}
              placeholder="请选择仪器"
              onChange={(value) => {
                this.setState({
                  Name: value,
                  Factory: undefined,
                  Method: undefined,
                }, () => {
                  this.getFactorySelectList()
                })
              }}
            >
              {
                this.props.instrumentSelectList.map((item, index) => {
                  return <Option key={index} value={item}>{item}</Option>
                })
              }
            </Select>
          }
          return text;
        }
      },
      {
        title: '生产厂家',
        dataIndex: 'Factory',
        key: 'Factory',
        render: (text, record, index) => {
          if (record.handleType === "add") {
            return <Select
              style={{ width: '80%' }}
              placeholder="请选择生产厂家"
              value={this.state.Factory}
              onChange={(value) => {
                this.setState({
                  Factory: value,
                  Method: undefined,
                }, () => {
                  this.getMethodSelectList()
                })
              }}
            >
              {
                this.props.factorySelectList.map((item, index) => {
                  return <Option key={index} value={item}>{item}</Option>
                })
              }
            </Select>
          }
          return text;
        }
      },
      {
        title: '分析方法',
        dataIndex: 'Method',
        key: 'Method',
        render: (text, record, index) => {
          if (record.handleType === "add") {
            return <Select
              style={{ width: '80%' }}
              placeholder="请选择分析方法"
              value={this.state.Method}
              onChange={(value) => {
                this.setState({
                  Method: value
                }, () => {
                  this.getMonitorItem()
                })
              }}
            >
              {
                this.props.methodSelectList.map((item, index) => {
                  return <Option key={index} value={item}>{item}</Option>
                })
              }
            </Select>
          }
          return text;
        }
      },
      {
        title: '检测项目',
        dataIndex: 'MonitorItem',
        key: 'MonitorItem',
        render: (text, record) => {
          if (record.handleType === "add") {
            return monitorItem ? monitorItem : "-";
          }
          return text ? text : "-"
        }
      },
      {
        title: '操作',
        render: (text, record, index) => {
          if (record.handleType === "add") {
            return <Space>
              <Button type="link" onClick={() => { this.onSave() }}>保存</Button>
              <Button type="link" onClick={() => { this.onCancel(index) }}>取消</Button>
            </Space>
          }
          return <Popconfirm
            placement="left"
            title="确认是否删除?"
            onConfirm={() => {
              this.onDetete(record.ID)
            }}
            okText="是"
            cancelText="否">
            <Button type="link">删除</Button>
          </Popconfirm>
        }
      },
    ]
    return (
      <>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          添加
        </Button>
        <SdlTable style={{marginBottom: 20}} columns={columns} dataSource={dataSource} pagination={false} />
      </>
    );
  }
}

export default InstrumentInfo; 