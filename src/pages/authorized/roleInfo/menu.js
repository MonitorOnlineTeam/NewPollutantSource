/*
 * @Author: lzp
 * @Date: 2019-07-16 09:42:48
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 10:55:44
 * @Description: 菜单权限
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Tabs,
  Layout,
  Menu,
  Card,
  Button,
  Divider,
  Tree,
  Input,
  message,
  Spin,
  Select,
  Table,
  Popconfirm,
  Tag,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import MonitorContent from '@/components/MonitorContent';
import SdlForm from '@/pages/AutoFormManager/SdlForm';
const Search = Input.Search;
const { Option } = Select;

@connect(({ roleinfo, loading }) => ({
  MenuTree: roleinfo.MenuTree,
  SelectMenu: roleinfo.SelectMenu,
  CheckMenu: roleinfo.CheckMenu,
  CheckMenuLoading: loading.effects['roleinfo/getmenubyroleid'],
}))
@Form.create()
export default class UserInfoAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectvalue: '0',
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'Menu_Name',
          key: 'Menu_Name',
          width: 'auto',
        },
        {
          title: '图标',
          dataIndex: 'Menu_Img',
          key: 'Menu_Img',
          width: 'auto',
        },
        {
          title: '页面按钮',
          dataIndex: 'Menu_Button1',
          width: 'auto',
          key: 'Menu_Button1',
          render: (text, record) => {
            if (record.Menu_Button.length !== 0) {
              return (
                <span>
                  {record.Menu_Button.map(item => (
                    <Tag color="#2db7f5" key={item.ID}>
                      {item.Name}
                    </Tag>
                  ))}
                </span>
              );
            }
          },
        },
        {
          title: '操作',
          dataIndex: '',
          key: 'x',
          render: (text, record) => (
            <span>
              <a
                href="javascript:;"
                onClick={() => {
                  console.log(record.Roles_ID);
                  this.props.dispatch({
                    type: 'roleinfo/getroleinfobyid',
                    payload: {
                      Roles_ID: record.Roles_ID,
                    },
                  });
                  this.showModalEdit();
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="确认要删除吗?"
                onConfirm={() => {
                  this.props.dispatch({
                    type: 'roleinfo/delroleinfo',
                    payload: {
                      Roles_ID: record.Roles_ID,
                      callback: res => {
                        if (res.IsSuccess) {
                          message.success('删除成功');
                          this.props.dispatch({
                            type: 'roleinfo/getroleinfobytree',
                            payload: {},
                          });
                        }
                      },
                    },
                  });
                }}
                onCancel={this.cancel}
                okText="是"
                cancelText="否"
              >
                <a href="#">删除</a>
              </Popconfirm>
            </span>
          ),
        },
      ],
    };
  }
  onChange = value => {
    this.setState({
      selectvalue: value,
    });
    this.props.dispatch({
      type: 'roleinfo/getrolemenutree',
      payload: {
        Type: value,
      },
    });
    console.log(`selected ${value}`);
  };

  onBlur = () => {
    console.log('blur');
  };

  onFocus = () => {
    console.log('focus');
  };

  onSearch = val => {
    console.log('search:', val);
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'roleinfo/getparenttree',
      payload: {},
    });
    this.props.dispatch({
      type: 'roleinfo/getrolemenutree',
      payload: {
        Type: this.state.selectvalue,
      },
    });
  }

  render() {
    return (
      <MonitorContent
        {...this.props}
        breadCrumbList={[
          { Name: '首页', Url: '/' },
          { Name: '角色管理', Url: '/sysmanage/roleindex/' },
          { Name: '分配权限', Url: '' },
        ]}
      >
        <div style={{ width: '100%', height: 'calc(100vh - 500px)', background: '#fff' }}>
          {
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="请选择系统"
              optionFilterProp="children"
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onSearch={this.onSearch}
              value={this.state.selectvalue}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.props.SelectMenu.map((item, key) => (
                <Option key={item.ID}>{item.Name}</Option>
              ))}
            </Select>
          }
          <Table
            onRow={record => {
              return {
                onClick: event => {
                  console.log('onClick=', record);
                  this.setState({
                    selectedRowKeys: record,
                    rowKeys: [record.key],
                  });
                },
              };
            }}
            defaultExpandAllRows={true}
            columns={this.state.columns}
            dataSource={this.props.MenuTree}
          />
        </div>
      </MonitorContent>
    );
  }
}
