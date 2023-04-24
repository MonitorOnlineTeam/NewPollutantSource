import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';
import SdlForm from './SdlForm';
import { Modal } from 'antd';

const FormItem = Form.Item;

@connect(({ loading, autoForm }) => ({
  loadingConfig: loading.effects['autoForm/getPageConfig'],
  loadingConfigId: loading.effects['autoForm/getConfigIdList'],
  loadingGetFormData: loading.effects['autoForm/getFormData'],
  addFormItems: autoForm.addFormItems,
  editFormData: autoForm.editFormData,
  tableInfo: autoForm.tableInfo,
  loading: loading,
}))
@Form.create()
class AutoFormEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      inputPlaceholder: '请输入',
      selectPlaceholder: '请选择',
      configId: props.configId || props.match.params.configId,
      keysParams: props.keysParams || JSON.parse(props.match.params.keysParams),
      uid: props.uid || (props.match && props.match.params.uid) || null,
    };
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this._renderForm = this._renderForm.bind(this);
  }

  componentDidMount() {}

  onSubmitForm(formData) {
    let { form, dispatch, successCallback, appendFormData } = this.props;
    const { configId, keysParams, uid } = this._SELF_;
    console.log('appendFormData', appendFormData);
    console.log('formData', formData);
    // return;
    dispatch({
      type: 'autoForm/saveEdit',
      payload: {
        configId: configId,
        FormData: {
          ...formData,
          ...appendFormData,
        },
        callback: res => {
          if (res.IsSuccess) {
            successCallback ? successCallback(res) : history.go(-1);
          }
        },
      },
    });
  }

  _renderForm() {
    const { configId, keysParams } = this._SELF_;
    return (
      <SdlForm
        onRef={sdlform => (this.sdlFormRef = sdlform)}
        configId={configId}
        onSubmitForm={this.onSubmitForm}
        form={this.props.form}
        isEdit={true}
        hideBtns={true}
        keysParams={keysParams}
        onClickBack={this.props.onClickBack}
        {...this.props}
      ></SdlForm>
    );
  }

  render() {
    return (
      <Modal
        title="编辑"
        bodyStyle={{ padding: 0 }}
        onOk={() => {
          this.sdlFormRef._onSubmitForm();
        }}
        destroyOnClose
        {...this.props}
      >
        {this._renderForm()}
      </Modal>
    );
  }
}

AutoFormEdit.propTypes = {
  // 主键对象
  keysParams: PropTypes.object.isRequired,
  // 请求成功回调
  successCallback: PropTypes.func,
  // configId
  configId: PropTypes.string.isRequired,
  //
  visible: PropTypes.string.isRequired,
  //
};

AutoFormEdit.defaultProps = {
  breadcrumb: true,
  // 添加、编辑时formData追加的对象
  appendFormData: {},
};

export default AutoFormEdit;
