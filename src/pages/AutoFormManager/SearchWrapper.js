/**
 * @Author: Jiaqi
 * @Date: 2019-05-07 16:03:14
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-04-04 14:03:27
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
import EnterprisePointCascadeMultiSelect from '@/components/EnterprisePointCascadeMultiSelect'
import SearchSelect from './SearchSelect';
import SdlCascader from './SdlCascader';
import SdlRadio from './SdlRadio';
import SdlCheckbox from './SdlCheckbox';
import CascaderMultiple from "@/components/CascaderMultiple"
import RangePicker_ from '@/components/RangePicker/NewRangePicker'

const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const { RangePicker, MonthPicker } = DatePicker;
@connect(({ loading, autoForm }) => ({
  searchForm: autoForm.searchForm,
  searchConfigItems: autoForm.searchConfigItems,
  whereList: autoForm.whereList
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

  componentWillReceiveProps(nextProps) {
    if (this.props.searchConfigItems[nextProps.configId] !== nextProps.searchConfigItems[nextProps.configId]) {
      this.setState({
        isShowExpand: nextProps.searchConfigItems[nextProps.configId].length > 2,
        expand: nextProps.searchConfigItems[nextProps.configId].length > 2,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.searchForm.current !== nextProps.searchForm.current) {
      return false;
    }
    return true;
  }

  onSubmitForm() {
    console.log(":resultConfigId=",this.props.resultConfigId)
    const {resultConfigId, configId, searchForm, whereList, dispatch, searchParams} = this.props;
    // TODO 主要用于 关联表业务  查询条件configId 与 列表configId不一样的问题  参考 维护监测点页面需求
    if(resultConfigId){
      dispatch({
        type: "autoForm/updateState",
        payload:{
          searchForm:{
            ...searchForm,
            [resultConfigId]:{
              ...searchForm[configId]
            }
          },
          whereList:{
            ...whereList,
            [resultConfigId]:{
              ...whereList[configId]
            }
          }
        }
      })
    }
    setTimeout(()=>{
      dispatch({
        type: 'autoForm/getAutoFormData',
        payload: {
          configId: resultConfigId || configId,
          searchParams: searchParams
        }
      });
    }, 0)
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

  // 时间范围控件
  _rtnRangePickerEl = item => {
    const { dateFormat } = item;
    const { fieldName } = item;
    const format = dateFormat ? dateFormat.toUpperCase() : "";
 
    console.log("format=", format)
    
    switch(format)
    {
       case "YYYY-MM-DD HH:MM:SS":
            return <RangePicker_ fieldName={fieldName}   
            callback={(dates,type,fieldName)=>this.dateCallBack(dates,type,fieldName)} style={{ width: '100%' }} />
         
       case "YYYY-MM-DD HH:MM":
            return <RangePicker_ fieldName={fieldName}   
            callback={(dates,type,fieldName)=>this.dateCallBack(dates,type,fieldName)} style={{ width: '100%' }} dataType="minute"/>
            
       case "YYYY-MM-DD HH":
            return <RangePicker_ fieldName={fieldName}   
            callback={(dates,type,fieldName)=>this.dateCallBack(dates,type,fieldName)} style={{ width: '100%' }} dataType="hour"/>
           
       default:
            return <RangePicker_ style={{ width: '100%' }} fieldName={fieldName}   
            callback={(dates,type,fieldName)=>this.dateCallBack(dates,type,fieldName)} dataType="day"/>
             
    }

    // return <RangePicker_ style={{ width: '100%' }} />
    // if (format) {
    //   return <RangePicker style={{ width: '100%' }} format={format} />
    // }
    // return <RangePicker style={{ width: '100%' }} />
  }

  /**时间控件回调 */
  dateCallBack=(dates,type,fieldName)=>{
      const {form:{setFieldsValue}}=this.props;
      if(dates[0] && dates[1])
      setFieldsValue({ [fieldName]:dates });
      else
      {
        setFieldsValue({ [fieldName]:undefined });
      }
  }

  

  // 渲染FormItem
  _renderFormItem() {
    const { dispatch, form: { getFieldDecorator }, searchConfigItems, configId } = this.props;
    const { formLayout, inputPlaceholder, selectPlaceholder } = this._SELF_;
    const searchConditions = searchConfigItems[configId] || [];
    let element = '';
    // const len = searchConditions.length;
    // const isHide = len > 2;
    return searchConditions.map((item, index) => {
      let isHide = this.state.expand && index > 1 ? "none" : "";
      let { placeholder } = item;
      const { fieldName } = item;
      const { labelText } = item;
      let zIndex = 1;

      // 判断类型
      switch (item.type) {
        case '文本框':
          placeholder = placeholder || inputPlaceholder;
          element = <Input placeholder={placeholder} allowClear={true} />;
          break;
        case '监测点':
          placeholder = placeholder || inputPlaceholder;
          zIndex = 2;
          let props = {};
          if (item.DF_NAME === "DGIMN") {
            props = {
              rtnValType: "DGIMN",
            }
          }
          // element = <EnterprisePointCascadeMultiSelect {...props}/>
          element = <CascaderMultiple {...this.props}/>
          break;
        case '下拉列表框':
        case '下拉多选':
          placeholder = placeholder || selectPlaceholder;
          const mode = item.type === "下拉多选" ? 'multiple' : '';
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
        case "三级行政区下拉框":
          placeholder = placeholder || selectPlaceholder;
          element = (
            <SdlCascader
              itemName={item.configDataItemName}
              itemValue={item.configDataItemValue}
              configId={item.configId}
              changeOnSelect={true}
              placeholder={placeholder}
              data={item.value}
            />
          );
          break;
        case "日期框":
          placeholder = placeholder || inputPlaceholder;
          element = this._rtnDateEl(item);
          break;
        case "日期范围":
          placeholder = placeholder || inputPlaceholder;
          element = this._rtnRangePickerEl(item);
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
          <FormItem {...formLayout} label={labelText} style={{ width: '100%', zIndex: zIndex }}>
            {getFieldDecorator(`${fieldName}`, {})(
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
              <Button type="primary" onClick={() => {
                // 重置分页并查询数据
                this.props.dispatch({
                  type: 'autoForm/updateState',
                  payload: {
                    searchForm: {
                      ...this.props.searchForm,
                      [configId]: {
                        ...this.props.searchForm[configId],
                        current: 1,
                        pageSize: 10
                      }
                    }
                  }
                });
                setTimeout(() => {
                  this.onSubmitForm()
                }, 0)
              }}>
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
  // 
  resultConfigId: PropTypes.string,
};

export default SearchWrapper;
