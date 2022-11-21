import React, { Component, Fragment } from 'react';
import PropTypes, { object } from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';
import SdlForm from "./SdlForm"
import { Modal } from 'antd'

@connect(({ loading, autoForm }) => ({
  loadingConfig: loading.effects['autoForm/getPageConfig'],
  loadingAdd: loading.effects['autoForm/add'],
}))
@Form.create()
class AutoFormAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      configId: props.configId || props.match.params.configId
    };
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this._renderForm = this._renderForm.bind(this);
  }

  componentDidMount() {
  }

  onSubmitForm(formData) {
    const { dispatch, successCallback, form } = this.props;
    const { uid, configId } = this._SELF_;
    debugger
    dispatch({
      type: 'autoForm/add',
      payload: {
        configId: configId,
        FormData: {
          ...formData,
        },
        callback: (res) => {
          if (res.IsSuccess) {
            successCallback ? successCallback(res) : history.go(-1); //dispatch(routerRedux.push(`/sysmanage/autoformmanager/${configId}`));
          }
        }
      }
    });
  }

  _renderForm() {
    const { form: { getFieldDecorator }, form } = this.props;
    const { configId } = this._SELF_;

    return <SdlForm
      onRef={sdlform => this.sdlFormRef = sdlform}
      configId={configId}
      hideBtns={true}
      onSubmitForm={this.onSubmitForm}
      onClickBack={this.props.onClickBack}
      form={form}
    >
    </SdlForm>
  }

  onCloseModal = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    console.log("this.sdlFormRef=", this.sdlFormRef)
    return (
      <Modal
        title="添加"
        bodyStyle={{ padding: 0 }}
        onOk={() => {
          console.log("this.sdlFormRef=", this.sdlFormRef)
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


AutoFormAddModal.propTypes = {
  // 请求成功回调
  successCallback: PropTypes.func,
  // configId
  configId: PropTypes.string.isRequired,
  // 
  visible: PropTypes.string.isRequired,
};

AutoFormAddModal.defaultProps = {
  breadcrumb: true
}

export default AutoFormAddModal;
