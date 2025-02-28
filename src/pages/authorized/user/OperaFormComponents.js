/*
 * @Author: lzp
 * @Date: 2019-07-16 09:42:48
 * @LastEditors: outman0611
 * @LastEditTime: 2025-01-14 09:27:03
 * @Description: 用户信息添加编辑表单 运维
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
  Col,
  Select,
  Row,
  Radio,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Cookie from 'js-cookie';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlForm from '@/pages/AutoFormManager/SdlForm';
import styles from './style.less';

const { Search } = Input;

const FormItem = Form.Item;
const { Content, Sider } = Layout;

const { Item } = Menu;
const { TreeNode } = Tree;
@connect(({ userinfo, loading, global, operations }) => ({
  configInfo: global.configInfo,
  operationCompanyList: operations.operationCompanyList,
  operationCompanyLoading: loading.effects['operations/getOperationCompanyList'],
  largeRegionListLoading: loading.effects[`ctCommon/GetLargeRegionList`],
  userType: userinfo.userType,
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushTypeList: [],
      largeRegionList: [],
      operationCompanyRequired: true,
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'userinfo/updateState',
      payload: {
        operaBasicInfoForm: this.props.form,
      },
    });
    this.props.dispatch({
      type: 'operations/getOperationCompanyList', //获取运维单位列表
    });
    this.props.dispatch({
      type: `ctCommon/GetLargeRegionList`,
      payload: {},
      callback: res => {
        this.setState({ largeRegionList: res });
      },
    });
    this.getPushTypeList();
  }

  componentDidUpdate(prevProps, prevState) {
    const { userType } = this.props;
    if (userType !== prevProps.userType) {
      if (userType == 2 || userType == 3) {
        //运维单位 || 其他
        this.props.form.setFieldsValue({
          BusinessAttribute: undefined,
          IndustryAttribute: undefined,
          Question: undefined,
        });
        if (userType == 3) {
          this.setState({ operationCompanyRequired: false }, () => {
            this.props.form.setFieldsValue({ OperationCompany: undefined });
          });
        }
      } else {
        this.setState({ operationCompanyRequired: true });
      }
    }
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'userinfo/updateState',
      payload: {
        userType: undefined,
      },
    });
  }

  // 获取推送类型列表
  getPushTypeList = () => {
    this.props.dispatch({
      type: 'userinfo/GetPushTypeList',
      payload: {},
      callback: res => {
        this.setState({ pushTypeList: res.map(item => ({ value: item.code, label: item.name })) });
      },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      userType,
      isEdit,
    } = this.props;
    const UserType = Cookie.get('currentUser') && JSON.parse(Cookie.get('currentUser'))?.UserType;
    const IsSystemRole =
      Cookie.get('currentUser') && JSON.parse(Cookie.get('currentUser'))?.IsSystemRole;

    const formFilesData = [
      { label: '登录名', field: 'User_Account', required: true },
      { label: '姓名', field: 'User_Name', required: true },
      {
        label: '性别',
        field: 'User_Sex',
        inputNode: 'radio',
        list: [{ name: '男', value: 1 }, { name: '女', value: 2 }],
        initialValue: 1,
      },
      {
        label: '手机号',
        field: 'Phone',
        validator: { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确!' },
      },
      { label: '邮箱', field: 'Email', validator: { type: 'email', message: '邮箱格式不正确!' } },
      {
        label: '推送类型',
        field: 'SendPush',
        inputNode: 'select',
        mode: 'multiple',
        list: this.state.pushTypeList,
      },
      {
        label: '用户类型',
        field: 'UserType',
        inputNode: 'select',
        required: true,
        disabled: (UserType == 2 || UserType == 3) && IsSystemRole != 1,
        list: [
          { value: '1', label: '雪迪龙' },
          { value: '2', label: '运维单位' },
          { value: '3', label: '其他' },
        ],
        initialValue: UserType != 1 ? UserType : undefined,
      },
      {
        label: '运维公司',
        field: 'OperationCompany',
        inputNode: 'select',
        hidden: userType == 3 || UserType == 3 || (!userType && UserType != 2),
        required: this.state.operationCompanyRequired,
        list: this.props.operationCompanyList.map(item => ({
          value: item['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID'],
          label: item['dbo.T_Bas_OperationMaintenanceEnterprise.Company'],
        })),
        loading: this.props.operationCompanyLoading,
      },
      {
        label: '业务属性',
        field: 'BusinessAttribute',
        inputNode: 'select',
        hidden: userType != 1,
        mode: 'multiple',
        list: [
          { value: '1', value: '职能-售后服务' },
          { value: '2', label: '售后服务-安装调试' },
          { value: '3', label: '售后服务-非驻厂运营' },
          { value: '4', label: '售后服务-驻厂运营' },
          { value: '5', label: '其他' },
        ],
      },
      {
        label: '行业属性',
        field: 'IndustryAttribute',
        inputNode: 'select',
        hidden: userType != 1,
        mode: 'multiple',
        list: [
          { value: '5', value: '大气' },
          { value: '6', label: '地表水' },
          { value: '10', label: '过程分析' },
          { value: '2', label: '污染源气' },
          { value: '1', label: '污染源水' },
          { value: '11', label: '其他' },
        ],
      },
      {
        label: '所属大区',
        field: 'Question',
        inputNode: 'select',
        hidden: userType != 1,
        list: this.state.largeRegionList.map(item => ({
          value: item['ID'],
          label: item['LargeRegion'],
        })),
        loading: this.props.largeRegionListLoading,
      },
    ];
    return (
      <Form id="searchForm">
        <Row className={styles.operaFormWrapper}>
          {formFilesData.map(item => {
            return (
              <Col span={12}>
                <FormItem label={item.label} hidden={item.hidden}>
                  {getFieldDecorator(item.field, {
                    rules: item.validator
                      ? [
                          { required: item.required, message: `请输入${item.label}` },
                          { ...item.validator },
                        ]
                      : [{ required: item.required, message: `请输入${item.label}` }],
                    initialValue: item.initialValue,
                  })(
                    item.inputNode === 'radio' ? (
                      <Radio.Group>
                        {item.list.map(itemList => (
                          <Radio value={itemList.value}>{itemList.name}</Radio>
                        ))}
                      </Radio.Group>
                    ) : item.inputNode === 'select' ? (
                      <Select
                        options={item.list}
                        loading={item.loading}
                        mode={item.mode}
                        disabled={item.disabled}
                        placeholder="请输入"
                        allowClear
                        onChange={values => {
                          if (item.field == 'UserType') {
                            this.props.dispatch({
                              type: 'userinfo/updateState',
                              payload: {
                                userType: values,
                              },
                            });
                            const { dispatch, form } = this.props;
                            if (values == 2 || values == 3) {
                              //运维单位 || 其他
                              form.setFieldsValue({
                                BusinessAttribute: undefined,
                                IndustryAttribute: undefined,
                                Question: undefined,
                              });
                              if (values == 3) {
                                this.setState({ operationCompanyRequired: false }, () => {
                                  form.setFieldsValue({ OperationCompany: undefined });
                                });
                              }
                            } else {
                              this.setState({ operationCompanyRequired: true });
                            }
                          }
                        }}
                      />
                    ) : (
                      <Input placeholder="请输入" allowClear />
                    ),
                  )}
                </FormItem>
              </Col>
            );
          })}
        </Row>
        <Divider orientation="right">
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              const { dispatch, form } = this.props;
              form.validateFields((err, values) => {
                if (!err) {
                  console.log(values);
                  this.props.formValidateFieldsCallback(values);
                }
              });
            }}
          >
            下一步
          </Button>
        </Divider>
      </Form>
    );
  }
}
