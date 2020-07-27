/*
 * @desc: AutoForm编辑公共页面
 * @Author: JianWei
 * @Date: 2019-5-24 15:28:31
 * @Last Modified by: JianWei
 * @Last Modified time: 2019年5月24日15:28:35
 */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import moment from "moment";
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { checkRules } from '@/utils/validator';
import MonitorContent from '../../components/MonitorContent/index';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import SdlForm from "./SdlForm"

const FormItem = Form.Item;

@connect(({ loading, autoForm }) => ({
  loadingConfig: loading.effects['autoForm/getPageConfig'],
  loadingAdd: loading.effects['autoForm/add'],
  addFormItems: autoForm.addFormItems,
  editFormData: autoForm.editFormData,
  tableInfo: autoForm.tableInfo
}))
@Form.create()
class AutoFormEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { MapVisible: false };
    this.state = {
      MapVisible: false,
      EditMarker: false,
      EditPolygon: false,
      longitude: 0,
      latitude: 0,
      polygon: []
    };
    this._SELF_ = {
      formLayout: props.formLayout || {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
          md: { span: 10 },
        },
      },
      inputPlaceholder: "请输入",
      selectPlaceholder: "请选择",
      configId: props.configId || props.match.params.configId,
      keysParams: props.keysParams || JSON.parse(props.match.params.keysParams),
      uid: props.uid || (props.match && props.match.params.uid) || null
    };
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this._renderForm = this._renderForm.bind(this);
  }

  componentDidMount() {
    let { addFormItems, dispatch } = this.props;
    const { configId, keysParams, uid } = this._SELF_;
    // // 获取数据
    // dispatch({
    //   type: 'autoForm/getFormData',
    //   payload: {
    //     configId: configId,
    //     ...keysParams
    //   }
    // });
  }

  onSubmitForm(formData) {
    let { form, dispatch, successCallback } = this.props;
    const { configId, keysParams, uid } = this._SELF_;
    // // 截取字符串，重新组织主键参数
    // const keys = keysParams;
    // let primaryKey = {};
    // for (let key in keys) {
    //   primaryKey[key.split('.').pop().toString()] = keys[key];
    // }

    // form.validateFields((err, values) => {
    //   if (!err) {
    //     let FormData = {};
    //     for (let key in values) {
    //       if (values[key] && values[key]["fileList"]) {
    //         // 处理附件列表
    //         FormData[key] = uid;
    //       } else if (values[key] && moment.isMoment(values[key])) {
    //         // 格式化moment对象
    //         FormData[key] = moment(values[key]).format("YYYY-MM-DD HH:mm:ss")
    //       } else {
    //         FormData[key] = values[key] && values[key].toString()
    //       }
    //     }
    dispatch({
      type: 'autoForm/saveEdit',
      payload: {
        configId: configId,
        FormData: {
          ...formData
        },
        callback: (res) => {
          if (res.IsSuccess) {
            successCallback ? successCallback(res) : history.go(-1);
          }
        }
      }
    });
    //   }
    // });
  }

  _renderForm() {
    const { configId, keysParams } = this._SELF_;
    return <SdlForm
      configId={configId}
      onSubmitForm={this.onSubmitForm}
      form={this.props.form}
      isEdit={true}
      keysParams={keysParams}
      {...this.props}
    ></SdlForm>
  }

  render() {
    const { dispatch, breadcrumb } = this.props;
    const { configId } = this._SELF_;

    return (
      <Fragment>
        {
          breadcrumb ?
            // <MonitorContent breadCrumbList={
            //   [
            //     { Name: '首页', Url: '/' },
            //     { Name: '系统管理', Url: '' },
            //     { Name: 'AutoForm', Url: '/sysmanage/autoformmanager/' + configId },
            //     { Name: '编辑', Url: '' }
            //   ]
            // }
            // >
            <BreadcrumbWrapper title="编辑">
              {this._renderForm()}
              {/* </MonitorContent> : */}
            </BreadcrumbWrapper> :
            <Fragment>
              {this._renderForm()}
            </Fragment>
        }
      </Fragment>
    );
  }
}


AutoFormEdit.propTypes = {
  // 请求成功回调
  successCallback: PropTypes.func,
  // 是否显示面包屑
  breadcrumb: PropTypes.bool,
  // configId
  configId: PropTypes.string.isRequired,
  // 主键对象
  keysParams: PropTypes.object.isRequired,
};

AutoFormEdit.defaultProps = {
  breadcrumb: true
}

export default AutoFormEdit;
