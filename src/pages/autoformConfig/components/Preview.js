import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import { connect } from 'dva'
import { Modal } from 'antd'
import SdlForm from '@/pages/AutoFormManager/SdlForm';
import { Form } from '@ant-design/compatible';
import moment from 'moment'
import AutoformView from '@/pages/AutoFormManager/AutoFormView'

@connect()
@Form.create()
class Preview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
      editModalVisible: false,
      keysParams: {},
      viewModalVisible: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.tableConfigList !== prevProps.tableConfigList) {
      this.props.dispatch({
        type: 'autoForm/getPageConfig',
        payload: {
          configId: this.props.tableConfigList[0].DT_CONFIG_ID + "",
        }
      });
    }
  }

  onSubmitForm = (formData) => {
    const { dispatch, successCallback, form } = this.props;
    const configId = this.props.tableConfigList[0].DT_CONFIG_ID;
    if (formData.HazardousWasteYear) {
      formData.HazardousWasteYear = moment(formData.HazardousWasteMonth).format("YYYY")
    }
    if (formData.HazardousWasteMonth) {
      formData.HazardousWasteMonth = moment(formData.HazardousWasteMonth).format("MM")
    }
    dispatch({
      type: 'autoForm/add',
      payload: {
        configId: configId,
        FormData: {
          ...formData,
        },
        callback: (res) => {
          if (res.IsSuccess) {
            this.setState({ addModalVisible: false })
          }
        }
      }
    });
    //   }
    // });
  }

  onEditSubmitForm = (formData) => {
    let { form, dispatch, successCallback } = this.props;
    const configId = this.props.tableConfigList[0].DT_CONFIG_ID;
    dispatch({
      type: 'autoForm/saveEdit',
      payload: {
        configId: configId,
        reload: true,
        FormData: {
          ...formData
        },
        callback: (res) => {
          if (res.IsSuccess) {
            this.setState({ editModalVisible: false })
          }
        }
      }
    });
    //   }
    // });
  }

  render() {
    const { addModalVisible, editModalVisible, keysParams, viewModalVisible } = this.state;
    console.log('keysParams=', keysParams)
    const { form } = this.props;
    const configId = this.props.tableConfigList.length ? this.props.tableConfigList[0].DT_CONFIG_ID : "";
    return (
      <>
        <SearchWrapper configId={configId} />
        <AutoFormTable configId={configId}
          onSubmitForm={this.onSubmitForm}
          onAdd={() => {
            this.setState({
              addModalVisible: true
            })
          }}
          onEdit={(record, key) => {
            this.setState({
              editModalVisible: true,
              keysParams: {
                [this.props.tableConfigList[0].DT_PRIMARYKEY]: record[this.props.tableConfigList[0].DT_PRIMARYKEY]
              }
            })
          }}
          onView={(record, key) => {
            this.setState({
              viewModalVisible: true,
              keysParams: {
                [this.props.tableConfigList[0].DT_PRIMARYKEY]: record[this.props.tableConfigList[0].DT_PRIMARYKEY]
              }
            })
          }}
        />
        <Modal width="70vw" title="添加" visible={addModalVisible} footer={null} onCancel={() => {
          this.setState({
            addModalVisible: true
          }, () => { this.props.form.resetFields(); })
        }}>
          <SdlForm
            form={form}
            configId={configId}
            onSubmitForm={this.onSubmitForm}
            onClickBack={() => {
              this.setState({
                addModalVisible: false
              })
            }}
          >
          </SdlForm>
        </Modal>
        <Modal width="70vw" title="编辑" visible={editModalVisible} footer={null} onCancel={() => {
          this.setState({
            editModalVisible: false,
            keysParams: {}
          }, () => { this.props.form.resetFields(); })
        }}>
          {
            // JSON.stringify(keysParams) != '{}' && <SdlForm
            <SdlForm
              form={form}
              configId={configId}
              onSubmitForm={this.onEditSubmitForm}
              isEdit={true}
              keysParams={keysParams}
              onClickBack={() => {
                this.setState({
                  editModalVisible: false
                })
              }}
            >
            </SdlForm>
          }
        </Modal>
        <Modal width="70vw" title="详情" visible={viewModalVisible} footer={null} onCancel={() => {
          this.setState({
            viewModalVisible: false,
            keysParams: {}
          })
        }}>
          <AutoformView breadcrumb={false} configId={configId} keysParams={keysParams} />
        </Modal>
      </>
    );
  }
}

export default Preview;