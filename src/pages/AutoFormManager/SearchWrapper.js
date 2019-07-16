/**
 * @Author: Jiaqi
 * @Date: 2019-05-07 16:03:14
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-06-13 15:22:08
 * @desc: 搜索容器组件
 * @props {string} formChangeActionType formAction
 * @props {store object} searchFormState formState对象
 * @props {function} resetForm 重置表单function
 * @props {function} onSubmitForm  表单提交function
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Table,
    Form,
    Spin,
    Radio,
    Checkbox,
    TimePicker,
    Select, Modal, Tag, Divider, Dropdown, Icon, Menu, Popconfirm, message, DatePicker, InputNumber
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import SearchSelect from './SearchSelect';
import SdlCascader from './SdlCascader';
import SdlRadio from './SdlRadio';
import SdlCheckbox from './SdlCheckbox';

const {Option} = Select;
const {Search} = Input;
const {confirm} = Modal;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const { RangePicker, MonthPicker } = DatePicker;
@connect(({ loading, autoForm }) => ({
    searchForm: autoForm.searchForm,
    searchConfigItems: autoForm.searchConfigItems,
}))
@Form.create({
    mapPropsToFields(props) {
        let obj = {};
        const configIdSearchForm = props.searchForm[props.configId] || [];
        const searchConditions = props.searchConfigItems[props.configId] || [];
        searchConditions.map(item => obj[item.fieldName] = Form.createFormField(configIdSearchForm[item['fieldName']]));
        return {
            ...obj
        };
    },
    onFieldsChange(props, fields, allFields) {
        props.dispatch({
            type: 'autoForm/updateState',
            payload: {
                searchForm: {
                    ...props.searchForm,
                    [props.configId]: {
                        ...props.searchForm[props.configId],
                        ...fields
                    }
                }
            }
        });
    }
})

class SearchWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // isHide:false
            isShowExpand: props.searchConfigItems[props.configId] && props.searchConfigItems[props.configId].length > 2,
            expand: props.searchConfigItems[props.configId] && props.searchConfigItems[props.configId].length > 2
        };
        this._SELF_ = {
            formLayout: props.formLayout || {
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
            },
            inputPlaceholder: "请输入",
            selectPlaceholder: "请选择",
        };
        this._resetForm = this._resetForm.bind(this);
        this._renderFormItem = this._renderFormItem.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this._handleExpand = this._handleExpand.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.searchForm.current !== nextProps.searchForm.current) {
            return false;
        }
        return true;
    }

    onSubmitForm() {
        this.props.dispatch({
            type: 'autoForm/getAutoFormData',
            payload: {
                configId: this.props.configId,
                searchParams: this.props.searchParams
            }
        });
    }

    // 重置表单
    _resetForm() {
        this.props.form.resetFields();
        this.props.dispatch({
            type: 'autoForm/updateState',
            payload: {
                searchForm: {
                    // ...this.props.searchForm,
                    current: 1,
                    pageSize: 10
                }
            }
        });
        setTimeout(() => {
            this.onSubmitForm();
        }, 0);
    // this.props.resetForm();
    }

  _rtnDateEl = (item) => {
    const { dateFormat } = item;
    const format = dateFormat.toUpperCase();
    if (format === "YYYY-MM" || format === "MM") {
      // 年月 、 月
      return <MonthPicker style={{ width: "100%" }} format={format} />
    } if (format === "YYYY") {
      // 年
      return <DatePicker format={format} style={{ width: "100%" }} />
      // return <DatePicker
      //   mode="year"
      //   onPanelChange={(value, mode) => {
      //     this.props.form.setFieldsValue({ [item.fieldName]: value })
      //   }}
      //   format={format} />
    } else {
      // 年-月-日 时:分:秒
      return <DatePicker showTime format={format} style={{ width: "100%" }} />
    }
  }

  // 渲染FormItem
  _renderFormItem() {
      const { dispatch, form: { getFieldDecorator }, searchConfigItems, configId } = this.props;
      console.log(searchConfigItems);
      const { formLayout, inputPlaceholder, selectPlaceholder } = this._SELF_;
      const searchConditions = searchConfigItems[configId] || [];
      let element = '';
      // const len = searchConditions.length;
      // const isHide = len > 2;
      return searchConditions.map((item, index) => {
          let isHide = this.state.expand && index > 1 ? "none" : "";
          let {placeholder} = item;
          const {fieldName} = item;
          const {labelText} = item;

          // 判断类型
          switch (item.type) {
              case '文本框':
                  placeholder = placeholder || inputPlaceholder;
                  element = <Input placeholder={placeholder} allowClear={true} />;
                  break;
              case '下拉列表框':
              case '多选下拉列表':
                  placeholder = placeholder || selectPlaceholder;
                  const mode = item.type === "多选下拉列表" ? 'multiple' : '';
                  element = (
                      <SearchSelect
                          configId={item.configId}
                          itemName={item.configDataItemName}
                          itemValue={item.configDataItemValue}
                          data={item.value}
                          mode={mode}
                       />
                  );
                  break;
              case "多选下拉搜索树":
                  placeholder = placeholder || selectPlaceholder;
                  element = (
                      <SdlCascader
                          itemName={item.configDataItemName}
                itemValue={item.configDataItemValue}
                configId={item.configId}
                placeholder={placeholder}
                data={item.value}
                      />
                  );
                  break;
              case "日期框":
                  placeholder = placeholder || inputPlaceholder;
                  element = this._rtnDateEl(item);
                  break;
              case "单选":
                  element = (
                      <SdlRadio
                data={item.value}
                          configId={item.configId}
                          all={true}
                      />
                  );
                  break;
              case "多选":
                  element = (
                      <SdlCheckbox
                          data={item.value}
                          configId={item.configId}
                      />
                  );
                  break;
              default:
                  element = null;
                  break;
          }
          return (
              element &&
        <Col style={{ display: isHide, marginBottom: 6 }} key={index} md={8} sm={24}>
            <FormItem {...formLayout} label={labelText} style={{ width: '100%' }}>
              {getFieldDecorator(`${fieldName  }`, {})(
                    element
                )}
            </FormItem>
        </Col>
          );
      });
  }

  // 展开折叠
  _handleExpand() {
      this.setState({
          expand: !this.state.expand
      });
  }

  render() {
      const { formLayout, inputPlaceholder, selectPlaceholder } = this._SELF_;
      const { searchConfigItems, configId } = this.props;
      const searchConditions = searchConfigItems[configId] || [];
      const style = {};
      if (searchConditions.length % 3 === 0 && !this.state.expand) {
          style.float = "right";
      } else {
          style.marginLeft = 20;
      }
      return (
          <Form layout="inline" >
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  {
                      this._renderFormItem()
                  }
            {
                      searchConditions.length ? <Col style={{ marginTop: 6, ...style }}>
                <Button type="primary" onClick={this.onSubmitForm}>
                查询
              </Button>
                          <Button style={{ marginLeft: 8 }} onClick={this._resetForm}>
                重置
                          </Button>
                          {
                              this.state.isShowExpand &&
                <React.Fragment>
                    {
                        this.state.expand ? <a style={{ marginLeft: 8 }} onClick={this._handleExpand}>
                      展开 <Icon type="down" />
                        </a> : <a style={{ marginLeft: 8 }} onClick={this._handleExpand}>
                        收起 <Icon type="up" />
                    </a>
                    }
                </React.Fragment>
                          }
                      </Col> : null
                  }
              </Row>
              {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24} style={{ margin: '10px 0' }}>
            <Button type="primary" onClick={this.onSubmitForm.bind(this.props.form)}>
              查询
                  </Button>
            <Button style={{ marginLeft: 8 }} onClick={this._resetForm}>
              重置
                  </Button>
          </Col>
        </Row> */}
          </Form>
      );
  }
}

SearchWrapper.propTypes = {
    // actionType
    // formChangeActionType: PropTypes.string.isRequired,
    // store
    // searchFormState: PropTypes.object.isRequired,
    // 重置表单
    resetForm: PropTypes.func,
    // 提交表单
    onSubmitForm: PropTypes.func,
    // formLayout布局
    formLayout: PropTypes.object,
};

export default SearchWrapper;
