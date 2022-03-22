import React, { Component, Fragment } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Spin, Modal, Button, Divider, Tooltip, Popconfirm } from 'antd';
import { connect } from 'dva';
import SdlTable from '../../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../../AutoFormManager/SearchWrapper';
import SdlForm from '@/pages/AutoFormManager/SdlForm'
import { handleFormData } from '@/utils/utils';
import {
  DelIcon, EditIcon,
} from '@/utils/icon';

@connect(({ loading, autoForm }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    btnloading: loading.effects['operationsysmanage/Add'],
    btnloading1: loading.effects['operationsysmanage/Edit'],
}))
@Form.create()
 class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataWhere: [],
            visible: false,
            Evisible: false,
            keysParams: null,
            AttachmentID: '',
            ID: '',
        };
    }

    componentDidMount() {
      const {
        configId, UserID
      } = this.props;
      const DataWhere = [{
        Key: '[dbo]__[T_Bas_CertificateInfo]__User_ID',
        Value: UserID,
        Where: '$=',
      },
      ];
      this.setState({
        DataWhere
      })
      this.reloadPage(configId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UserID !== this.props.UserID) {
            {
                const { dispatch, configId } = this.props;
               const DataWhere = [{
                     Key: '[dbo]__[T_Bas_CertificateInfo]__User_ID',
                     Value: nextProps.UserID,
                     Where: '$=',
                   },
                 ];
                 this.setState({
                   DataWhere,
                 }, () => {
                   dispatch({
                     type: 'autoForm/getAutoFormData',
                     payload: {
                       configId,
                       searchParams: this.state.DataWhere,
                     },
                   })
                 })
            }
        }
    }

    /** 逻辑删除 */
    delete = ID => {
      const {
        dispatch,
        configId,
      } = this.props;
      dispatch({
        type: 'operationsysmanage/DeleteOperationSys',
        payload: {
          configId,
          CertificateInfoID: ID,
          searchParams: this.state.DataWhere,
        },
      });
    }

    reloadPage = () => {
        const { dispatch, configId } = this.props;
        dispatch({
            type: 'autoForm/updateState',
            payload: {
                routerConfig: configId,
            },
        });
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId,
            },
        })
    }

    /** 保存核实单 */
    handleOk = e => {
      const {
        dispatch,
        form,
        UserID,
        configId,
      } = this.props;
      form.validateFields((err, values) => {
        if (!err) {
          const formData = handleFormData(values);
          formData.User_ID = UserID;
          dispatch({
            type: 'operationsysmanage/Add',
            payload: {
              configId,
              FormData: formData,
               callback: result => {
                 if (result.IsSuccess) {
                   this.setState({
                     visible: false,
                   }, () => {
                     dispatch({
                       type: 'autoForm/getAutoFormData',
                       payload: {
                         configId,
                         searchParams: this.state.DataWhere,
                       },
                     })
                   })
                 }
               },
            },
          });
        }
      });
    };

    SaveOk = e => {
      const {
        dispatch,
        form,
        UserID,
        configId,
      } = this.props;
      form.validateFields((err, values) => {
        if (!err) {
          const formData = handleFormData(values);
          formData.User_ID = UserID;

          dispatch({
            type: 'operationsysmanage/Edit',
            payload: {
              configId,
              FormData: {
                ...formData,
                ID: this.state.ID,
              },
              callback: result => {
                if (result.IsSuccess) {
                  this.setState({
                    Evisible: false,
                  }, () => {
                    dispatch({
                      type: 'autoForm/getAutoFormData',
                      payload: {
                        configId,
                        searchParams: this.state.DataWhere,
                      },
                    })
                  })
                }
              },
            },
          });
        }
      });
    };

    render() {
        console.log('this.props111111111111111111111', this.props);
        const {
          configId,
          btnloading,
          btnloading1,
           } = this.props;
        const { DataWhere } = this.state;
        if (this.props.loading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                size="large"
            />);
        }
        return (
          <div>
              <Card>
                  <SearchWrapper
                      onSubmitForm={form => this.loadReportList(form)}
                      configId={configId}
                  ></SearchWrapper>
                  <SdlTable
                      style={{ marginTop: 10 }}
                      configId={configId}
                      parentcode="ddd"
                      searchParams={DataWhere}
                      appendHandleButtons={(selectedRowKeys, selectedRows) => <Fragment>
                          <Button icon={<PlusOutlined />} type="primary" onClick={() => {
                              this.setState({
                                  visible: true,
                              })
                          }}>添加</Button>
                        </Fragment>}
                      appendHandleRows={row => <Fragment>
                               <Tooltip title="编辑">
                                  <a onClick={() => {
                                      const keysParams = {
                                        'dbo.T_Bas_CertificateInfo.ID': row['dbo.T_Bas_CertificateInfo.ID'],
                                      };
                                      const arr = row['dbo.T_Bas_CertificateInfo.AttachmentID'] ? row['dbo.T_Bas_CertificateInfo.AttachmentID'].split('|') : [];

                                      this.setState({
                                       keysParams,
                                       AttachmentID: arr.length > 0 ? arr[arr.length - 2] : '',
                                       ID: row['dbo.T_Bas_CertificateInfo.ID'],
                                      }, () => {
                                        this.setState({
                                          Evisible: true,
                                        })
                                      })
                                  }}><EditIcon/></a>
                              </Tooltip>
                              <Divider type="vertical" />
                              <Tooltip title="删除">
                              <Popconfirm
                                  title="确认要删除吗?"
                                  onConfirm={() => {
                                  this.delete(
                                      row['dbo.T_Bas_CertificateInfo.ID'],
                                  );
                                  }}
                                  onCancel={this.cancel}
                                  okText="是"
                                  cancelText="否"
                              >
                                  <a href="#"><DelIcon /></a>
                              </Popconfirm>
                              </Tooltip>
                          </Fragment>}
                      {...this.props}
                  >
                  </SdlTable>
                  <Modal
                        title="添加"
                        visible={this.state.visible}
                        destroyOnClose // 清除上次数据
                        onOk={this.handleOk}
                        okText="保存"
                        cancelText="关闭"
                        confirmLoading={btnloading}
                        onCancel={() => {
                          this.setState({
                            visible: false,
                          });
                        }}
                        width="50%"
                      >
                        <SdlForm configId={configId} form={this.props.form} hideBtns noLoad />
                  </Modal>
                    <Modal
                        title="编辑"
                        visible={this.state.Evisible}
                        destroyOnClose // 清除上次数据
                        onOk={this.SaveOk}
                         confirmLoading={btnloading1}
                        okText="保存"
                        cancelText="关闭"
                        onCancel={() => {
                          this.setState({
                            Evisible: false,
                          });
                        }}
                        width="50%"
                      >
                        <SdlForm configId={configId} onSubmitForm={this.onSubmitForm} form={this.props.form} hideBtns isEdit keysParams={this.state.keysParams} noLoad uid={this.state.AttachmentID}/>
                  </Modal>
              </Card>
          </div>
        );
    }
}
export default Index;
