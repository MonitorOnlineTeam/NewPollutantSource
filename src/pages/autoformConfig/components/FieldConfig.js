/**
 * 功  能：autoFrom - 字段配置
 * 创建人：武慧泽
 * 创建时间：2020.11.11
 */
import React, { Component, useState } from 'react';
import { connect } from 'dva';
import { Form, Table, Col, Card, Input, Button, Modal, Select, Checkbox, Typography, Popconfirm, InputNumber, Space } from 'antd';
//import ModalDrag from '../../utils/ModalDrag';                          //弹框拖动
import AutoFormField from './AutoFormField';  //字段配置弹框
import EditableTable from "./EditableTable";
import DatasourceAdd from "./DatasourceAdd";  //增加字段
// import DbSourceTree from './DbSourceTree';
import SdlTable from '@/components/SdlTable'
import AutoFormAddTable from './AutoFormAddTable';
import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DATASPURCE_SELECT_OPTIONS_CONST } from '../CONST'
const pageUrl = {
  GetCfgFiledsData: 'fieldConfigModel/GetCfgFiledsData'
};

const Row = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });
  // console.log('props', props)
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      },
    ),
    transition,
    ...(isDragging
      ? {
        position: 'relative',
        zIndex: 9999,
      }
      : {}),
  };
  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === 'sort') {
          return React.cloneElement(child, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: 'none',
                  cursor: 'move',
                }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

@connect(({ loading, fieldConfigModel, dbTree }) => ({
  loading: loading.effects[pageUrl.GetCfgFiledsData],
  pageSize: fieldConfigModel.pageSize,
  pageIndex: fieldConfigModel.pageIndex,
  tableDatas: fieldConfigModel.tableDatas,
  dbTreeArray: dbTree.dbTreeArray

}))
class FieldConfig extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      editRecord: {},
      foreigh: [],
      dataSource: [],
      id: '',
      dbKey: '',
      tableName: ''
    };
  }
  //首次渲染调用
  componentWillMount() {
    // this.reloadData(1);
  }
  componentDidMount() {
    window.addEventListener('resize', this.windowResize.bind(this)); //监听窗口大小改变
    this.props.onRef(this);
  }
  componentWillUnmount() { //一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('resize', this.windowResize.bind(this));
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.tableDatas !== prevProps.tableDatas) {
      this.setState({ dataSource: this.props.tableDatas })
    }
    // if (this.state.editingKey !== prevState.editingKey) {
    //   let values = this.formRef.current.getFieldsValue();
    //   console.log('value1111', values)
    // }
  }

  //获取数据
  reloadData = (pageIndex, id, dbKey, tableName) => {
    // if (id && dbKey) {
    this.props.dispatch({
      type: pageUrl.GetCfgFiledsData,
      payload: {
        id: this.props.id,
        dbKey: this.props.dbKey
      },
      callback: (res) => {
      }
    })
    //   this.setState({
    //     tableName: tableName,
    //     id: id,
    //     dbKey: dbKey
    //   })
    // }
  }
  windowResize() {
    let [size] = [''];
    if (document.body.clientHeight >= 1050) {
      size = 'default';
    } else if (document.body.clientHeight >= 800 && document.body.clientHeight < 1050) {
      size = 'middle';
    } else {
      size = 'small';
    }
    this.setState({
      windowWidth: document.body.clientWidth,
      windowHeight: document.body.clientHeight,
      size: size
    });
  }

  onEdit = (record) => {
    this.formRef.current.setFieldsValue({
      ...record,
    });
    this.setState({
      editingKey: record.GUID,
      editRecord: record,
    })
  };

  isEditing = (record) => {
    let status = record.GUID === this.state.editingKey
    return status;
  }



  onSave = (record, nextRecord) => {
    this.formRef.current.validateFields().then((values) => {
      console.log('values', values);
      console.log('record', record);
      // return
      const { dataSource } = this.state;
      // const activeIndex = this.state.dataSource.findIndex((i) => i.GUID === record.GUID);


      let dataSource_temp = dataSource.map(item => {
        return {
          ...item,
          DF_ISPRIMARYKEY: item.DF_ISPRIMARYKEY ? 1 : null,
          DF_ISNOTNULL: item.DF_ISNOTNULL ? 1 : null,
          DF_ISADD: item.DF_ISADD ? 1 : null,
          DF_ISEDIT: item.DF_ISEDIT ? 1 : null,
          LIST_ISSHOW: item.LIST_ISSHOW ? 1 : null,
          DF_ISFIXED: item.DF_ISFIXED ? 1 : null,
          LIST_ISEXPORT: item.LIST_ISEXPORT ? 1 : null,
          DF_HIDDEN: item.DF_HIDDEN ? 1 : null,
          DF_ISSORT: item.DF_ISSORT ? 1 : null,
          FOREIGN_DF_NAME: item.FOREIGN_DF_NAME ? item.FOREIGN_DF_NAME.toString() : null,
          DF_VALIDATE: item.DF_VALIDATE ? item.DF_VALIDATE.toString() : null,
          FOREIGH_DT_CONFIGID: item.FOREIGH_DT_CONFIGID ? item.FOREIGH_DT_CONFIGID : ""
        }
      })
      console.log('dataSource_temp', dataSource_temp)
      // console.log('activeIndex', activeIndex)
      // if (activeIndex > -1) {
      //   let saveCfgStr = [];
      //   let tabAllName = record.DT_NAME;
      //   let data = {
      //     ...record, ...values,
      //     DF_ISPRIMARYKEY: values.DF_ISPRIMARYKEY ? 1 : null,
      //     DF_ISNOTNULL: values.DF_ISNOTNULL ? 1 : null,
      //     DF_ISADD: values.DF_ISADD ? 1 : null,
      //     DF_ISEDIT: values.DF_ISEDIT ? 1 : null,
      //     LIST_ISSHOW: values.LIST_ISSHOW ? 1 : null,
      //     DF_ISFIXED: values.DF_ISFIXED ? 1 : null,
      //     LIST_ISEXPORT: values.LIST_ISEXPORT ? 1 : null,
      //     DF_HIDDEN: values.DF_HIDDEN ? 1 : null,
      //     DF_ISSORT: values.DF_ISSORT ? 1 : null,
      //     FOREIGN_DF_NAME: values.FOREIGN_DF_NAME ? values.FOREIGN_DF_NAME.toString() : null,
      //     DF_VALIDATE: values.DF_VALIDATE ? values.DF_VALIDATE.toString() : null,
      //     FOREIGH_DT_CONFIGID: values.FOREIGH_DT_CONFIGID ? values.FOREIGH_DT_CONFIGID : ""
      //   };
      //   let newDataSource = [...dataSource];
      //   newDataSource[activeIndex - 1] = data;
      //   this.setState({
      //     dataSource: newDataSource
      //   }, () => {
      //     this.formRef.current.setFieldsValue({
      //       ...nextRecord,
      //     });
      //     this.setState({
      //       editRecord: nextRecord,
      //     })
      //     console.log('dataSource', this.state.dataSource)
      //   })
      // }
      this.props.dispatch({
        type: 'fieldConfigModel/SaveFieldsConfig',
        payload: {
          Fileid: dataSource_temp,
          configId: this.props.id,
          // tabAllName,
          callback: () => {
            this.reloadData();
            this.setState({
              editingKey: ''
            })
          }
        }
      });

      // this.setState({
      //   tableDatas:
      // })
      // setData(newData);
      // setEditingKey('');
      // } else {
      // newData.push(row);
      // setData(newData);
      // setEditingKey('');
      // }
    })
  }

  //外表ConfigID
  handleForeighArr = () => {
    let { dbTreeArray, dbKey, } = this.props;
    const { editRecord } = this.state;
    let data = this.state.foreigh;
    let res = [];
    if (editRecord.DF_FOREIGN_TYPE == '表链接') {
      if (dbTreeArray && dbTreeArray.length > 0) {
        let treeFind = dbTreeArray.find(item => item.id == dbKey);
        if (treeFind) {
          data = treeFind.children;
        }
      }
    }
    if (data && data.length > 0) {
      data.forEach((item, i) => {
        res.push(
          <Option key={i} value={item.id}>{item.title}</Option>
        )
      })
    }
    return res;
  }

  //外键类型change
  handelDFFOREIGNTYPE = (value, index, dataIndex) => {
    let { dbTreeArray, dbKey, id } = this.props;
    if (value === "1") {
      if (dbTreeArray && dbTreeArray.length > 0) {
        let data = dbTreeArray.find(item => item.id == dbKey).children;
        this.setState({
          foreigh: data
        })
        // console.log(record.FOREIGN_DF_ID);
        this.handelFOREIGHDT(id)
      }

    } else {
      this.setState({
        foreigh: []
      })
      this.formRef.current.setFieldsValue({
        FOREIGH_DT_CONFIGID: ''
      })
    }
    this.changeDataSource(value, index, dataIndex)
  }

  //外表ConfigID
  handelFOREIGHDT = (value, index, dataIndex) => {
    debugger
    this.formRef.current.setFieldsValue({ FOREIGH_DT_CONFIGID: value, FOREIGN_DF_ID: '', FOREIGN_DF_NAME: undefined })
    let that = this;
    this.props.dispatch({
      type: 'fieldConfigModel/GetCfgFiledsDataFromDbByTableName',
      payload: {
        configId: value,
        callBack: (date) => {
          this.setState({
            foreighdtconfigData: date
          })

        }
      }
    });
    if (index, dataIndex) {
      that.changeDataSource(value, index, dataIndex)
    }
  }

  //外键Code
  handleForeiGndfArr = () => {
    let { editRecord } = this.state;
    let data = this.state.foreighdtconfigData;
    let res = [];

    if (data && data.length > 0) {
      data.forEach((item, i) => {
        res.push(
          <Option key={i} value={item.FullFieldName}>{item.DF_NAME}</Option>
        )
      })
    }
    return res;
  }

  EditableCell = (params) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      keyName,
      placeholder,
      ...restProps
    } = params;
    console.log('params', params)
    // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          this.getFormItem({ dataIndex, inputType, keyName, placeholder, index })
        ) : (
          children
        )}
      </td>
    );
  };

  changeDataSource = (value, index, key) => {
    let dataSource = [...this.state.dataSource];
    // const key = value.currentTarget.id.replace(/\d+/g,'');
    dataSource[index][key] = value;
    if (key === "PollutantName") {
      dataSource[index]["PollutantCode"] = value
    }
    console.log('dataSource', dataSource)
    this.setState({ dataSource: dataSource })
  }

  getFormItem = ({ dataIndex, inputType, keyName, placeholder, index }) => {
    const width = 210;
    switch (inputType) {
      case 'checked':
        return <Form.Item name={dataIndex} valuePropName="checked" style={{ margin: 0, textAlign: 'center' }}>
          <Checkbox onChange={e => this.changeDataSource(e.target.checked, index, dataIndex)} />
        </Form.Item>
      case 'select':
        return <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Select style={{ width: '100%' }} onChange={value => this.changeDataSource(value, index, dataIndex)}>
            {this.handleResArr(DATASPURCE_SELECT_OPTIONS_CONST[keyName])}
          </Select>
        </Form.Item>
      case 'select-tags':
        return <Form.Item name={dataIndex} style={{ margin: 0 }} onChange={value => this.changeDataSource(value, index, dataIndex)}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
          >
            {this.handleResArr(DATASPURCE_SELECT_OPTIONS_CONST[keyName])}
          </Select>
        </Form.Item>
      case 'number':
        return <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <InputNumber onChange={value => this.changeDataSource(value, index, dataIndex)} />
        </Form.Item>
      // 外键类型
      case 'foreignTypeArr':
        return <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Select
            style={{ width: '100%' }}
            onChange={value => this.handelDFFOREIGNTYPE(value, index, dataIndex)}
          >
            {this.handleResArr(DATASPURCE_SELECT_OPTIONS_CONST.foreignTypeArr)}
          </Select>
        </Form.Item>
      // 外表configID
      case 'FOREIGH_DT_CONFIGID':
        return <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Select
            placeholder="请选择外表"
            style={{ width: '100%' }}
            onChange={value => this.handelFOREIGHDT(value, index, dataIndex)}
          >
            {
              this.handleForeighArr()
            }
          </Select>
        </Form.Item>
      // 外键code
      case 'FOREIGN_DF_ID':
        return <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Select
            style={{ width: '100%' }}
            onChange={value => this.changeDataSource(value, index, dataIndex)}
          >
            {this.handleForeiGndfArr()}
          </Select>
        </Form.Item>
      // 外键name
      case 'FOREIGN_DF_NAME':
        return <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Select
            style={{ width: '100%' }}
            mode="multiple"
            onChange={value => this.changeDataSource(value, index, dataIndex)}
          >
            {this.handleForeiGndfArr()}
          </Select>
        </Form.Item>
      // 枚举
      case 'ENUM_NAME':
        return <div style={{ display: 'flex' }}>
          <Form.Item name={dataIndex} style={{ margin: 0 }}>
            <Input style={{ width: 212, borderRight: 0 }}
              onChange={e => this.changeDataSource(e.target.value, index, dataIndex)}
            />
          </Form.Item>
          <AutoFormAddTable setEnumName={(TableData) => {
            this.formRef.current.setFieldsValue({
              ENUM_NAME: TableData
            })
            this.changeDataSource(TableData, index, dataIndex)
          }} getEnumName={this.formRef.current.getFieldValue} record={this.state.editRecord} />
        </div>
      default:
        return <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          <Input placeholder={placeholder} onChange={e => this.changeDataSource(e.target.value, index, dataIndex)} />
        </Form.Item>
    }
  }

  // 处理下拉列表
  handleResArr = (data) => {
    let res = [];
    if (data && data.length > 0) {
      data.forEach((item, i) => {
        res.push(
          <Option key={i} value={item.TypeValue}>{item.TypeName}</Option>
        )
      })
    }
    return res;
  }

  onDragEnd = ({ active, over }) => {
    console.log('active', active)
    console.log('over', over)
    if (active.id !== over?.id) {
      //   setDataSource((previous) => {
      //     const activeIndex = previous.findIndex((i) => i.key === active.id);
      //     const overIndex = previous.findIndex((i) => i.key === over?.id);
      //     return arrayMove(previous, activeIndex, overIndex);
      //   });
      this.setState((prevState) => {
        let previous = prevState.dataSource;
        debugger
        const activeIndex = previous.findIndex((i) => i.GUID === active.id);
        const overIndex = previous.findIndex((i) => i.GUID === over?.id);
        let newDataSource = arrayMove(previous, activeIndex, overIndex)
        console.log('newDataSource', newDataSource)
        return {
          editingKey: '',
          editRecord: {},
          dataSource: newDataSource.map((item, index) => {
            return {
              ...item,
              DF_ORDER: index + 1
            }
          })
        }
      })
    }
  };



  render() {
    const columns = [
      {
        key: 'sort',
        fixed: 'left',
      },
      {
        title: '字段名',
        dataIndex: 'DF_NAME',
        width: 120,
        align: 'center',
        editable: false,
        fixed: 'left',
        ellipsis: true,
      },
      {
        title: '显示名称',
        dataIndex: 'DF_NAME_CN',
        width: 100,
        align: 'center',
        editable: true,
        fixed: 'left',
        ellipsis: true,
        // type: 'input',
      },

      {
        title: '排序',
        dataIndex: 'DF_ORDER',
        width: 80,
        editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '主键',
        dataIndex: 'DF_ISPRIMARYKEY',
        width: 80,
        editable: true,
        inputType: 'checked',
        render: (text, record) => {
          return text == 1 ? '√' : ''
        }
        // align: 'center',
        // type: 'checkbox',
        // type: 'checkbox'
      },
      {
        title: '必填',
        dataIndex: 'DF_ISNOTNULL',
        width: 80,
        editable: true,
        inputType: 'checked',
        render: (text, record) => {
          return text == 1 ? '√' : ''
        }
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '添加',
        dataIndex: 'DF_ISADD',
        width: 80,
        editable: true,
        inputType: 'checked',
        render: (text, record) => {
          return text == 1 ? '√' : ''
        }
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '编辑',
        dataIndex: 'DF_ISEDIT',
        width: 80,
        editable: true,
        inputType: 'checked',
        render: (text, record) => {
          return text == 1 ? '√' : ''
        }
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '列表',
        dataIndex: 'LIST_ISSHOW',
        width: 80,
        editable: true,
        inputType: 'checked',
        render: (text, record) => {
          return text == 1 ? '√' : ''
        }
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '固定',
        dataIndex: 'DF_ISFIXED',
        width: 80,
        editable: true,
        inputType: 'checked',
        render: (text, record) => {
          return text == 1 ? '√' : ''
        }
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '隐藏',
        dataIndex: 'DF_HIDDEN',
        width: 80,
        editable: true,
        inputType: 'checked',
        render: (text, record) => {
          return text == 1 ? '√' : ''
        }
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '表单控件',
        dataIndex: 'DF_CONTROL_TYPE',
        width: 180,
        editable: true,
        inputType: 'select',
        keyName: 'WidgetTypeArr'
      },
      {
        title: '校验方式',
        dataIndex: 'DF_VALIDATE',
        width: 180,
        editable: true,
        inputType: 'select-tags',
        keyName: 'ValidateArray'
      },
      {
        title: '查询',
        dataIndex: 'DF_ISQUERY',
        width: 180,
        editable: true,
        inputType: 'select',
        keyName: 'SearchTypeArr',
        render: (text, record) => {
          if (text == 0) {
            return '不查询';
          }
          if (text == 1) {
            return '列表头部显示'
          }
          if (text == 2) {
            return '特殊位置显示'
          }
        }
      },
      {
        title: '查询控件',
        dataIndex: 'DF_QUERY_CONTROL_TYPE',
        width: 180,
        editable: true,
        inputType: 'select',
        keyName: 'queryConditionTypeArr'
        // align: 'center',
        //    type: 'select',
      },
      {
        title: '查询方式',
        dataIndex: 'DF_CONDITION',
        width: 120,
        editable: true,
        inputType: 'select',
        keyName: 'conditionTypeArr',
        // align: 'center',
        //   type: 'select',
        render: (text) => {
          if (text == "$=") {
            return '相等'
          }
          if (text == "$ne") {
            return '不等'
          }
          if (text == "$like") {
            return '模糊匹配'
          }
          if (text == "$gte") {
            return '大于等于'
          }
          if (text == "$gt") {
            return '大于'
          }
          if (text == "$lte") {
            return '小于等于'
          }
          if (text == "$lt") {
            return '小于'
          }
          if (text == "$nin") {
            return '不包含'
          }
          if (text == "$in") {
            return '包含'
          }
        }
      },
      {
        title: '列表宽度',
        dataIndex: 'LIST_WITH',
        width: 120,
        editable: true,
        inputType: 'number',
      },
      {
        title: '合并列',
        dataIndex: 'DF_COLSPAN',
        width: 120,
        editable: true,
        type: 'input',
        inputType: 'number',
      },
      {
        title: '合并行',
        dataIndex: 'DF_ROWSPAN',
        width: 120,
        editable: true,
        type: 'input',
        inputType: 'number',
      },
      {
        title: '提示信息',
        dataIndex: 'DF_TOOLTIP',
        width: 200,
        editable: true,
      },
      {
        title: '列格式化',
        dataIndex: 'DF_FORMAT',
        width: 200,
        editable: true,
      },
      {
        title: '宽度',
        dataIndex: 'DF_WIDTH',
        width: 120,
        editable: true,
      },
      {
        title: '高度',
        dataIndex: 'DF_HEIGHT',
        width: 120,
        editable: true,
      },
      // {
      //   title: '维护页面控件样式',
      //   dataIndex: 'DF_OPECLASS',
      //   width: 150,
      //   // editable: true,
      //   // align: 'center',
      //   // type: 'input',
      // },
      {
        title: '默认值',
        dataIndex: 'DF_DEFAULTVALUE',
        width: 120,
        editable: true,
      },
      {
        title: '外键类型',
        dataIndex: 'DF_FOREIGN_TYPE',
        width: 120,
        editable: true,
        inputType: 'foreignTypeArr',
        render: (text, record) => {
          if (text == 0) {
            return "无"
          }
          if (text == 1) {
            return "表链接"
          }
          if (text == 2) {
            return "枚举"
          }
        }
      },
      {
        title: '关联关系',
        dataIndex: 'FOREIGH_RELATION_TYPE',
        width: 120,
        editable: true,
        inputType: 'select',
        keyName: 'foreignRelTypeArr'
      },
      {
        title: '外表ConfigID',
        dataIndex: 'FOREIGH_DT_CONFIGID',
        width: 200,
        editable: true,
        inputType: 'FOREIGH_DT_CONFIGID',
        ellipsis: true,

        // align: 'center',
        //    type: 'select',
      },
      {
        title: '外键Code',
        dataIndex: 'FOREIGN_DF_ID',
        width: 200,
        editable: true,
        inputType: 'FOREIGN_DF_ID',
        ellipsis: true,

        // editable: true,
        // align: 'center',
        //   type: 'select',
      },
      {
        title: '外键Name',
        dataIndex: 'FOREIGN_DF_NAME',
        width: 200,
        editable: true,
        inputType: 'FOREIGN_DF_NAME',
        ellipsis: true,

        // editable: true,
        // align: 'center',
        //    type: 'select',
      },
      {
        title: '枚举值',
        dataIndex: 'ENUM_NAME',
        width: 300,
        editable: true,
        inputType: 'ENUM_NAME',
        align: 'center'
      },
      {
        title: '其他配置',
        dataIndex: 'DF_OtherOptions',
        width: 200,
        editable: true,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '日期格式化',
        dataIndex: 'DF_DATEFORMAT',
        width: 120,
        editable: true,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      // {
      //   title: '导入',
      //   dataIndex: 'DF_ISIMPORT',
      //   width: 150,
      //   // editable: true,
      //   align: 'center',
      //   //   type: 'select',
      // },
      {
        title: '单位',
        dataIndex: 'DF_Unit',
        width: 120,
        editable: true,
        align: 'center',
      },
      {
        title: '列格式化',
        dataIndex: 'DF_ISFormat',
        width: 140,
        editable: true,
        inputType: 'select',
        keyName: 'FormatType',
      },
      {
        title: '对齐方式',
        dataIndex: 'DF_ALIGN',
        width: 140,
        editable: true,
        inputType: 'select',
        keyName: 'AlignType',
      },
      {
        title: '上传类型',
        dataIndex: 'DF_UpType',
        width: 140,
        editable: true,
        placeholder: '上传类型.xls,.xlsx,.doc,.txt,.ppt等'
      },
      {
        title: '上传数量',
        dataIndex: 'DF_UpNum',
        width: 100,
        editable: true,
        inputType: 'number',
      },
      // {
      //   title: '操作',
      //   align: 'center',
      //   fixed: 'right',
      //   width: 160,
      //   render: (text, record) => {
      //     const editable = this.isEditing(record);
      //     return editable ? (
      //       <span>
      //         <Typography.Link
      //           onClick={() => this.onSave(record)}
      //           style={{
      //             marginRight: 8,
      //           }}
      //         >
      //           保存
      //         </Typography.Link>
      //         <Popconfirm title="确定取消吗?" onConfirm={() => {
      //           this.setState({ editingKey: '' })
      //         }}>
      //           <a>取消</a>
      //         </Popconfirm>
      //       </span>
      //     ) : (
      //       <Typography.Link onClick={() => this.onEdit(record)}>
      //         编辑
      //       </Typography.Link>
      //     );

      //     // <AutoFormField record={record} id={this.props.id} dbKey={this.props.dbKey} FieldReloadData={this.reloadData} />
      //   }
      // }
    ]
    const { TableData } = this.props;
    const tableDatas = this.props.tableDatas;
    const { dataSource } = this.state;
    const mergedColumns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record, rowIndex) => {
          return {
            record,
            index: rowIndex,
            inputType: col.inputType || 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            keyName: col.keyName,
            placeholder: col.placeholder,
            editing: this.isEditing(record),
          }
        },
      };
    });

    return (
      <div>
        <Space style={{ marginBottom: 10 }}>
          <DatasourceAdd onRef={(ref) => { this.$Child = ref }} dbKey={this.props.dbKey} id={this.props.id} tableName={this.props.tableName} FieldReloadData={this.reloadData} />
          <Button type='primary' onClick={this.onSave}>保存</Button>
        </Space>
        <Form ref={this.formRef}
          component={false}
          initialValues={this.state.editRecord}
          style={{ marginTop: 10 }}
          onFieldsChange={(_, allFields) => {
            console.log('allFields', allFields)
          }}
        >
          <DndContext onDragEnd={this.onDragEnd}>
            <SortableContext
              // rowKey array
              items={dataSource.map((i) => i.GUID)}
              strategy={verticalListSortingStrategy}
            >
              <Table
                rowKey="GUID"
                // components={this.components}
                // style={{ wordBreak: "break-all", "tablelayout": "fixed", overflow: "auto" }}
                components={{
                  body: {
                    row: Row,
                    cell: this.EditableCell,
                  },
                }}
                bordered
                pagination={false}
                // scroll={{ x: 2800 }}
                dataSource={dataSource}
                columns={mergedColumns}
                onRow={(record) => {
                  return {
                    onClick: (event) => {
                      this.onEdit(record)
                    }, // 点击行
                    onDoubleClick: (event) => { },
                    onContextMenu: (event) => { },
                    onMouseEnter: (event) => { }, // 鼠标移入行
                    onMouseLeave: (event) => {
                      // this.onSave(record);
                    },
                  };
                }}
                // rowClassName="editable-row"
                scroll={{ x: 'max-content' }}
                loading={this.props.loading}
              />

            </SortableContext>
          </DndContext>

        </Form>
        {/* <EditableTable columns={columns} dataSource={TableData} /> */}
      </div>
    );
  }
}

export default FieldConfig;