import React, { PureComponent } from 'react';
import { Card, Button, Modal, Tooltip, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import SdlTable from '@/components/SdlTable';
import { DelIcon } from '@/utils/icon'

@connect(({ loading, emergency }) => ({
  saveEntList: emergency.saveEntList,
}))
class Ent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sheShiEntList: [],
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
          title: '行业类别',
          dataIndex: 'IndustryType',
          key: 'IndustryType',
          width: 140,
          ellipsis: true,
        },
        {
          title: '企业',
          dataIndex: 'Abbreviation',
          key: 'Abbreviation',
          width: 206,
          ellipsis: true,
        },
        {
          title: '地址',
          dataIndex: 'EntAddress',
          key: 'EntAddress',
          width: 206,
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

  // 获取保存后的涉事企业
  getSaveList = () => {
    this._dispatch('emergency/getSaveEntAndMingan', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: 2,
    }, (res) => {
      let selectedRowKeys = [];
      res.map(item => {
        selectedRowKeys.push(item.EntCode)
      })
      console.log('selectedRowKeys1=', selectedRowKeys)
      this.setState({
        selectedRowKeys: selectedRowKeys
      })
    })
  }

  // 获取
  getNarrationEntList = (init) => {
    this._dispatch('emergency/getNarrationEntList', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: 2
    }, (res) => {
      this.setState({
        sheShiEntList: res,
      })
    })
  }

  // 删除涉事企业
  delSensitiveOrEnt = (code) => {
    this._dispatch('emergency/delSensitiveOrEnt', {
      RelationCode: code,
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: 2,
    })
  }

  // 保存涉事企业或敏感点
  onSave = () => {
    if (!this.state.selectedRowKeys.length) {
      message.error("请选择企业后保存！");
      return;
    }
    this._dispatch('emergency/saveEntAndMingan', {
      AlarmInfoCode: this._SELF_.AlarmInfoCode,
      Type: 2,
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
    const { sheShiEntList, selectedRowKeys, isModalVisible } = this.state;
    const { entColumns } = this._SELF_;
    const { saveEntList } = this.props;

    const entRowSelection = {
      selectedRowKeys: selectedRowKeys,
      getCheckboxProps: (record) => ({
        disabled: record.IsChecked == 1,
        name: record.EntName,
      }),
      onChange: this.onEntSelectChange,
    };
    console.log('selectedRowKeys=', selectedRowKeys)

    return (
      <Card title="涉事企业" type="inner" extra={
        <Button Button type="primary" onClick={() => {
          this.setState({
            isModalVisible: true,
          });
          this.getNarrationEntList();
        }}>添加</Button>
      }>
        <SdlTable rowKey={(record) => record.EntCode} dataSource={saveEntList} columns={entColumns} size={'small'} pagination={false} />
        <Modal
          title="选择企业"
          visible={isModalVisible}
          width={'70vw'}
          onOk={this.onSave}
          onCancel={() => this.setState({ isModalVisible: false })}
        >
          <SdlTable rowKey={(record) => record.EntCode} rowSelection={entRowSelection} dataSource={sheShiEntList} columns={entColumns.filter(item => item.key !== 'handle')} size={'small'} pagination={false} />
        </Modal>
      </Card >
    );
  }
}

export default Ent;