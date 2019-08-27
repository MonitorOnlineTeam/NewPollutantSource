import React, { Component, Fragment } from 'react';
import {
    Card, Spin, Modal, Button, Form, Divider, Tooltip, Popconfirm,
} from 'antd';
import { connect } from 'dva';
import cuid from 'cuid';
import SdlTable from '../../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../../AutoFormManager/SearchWrapper';
import SdlForm from '@/pages/AutoFormManager/SdlForm'
import { handleFormData } from '@/utils/utils';
import AutoFormEdit from '@/pages/AutoFormManager/AutoFormEdit';
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
        configId,
      } = this.props;
      this.reloadPage(configId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.DGIMN !== this.props.DGIMN) {
            {
                const { dispatch, configId } = this.props;
               const DataWhere = [{
                     Key: '[dbo]__[T_Bas_EquipmentInfo]__PointCode',
                     Value: nextProps.DGIMN,
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

    /** 逻辑删除 */
    delete=ID => {
        const { dispatch, configId } = this.props;
        dispatch({
            type: 'operationsysmanage/DeleteOperationSys',
            payload: {
                configId,
                EquipmentInfoID: ID,
                searchParams: this.state.DataWhere,
            },
        });
    }

    /** 保存核实单 */
    handleOk = e => {
      const {
        dispatch,
        form,
        DGIMN,
        configId,
      } = this.props;
      form.validateFields((err, values) => {
        if (!err) {
          const formData = handleFormData(values);
          formData.PointCode = DGIMN;
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
        DGIMN,
        configId,
      } = this.props;
      form.validateFields((err, values) => {
        if (!err) {
          const formData = handleFormData(values);
          formData.PointCode = DGIMN;

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
        console.log('this.props', this.props);
        const { configId } = this.props;
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
                                <Button icon="plus" type="primary" onClick={() => {
                                    this.setState({
                                        visible: true,
                                    })
                                }}>添加</Button>
                              </Fragment>}
                               appendHandleRows={row => <Fragment>
                                     <Tooltip title="编辑">
                                        <a onClick={() => {
                                            const keysParams = {
                                              'dbo.T_Bas_EquipmentInfo.ID': row['dbo.T_Bas_EquipmentInfo.ID'],
                                            };
                                            const arr = row['dbo.T_Bas_EquipmentInfo.AttachmentID'] ? row['dbo.T_Bas_EquipmentInfo.AttachmentID'].split('|') : [];

                                            this.setState({
                                              keysParams,
                                              AttachmentID: arr.length > 0 ? arr[arr.length - 2] : '',
                                              ID: row['dbo.T_Bas_EquipmentInfo.ID'],
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
                                            row['dbo.T_Bas_EquipmentInfo.ID'],
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
