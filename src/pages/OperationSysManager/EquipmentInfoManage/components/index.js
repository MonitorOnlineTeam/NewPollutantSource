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
            uid: cuid(),
            Evisible: false,
            keysParams: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.DGIMN !== this.props.DGIMN) {
            {
               const DataWhere = [{
                     Key: '[dbo]__[T_Bas_EquipmentInfo]__PointCode',
                     Value: nextProps.DGIMN,
                     Where: '$=',
                   },
                 ];
                 this.setState({
                     DataWhere,
                 }, () => {
                     this.reloadPage()
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
          const formData = handleFormData(values, this.state.uid);
          formData.PointCode = DGIMN;
          dispatch({
            type: 'operationsysmanage/AddEquipmentInfo',
            payload: {
              configId,
              FormData: formData,
              callback: result => {
                  if (result.IsSuccess) {
                      this.setState({
                          visible: false,
                      }, () => {
                          this.reloadPage();
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
        const { pointDataWhere } = this.state;
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
                            searchParams={pointDataWhere}
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
                                            debugger;
                                            this.setState({
                                              keysParams,
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
                              footer={false}
                              onCancel={() => {
                                this.setState({
                                  Evisible: false,
                                });
                              }}
                              width="50%"
                            >
                              <SdlForm configId={configId} onSubmitForm={this.onSubmitForm} form={this.props.form} isEdit keysParams={this.state.keysParams} noLoad/>
                        </Modal>
                    </Card>
                </div>
        );
    }
}
export default Index;
