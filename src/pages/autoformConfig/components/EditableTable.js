import React from 'react';
import { Checkbox, Input, message, Select, Table, Tooltip } from 'antd';
import styles from './EditableTable.less';
import { Form } from '@ant-design/compatible';

const EditableContext = React.createContext();
const { Option, OptGroup } = Select;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
    checkboxes: {}
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };
  onCheckboxChange = (e, record) => {
    const { checkboxes } = this.state;
    checkboxes[record.editable_row_key] = e.target.checked;
    this.setState({
      checkboxes
    });
  };
  save = (e, dataIndex) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      const value = values;
    });
  };
  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title, type, data = [], required } = this.props;

    const optGroups = [];
    if (type === 'select' && data.length > 0) {
      data.map((item, index) => {
        const optGroup = <OptGroup label={item.label} key={index}>
          {item.options.map((option, index2) => {
            return <Option value={option} key={index2}>{option}</Option>;
          })}
        </OptGroup>;
        optGroups.push(optGroup);
      });
    }

    const { editing } = this.state;
    return !editing && type === 'input' ?
      (<div
        className={styles['editable-cell-value-wrap']}
        style={{ paddingRight: 24, minHeight: '30px' }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>)
      : (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: required !== undefined && required === true,
                message: `${title} 必填`,
              },
            ],
            //默认值，如果是下拉框则设置默认值为下拉项第一项
            initialValue: type === 'select' ? data[0].options[0] : record[dataIndex],
          })(
            type === 'select' ?
              <Select
                style={{ width: '200px' }}
                ref={node => (this.input = node)}
                onPressEnter={this.save}
                //onBlur={this.save}
              >
                {optGroups}
              </Select>
              : type === 'checkbox' ?
              <Checkbox
                ref={node => (this.input = node)}
                onChange={(e) => this.onCheckboxChange(e, record)}
                checked={this.state.checkboxes[record.editable_row_key]}
              />
              : <Input
                maxLength={dataIndex === 'describe' ? 100 : 40}
                ref={node => (this.input = node)}
                onPressEnter={this.save}
                //onBlur={e => this.save(e, dataIndex)}
              />
          )}
        </Form.Item>
      );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      type,
      data,
      width,
      required,
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

class EditableTable extends React.Component {
  constructor(props) {
    super(props);

    const dataSource = (props.dataSource || []).map((data, idx) => {
      return {
        ...data,
        editable_row_key: idx + '_' + props.rowKey,
      };
    });

    this.state = {
      dataSource,
      count: dataSource.length,
    };
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    let newData = dataSource.filter(item => item.editable_row_key !== key);
    this.setState({ dataSource: newData });
  };

  handleAdd = () => {
    const { dataSource, count } = this.state;
    const newData = {
      'editable_row_key': count + '_' + this.props.rowKey,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });

  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.editable_row_key === item.editable_row_key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });

    if (this.props.onDataSourceChanged) {
      this.props.onDataSourceChanged(newData);
    }
  };
  save = (e, dataIndex) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      const value = values;
    });
  };
  delete = () => {
    const { selectRows = [] } = this.state;
    const dataSource = [...this.state.dataSource];

    selectRows.forEach((selectRow) => {
      dataSource.forEach((item, index) => {
        if (selectRow === item.editable_row_key) {
          dataSource.splice(index, 1);
        }
      });
    });

    this.setState({
      dataSource,
      selectRows: []
    });
  };

  render() {
    const { dataSource} = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.props.columns.map((col) => {

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
          type: col.type,
          data: col.data,
          required: col.required,
          ellipsis: true,
          width: col.width,
          handleSave: this.handleSave,
        }),
      };
    });

    columns.push(
      {
        title: '操作',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <a onClick={() => {
              this.handleDelete(record['editable_row_key']);
            }}>
              删除
            </a>
          ) : null,
      },
    );

    const title = (
      <div>
        {/* <a onClick={this.handleAdd} style={{ marginLeft: '10px' }}>
          <Tooltip title={'添加新单词'}>
            <img src={'/img/word.png'} width={30}/>
          </Tooltip>
        </a> */}
      </div>
    );

    const rowSelection = {
      onChange: record => {
        this.setState({
          selectRows: record
        });
      }
    };
     // 计算table长度
    let scrollXWidth = columns.map(col => col.width).reduce(
        (prev, curr,index) => {
        if(index<=6)
        {
            curr = curr + 20
        }
        return prev + curr;
    }, 0)
      //非通用,每个页面的表格会有差异,并非统一,自行调整
     //设备的高度
     let screenHeight = window.screen.height
     //设备的宽度
     let screenWidth = window.screen.width
     //y轴
     let yHeight;
     if((screenWidth === 1920 || screenWidth === 1600) && screenHeight === 1200)
     {
         yHeight = 'calc(110vh - 317px)'
     }
     else if( (screenWidth === 1600 || screenWidth === 1280) && screenHeight === 1024)
     {
         yHeight = 'calc(110vh - 309px)'
     }
     else if((screenWidth === 1366 || screenWidth === 1360 || screenWidth === 1280 ) && screenHeight === 768)
     {
         yHeight = 'calc(110vh - 298px)'
     }
     else if(screenWidth === 1024 && screenHeight === 768)
     {
         yHeight = 'calc(110vh - 320px)'
     }
     else
     {
         yHeight = layoutStyle.tableYstyle
     } 
    return (
        
      <Table
        style={{wordBreak:"break-all","white-space":"nowrap","table-layout":"fixed"}}
        scroll={{ y: yHeight,x:'max-content' }}
        rowSelection={rowSelection}
        rowKey="editable_row_key"
        title={() => title}
        components={components}
        rowClassName={() => styles['editable-row']}
        size="middle"
        pagination={false}
        dataSource={dataSource}
        columns={columns}
      />
    );
  }
}

export default EditableTable;