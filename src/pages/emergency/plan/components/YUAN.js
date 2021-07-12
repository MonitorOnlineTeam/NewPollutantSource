import React, { PureComponent } from 'react';
import { Card, Popconfirm, Tooltip, Button, Modal } from 'antd';
import SdlTable from '@/components/SdlTable'
import { DelIcon } from '@/utils/icon'
import { connect } from 'dva';
import AttachmentView from '@/components/AttachmentView'


@connect()
class YUAN extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      modalDataSource: [],
      selectedRowKeys: [],
    };
    this._SELF_ = {
      TYPE: 4,
      KEY: 'PlanCode',
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
          title: '预案级别',
          dataIndex: 'PlanLevel',
          key: 'PlanLevel',
        },
        {
          title: '预案名称',
          dataIndex: 'PlanName',
          key: 'PlanName',
        },
        {
          title: '编制单位',
          dataIndex: 'Name',
          key: 'Name',
        },
        {
          title: '附件',
          dataIndex: 'Attachment',
          key: 'Attachment',
          render: (text) => {
            let dataSource = [];
            if (text) {
              dataSource = text.split(',').map(item => {
                return {
                  name: item,
                  attach: `/upload/${item}`
                }
              })
            }
            console.log('dataSource=', dataSource)
            return <AttachmentView dataSource={dataSource} />
          }
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
    this.getRelationTable();
  }


  // 获取调度数据
  getListTable = () => {
    this.props.dispatch({
      type: "emergency/getListTable",
      payload: {
        AlarmInfoCode: this.props.AlarmInfoCode,
        Type: this._SELF_.TYPE,
      },
      callback: (res) => {
        this.setState({ modalDataSource: res, isModalVisible: true })
      }
    })
  }

  // 已选择
  getRelationTable = () => {
    this.props.dispatch({
      type: "emergency/getRelationTable",
      payload: {
        AlarmInfoCode: this.props.AlarmInfoCode,
        Type: this._SELF_.TYPE,
      },
      callback: (res) => {
        let selectedRowKeys = res.map(item => item[this._SELF_.KEY]);
        this.setState({ dataSource: res, selectedRowKeys: selectedRowKeys })
      }
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

  handleCancel = () => {
    this.setState({ isModalVisible: false })
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
        this.getRelationTable();
        this.setState({ isModalVisible: false })
      }
    })
  }


  render() {
    const { columns } = this._SELF_;
    const { dataSource, isModalVisible, selectedRowKeys, modalDataSource } = this.state;

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



    return (
      <Card
        type="inner"
        title="已选择预案"
        extra={
          <Button type="primary" ghost onClick={() => this.getListTable()}>选择预案</Button>
        }
        style={{ marginTop: 10 }}
      >
        <SdlTable rowKey={(record) => record[this._SELF_.KEY]} columns={columns} dataSource={dataSource} pagination={false} />
        <Modal
          title="选择预案"
          visible={isModalVisible}
          width={'60vw'}
          onOk={this.onSave}
          onCancel={this.handleCancel}
          bodyStyle={{ paddingBottom: 0 }}
          destroyOnClose
        >
          <SdlTable rowSelection={rowSelection} rowKey={(record) => record[this._SELF_.KEY]} columns={columns.filter(item => item.key !== 'handle')} dataSource={modalDataSource} />
        </Modal>
      </Card>
    );
  }
}

export default YUAN;