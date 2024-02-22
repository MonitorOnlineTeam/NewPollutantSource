/**
 * 功  能：autoFrom - 字段配置
 * 创建人：武慧泽
 * 创建时间：2020.11.11
 */
import React, { Component, useState } from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Card, Input, Button, Modal, Select, Checkbox } from 'antd';
//import ModalDrag from '../../utils/ModalDrag';                          //弹框拖动
import AutoFormField from './AutoFormField';  //字段配置弹框
import EditableTable from "./EditableTable";
import DatasourceAdd from "./DatasourceAdd";  //增加字段
// import DbSourceTree from './DbSourceTree';
import { Form } from '@ant-design/compatible';
import SdlTable from '@/components/SdlTable'
const pageUrl = {
  GetCfgFiledsData: 'fieldConfigModel/GetCfgFiledsData'
};
@connect(({ loading, fieldConfigModel }) => ({
  loading: loading.effects[pageUrl.GetCfgFiledsData],
  pageSize: fieldConfigModel.pageSize,
  pageIndex: fieldConfigModel.pageIndex,
  tableDatas: fieldConfigModel.tableDatas
}))

class FieldConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      dbKey: '',
      tableName: ''
    };
  }
  //首次渲染调用
  componentWillMount() {
    this.reloadData(1);
  }
  componentDidMount() {
    window.addEventListener('resize', this.windowResize.bind(this)); //监听窗口大小改变
    this.props.onRef(this);
  }
  componentWillUnmount() { //一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('resize', this.windowResize.bind(this));
  }
  //获取数据
  reloadData = (pageIndex, id, dbKey, tableName) => {
    if (id && dbKey) {
      this.props.dispatch({
        type: pageUrl.GetCfgFiledsData,
        payload: {
          id: this.props.id,
          dbKey: this.props.dbKey
        }
      })
      this.setState({
        tableName: tableName,
        id: id,
        dbKey: dbKey
      })
    }
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
  render() {
    const selectData_DF_CONTROL_TYPE = [
      { lable: '试试', options: ['文本框', '下拉列表框', '日期框', '时间框', '单选', '多选', '多选下拉列表', '下拉列表树', '下拉搜索树', '多选下拉搜索树', '下拉表格', '搜索表格框', '数字', '经度', '纬度', '坐标集合', '上传', '富文本', '密码框', '地图', '三级行政区下拉框'] }
    ];
    const selectData_DF_ISQUERY = [{ lable: '', options: ['不查询', '列表头部显示', '特殊位置显示'] }];

    const selectData_DF_QUERY_CONTROL_TYPE = [{ lable: '', options: [''] }]
    const columns = [
      {
        title: '字段名',
        dataIndex: 'DF_NAME',
        width: 120,
        align: 'center',
        // editable: false,
        // fixed: 'left',

      },
      {
        title: '显示名称',
        dataIndex: 'DF_NAME_CN',
        width: 100,
        // align: 'center',
        // editable: true,
        // // fixed: 'left',
        // type: 'input',
      },

      {
        title: '排序',
        dataIndex: 'DF_ORDER',
        width: 80,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '主键',
        dataIndex: 'DF_ISPRIMARYKEY',
        width: 50,
        // editable: true,
        // align: 'center',
        // type: 'checkbox',
        // type: 'checkbox'
      },
      {
        title: '必填',
        dataIndex: 'DF_ISNOTNULL',
        width: 50,
        // editable: true,
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '添加',
        dataIndex: 'DF_ISADD',
        width: 50,
        // editable: true,
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '编辑',
        dataIndex: 'DF_ISEDIT',
        width: 50,
        // editable: true,
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '列表',
        dataIndex: 'LIST_ISSHOW',
        width: 50,
        // editable: true,
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '固定',
        dataIndex: 'DF_ISFIXED',
        width: 50,
        // editable: true,
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '导出',
        dataIndex: 'LIST_ISEXPORT',
        width: 50,
        // editable: true,
        // align: 'center',
        // type: 'checkbox'
      },
      {
        title: '表单控件',
        dataIndex: 'DF_CONTROL_TYPE',
        width: 100,
        // editable: true,
        // align: 'center',
        // type: 'select',
        data: selectData_DF_CONTROL_TYPE,
      },
      {
        title: '校验方式',
        dataIndex: 'DF_VALIDATE',
        width: 80,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '查询',
        dataIndex: 'DF_ISQUERY',
        width: 80,
        // editable: true,
        // align: 'center',
      },
      {
        title: '查询控件',
        dataIndex: 'DF_QUERY_CONTROL_TYPE',
        width: 80,
        // editable: true,
        // align: 'center',
        //    type: 'select',
      },
      {
        title: '查询方式',
        dataIndex: 'DF_CONDITION',
        width: 80,
        // editable: true,
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
        width: 70,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      // {
      //     title: '合并列',
      //     dataIndex: 'DF_COLSPAN',
      //     width: 70,
      //     editable: true,
      //     align:'center',
      //     type: 'input',
      // },
      // {
      //     title: '合并行',
      //     dataIndex: 'DF_ROWSPAN',
      //     width: 70,
      //     editable: true,
      //     align:'center',
      //     type: 'input',
      // },
      {
        title: '提示信息',
        dataIndex: 'DF_TOOLTIP',
        width: 200,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '列格式化',
        dataIndex: 'DF_FORMAT',
        width: 200,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '宽度',
        dataIndex: 'DF_WIDTH',
        width: 60,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '高度',
        dataIndex: 'DF_HEIGHT',
        width: 60,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '维护页面控件样式',
        dataIndex: 'DF_OPECLASS',
        width: 150,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '默认值',
        dataIndex: 'DF_DEFAULTVALUE',
        width: 60,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '外键类型',
        dataIndex: 'DF_FOREIGN_TYPE',
        width: 70,
        // editable: true,
        // align: 'center',
        //    type: 'select',
      },
      {
        title: '关联关系',
        dataIndex: 'FOREIGH_RELATION_TYPE',
        width: 70,
        // editable: true,
        // align: 'center',
        //    type: 'select',
      },
      {
        title: '外表ConfigID',
        dataIndex: 'FOREIGH_DT_CONFIGID',
        width: 200,
        // editable: true,
        // align: 'center',
        //    type: 'select',
      },
      {
        title: '外键Code',
        dataIndex: 'FOREIGN_DF_ID',
        width: 200,
        // editable: true,
        // align: 'center',
        //   type: 'select',
      },
      {
        title: '外键Name',
        dataIndex: 'FOREIGN_DF_NAME',
        width: 200,
        // editable: true,
        // align: 'center',
        //    type: 'select',
      },
      {
        title: '枚举值',
        dataIndex: 'ENUM_NAME',
        width: 200,
        editable: true,
        align: 'center'
      },
      {
        title: '其他配置',
        dataIndex: 'DF_OtherOptions',
        width: 200,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '日期格式化',
        dataIndex: 'DF_DATEFORMAT',
        width: 80,
        // editable: true,
        // align: 'center',
        // type: 'input',
      },
      {
        title: '导入',
        dataIndex: 'DF_ISIMPORT',
        width: 150,
        // editable: true,
        align: 'center',
        //   type: 'select',
      },
      {
        title: '单位',
        dataIndex: 'DF_Unit',
        width: 40,
        // editable: true,
        align: 'center',
        // type: 'input',
      },
      {
        title: '操作',
        align: 'center',
        fixed: 'right',
        width: 60,
        render: (text, record) => <AutoFormField record={record} id={this.props.id} dbKey={this.props.dbKey} FieldReloadData={this.reloadData} />
      }
    ]
    const { TableData } = this.props;
    const tableDatas = this.props.tableDatas;
    return (
      <div>
        <DatasourceAdd onRef={(ref) => { this.$Child = ref }} dbKey={this.props.dbKey} id={this.props.id} tableName={this.props.tableName} FieldReloadData={this.reloadData} />
        <SdlTable
          // components={this.components}
          // style={{ wordBreak: "break-all", "tablelayout": "fixed", overflow: "auto" }}
          bordered
          dataSource={tableDatas}
          columns={columns}
          // rowClassName="editable-row"
          // scroll={{ y: yHeight, x: 'max-content' }}
          loading={this.props.loading}
        />
        {/* <EditableTable columns={columns} dataSource={TableData} /> */}
      </div>
    );
  }
}

export default Form.create()(FieldConfig);
