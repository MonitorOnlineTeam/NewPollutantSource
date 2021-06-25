import React, { PureComponent } from 'react';
import { Card, Button, Modal, Tooltip, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import { DelIcon } from '@/utils/icon'

@connect(({ loading, emergency }) => ({
  saveMinganList: emergency.saveMinganList,
}))
class MinGan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      allDataSource: [],
      selectedRowKeys: [],
      isModalVisible: false,
    };
    this._SELF_ = {
      AlarmInfoCode: this.props.AlarmInfoCode,
      entColumns: [
        {
          title: '序号',
          key: 'index',
          width: 60,
          render: (text, record, index) => {
            return index + 1;
          }
        },
        {
          title: '类型',
          dataIndex: 'SensitiveTypeName',
          key: 'SensitiveTypeName',
          width: 120,
          ellipsis: true,
        },
        {
          title: '敏感点名称',
          dataIndex: 'SensitiveName',
          key: 'SensitiveName',
          width: 230,
          ellipsis: true,
        },
        {
          title: '地址',
          dataIndex: 'Address',
          key: 'Address',
          width: 230,
          ellipsis: true,
        },
        {
          title: '描述',
          dataIndex: 'Describe',
          key: 'Describe',
          width: 230,
          ellipsis: true,
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
                  this.delSensitiveOrEnt(record.RelationCode);
                }}
                okText="是"
                cancelText="否">
                <a href="#"><DelIcon /></a>
              </Popconfirm>
            </Tooltip>
          }
        },
      ],
    }
  }

  componentDidMount() {
    this.getSaveList();
  }

  _dispatch = (actionType, payload, callback) => {
    this.props.dispatch({
      type: actionType,
      payload: payload,
      callback: (res) => {
        callback && callback(res)
      }
    })
  }

  // 获取保存后的数据
  getSaveList = () => {
    this._dispatch('emergency/getSaveEntAndMingan', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: 1,
    }, (res) => {
      let selectedRowKeys = [];
      res.map(item => {
        selectedRowKeys.push(item.EntCode)
      })
      this.setState({
        selectedRowKeys: selectedRowKeys
      })
    })
  }

  // 获取
  getNarrationEntList = (init) => {
    this._dispatch('emergency/getNarrationEntList', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: 1
    }, (res) => {
      this.setState({
        allDataSource: res,
      })
    })
  }

  // 删除
  delSensitiveOrEnt = (code) => {
    this._dispatch('emergency/delSensitiveOrEnt', {
      RelationCode: code,
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: 1,
    })
  }

  // 保存敏感点
  onSave = () => {
    if (!this.state.selectedRowKeys.length) {
      message.error("请选择敏感目标后保存！");
      return;
    }
    this._dispatch('emergency/saveEntAndMingan', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: 1,
      ChildrenCode: this.state.selectedRowKeys
    }, (res) => {
      this.setState({ isModalVisible: false })
      // this.getSaveList()
    })
  }

  onEntSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys: selectedRowKeys });
  }

  render() {
    const { allDataSource, selectedRowKeys, isModalVisible } = this.state;
    const { entColumns } = this._SELF_;
    const { saveMinganList } = this.props;

    const entRowSelection = {
      selectedRowKeys: selectedRowKeys,
      getCheckboxProps: (record) => ({
        disabled: record.IsChecked == 1,
        name: record.EntName,
      }),
      onChange: this.onEntSelectChange,
    };


    return (
      <Card title="敏感目标" type="inner" extra={
        <Button Button type="primary" onClick={() => {
          this.setState({
            isModalVisible: true,
          });
          this.getNarrationEntList();
        }}>添加</Button>
      }>
        <SdlTable rowKey={(record) => record.SensitiveCode} dataSource={saveMinganList} columns={entColumns} size={'small'} pagination={false} />
        <Modal
          title="选择敏感目标"
          visible={isModalVisible}
          width={'70vw'}
          onOk={this.onSave}
          onCancel={() => this.setState({ isModalVisible: false })}
        >
          <SdlTable rowKey={(record) => record.SensitiveCode} rowSelection={entRowSelection} dataSource={allDataSource} columns={entColumns.filter(item => item.key !== 'handle')} size={'small'} pagination={false} />
        </Modal>
      </Card >
    );
  }
}

export default MinGan;