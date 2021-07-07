import React, { PureComponent } from 'react';
import { Card, Row, Button, Space, Tooltip, Popconfirm, Input, Divider, Select } from 'antd'
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable'
import { DelIcon } from '@/utils/icon'
import { RollbackOutlined } from '@ant-design/icons';


@connect(({ loading, emergency }) => ({
  dutyOneData: emergency.dutyOneData,
  stepBarData: emergency.stepBarData,
  dictionaryList: emergency.dictionaryList,
}))
class Vehicle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      showFlag: true, // true 显示结果，false显示调度列表
      dataSource: [],
      selectedRowKeys: [],
    };

    this._SELF_ = {
      KEY: "VehicleCode",
      TYPE: 9,
      columns: [
        {
          title: '序号',
          key: 'index',
          width: 60,
          render: (text, record, index) => {
            return index + 1;
          }
        },
        {
          title: '车辆名称',
          dataIndex: 'VehicleName',
          key: 'VehicleName',
        },
        {
          title: '车辆类型',
          dataIndex: 'VehicleTypeName',
          key: 'VehicleTypeName',
        },
        {
          title: '车牌号',
          dataIndex: 'LicensePlate',
          key: 'LicensePlate',
        },
        {
          title: '所在企业/单位',
          dataIndex: 'EntName',
          key: 'EntName',
          width: 180,
        },
        {
          title: '联系人',
          dataIndex: 'LinkMan',
          key: 'LinkMan',
        },
        {
          title: '联系电话',
          dataIndex: 'Phone',
          key: 'Phone',
        },
        {
          title: '操作',
          key: 'handle',
          render: (text, record) => {
            return <Tooltip title="删除">
              <Popconfirm
                placement="left"
                title="确认是否删除?"
                onConfirm={() => {
                  this.onDelete(record);
                }}
                okText="是"
                cancelText="否">
                <a href="#"><DelIcon /></a>
              </Popconfirm>
            </Tooltip>
          }
        },
      ]
    }
  }

  componentDidMount() {
    // this.getListTable();
    this.getRelationTable()
  }

  // 获取调度数据
  getListTable = () => {
    this.props.dispatch({
      type: "emergency/getListTable",
      payload: {
        AlarmInfoCode: this.props.AlarmInfoCode,
        Type: this._SELF_.TYPE
      },
      callback: (res) => {
        this.setState({ dataSource: res })
      }
    })
  }

  // 结果
  getRelationTable = () => {
    const { ParamType, ParamName } = this.state;
    this.props.dispatch({
      type: "emergency/getRelationTable",
      payload: {
        ParamName,
        ParamType,
        AlarmInfoCode: this.props.AlarmInfoCode,
        Type: this._SELF_.TYPE
      },
      callback: (res) => {
        let selectedRowKeys = res.map(item => item[this._SELF_.KEY]);
        this.setState({ dataSource: res, selectedRowKeys: selectedRowKeys })
      }
    })
  }


  // 调度
  onDispatch = () => {
    this.setState({
      showFlag: !this.state.showFlag
    }, () => {
      this.getListTable()
    })
  }

  // 保存
  onSave = () => {
    this.props.dispatch({
      type: "emergency/saveDispatch",
      payload: {
        AlarmInfoCode: this.props.AlarmInfoCode,
        Type: this._SELF_.TYPE,
        ChildrenCode: this.state.selectedRowKeys
      },
      callback: (res) => {
        // this.setState({ showFlag: true })
        this.onback();
      }
    })
  }

  // 返回
  onback = () => {
    this.setState({ showFlag: true }, () => {
      this.getRelationTable();
    })
  }

  // 删除
  onDelete = (record) => {
    this.props.dispatch({
      type: "emergency/deleteDispatch",
      payload: {
        RelationCode: record.RelationCode
      },
      callback: (res) => {
        this.getRelationTable()
      }
    })
  }

  render() {
    const { isModalVisible, showFlag, dataSource, selectedRowKeys } = this.state;
    const { columns } = this._SELF_;
    const { dictionaryList } = this.props;


    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys: selectedRowKeys })
      },
      getCheckboxProps: (record) => ({
        disabled: record.IsChecked === 1,
        name: record.name,
      }),
    };

    let _props = showFlag ? {} : { rowSelection }
    let _columns = showFlag ? columns : columns.filter(item => item.key !== 'handle')
    return (
      <Card bordered={false} title="车辆调度" style={{ margin: 0 }} extra={
        <Button icon={<RollbackOutlined />} onClick={() => history.go(-1)}>返回</Button>
      }>
        <Row
          style={{ marginTop: 10, marginBottom: 20 }}
        >
          <Space align="baseline" size={40}>
            <div>
              车辆类型：
              <Select allowClear placeholder="请选择车辆类型" style={{ width: 180 }} onChange={(value) => {
                this.setState({ ParamType: value })
              }}>
                {
                  dictionaryList.VehicleType.map(item => {
                    return <Option value={item.VehicleTypeCode} key={item.VehicleTypeCode}>{item.VehicleTypeName}</Option>
                  })
                }
              </Select>
            </div>
          </Space>
          <Space align="baseline" style={{ marginLeft: 10 }}>
            <Button type="primary" onClick={this.getRelationTable}>查询</Button>
            <Divider type="vertical" />
            {
              showFlag ?
                <Button type="primary" onClick={this.onDispatch}>车辆调度</Button>
                :
                <Space>
                  <Button type="primary" onClick={this.onSave}>保存</Button>
                  <Button onClick={this.onback}>返回</Button>
                </Space>
            }
          </Space>
        </Row>
        <SdlTable rowKey={(record) => record[this._SELF_.KEY]} columns={_columns} dataSource={dataSource} {..._props} />
      </Card>
    );
  }
}

export default Vehicle;