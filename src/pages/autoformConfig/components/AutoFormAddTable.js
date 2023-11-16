/**
 * 功  能：字段配置弹框
 * 创建人：张哲
 * 创建时间：2020.11.11
 */
import React, { Component } from 'react';
import {
  Table,
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Modal,
  Input,
  Popconfirm,
  message,
  Space,
} from 'antd';
// import ModalDrag from '../../utils/ModalDrag';                          //弹框拖动
import moment from 'moment';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

const pageUrl = {
  GetEnumDictionary: 'fieldConfigModel/GetEnumDictionary', //获取枚举值
  AddEnum: 'fieldConfigModel/AddEnum', //添加枚举值
  UpdateEnum: 'fieldConfigModel/UpdateEnum', //修改枚举值
  DelEnum: 'fieldConfigModel/DelEnum', //删除枚举值
  // updateState:'historydata/updateState',
};

@connect(({ loading, fieldConfigModel }) => ({
  loading: loading.effects[pageUrl.GetEnumDictionary],
  EnumData: fieldConfigModel.EnumData, //枚举值
}))
class AutoFormAddTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Key',
        dataIndex: 'key',
        align: 'center',
        width: '40%',
      },
      {
        title: 'Value',
        dataIndex: 'value',
        align: 'center',
        width: '40%',
        editable: true,
      },
      // {
      //   title: '备注',
      //   dataIndex: '备注',
      //   align:'center',
      // },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operation',
        render: (text, record) => (
          // this.state.dataSource.length >= 1 ? (
          <Space>
            <a onClick={this.getTableData}>保存</a>
            <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        ),

        // ) : null,
      },
    ];

    this.state = {
      TableRowData: [],
      enumerationVisible: false, //枚举弹框
      TableData: [],
    };
  }

  componentDidMount() {}

  handleDelete = value => {
    let { TableData } = this.state;
    let res = TableData.filter(item => item.key != value.key);
    this.setState({
      TableData: res,
    });
  };

  handleSave = row => {
    this.setState({ TableRowData: row });
  };
  //保存
  getTableData = () => {
    let { TableRowData, TableData } = this.state;
    let res = [];
    res = TableData.map(item => {
      if (item.key == TableRowData.key) {
        return { key: item.key, value: TableRowData.value };
      } else {
        return item;
      }
    });
    this.setState({
      TableData: res,
    });
  };
  //提交
  handleSubmit = e => {
    let TableData = [...this.state.TableData];
    let res = [];
    let flag = true;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      debugger;
      if (!err) {
        res = TableData;
        res.forEach(item => {
          debugger;
          if (item.key == values.key) {
            message.error('key值重复，修改失败！');
            flag = false;
          }
        });
        if (flag) {
          res.push({ key: values.key, value: values.value });
          message.success('添加成功！');
          this.setState({
            TableData: res,
          });
          this.props.form.setFieldsValue({ key: undefined, value: undefined });
        }
      }
    });
  };

  //枚举弹框
  enumerationShowModal = () => {
    let { record, getEnumName } = this.props;
    debugger;
    if (getEnumName('ENUM_NAME')) {
      let res = JSON.parse(getEnumName('ENUM_NAME'));
      this.setState({
        enumerationVisible: true,
        TableData: [...res],
      });
    } else {
      this.setState({
        enumerationVisible: true,
        TableData: [],
      });
    }
  };

  enumerationhandleOk = e => {
    this.setState({
      enumerationVisible: false,
    });
  };

  enumerationhandleCancel = e => {
    this.setState({
      enumerationVisible: false,
    });
  };
  //获取枚举值
  reloadData = () => {
    this.props.dispatch({
      type: pageUrl.GetEnumDictionary,
    });
  };
  //保存
  handeUpdata = () => {
    let { setEnumName } = this.props;
    let { TableData } = this.state;
    // setEnumName({
    //   ENUM_NAME: JSON.stringify(TableData)
    // })
    // debugger
    let _TableData = TableData && TableData.length ? JSON.stringify(TableData) : undefined;
    this.props.setEnumName(_TableData);
    this.setState({
      enumerationVisible: false,
    });
  };
  render() {
    const { dataSource, TableData } = this.state;
    const { EnumData } = this.props;
    const { getFieldDecorator } = this.props.form;
    // const title=<ModalDrag title='枚举'/>;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    console.log('columns', columns);
    return (
      <>
        <Button onClick={this.enumerationShowModal}>编辑</Button>
        <Modal
          visible={this.state.enumerationVisible}
          centered={true}
          title={'枚举'}
          width={800}
          className="autoModal"
          classTitle="autoModal"
          onOk={this.enumerationhandleOk}
          onCancel={this.enumerationhandleCancel}
          mask={false}
          isCardHeight={true}
          destroyOnClose={true}
          footer={
            <Button type="primary" onClick={this.handeUpdata}>
              保存
            </Button>
          }
        >
          <Form layout="inline" onSubmit={this.handleSubmit} style={{ float: 'right' }}>
            <Form.Item label="Key">
              {getFieldDecorator('key', {
                rules: [{ required: true, message: '请输入Key' }],
              })(<Input placeholder="请输入Key" />)}
            </Form.Item>
            <Form.Item label="Value">
              {getFieldDecorator('value', {
                rules: [{ required: true, message: '请输入Value' }],
              })(<Input placeholder="请输入Value" />)}
            </Form.Item>
            <Form.Item style={{ marginRight: 0 }}>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </Form.Item>
          </Form>
          <Table
            components={components}
            loading={this.props.loading}
            style={{ marginTop: 50 }}
            size="middle"
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={TableData}
            columns={columns}
          />
        </Modal>
      </>
    );
  }
}
export default Form.create()(AutoFormAddTable);
